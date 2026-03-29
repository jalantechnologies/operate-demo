import re
from datetime import datetime, timedelta, timezone
from typing import Optional

import requests
from pymongo import MongoClient

from modules.config.config_service import ConfigService
from modules.logger.logger import Logger
from modules.scenario_run.errors import ScenarioRunRecordNotFoundError
from modules.scenario_run.internals.scenario_run_writer import ScenarioRunWriter
from modules.scenario_run.internals.store.scenario_run_repository import ScenarioRunRepository
from modules.scenario_run.types import ScenarioRun, ScenarioRunStatus

# Parses "The monitor was last triggered at Sun Mar 29 2026 08:14:57 UTC." from Datadog body
_DATADOG_TRIGGERED_AT_RE = re.compile(r"The monitor was last triggered at (.+? UTC)\.")


class ScenarioRunReader:
    @staticmethod
    def get_by_id(run_id: str) -> ScenarioRun:
        run = ScenarioRunRepository.find_by_id(run_id)
        if run is None:
            raise ScenarioRunRecordNotFoundError()

        if run.status == ScenarioRunStatus.PENDING:
            # Fetch the Datadog log ingestion timestamp on every poll so step 1 of the
            # timeline fills in quickly (seconds after trigger) even while waiting for
            # the monitor to fire. Store it so the response always includes it.
            error_logged_at = ScenarioRunReader._fetch_datadog_log_timestamp(
                run.correlation_id, run.triggered_at
            )
            # Only persist if we got a real Datadog timestamp (not just the fallback)
            if error_logged_at != run.triggered_at and run.error_logged_at != error_logged_at:
                ScenarioRunWriter.update_error_logged_at(run.id, error_logged_at)
                run = ScenarioRunRepository.find_by_id(run_id)

            operate_db_uri = ConfigService[str].get_value("operate.db_uri")
            operate_db = MongoClient(operate_db_uri).get_default_database()
            doc = operate_db["cases"].find_one({"title": {"$regex": re.escape(run.correlation_id)}})
            if doc is not None:
                occurrences = doc.get("occurrences") or []
                webhook_received_at = occurrences[0]["occurred_at"].replace(tzinfo=timezone.utc) if occurrences else None
                case_created_at = doc.get("created_at")
                if case_created_at is not None:
                    case_created_at = case_created_at.replace(tzinfo=timezone.utc)

                datadog_alerted_at = None
                if occurrences:
                    body = occurrences[0].get("description", "")
                    match = _DATADOG_TRIGGERED_AT_RE.search(body)
                    if match:
                        try:
                            datadog_alerted_at = datetime.strptime(
                                match.group(1), "%a %b %d %Y %H:%M:%S UTC"
                            ).replace(tzinfo=timezone.utc)
                        except ValueError:
                            pass

                run = ScenarioRunWriter.mark_detected(
                    run.id,
                    operate_case_id=str(doc["_id"]),
                    error_logged_at=error_logged_at,
                    datadog_alerted_at=datadog_alerted_at,
                    webhook_received_at=webhook_received_at,
                    case_created_at=case_created_at,
                )

        return run

    @staticmethod
    def _fetch_datadog_log_timestamp(correlation_id: str, fallback: datetime) -> datetime:
        """Query Datadog Logs API for the exact ingestion time of the error log containing correlation_id."""
        try:
            api_key = ConfigService[str].get_value("datadog.api_key")
            app_key = ConfigService[str].get_value("datadog.app_key")
            site = ConfigService[str].get_value("datadog.site_name")
        except Exception:
            return fallback

        try:
            now = datetime.now(timezone.utc)
            from_time = fallback - timedelta(minutes=2)
            headers = {
                "DD-API-KEY": api_key,
                "DD-APPLICATION-KEY": app_key,
                "Content-Type": "application/json",
            }
            body = {
                "filter": {
                    "query": f'"{correlation_id}"',
                    "from": from_time.strftime("%Y-%m-%dT%H:%M:%SZ"),
                    "to": now.strftime("%Y-%m-%dT%H:%M:%SZ"),
                },
                "sort": "timestamp",
                "page": {"limit": 1},
            }
            resp = requests.post(
                f"https://api.{site}/api/v2/logs/events/search",
                headers=headers,
                json=body,
                timeout=10,
            )
            if resp.status_code != 200:
                return fallback
            logs = resp.json().get("data", [])
            if not logs:
                return fallback
            ts_str = logs[0].get("attributes", {}).get("timestamp")
            if not ts_str:
                return fallback
            return datetime.fromisoformat(ts_str.replace("Z", "+00:00"))
        except Exception as exc:
            Logger.error(message=f"Failed to fetch Datadog log timestamp for {correlation_id}: {exc}")
            return fallback

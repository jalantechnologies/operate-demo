from datetime import datetime, timezone
from typing import Any, Optional

from bson import ObjectId

from modules.application.repository import ApplicationRepository
from modules.scenario_run.types import ScenarioRun, ScenarioRunType, ScenarioRunStatus


class ScenarioRunRepository(ApplicationRepository):
    collection_name = "scenario_runs"

    @classmethod
    def insert(cls, run: ScenarioRun) -> ScenarioRun:
        doc = {
            "scenario_run_type": run.scenario_run_type.value,
            "correlation_id": run.correlation_id,
            "status": run.status.value,
            "operate_case_id": run.operate_case_id,
            "triggered_at": run.triggered_at,
        }
        result = cls.collection().insert_one(doc)
        return cls._from_doc({**doc, "_id": result.inserted_id})

    @classmethod
    def find_by_id(cls, run_id: str) -> Optional[ScenarioRun]:
        doc = cls.collection().find_one({"_id": ObjectId(run_id)})
        return cls._from_doc(doc) if doc is not None else None

    @classmethod
    def update_error_logged_at(cls, run_id: str, error_logged_at: datetime) -> None:
        cls.collection().update_one(
            {"_id": ObjectId(run_id)},
            {"$set": {"error_logged_at": error_logged_at}},
        )

    @classmethod
    def mark_detected(
        cls,
        run_id: str,
        operate_case_id: str,
        error_logged_at: Optional[datetime] = None,
        datadog_alerted_at: Optional[datetime] = None,
        webhook_received_at: Optional[datetime] = None,
        case_created_at: Optional[datetime] = None,
    ) -> ScenarioRun:
        now = datetime.now(tz=timezone.utc)
        cls.collection().update_one(
            {"_id": ObjectId(run_id)},
            {"$set": {
                "status": ScenarioRunStatus.DETECTED.value,
                "operate_case_id": operate_case_id,
                "error_logged_at": error_logged_at,
                "datadog_alerted_at": datadog_alerted_at,
                "webhook_received_at": webhook_received_at,
                "case_created_at": case_created_at,
                "updated_at": now,
            }},
        )
        doc = cls.collection().find_one({"_id": ObjectId(run_id)})
        return cls._from_doc(doc)

    @staticmethod
    def _from_doc(doc: dict[str, Any]) -> ScenarioRun:
        return ScenarioRun(
            id=str(doc["_id"]),
            scenario_run_type=ScenarioRunType(doc["scenario_run_type"]),
            correlation_id=doc["correlation_id"],
            status=ScenarioRunStatus(doc["status"]),
            operate_case_id=doc.get("operate_case_id"),
            triggered_at=doc["triggered_at"],
            error_logged_at=doc.get("error_logged_at"),
            datadog_alerted_at=doc.get("datadog_alerted_at"),
            webhook_received_at=doc.get("webhook_received_at"),
            case_created_at=doc.get("case_created_at"),
        )

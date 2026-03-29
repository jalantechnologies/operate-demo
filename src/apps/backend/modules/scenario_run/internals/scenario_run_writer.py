from datetime import datetime, timezone
from typing import Optional

from modules.scenario_run.internals.store.scenario_run_repository import ScenarioRunRepository
from modules.scenario_run.types import ScenarioRun, ScenarioRunType, ScenarioRunStatus


class ScenarioRunWriter:
    @staticmethod
    def create(scenario_run_type: ScenarioRunType, correlation_id: str) -> ScenarioRun:
        run = ScenarioRun(
            scenario_run_type=scenario_run_type,
            correlation_id=correlation_id,
            status=ScenarioRunStatus.PENDING,
            triggered_at=datetime.now(tz=timezone.utc),
        )
        return ScenarioRunRepository.insert(run)

    @staticmethod
    def mark_detected(
        run_id: str,
        operate_case_id: str,
        error_logged_at: Optional[datetime] = None,
        datadog_alerted_at: Optional[datetime] = None,
        webhook_received_at: Optional[datetime] = None,
        case_created_at: Optional[datetime] = None,
    ) -> ScenarioRun:
        return ScenarioRunRepository.mark_detected(
            run_id,
            operate_case_id,
            error_logged_at=error_logged_at,
            datadog_alerted_at=datadog_alerted_at,
            webhook_received_at=webhook_received_at,
            case_created_at=case_created_at,
        )

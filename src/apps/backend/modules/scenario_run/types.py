import enum
from dataclasses import dataclass
from datetime import datetime
from typing import Any, Optional


class ScenarioRunType(str, enum.Enum):
    PROACTIVE_ERROR_MONITORING = "proactive-error-monitoring"


class ScenarioRunStatus(str, enum.Enum):
    PENDING = "pending"
    DETECTED = "detected"


@dataclass
class ScenarioRun:
    scenario_run_type: ScenarioRunType
    correlation_id: str
    status: ScenarioRunStatus
    triggered_at: datetime
    operate_case_id: Optional[str] = None
    error_logged_at: Optional[datetime] = None
    datadog_alerted_at: Optional[datetime] = None
    webhook_received_at: Optional[datetime] = None
    case_created_at: Optional[datetime] = None
    id: Optional[str] = None

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "scenario_run_type": self.scenario_run_type.value,
            "correlation_id": self.correlation_id,
            "status": self.status.value,
            "operate_case_id": self.operate_case_id,
            "triggered_at": self.triggered_at,
            "error_logged_at": self.error_logged_at,
            "datadog_alerted_at": self.datadog_alerted_at,
            "webhook_received_at": self.webhook_received_at,
            "case_created_at": self.case_created_at,
        }


@dataclass(frozen=True)
class TriggerScenarioRunParams:
    scenario_run_type: ScenarioRunType


@dataclass(frozen=True)
class ScenarioRunErrorCode:
    NOT_FOUND: str = "SCENARIO_RUN_ERR_01"
    BAD_REQUEST: str = "SCENARIO_RUN_ERR_02"
    RUN_NOT_FOUND: str = "SCENARIO_RUN_ERR_03"

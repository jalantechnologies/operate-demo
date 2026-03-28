from dataclasses import dataclass
from enum import Enum


class ScenarioId(str, Enum):
    SILENT_FAILURE = "silent-failure"


@dataclass(frozen=True)
class TriggerScenarioParams:
    scenario_id: ScenarioId


@dataclass(frozen=True)
class TriggerScenarioResult:
    scenario_id: ScenarioId
    message: str


@dataclass(frozen=True)
class ScenarioErrorCode:
    NOT_FOUND: str = "SCENARIO_ERR_01"
    BAD_REQUEST: str = "SCENARIO_ERR_02"

from modules.application.errors import AppError
from modules.scenario_run.types import ScenarioRunErrorCode


class ScenarioRunNotFoundError(AppError):
    def __init__(self, scenario_run_type: str) -> None:
        super().__init__(
            code=ScenarioRunErrorCode.NOT_FOUND,
            http_status_code=404,
            message=f"Scenario run '{scenario_run_type}' not found.",
        )


class ScenarioRunBadRequestError(AppError):
    def __init__(self, message: str) -> None:
        super().__init__(code=ScenarioRunErrorCode.BAD_REQUEST, http_status_code=400, message=message)


class ScenarioRunRecordNotFoundError(AppError):
    def __init__(self) -> None:
        super().__init__(
            code=ScenarioRunErrorCode.RUN_NOT_FOUND,
            http_status_code=404,
            message="Scenario run record not found.",
        )

from modules.application.errors import AppError
from modules.scenario.types import ScenarioErrorCode


class ScenarioNotFoundError(AppError):
    def __init__(self, scenario_id: str) -> None:
        super().__init__(
            code=ScenarioErrorCode.NOT_FOUND, http_status_code=404, message=f"Scenario '{scenario_id}' not found."
        )


class ScenarioBadRequestError(AppError):
    def __init__(self, message: str) -> None:
        super().__init__(code=ScenarioErrorCode.BAD_REQUEST, http_status_code=400, message=message)

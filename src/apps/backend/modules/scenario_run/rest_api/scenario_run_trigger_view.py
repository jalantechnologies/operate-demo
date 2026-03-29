from flask import jsonify, request
from flask.typing import ResponseReturnValue
from flask.views import MethodView

from modules.scenario_run.errors import ScenarioRunBadRequestError, ScenarioRunNotFoundError
from modules.scenario_run.scenario_run_service import ScenarioRunService
from modules.scenario_run.types import ScenarioRunType, TriggerScenarioRunParams


class ScenarioRunTriggerView(MethodView):
    def post(self) -> ResponseReturnValue:
        request_data = request.get_json()

        if request_data is None:
            raise ScenarioRunBadRequestError("Request body is required")

        scenario_run_type_raw = request_data.get("scenario_run_type")

        if not scenario_run_type_raw:
            raise ScenarioRunBadRequestError("scenario_run_type is required")

        try:
            scenario_run_type = ScenarioRunType(scenario_run_type_raw)
        except ValueError as e:
            raise ScenarioRunNotFoundError(scenario_run_type=scenario_run_type_raw) from e

        params = TriggerScenarioRunParams(scenario_run_type=scenario_run_type)
        run = ScenarioRunService.trigger(params=params)

        return jsonify(run.to_dict()), 201

from dataclasses import asdict

from flask import jsonify, request
from flask.typing import ResponseReturnValue
from flask.views import MethodView

from modules.scenario.errors import ScenarioBadRequestError, ScenarioNotFoundError
from modules.scenario.scenario_service import ScenarioService
from modules.scenario.types import ScenarioId, TriggerScenarioParams


class ScenarioView(MethodView):
    def post(self) -> ResponseReturnValue:
        request_data = request.get_json()

        if request_data is None:
            raise ScenarioBadRequestError("Request body is required")

        scenario_id_raw = request_data.get("scenario_id")

        if not scenario_id_raw:
            raise ScenarioBadRequestError("scenario_id is required")

        try:
            scenario_id = ScenarioId(scenario_id_raw)
        except ValueError:
            raise ScenarioNotFoundError(scenario_id=scenario_id_raw)

        params = TriggerScenarioParams(scenario_id=scenario_id)
        result = ScenarioService.trigger_scenario(params=params)

        return jsonify(asdict(result)), 200

from flask import jsonify
from flask.typing import ResponseReturnValue
from flask.views import MethodView

from modules.scenario_run.scenario_run_service import ScenarioRunService


class ScenarioRunView(MethodView):
    def get(self, run_id: str) -> ResponseReturnValue:
        run = ScenarioRunService.get_by_id(run_id)
        return jsonify(run.to_dict()), 200

from flask import Blueprint

from modules.scenario_run.rest_api.scenario_run_router import ScenarioRunRouter


class ScenarioRunRestApiServer:
    @staticmethod
    def create() -> Blueprint:
        scenario_run_blueprint = Blueprint("scenario_run", __name__)
        return ScenarioRunRouter.create_route(blueprint=scenario_run_blueprint)

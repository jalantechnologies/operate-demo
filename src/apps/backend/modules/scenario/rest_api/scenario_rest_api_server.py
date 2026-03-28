from flask import Blueprint

from modules.scenario.rest_api.scenario_router import ScenarioRouter


class ScenarioRestApiServer:
    @staticmethod
    def create() -> Blueprint:
        scenario_api_blueprint = Blueprint("scenario", __name__)
        return ScenarioRouter.create_route(blueprint=scenario_api_blueprint)

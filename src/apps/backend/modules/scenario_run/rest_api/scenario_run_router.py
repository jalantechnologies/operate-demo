from flask import Blueprint

from modules.scenario_run.rest_api.scenario_run_trigger_view import ScenarioRunTriggerView
from modules.scenario_run.rest_api.scenario_run_view import ScenarioRunView


class ScenarioRunRouter:
    @staticmethod
    def create_route(*, blueprint: Blueprint) -> Blueprint:
        blueprint.add_url_rule(
            "/scenario-runs",
            view_func=ScenarioRunTriggerView.as_view("scenario_run_trigger_view"),
            methods=["POST"],
        )
        blueprint.add_url_rule(
            "/scenario-runs/<run_id>",
            view_func=ScenarioRunView.as_view("scenario_run_view"),
            methods=["GET"],
        )
        return blueprint

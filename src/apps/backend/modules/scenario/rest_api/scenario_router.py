from flask import Blueprint

from modules.scenario.rest_api.scenario_view import ScenarioView


class ScenarioRouter:
    @staticmethod
    def create_route(*, blueprint: Blueprint) -> Blueprint:
        blueprint.add_url_rule(
            "/scenarios",
            view_func=ScenarioView.as_view("scenario_view"),
            methods=["POST"],
        )

        return blueprint

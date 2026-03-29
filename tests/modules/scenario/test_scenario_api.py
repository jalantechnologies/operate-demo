import json

from server import app

from modules.scenario.types import ScenarioErrorCode, ScenarioId
from tests.modules.scenario.base_test_scenario import BaseTestScenario


class TestScenarioApi(BaseTestScenario):
    def test_trigger_silent_failure_scenario_success(self) -> None:
        response = self.make_post_request({"scenario_id": ScenarioId.SILENT_FAILURE.value})

        assert response.status_code == 200
        assert response.json is not None
        assert response.json.get("scenario_id") == ScenarioId.SILENT_FAILURE.value
        assert response.json.get("message") is not None

    def test_trigger_scenario_missing_body(self) -> None:
        with app.test_client() as client:
            response = client.post(self.SCENARIOS_URL, content_type="application/json", data="null")

        assert response.status_code == 400
        assert response.json is not None
        assert response.json.get("code") == ScenarioErrorCode.BAD_REQUEST

    def test_trigger_scenario_missing_scenario_id(self) -> None:
        response = self.make_post_request({})

        assert response.status_code == 400
        assert response.json is not None
        assert response.json.get("code") == ScenarioErrorCode.BAD_REQUEST

    def test_trigger_scenario_unknown_scenario_id(self) -> None:
        response = self.make_post_request({"scenario_id": "non-existent-scenario"})

        assert response.status_code == 404
        assert response.json is not None
        assert response.json.get("code") == ScenarioErrorCode.NOT_FOUND

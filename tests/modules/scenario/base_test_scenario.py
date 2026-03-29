import json
import unittest

from server import app

from modules.logger.logger_manager import LoggerManager
from modules.scenario.rest_api.scenario_rest_api_server import ScenarioRestApiServer


class BaseTestScenario(unittest.TestCase):
    SCENARIOS_URL = "http://127.0.0.1:8080/api/scenarios"
    HEADERS = {"Content-Type": "application/json"}

    def setUp(self) -> None:
        LoggerManager.mount_logger()
        ScenarioRestApiServer.create()

    def make_post_request(self, data: dict):
        with app.test_client() as client:
            return client.post(
                self.SCENARIOS_URL, headers=self.HEADERS, data=json.dumps(data) if data is not None else None
            )

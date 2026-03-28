from modules.scenario.scenario_service import ScenarioService
from modules.scenario.types import ScenarioId, TriggerScenarioParams
from tests.modules.scenario.base_test_scenario import BaseTestScenario


class TestScenarioService(BaseTestScenario):
    def test_trigger_silent_failure_scenario(self) -> None:
        params = TriggerScenarioParams(scenario_id=ScenarioId.SILENT_FAILURE)

        result = ScenarioService.trigger_scenario(params=params)

        assert result.scenario_id == ScenarioId.SILENT_FAILURE
        assert result.message is not None
        assert len(result.message) > 0

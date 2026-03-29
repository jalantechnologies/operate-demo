from modules.scenario_run.internals.scenario_run_reader import ScenarioRunReader
from modules.scenario_run.internals.scenario_run_trigger import ScenarioRunTrigger
from modules.scenario_run.internals.scenario_run_writer import ScenarioRunWriter
from modules.scenario_run.types import ScenarioRun, TriggerScenarioRunParams


class ScenarioRunService:
    @staticmethod
    def trigger(params: TriggerScenarioRunParams) -> ScenarioRun:
        correlation_id = ScenarioRunTrigger.run(params.scenario_run_type)
        return ScenarioRunWriter.create(params.scenario_run_type, correlation_id)

    @staticmethod
    def get_by_id(run_id: str) -> ScenarioRun:
        return ScenarioRunReader.get_by_id(run_id)

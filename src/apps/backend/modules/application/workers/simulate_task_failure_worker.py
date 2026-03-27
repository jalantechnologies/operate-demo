from typing import Any

from modules.application.worker import Worker
from modules.logger.logger import Logger
from modules.task.internal.store.task_repository import TaskRepository


class SimulateTaskFailureWorker(Worker):
    """
    Periodically simulates a realistic task processing failure and logs it as an error.

    This worker exists so that Operate's Datadog log monitor has real error logs to
    detect, which triggers the webhook and creates a case — completing the end-to-end
    cloud log monitoring pipeline.

    The simulated failure mirrors what a real task processing bug would look like:
    a database query that returns no results in a context where one was expected,
    causing a downstream operation to fail.
    """

    queue = "low"
    max_retries = 1
    cron_schedule = "*/5 * * * *"  # Every 5 minutes

    @classmethod
    def perform(cls, *args: Any, **kwargs: Any) -> None:
        try:
            task_count = TaskRepository.collection().count_documents({"active": True})

            if task_count == 0:
                raise RuntimeError("Task processor stalled: no active tasks found but processing was expected")

        except RuntimeError as e:
            Logger.error(message=f"SimulateTaskFailureWorker: task processing failed — {e}")
        except Exception as e:
            Logger.error(message=f"SimulateTaskFailureWorker: unexpected error during task processing — {e}")

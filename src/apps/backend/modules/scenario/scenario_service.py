import secrets
import uuid

from modules.logger.logger import Logger
from modules.scenario.errors import ScenarioNotFoundError
from modules.scenario.types import ScenarioId, TriggerScenarioParams, TriggerScenarioResult

# Realistic error log templates for a generic email notification pipeline.
# Each entry simulates a silent failure where the API returns 200 but the email never delivers.
_SILENT_FAILURE_MESSAGES = [
    (
        "NotificationDispatchWorker: email delivery silently dropped "
        "[job_id={job_id}, user_id={user_id}] — "
        "SMTP relay accepted the message (250 OK) but bounce record written 4 s later; "
        "no alert configured on soft-bounce queue"
    ),
    (
        "EmailQueueWorker: outbound message enqueued but never dequeued "
        "[job_id={job_id}, user_id={user_id}] — "
        "queue depth 0 after flush, message_id={message_id} missing from sent log; "
        "downstream consumer silently exited without error"
    ),
    (
        "NotificationWorker: email notification for user_id={user_id} "
        "returned HTTP 200 from mail provider but delivery_status=deferred; "
        "job_id={job_id}, correlation_id={correlation_id} — "
        "no retry scheduled, notification_status never updated"
    ),
    (
        "EmailWorker: PDF attachment stripped by relay anti-virus "
        "[job_id={job_id}, user_id={user_id}] — "
        "envelope accepted, body delivered without attachment; "
        "recipient sees empty email, system records status=sent"
    ),
    (
        "ScheduledNotificationWorker: follow-up email to user_id={user_id} "
        "silently discarded — SPF check failed for envelope sender, "
        "receiving MTA issued 550 after DATA phase but connection already closed; "
        "job_id={job_id}, no DeliveryFailure event emitted"
    ),
]


class ScenarioService:
    @staticmethod
    def trigger_scenario(*, params: TriggerScenarioParams) -> TriggerScenarioResult:
        if params.scenario_id == ScenarioId.SILENT_FAILURE:
            return ScenarioService._trigger_silent_failure()

        raise ScenarioNotFoundError(scenario_id=params.scenario_id)

    @staticmethod
    def _trigger_silent_failure() -> TriggerScenarioResult:
        template = secrets.choice(_SILENT_FAILURE_MESSAGES)
        message = template.format(
            job_id=f"job_{uuid.uuid4().hex[:8]}",
            user_id=f"user_{uuid.uuid4().hex[:8]}",
            message_id=f"msg_{uuid.uuid4().hex[:12]}",
            correlation_id=str(uuid.uuid4()),
        )

        Logger.error(message=message)

        return TriggerScenarioResult(
            scenario_id=ScenarioId.SILENT_FAILURE, message="Scenario triggered — error logged to Datadog."
        )

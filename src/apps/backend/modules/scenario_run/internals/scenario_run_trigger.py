import secrets
import uuid

from modules.logger.logger import Logger
from modules.scenario_run.errors import ScenarioRunNotFoundError
from modules.scenario_run.types import ScenarioRunType

# Realistic error log templates for a generic email notification pipeline.
# Each entry simulates a delivery failure detected by proactive monitoring.
_TEMPLATES = [
    (
        "NotificationDispatchWorker: email delivery failed "
        "[job_id={job_id}, user_id={user_id}] — "
        "SMTP relay accepted the message (250 OK) but bounce record written 4 s later; "
        "no alert configured on soft-bounce queue"
    ),
    (
        "EmailQueueWorker: outbound message enqueued but never dequeued "
        "[job_id={job_id}, user_id={user_id}] — "
        "queue depth 0 after flush, message_id={message_id} missing from sent log; "
        "downstream consumer exited without error"
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
        "dropped — SPF check failed for envelope sender, "
        "receiving MTA issued 550 after DATA phase but connection already closed; "
        "job_id={job_id}, no DeliveryFailure event emitted"
    ),
]


class ScenarioRunTrigger:
    @staticmethod
    def run(scenario_run_type: ScenarioRunType) -> str:
        if scenario_run_type == ScenarioRunType.PROACTIVE_ERROR_MONITORING:
            return ScenarioRunTrigger._silent_failure()
        raise ScenarioRunNotFoundError(scenario_run_type=scenario_run_type.value)

    @staticmethod
    def _silent_failure() -> str:
        job_id = f"job_{uuid.uuid4().hex[:8]}"
        template = secrets.choice(_TEMPLATES)
        message = template.format(
            job_id=job_id,
            user_id=f"user_{uuid.uuid4().hex[:8]}",
            message_id=f"msg_{uuid.uuid4().hex[:12]}",
            correlation_id=str(uuid.uuid4()),
        )
        Logger.error(message=message)
        # job_id is the correlation ID — embedded in the log and will appear in the case title
        return job_id

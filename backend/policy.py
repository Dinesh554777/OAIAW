from sqlalchemy.orm import Session
from models import EnvironmentPolicy, SecurityEvent, SecurityDecision, EventActor, AssessmentSession
import re

class PolicyViolationError(Exception):
    pass

class ControlledEnvironmentPolicy:
    def __init__(self, db: Session, assessment_session_id: int):
        self.db = db
        self.assessment_session_id = assessment_session_id
        
        # Fetch the session and policy
        self.session_record = self.db.query(AssessmentSession).filter_by(id=assessment_session_id).first()
        if not self.session_record:
            raise PolicyViolationError("Invalid assessment session.")
            
        self.policy = self.db.query(EnvironmentPolicy).filter_by(assessment_id=self.session_record.assessment_id).first()
        if not self.policy:
            # Fallback default policy if none defined
            self.policy = EnvironmentPolicy()

    def _log_event(self, action: str, resource: str, decision: SecurityDecision, reason: str = None):
        event = SecurityEvent(
            assessment_session_id=self.assessment_session_id,
            actor=EventActor.AI.value,
            event_type="POLICY_CHECK",
            action=action,
            resource=resource,
            decision=decision,
            reason=reason
        )
        self.db.add(event)
        self.db.commit()

    def check_file_read(self, path: str):
        if not self.policy.allow_file_read:
            self._log_event("read_file", path, SecurityDecision.DENIED, "File reading is disabled.")
            raise PolicyViolationError("File reading is disabled by policy.")
            
        if self._is_secret_path(path):
            if not self.policy.allow_secret_access:
                self._log_event("read_file", path, SecurityDecision.DENIED, "Access to secret files is forbidden.")
                raise PolicyViolationError("Access to secret files is forbidden by policy.")
                
        # More path validation can be handled by the sandbox, but we log the check
        self._log_event("read_file", path, SecurityDecision.ALLOWED)

    def check_file_write(self, path: str):
        if not self.policy.allow_file_write:
            self._log_event("write_file", path, SecurityDecision.DENIED, "File writing is disabled.")
            raise PolicyViolationError("File writing is disabled by policy.")
            
        self._log_event("write_file", path, SecurityDecision.ALLOWED)

    def check_tool_execution(self, tool_name: str):
        if tool_name == "run_tests" and not self.policy.allow_test_execution:
            self._log_event("execute_tool", tool_name, SecurityDecision.DENIED, "Test execution is disabled.")
            raise PolicyViolationError("Test execution is disabled by policy.")
            
        self._log_event("execute_tool", tool_name, SecurityDecision.ALLOWED)

    def check_network_access(self, domain: str = None):
        if not self.policy.network_enabled:
            self._log_event("network_access", domain or "any", SecurityDecision.DENIED, "Network access is disabled.")
            raise PolicyViolationError("Network access is disabled by policy.")
            
        self._log_event("network_access", domain or "any", SecurityDecision.ALLOWED)

    def redact_secrets(self, content: str) -> str:
        """Redacts common secret patterns like API_KEY, TOKEN, PASSWORD."""
        patterns = [
            (r"(?i)(api[_-]?key\s*[:=]\s*['\"]?)[a-zA-Z0-9_-]+(['\"]?)", r"\1***REDACTED***\2"),
            (r"(?i)(token\s*[:=]\s*['\"]?)[a-zA-Z0-9_-]+(['\"]?)", r"\1***REDACTED***\2"),
            (r"(?i)(password\s*[:=]\s*['\"]?)[a-zA-Z0-9_-]+(['\"]?)", r"\1***REDACTED***\2"),
            (r"(?i)(secret\s*[:=]\s*['\"]?)[a-zA-Z0-9_-]+(['\"]?)", r"\1***REDACTED***\2"),
            (r"(?i)(database_url\s*[:=]\s*['\"]?)[^\s'\"]+(['\"]?)", r"\1***REDACTED***\2")
        ]
        redacted_content = str(content)
        for pattern, replacement in patterns:
            redacted_content = re.sub(pattern, replacement, redacted_content)
        return redacted_content

    def _is_secret_path(self, path: str) -> bool:
        path_lower = path.lower()
        return ".env" in path_lower or "secret" in path_lower or "credentials" in path_lower

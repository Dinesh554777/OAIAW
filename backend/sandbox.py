import os
import subprocess
import shlex
import time
from typing import List, Optional, Tuple
from policy import ControlledEnvironmentPolicy, PolicyViolationError

class SandboxSecurityError(Exception):
    """Raised when a security violation occurs (e.g., path traversal, unauthorized command)."""
    pass

class SandboxExecutor:
    """
    A prototype sandbox executor that restricts path access, command execution, 
    and enforces timeouts.
    """
    
    ALLOWED_COMMANDS = {
        "pytest",
        "npm",
        "node",
        "python",
        "git",
        "ls",
        "cat"
    }

    def __init__(self, workspace_dir: str, policy: ControlledEnvironmentPolicy = None, timeout_seconds: int = 10):
        self.workspace_dir = os.path.abspath(workspace_dir)
        self.policy = policy
        if self.policy and getattr(self.policy.policy, 'max_command_timeout_seconds', None):
            self.timeout_seconds = self.policy.policy.max_command_timeout_seconds
        else:
            self.timeout_seconds = timeout_seconds
        
        if not os.path.exists(self.workspace_dir):
            os.makedirs(self.workspace_dir)

    def secure_path(self, requested_path: str) -> str:
        """
        Validates and resolves a path ensuring it strictly remains within the workspace directory.
        Prevents directory traversal attacks (e.g., ../../../etc/passwd).
        """
        # Normalize the requested path relative to the workspace
        if os.path.isabs(requested_path):
            # If absolute, it MUST start with the workspace dir
            abs_requested = os.path.normpath(requested_path)
        else:
            abs_requested = os.path.normpath(os.path.join(self.workspace_dir, requested_path))
            
        try:
            common_prefix = os.path.commonpath([self.workspace_dir, abs_requested])
            if common_prefix != self.workspace_dir:
                raise SandboxSecurityError(f"Access denied: Path '{requested_path}' escapes the workspace.")
        except ValueError:
            # commonpath raises ValueError if paths are on different drives on Windows
            raise SandboxSecurityError(f"Access denied: Path '{requested_path}' escapes the workspace.")
            
        return abs_requested

    def run_command(self, cmd_args: List[str]) -> Tuple[int, str, str]:
        """
        Executes a command securely.
        - Enforces an allowlist of base commands.
        - Runs without shell (shell=False) to prevent command injection.
        - Enforces execution timeouts.
        """
        if not cmd_args:
            raise SandboxSecurityError("No command provided.")
            
        base_cmd = cmd_args[0]
        if self.policy and not getattr(self.policy.policy, 'allow_shell', False):
            # Only allow predefined safe base commands if arbitrary shell is disabled
            if base_cmd not in self.ALLOWED_COMMANDS:
                if self.policy:
                    self.policy._log_event("execute_tool", base_cmd, "DENIED", "Command not allowed without shell permissions.")
                raise SandboxSecurityError(f"Command '{base_cmd}' is not allowed in this sandbox.")
        elif base_cmd not in self.ALLOWED_COMMANDS:
            # Always enforce ALLOWED_COMMANDS unless policy explicitly enables more (which it doesn't support here, but logic works)
            raise SandboxSecurityError(f"Command '{base_cmd}' is not allowed in this sandbox.")
            
        try:
            # We explicitly use shell=False to prevent shell injection (e.g., "npm test; rm -rf /")
            process = subprocess.run(
                cmd_args,
                cwd=self.workspace_dir,
                capture_output=True,
                text=True,
                timeout=self.timeout_seconds,
                shell=False
            )
            stdout = process.stdout
            stderr = process.stderr
            if self.policy:
                stdout = self.policy.redact_secrets(stdout)
                stderr = self.policy.redact_secrets(stderr)
                
            return process.returncode, stdout, stderr
        except subprocess.TimeoutExpired:
            raise SandboxSecurityError(f"Command execution exceeded timeout of {self.timeout_seconds} seconds.")
        except Exception as e:
            raise SandboxSecurityError(f"Execution failed: {str(e)}")

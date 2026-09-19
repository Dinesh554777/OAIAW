import os
import pytest
from sandbox import SandboxExecutor, SandboxSecurityError

def test_sandbox_secure_path_within_workspace(tmp_path):
    workspace = str(tmp_path)
    sandbox = SandboxExecutor(workspace)
    
    # Valid paths
    assert sandbox.secure_path("test.py").startswith(workspace)
    assert sandbox.secure_path("src/main.js").startswith(workspace)

def test_sandbox_prevents_path_traversal(tmp_path):
    workspace = str(tmp_path)
    sandbox = SandboxExecutor(workspace)
    
    # Attempt traversal
    with pytest.raises(SandboxSecurityError, match="escapes the workspace"):
        sandbox.secure_path("../../../etc/passwd")
        
    with pytest.raises(SandboxSecurityError, match="escapes the workspace"):
        sandbox.secure_path("src/../../etc/passwd")

def test_sandbox_allowlist_command(tmp_path):
    workspace = str(tmp_path)
    sandbox = SandboxExecutor(workspace)
    
    # Arbitrary command
    with pytest.raises(SandboxSecurityError, match="is not allowed in this sandbox"):
        sandbox.run_command(["rm", "-rf", "/"])

def test_sandbox_prevents_shell_injection(tmp_path):
    workspace = str(tmp_path)
    sandbox = SandboxExecutor(workspace)
    
    # Try to trick npm into executing a shell command
    # Because shell=False, the OS will try to find an executable named "npm test; echo PWNED" which fails.
    with pytest.raises(SandboxSecurityError):
        sandbox.run_command(["npm test; echo PWNED"])

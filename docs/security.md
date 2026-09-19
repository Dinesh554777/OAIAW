# OAIAW Security Model

This document outlines the security posture of the OAIAW (Online Assessment in the AI World) platform, focusing specifically on how candidate code and AI agent tools are executed safely.

## The Threat Model
Because OAIAW allows candidates (and autonomous AI agents) to submit and execute arbitrary code to evaluate technical competency, the backend is inherently exposed to:
- **Command Injection**: Malicious attempts to execute arbitrary shell commands on the host server.
- **Path Traversal**: Attempts to read or write sensitive files outside of the designated workspace (e.g., `.env`, `/etc/passwd`).
- **Resource Exhaustion**: Intentional or accidental infinite loops (CPU/Memory exhaustion).

## Phase 11: Prototype Security Sandbox
For the current prototype, we have implemented a pure-Python `SandboxExecutor` (`backend/sandbox.py`) that enforces the following mitigations:

1. **Path Isolation**: All requested file paths are passed through a strict `os.path.commonpath` verifier. If a requested path resolves to a directory above the designated `/tmp/workspace_{task_id}_{candidate_id}` directory, a `SandboxSecurityError` is immediately raised.
2. **Command Allowlisting**: The AI agent and the test runner cannot execute arbitrary commands. We strictly enforce a hardcoded allowlist (`pytest`, `npm`, `node`, `git`). 
3. **No-Shell Execution**: All subprocess executions are invoked with `shell=False`. This completely mitigates classical shell injection attacks (e.g., `npm test; rm -rf /`).
4. **Execution Timeouts**: All executions are bound by a strict timeout (e.g., 10 seconds). Any hanging process is forcefully terminated.

## Production-Grade Security
While the prototype sandbox effectively prevents basic exploits and path traversal, it is **not sufficient for a production environment**. 

Before launching OAIAW to actual users, the execution layer MUST be transitioned to one of the following true isolation mechanisms:

1. **MicroVMs (Firecracker)**: The industry standard for CI/CD and coding assessments. Every session boots a lightweight, completely isolated virtual machine in milliseconds.
2. **Container Sandboxing (gVisor)**: Running candidate workspaces in Docker containers sandboxed by gVisor (runsc) to intercept and restrict all Linux syscalls.
3. **Network Isolation**: Currently, the prototype allows the subprocess to make external network requests. Production must firewall the workspace, dropping all outbound connections except to authorized package registries (e.g., `registry.npmjs.org`).
4. **Cgroups**: Strict enforcement of CPU cores and RAM limits at the kernel level.

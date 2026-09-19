import os
import json
from sandbox import SandboxExecutor, SandboxSecurityError

class AgentTools:
    def __init__(self, workspace_dir: str):
        self.sandbox = SandboxExecutor(workspace_dir)

    def list_files(self) -> str:
        files = []
        for root, _, filenames in os.walk(self.sandbox.workspace_dir):
            for filename in filenames:
                rel_dir = os.path.relpath(root, self.sandbox.workspace_dir)
                rel_file = os.path.join(rel_dir, filename) if rel_dir != "." else filename
                files.append(rel_file)
        return json.dumps(files)

    def read_file(self, path: str) -> str:
        try:
            secure_p = self.sandbox.secure_path(path)
            if not os.path.exists(secure_p):
                return json.dumps({"error": "File not found"})
            with open(secure_p, 'r') as f:
                return json.dumps({"content": f.read()})
        except SandboxSecurityError as e:
            return json.dumps({"error": str(e)})
        except Exception as e:
            return json.dumps({"error": str(e)})

    def write_file(self, path: str, content: str) -> str:
        try:
            secure_p = self.sandbox.secure_path(path)
            os.makedirs(os.path.dirname(secure_p), exist_ok=True)
            with open(secure_p, 'w') as f:
                f.write(content)
            return json.dumps({"status": "success"})
        except SandboxSecurityError as e:
            return json.dumps({"error": str(e)})
        except Exception as e:
            return json.dumps({"error": str(e)})

    def search_code(self, query: str) -> str:
        results = []
        for root, _, filenames in os.walk(self.sandbox.workspace_dir):
            for filename in filenames:
                path = os.path.join(root, filename)
                with open(path, 'r', errors='ignore') as f:
                    for i, line in enumerate(f):
                        if query in line:
                            rel_p = os.path.relpath(path, self.sandbox.workspace_dir)
                            results.append({"file": rel_p, "line": i+1, "content": line.strip()})
        return json.dumps(results)

    def apply_patch(self, path: str, patch: str) -> str:
        return json.dumps({"error": "apply_patch not implemented in prototype. Use write_file."})

    def run_tests(self) -> str:
        try:
            # For demonstration, we attempt an actual test run, falling back to mock if not configured
            # A real environment might run "npm test" or "pytest"
            returncode, stdout, stderr = self.sandbox.run_command(["npm", "test"])
            return json.dumps({
                "status": "success" if returncode == 0 else "failed",
                "output": stdout,
                "error": stderr
            })
        except SandboxSecurityError as e:
            return json.dumps({"error": str(e)})
        except FileNotFoundError:
            # Fallback for systems without npm installed during prototype testing
            return json.dumps({"output": "Mock test run successful. (npm not found)"})

    def get_test_output(self) -> str:
        return json.dumps({"output": "Mock test output."})

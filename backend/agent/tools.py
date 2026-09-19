import os
import json
import subprocess

def secure_path(base_dir: str, requested_path: str) -> str:
    """Validates and resolves a path ensuring it remains within the base_dir."""
    abs_base = os.path.abspath(base_dir)
    abs_requested = os.path.abspath(os.path.join(base_dir, requested_path))
    if not abs_requested.startswith(abs_base):
        raise PermissionError(f"Access denied: path '{requested_path}' escapes the workspace.")
    return abs_requested

class AgentTools:
    def __init__(self, workspace_dir: str):
        self.workspace_dir = os.path.abspath(workspace_dir)
        if not os.path.exists(self.workspace_dir):
            os.makedirs(self.workspace_dir)

    def list_files(self) -> str:
        files = []
        for root, _, filenames in os.walk(self.workspace_dir):
            for filename in filenames:
                rel_dir = os.path.relpath(root, self.workspace_dir)
                rel_file = os.path.join(rel_dir, filename) if rel_dir != "." else filename
                files.append(rel_file)
        return json.dumps(files)

    def read_file(self, path: str) -> str:
        try:
            secure_p = secure_path(self.workspace_dir, path)
            if not os.path.exists(secure_p):
                return json.dumps({"error": "File not found"})
            with open(secure_p, 'r') as f:
                return json.dumps({"content": f.read()})
        except Exception as e:
            return json.dumps({"error": str(e)})

    def write_file(self, path: str, content: str) -> str:
        try:
            secure_p = secure_path(self.workspace_dir, path)
            os.makedirs(os.path.dirname(secure_p), exist_ok=True)
            with open(secure_p, 'w') as f:
                f.write(content)
            return json.dumps({"status": "success"})
        except Exception as e:
            return json.dumps({"error": str(e)})

    def search_code(self, query: str) -> str:
        # Simplistic search for prototype
        results = []
        for root, _, filenames in os.walk(self.workspace_dir):
            for filename in filenames:
                path = os.path.join(root, filename)
                with open(path, 'r', errors='ignore') as f:
                    for i, line in enumerate(f):
                        if query in line:
                            rel_p = os.path.relpath(path, self.workspace_dir)
                            results.append({"file": rel_p, "line": i+1, "content": line.strip()})
        return json.dumps(results)

    def apply_patch(self, path: str, patch: str) -> str:
        return json.dumps({"error": "apply_patch not implemented in prototype. Use write_file."})

    def run_tests(self) -> str:
        # In a real environment, this would run actual test commands.
        return json.dumps({"output": "Mock test run successful."})

    def get_test_output(self) -> str:
        return json.dumps({"output": "Mock test output."})

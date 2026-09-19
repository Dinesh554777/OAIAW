import subprocess
import os
import json

def init_git_repo(workspace_dir: str):
    if not os.path.exists(os.path.join(workspace_dir, '.git')):
        subprocess.run(['git', 'init'], cwd=workspace_dir, check=True, capture_output=True)
        subprocess.run(['git', 'config', 'user.email', 'candidate@oaiaw.com'], cwd=workspace_dir, check=True)
        subprocess.run(['git', 'config', 'user.name', 'Candidate'], cwd=workspace_dir, check=True)

def git_commit(workspace_dir: str, message: str, author_name: str, author_email: str):
    init_git_repo(workspace_dir)
    subprocess.run(['git', 'add', '.'], cwd=workspace_dir, check=True, capture_output=True)
    
    # Check if there are changes
    status = subprocess.run(['git', 'status', '--porcelain'], cwd=workspace_dir, capture_output=True, text=True)
    if not status.stdout.strip():
        return None # No changes to commit
        
    env = os.environ.copy()
    env['GIT_AUTHOR_NAME'] = author_name
    env['GIT_AUTHOR_EMAIL'] = author_email
    env['GIT_COMMITTER_NAME'] = author_name
    env['GIT_COMMITTER_EMAIL'] = author_email

    res = subprocess.run(['git', 'commit', '-m', message], cwd=workspace_dir, env=env, capture_output=True, text=True)
    if res.returncode == 0:
        # Get hash
        log = subprocess.run(['git', 'log', '-1', '--format=%H'], cwd=workspace_dir, capture_output=True, text=True)
        return log.stdout.strip()
    return None

def get_git_history(workspace_dir: str):
    if not os.path.exists(os.path.join(workspace_dir, '.git')):
        return []
    res = subprocess.run(['git', 'log', '--pretty=format:%H|%an|%ae|%s|%ad', '--date=iso'], cwd=workspace_dir, capture_output=True, text=True)
    if res.returncode != 0 or not res.stdout.strip():
        return []
    
    history = []
    for line in res.stdout.strip().split('\n'):
        parts = line.split('|', 4)
        if len(parts) == 5:
            history.append({
                "hash": parts[0],
                "author_name": parts[1],
                "author_email": parts[2],
                "message": parts[3],
                "date": parts[4]
            })
    return history

def get_git_diff(workspace_dir: str):
    if not os.path.exists(os.path.join(workspace_dir, '.git')):
        return ""
    # Get diff from root commit (empty tree) or first commit
    # For a real system we diff against the starter repo branch.
    # For prototype, we just do a diff against HEAD or working tree.
    res = subprocess.run(['git', 'diff', 'HEAD'], cwd=workspace_dir, capture_output=True, text=True)
    return res.stdout

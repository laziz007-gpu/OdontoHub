import subprocess
import os

os.chdir(r'd:\OdontoHUB\WebApp\Backendv2\Backend')

# Set environment to avoid editor
env = os.environ.copy()
env['GIT_EDITOR'] = 'true'
env['GIT_MERGE_AUTOEDIT'] = 'no'

try:
    # Try to complete the merge
    result = subprocess.run(
        ['git', 'commit', '--no-edit'],
        env=env,
        capture_output=True,
        text=True,
        timeout=5
    )
    print("STDOUT:", result.stdout)
    print("STDERR:", result.stderr)
    print("Return code:", result.returncode)
except Exception as e:
    print(f"Error: {e}")
    # If that fails, try to abort and start fresh
    subprocess.run(['git', 'merge', '--abort'], capture_output=True)
    print("Merge aborted. Please try again.")

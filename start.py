import os
import sys
import subprocess
import time
import webbrowser
from pathlib import Path

ROOT = Path(__file__).parent.resolve()
BACKEND_DIR = ROOT / "backend"
FRONTEND_DIR = ROOT / "frontend"

def main():
    print("========================================================")
    print("  RAILS DE · Rigorous High-Efficiency Learning System  ")
    print("  Non-Slop Hallmark Vantage Design System               ")
    print("========================================================")
    print()

    # 1. Start FastAPI Backend on port 8001
    print("Starting FastAPI Backend on http://127.0.0.1:8001 ...")
    backend_proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "server:app", "--host", "127.0.0.1", "--port", "8001"],
        cwd=str(BACKEND_DIR)
    )

    # 2. Start Vite Frontend on port 5173
    print("Starting Vite Frontend on http://localhost:5173 ...")
    npm_cmd = "npm.cmd" if os.name == "nt" else "npm"
    frontend_proc = subprocess.Popen(
        [npm_cmd, "run", "dev"],
        cwd=str(FRONTEND_DIR)
    )

    time.sleep(2)
    print("Opening browser at http://localhost:5173 ...")
    webbrowser.open("http://localhost:5173")

    print("\nPress Ctrl+C to stop both servers.")
    try:
        backend_proc.wait()
        frontend_proc.wait()
    except KeyboardInterrupt:
        print("\nStopping RAILS DE servers...")
        backend_proc.terminate()
        frontend_proc.terminate()
        print("Done.")

if __name__ == "__main__":
    main()

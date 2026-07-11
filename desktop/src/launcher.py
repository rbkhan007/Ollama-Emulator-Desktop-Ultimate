import sys
import threading
import uvicorn
from pathlib import Path
from ollama_emu.main import app

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent / "backend" / "src"))

def run_server():
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="warning")

def main():
    threading.Thread(target=run_server, daemon=True).start()

    from .qml_engine import QmlEngine
    engine = QmlEngine()
    sys.exit(engine.run())

if __name__ == "__main__":
    main()

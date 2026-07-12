import gc
import logging
import threading
import time
import os
from typing import Optional, List, Callable

log = logging.getLogger("ollama-emu.memory")

try:
    import psutil
    HAS_PSUTIL = True
except ImportError:
    HAS_PSUTIL = False
    log.warning("psutil not installed — memory monitor disabled (pip install psutil)")


class MemoryMonitor:
    def __init__(self, threshold_percent: float = 35.0, interval_seconds: int = 30):
        self.threshold = threshold_percent
        self.interval = interval_seconds
        self._running = False
        self._thread: Optional[threading.Thread] = None
        self._callbacks: List[Callable] = []

    def start(self):
        if not HAS_PSUTIL:
            log.warning("Memory monitor requires psutil — skipping")
            return
        if self._thread and self._thread.is_alive():
            return
        self._running = True
        self._thread = threading.Thread(target=self._monitor_loop, daemon=True)
        self._thread.start()
        log.info("Memory monitor started (threshold: %.1f%%, interval: %ds)", self.threshold, self.interval)

    def stop(self):
        self._running = False
        if self._thread:
            self._thread.join(timeout=2)

    def register_callback(self, callback: Callable):
        self._callbacks.append(callback)

    def _monitor_loop(self):
        process = psutil.Process(os.getpid())
        total_ram = psutil.virtual_memory().total / (1024 * 1024)
        while self._running:
            try:
                rss_mb = process.memory_info().rss / (1024 * 1024)
                percent = (rss_mb / total_ram) * 100
                if percent > self.threshold:
                    log.warning("Memory %.1f%% > %.0f%% threshold — triggering cleanup", percent, self.threshold)
                    self._cleanup()
            except Exception:
                pass
            time.sleep(self.interval)

    def _cleanup(self):
        gc.collect()
        for cb in self._callbacks:
            try:
                cb()
            except Exception as e:
                log.error("Memory callback error: %s", e)

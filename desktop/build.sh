#!/usr/bin/env bash
# ============================================
# OllamoMUI Desktop — Build Script (macOS/Linux)
# ============================================
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "============================================"
echo "  OllamoMUI Desktop — Build Script"
echo "  Platform: $(uname -s)"
echo "============================================"

# 1. Build frontend
echo "[1/4] Building frontend..."
pushd frontend > /dev/null
npm install --silent 2>/dev/null
npm run build
popd > /dev/null
echo "[OK]"

# 2. Install deps
echo "[2/4] Installing dependencies..."
pip install pyinstaller pyside6 -q
echo "[OK]"

# 3. Clean
echo "[3/4] Cleaning..."
rm -rf dist build *.spec
echo "[OK]"

# 4. Build
echo "[4/4] Building executable..."
python desktop/build.py --skip-frontend
echo "[OK]"

# Copy extras
cp docs/README.md dist/ 2>/dev/null || true
cp configs/.env.example dist/ 2>/dev/null || true

echo ""
echo "============================================"
echo "  Build complete!"
echo "  Executable: dist/ollamomui"
if [[ "$(uname -s)" == "Darwin" ]]; then
    echo "  App Bundle: dist/ollamomui.app"
fi
echo "============================================"

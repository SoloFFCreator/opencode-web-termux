#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
if [[ -z "${PREFIX:-}" || ! -d "$PREFIX" ]]; then echo "Run this script inside Termux."; exit 1; fi
pkg update -y
pkg install -y nodejs-lts git
TARGET="${OPENCODE_DIR:-$HOME/opencode-web-termux}"
if [[ -d "$TARGET/.git" ]]; then git -C "$TARGET" pull --ff-only
else git clone "${OPENCODE_REPO_URL:-https://github.com/anomalyco/opencode-web-termux.git}" "$TARGET"; fi
cd "$TARGET"
pnpm install 2>/dev/null || npm install
npm run termux:build
mkdir -p "$PREFIX/bin"
cat > "$PREFIX/bin/opencode" <<EOF
#!/data/data/com.termux/files/usr/bin/bash
exec npm --prefix "$TARGET" run termux -- "\$@"
EOF
chmod +x "$PREFIX/bin/opencode"
echo "Installed. Run: opencode --help"

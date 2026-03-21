#!/usr/bin/env bash
set -euo pipefail

WORKDIR="$(cd "$(dirname "$0")/.." && pwd)"
LOGDIR="$WORKDIR/logs"
PLIST="$HOME/Library/LaunchAgents/com.openclaw.embodied-ai-daily.ingest.plist"
mkdir -p "$LOGDIR"

cat > "$PLIST" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>Label</key>
    <string>com.openclaw.embodied-ai-daily.ingest</string>
    <key>ProgramArguments</key>
    <array>
      <string>/bin/zsh</string>
      <string>-lc</string>
      <string>cd '$WORKDIR' && npm run ingest >> '$LOGDIR/ingest.log' 2>&1</string>
    </array>
    <key>StartInterval</key>
    <integer>86400</integer>
    <key>WorkingDirectory</key>
    <string>$WORKDIR</string>
    <key>RunAtLoad</key>
    <true/>
    <key>StandardOutPath</key>
    <string>$LOGDIR/launchd.out.log</string>
    <key>StandardErrorPath</key>
    <string>$LOGDIR/launchd.err.log</string>
  </dict>
</plist>
PLIST

launchctl unload "$PLIST" >/dev/null 2>&1 || true
launchctl load "$PLIST"

echo "Installed launchd job: $PLIST"
echo "Logs: $LOGDIR/ingest.log"

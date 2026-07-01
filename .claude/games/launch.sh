#!/bin/bash
# Opens game / dashboard in their own Apple Terminal windows so they're
# instantly interactive (real keyboard). Usage: launch.sh <snake|dashboard|both>
set -euo pipefail

REPO="$(cd "$(dirname "$0")/../.." && pwd)"
GAMES="$REPO/.claude/games"

open_window() {  # $1 = shell command to run in the new window
  osascript >/dev/null 2>&1 <<EOF
tell application "Terminal"
  activate
  do script "cd '$REPO' && $1"
end tell
EOF
}

launch_dashboard() { open_window "python3 '$GAMES/agent-dashboard.py'"; }
launch_snake()     { open_window "python3 '$GAMES/snake.py'"; }
launch_arcade()    { open_window "python3 '$GAMES/arcade.py'"; }  # one window: dashboard + snake

tile_side_by_side() {  # dashboard -> left half, game -> right half
  osascript >/dev/null 2>&1 <<'OSA'
tell application "Finder" to set b to bounds of window of desktop
set W to item 3 of b
set H to item 4 of b
set half to W / 2
tell application "Terminal"
  activate
  repeat with w in windows
    set nm to name of w
    if nm contains "agent-dashboard" then
      set bounds of w to {0, 25, half, H}
    else if nm contains "snake" then
      set bounds of w to {half, 25, W, H}
    end if
  end repeat
end tell
OSA
}

case "${1:-both}" in
  snake)     launch_snake ;;
  dashboard) launch_dashboard ;;
  arcade|both) launch_arcade ;;   # single window, split panes
  twowin)    launch_dashboard; sleep 0.4; launch_snake; sleep 0.6; tile_side_by_side ;;
  *) echo "usage: launch.sh <arcade|snake|dashboard|twowin>"; exit 1 ;;
esac
echo "launched: ${1:-both}"

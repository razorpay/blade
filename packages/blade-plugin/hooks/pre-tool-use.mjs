// PreToolUse (Edit/Write/MultiEdit): snapshot a code file before the agent's
// first edit to it in this turn, so Stop can count only the agent's changes.
// Only runs in sessions session-start marked as Blade projects. Never blocks
// the tool: it prints nothing and always exits 0.
import fs from 'fs';
import { readStdinJSON, getSessionFile, logError } from './utils/analytics.mjs';
import { getBaselinesDir, snapshotBaseline } from './utils/lineStats.mjs';

const main = async () => {
  const input = await readStdinJSON();
  const sessionFile = getSessionFile(input.session_id);
  if (!fs.existsSync(sessionFile)) return;
  snapshotBaseline(getBaselinesDir(sessionFile), (input.tool_input || {}).file_path);
};

main().catch((error) => logError('pre-tool-use', error));

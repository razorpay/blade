// SessionStart: when the project depends on @razorpay/blade, tell Claude to use
// the blade skill and record a session_start event. Prints nothing otherwise.
import path from 'path';
import {
  readStdinJSON,
  isBladeProject,
  getBladeVersion,
  getUserId,
  getSessionFile,
  writeJSON,
  sendAnalytics,
  logError,
} from './utils/analytics.mjs';

const main = async () => {
  const input = await readStdinJSON();
  const cwd = input.cwd || process.cwd();
  if (!isBladeProject(cwd)) return;

  const sessionId = input.session_id || 'unknown';
  writeJSON(getSessionFile(sessionId), {
    sessionId,
    cwd,
    startedAt: new Date().toISOString(),
    editedFiles: [],
    skillsUsed: [],
    docsRead: [],
  });

  await sendAnalytics({
    userId: getUserId(cwd),
    properties: {
      toolName: 'session_start',
      rootDirectoryName: path.basename(cwd),
      bladeVersion: getBladeVersion(cwd),
    },
  }).catch((error) => logError('session-start', error));

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'SessionStart',
        additionalContext:
          'This project uses @razorpay/blade. Before writing or reviewing UI code, invoke the blade skill and read the component docs it points to.',
      },
    }),
  );
};

main().catch((error) => logError('session-start', error));

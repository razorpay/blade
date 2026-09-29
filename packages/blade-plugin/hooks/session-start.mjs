// SessionStart: when the project depends on @razorpay/blade and/or
// @razorpay/blade-svelte, tell Claude which Blade skill to use and record a
// session_start event. Prints nothing otherwise.
import path from 'path';
import {
  readStdinJSON,
  getUserId,
  getSessionFile,
  writeJSON,
  sendAnalytics,
  logError,
} from './utils/analytics.mjs';
import { detectFrameworks, getBladeVersions, getNudge } from './utils/frameworks.mjs';

const main = async () => {
  const input = await readStdinJSON();
  const cwd = input.cwd || process.cwd();
  const frameworks = detectFrameworks(cwd);
  if (frameworks.length === 0) return;

  const sessionId = input.session_id || 'unknown';
  writeJSON(getSessionFile(sessionId), {
    sessionId,
    cwd,
    frameworks,
    startedAt: new Date().toISOString(),
    editedFiles: [],
    skillsUsed: [],
    docsRead: [],
  });

  const versions = getBladeVersions(cwd);
  await sendAnalytics({
    userId: getUserId(cwd),
    properties: {
      toolName: 'session_start',
      rootDirectoryName: path.basename(cwd),
      frameworks: frameworks.join(','),
      bladeVersion: versions.react ?? '',
      bladeSvelteVersion: versions.svelte ?? '',
    },
  }).catch((error) => logError('session-start', error));

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'SessionStart',
        additionalContext: getNudge(frameworks),
      },
    }),
  );
};

main().catch((error) => logError('session-start', error));

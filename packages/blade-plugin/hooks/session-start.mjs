// SessionStart: when the project depends on @razorpay/blade, tell the agent to
// use the blade skill. Prints nothing otherwise (including projects that only
// use @razorpay/blade-svelte, which has no skill). Must never fail the session, so errors are swallowed.
import { detectFrameworks, getNudge } from './utils/frameworks.mjs';

const readStdinJSON = async () => {
  let data = '';
  for await (const chunk of process.stdin) data += chunk;
  try {
    return JSON.parse(data);
  } catch {
    return {};
  }
};

const main = async () => {
  const input = await readStdinJSON();
  const nudge = getNudge(detectFrameworks(input.cwd || process.cwd()));
  if (!nudge) return;

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'SessionStart',
        additionalContext: nudge,
      },
    }),
  );
};

main().catch(() => {});

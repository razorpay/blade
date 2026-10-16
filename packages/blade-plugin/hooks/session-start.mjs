// SessionStart: when the project depends on @razorpay/blade and/or
// @razorpay/blade-svelte, tell the agent which Blade skill to use. Prints
// nothing otherwise. Must never fail the session, so errors are swallowed.
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
  const frameworks = detectFrameworks(input.cwd || process.cwd());
  if (frameworks.length === 0) return;

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'SessionStart',
        additionalContext: getNudge(frameworks),
      },
    }),
  );
};

main().catch(() => {});

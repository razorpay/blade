// PostToolUse: when an agent's edit adds `isSerif` (PT Serif) to a file that imports Blade,
// ask it to undo the change or mark it as the agentic dashboard hero heading.
// Prints nothing otherwise. Must never break the session, so errors are swallowed.
import { checkToolCall } from './utils/serifGuard.mjs';

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
  const reminder = checkToolCall(await readStdinJSON());
  if (!reminder) return;

  process.stdout.write(
    JSON.stringify({
      decision: 'block',
      reason: reminder,
      hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: reminder },
    }),
  );
};

main().catch(() => {});

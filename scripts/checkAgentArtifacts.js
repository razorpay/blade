/**
 * Fails if agent scratch output is tracked by git.
 *
 * Agents write reports, plans and status files while working on a change. Those are
 * notes *about* the change and must never be committed. .gitignore covers the usual
 * paths, but it does not help once a file is already tracked or when it is force-added,
 * so this runs on the whole index in CI and on pre-commit.
 */
const { execSync } = require('child_process');

// Templates and examples under .agents/.claude/.cursor are tracked on purpose, so these
// rules match generated output directories and root-level scratch files only.
const RULES = [
  {
    label: 'Agent review reports',
    test: (file) => /^\.(agents|claude|cursor)\/reviews\//.test(file),
  },
  {
    label: 'Agent artifacts',
    test: (file) => /^\.(agents|claude|cursor)\/artifacts\//.test(file),
  },
  {
    label: 'Agent worktrees',
    test: (file) => /^\.(agents|claude|cursor)\/worktrees\//.test(file),
  },
  {
    label: 'Browser automation captures',
    test: (file) => /^\.playwright-mcp\//.test(file),
  },
  {
    label: 'Scratch report at repo root',
    test: (file) =>
      /^[^/]*(announcement|batch-status|discovery-report|migration-plan|verification-report|patch-request|review-report|-review)\.md$/i.test(
        file,
      ),
  },
];

const trackedFiles = execSync('git ls-files', { encoding: 'utf8' }).split('\n').filter(Boolean);

const violations = RULES.map((rule) => ({
  label: rule.label,
  files: trackedFiles.filter(rule.test),
})).filter((violation) => violation.files.length > 0);

if (violations.length === 0) {
  console.log('✅ No agent scratch output is tracked by git');
  process.exit(0);
}

const offendingFiles = violations.flatMap((violation) => violation.files);

console.error('--------------------------------');
console.error(`❌ ${offendingFiles.length} agent scratch file(s) are tracked by git\n`);
for (const violation of violations) {
  console.error(`${violation.label}:`);
  for (const file of violation.files) {
    console.error(`  - ${file}`);
  }
  console.error('');
}
console.error('These are working notes, not part of the change. Remove them with:\n');
console.error(`  git rm --cached ${offendingFiles.join(' ')}\n`);
console.error('Keep such files outside the repo, or under an already-ignored artifacts/ path.');
console.error('--------------------------------');

process.exit(1);

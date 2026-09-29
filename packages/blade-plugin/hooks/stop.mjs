// Stop: publish the lines-of-code metric for files this session edited.
// Replaces the MCP's model-reported publish_lines_of_code_metric with numbers
// from `git diff --numstat`, restricted to files the agent touched.
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import {
  readStdinJSON,
  getSessionFile,
  readJSON,
  writeJSON,
  getUserId,
  sendAnalytics,
  logError,
} from './utils/analytics.mjs';
import { getBladeVersions } from './utils/frameworks.mjs';

// Matches both @razorpay/blade and @razorpay/blade-svelte imports.
const usesBlade = (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8').includes('@razorpay/blade');
  } catch {
    return false;
  }
};

const numstat = (cwd, files) => {
  const relative = files
    .map((f) => (path.isAbsolute(f) ? path.relative(cwd, f) : f))
    .filter((f) => !f.startsWith('..'));
  if (relative.length === 0) return [];
  const quoted = relative.map((f) => `"${f.replace(/"/g, '\\"')}"`).join(' ');
  const output = execSync(`git diff --numstat HEAD -- ${quoted}`, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
    timeout: 5000,
  });
  return output
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [added, removed, file] = line.split('\t');
      return { file, added: Number(added) || 0, removed: Number(removed) || 0 };
    });
};

const main = async () => {
  const input = await readStdinJSON();
  const sessionFile = getSessionFile(input.session_id);
  if (!fs.existsSync(sessionFile)) return;

  const session = readJSON(sessionFile, null);
  if (!session) return;

  const cwd = session.cwd || input.cwd || process.cwd();
  const pending = session.editedFiles || [];
  const skillsUsed = session.skillsUsed || [];
  const docsRead = session.docsRead || [];

  // Nothing to report: no edits and no Blade docs consulted this turn.
  if (pending.length === 0 && skillsUsed.length === 0 && docsRead.length === 0) return;

  let stats = [];
  try {
    stats = numstat(cwd, pending);
  } catch (error) {
    logError('stop:numstat', error);
  }

  const totals = {
    linesAddedTotal: 0,
    linesRemovedTotal: 0,
    bladeUiLinesAddedTotal: 0,
    bladeUiLinesRemovedTotal: 0,
    nonBladeUiLinesAddedTotal: 0,
    nonBladeUiLinesRemovedTotal: 0,
  };
  for (const { file, added, removed } of stats) {
    totals.linesAddedTotal += added;
    totals.linesRemovedTotal += removed;
    const isUi = /\.(tsx|jsx|svelte)$/.test(file);
    if (isUi && usesBlade(path.join(cwd, file))) {
      totals.bladeUiLinesAddedTotal += added;
      totals.bladeUiLinesRemovedTotal += removed;
    } else if (isUi) {
      totals.nonBladeUiLinesAddedTotal += added;
      totals.nonBladeUiLinesRemovedTotal += removed;
    }
  }

  const versions = getBladeVersions(cwd);
  await sendAnalytics({
    userId: getUserId(cwd),
    properties: {
      toolName: 'publish_lines_of_code_metric',
      rootDirectoryName: path.basename(cwd),
      frameworks: (session.frameworks || []).join(','),
      bladeVersion: versions.react ?? '',
      bladeSvelteVersion: versions.svelte ?? '',
      files: stats.map(({ file, added, removed }) => `${file}:${added}:${removed}`).join(','),
      skillsUsed: skillsUsed.join(','),
      docsRead: docsRead.join(','),
      ...totals,
    },
  }).catch((error) => logError('stop:analytics', error));

  // Reset per-turn accumulators so the next Stop reports only new work.
  writeJSON(sessionFile, { ...session, editedFiles: [], skillsUsed: [], docsRead: [] });
};

main().catch((error) => logError('stop', error));

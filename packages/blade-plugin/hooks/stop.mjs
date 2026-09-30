// Stop: publish the lines-of-code metric for the files the agent edited this
// turn. Replaces the MCP's model-reported publish_lines_of_code_metric with
// numbers diffed against per-turn snapshots (see utils/lineStats.mjs).
import fs from 'fs';
import path from 'path';
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
import { getBaselinesDir, computeLineStats, clearBaselines } from './utils/lineStats.mjs';

// Matches both @razorpay/blade and @razorpay/blade-svelte imports.
const usesBlade = (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8').includes('@razorpay/blade');
  } catch {
    return false;
  }
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

  const baselinesDir = getBaselinesDir(sessionFile);

  // Nothing to report: no edits and no Blade docs consulted this turn.
  if (pending.length === 0 && skillsUsed.length === 0 && docsRead.length === 0) {
    clearBaselines(baselinesDir);
    return;
  }

  let stats = [];
  try {
    stats = computeLineStats(baselinesDir, pending, cwd);
  } catch (error) {
    logError('stop:lineStats', error);
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
    if (isUi && usesBlade(path.resolve(cwd, file))) {
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

  // Reset per-turn state so the next Stop reports only new work.
  clearBaselines(baselinesDir);
  writeJSON(sessionFile, { ...session, editedFiles: [], skillsUsed: [], docsRead: [] });
};

main().catch((error) => logError('stop', error));

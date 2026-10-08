// Per-turn line counting for files the agent edits.
//
// PreToolUse snapshots a file just before the agent's first edit in a turn;
// Stop diffs that snapshot against the file on disk and then deletes it. So a
// turn reports only what the agent changed in that turn: new (untracked)
// files count in full, a file edited over several turns is not re-counted,
// and edits the user made before the agent touched the file are excluded.
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execFileSync } from 'child_process';

export const CODE_EXTENSIONS = new Set(['.tsx', '.ts', '.jsx', '.js', '.svelte']);

// git accepts /dev/null as "no file" on every platform, including Windows.
const NO_FILE = '/dev/null';

const baselineName = (filePath) => crypto.createHash('sha1').update(filePath).digest('hex');

export const getBaselinesDir = (sessionFile) => sessionFile.replace(/\.json$/, '.baselines');

// Returns true when a snapshot was taken, false when one already exists for
// this turn or the file is not code.
export const snapshotBaseline = (baselinesDir, filePath) => {
  if (!filePath || !CODE_EXTENSIONS.has(path.extname(filePath))) return false;
  const name = baselineName(filePath);
  const base = path.join(baselinesDir, `${name}.base`);
  const missing = path.join(baselinesDir, `${name}.new`);
  if (fs.existsSync(base) || fs.existsSync(missing)) return false;
  fs.mkdirSync(baselinesDir, { recursive: true });
  if (fs.existsSync(filePath)) fs.copyFileSync(filePath, base);
  else fs.writeFileSync(missing, '');
  return true;
};

const numstat = (from, to) => {
  let output;
  try {
    output = execFileSync('git', ['diff', '--no-index', '--numstat', '--', from, to], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: 5000,
    });
  } catch (error) {
    // --no-index exits 1 when the files differ; stdout still has the numstat.
    if (error.status !== 1) throw error;
    output = error.stdout;
  }
  const [added, removed] = (output.split('\n').find(Boolean) ?? '0\t0').split('\t');
  // Binary files report "-"; count them as zero lines.
  return { added: Number(added) || 0, removed: Number(removed) || 0 };
};

// Line stats for each file snapshotted this turn. Files without a snapshot
// (edited before this plugin version) are skipped rather than guessed.
export const computeLineStats = (baselinesDir, files, cwd) => {
  const stats = [];
  for (const filePath of files) {
    const name = baselineName(filePath);
    const base = path.join(baselinesDir, `${name}.base`);
    const wasMissing = fs.existsSync(path.join(baselinesDir, `${name}.new`));
    if (!fs.existsSync(base) && !wasMissing) continue;
    const from = wasMissing ? NO_FILE : base;
    const to = fs.existsSync(filePath) ? filePath : NO_FILE;
    const { added, removed } = numstat(from, to);
    const relative = path.relative(cwd, filePath).split(path.sep).join('/');
    stats.push({ file: relative.startsWith('..') ? filePath : relative, added, removed });
  }
  return stats;
};

export const clearBaselines = (baselinesDir) => {
  fs.rmSync(baselinesDir, { recursive: true, force: true });
};

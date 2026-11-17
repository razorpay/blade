// Guards PT Serif, which Blade reserves for the agentic dashboard hero heading
// (`<Heading size="2xlarge" isSerif />`). After an agent edits a file, checks only
// the text the edit added: if it uses `isSerif` in a file that imports Blade,
// the agent is asked to undo it or mark the use as intentional.
import fs from 'fs';
import path from 'path';

export const ALLOW_MARKER = 'blade-allow-serif';

const CHECKED_EXTENSIONS = new Set(['.tsx', '.jsx', '.ts', '.js', '.mjs', '.cjs', '.mdx']);
const IS_SERIF = /\bisSerif\b/;
const BLADE_IMPORT = /['"]@razorpay\/blade(?:\/[\w-]+)*['"]/;

// The lines a Codex `apply_patch` call adds, grouped by the file they belong to, so each
// file is judged only on its own changes.
const parsePatch = (patch) => {
  const edits = [];
  let current = null;
  for (const line of patch.split('\n')) {
    const header = line.match(/^\*\*\* (Add|Update|Delete) File: (.+)$/);
    if (header) {
      current = header[1] === 'Delete' ? null : { file: header[2].trim(), lines: [] };
      if (current) edits.push(current);
    } else if (current && line.startsWith('+') && !line.startsWith('+++')) {
      current.lines.push(line.slice(1));
    }
  }
  return edits.map(({ file, lines }) => ({ file, added: lines.join('\n') }));
};

// The text each edited file gained, for Claude Code's Write, Edit and MultiEdit tools
// (one file per call) and Codex's apply_patch (one or more files).
export const readEdit = (toolInput = {}) => {
  const edits = [];
  if (typeof toolInput.file_path === 'string') {
    const parts = [];
    if (typeof toolInput.content === 'string') parts.push(toolInput.content);
    if (typeof toolInput.new_string === 'string') parts.push(toolInput.new_string);
    if (Array.isArray(toolInput.edits)) {
      for (const edit of toolInput.edits) {
        if (typeof edit?.new_string === 'string') parts.push(edit.new_string);
      }
    }
    edits.push({ file: toolInput.file_path, added: parts.join('\n') });
  }
  for (const key of ['input', 'patch', 'command']) {
    const value = Array.isArray(toolInput[key]) ? toolInput[key].join('\n') : toolInput[key];
    if (typeof value === 'string' && value.includes('*** Begin Patch')) {
      edits.push(...parsePatch(value));
    }
  }
  return edits;
};

const nearestPackageName = (filePath) => {
  let dir = path.dirname(filePath);
  for (;;) {
    try {
      return JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8')).name ?? null;
    } catch {
      // keep walking up
    }
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
};

// Blade's own packages define and document the serif heading, so they are not checked.
export const isCheckedFile = (filePath) => {
  if (!filePath || !CHECKED_EXTENSIONS.has(path.extname(filePath))) return false;
  if (filePath.split(/[\\/]/).includes('node_modules')) return false;
  const packageName = nearestPackageName(filePath);
  return !(packageName === '@razorpay/blade' || packageName?.startsWith('@razorpay/blade-'));
};

// Whether `added` uses `isSerif`, judged against the file's full content after the edit.
export const hasSerifUse = (added, fileContent = added) =>
  Boolean(added) &&
  !fileContent.includes(ALLOW_MARKER) &&
  IS_SERIF.test(added) &&
  BLADE_IMPORT.test(fileContent);

export const getReminder = (files) =>
  [
    `Blade: this edit uses \`isSerif\` in ${files.join(', ')}.`,
    'PT Serif is reserved for the agentic dashboard hero heading (`<Heading size="2xlarge" isSerif />`). Do not use it for other headings, pages or custom components, even if a design looks similar.',
    `- If this is not the agentic dashboard hero heading, undo the serif change and use a regular \`Heading\`.`,
    `- If it is, add a \`// ${ALLOW_MARKER}: agentic dashboard hero\` comment (\`{/* ${ALLOW_MARKER}: agentic dashboard hero */}\` inside JSX) next to the usage, so reviewers can see it was intentional.`,
  ].join('\n');

const readFile = (file) => {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return null;
  }
};

// Full check for one tool call. Returns the reminder text, or null.
export const checkToolCall = ({ tool_input: toolInput, cwd } = {}) => {
  const base = cwd || process.cwd();
  const flaggedFiles = [];
  for (const { file, added } of readEdit(toolInput)) {
    if (!added) continue;
    const absolute = path.resolve(base, file);
    if (!isCheckedFile(absolute) || !hasSerifUse(added, readFile(absolute) ?? added)) continue;
    const relative = path.relative(base, absolute);
    flaggedFiles.push(relative && !relative.startsWith('..') ? relative : absolute);
  }
  return flaggedFiles.length > 0 ? getReminder(flaggedFiles) : null;
};

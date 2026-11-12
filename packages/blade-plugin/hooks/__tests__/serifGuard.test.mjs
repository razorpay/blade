import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import { ALLOW_MARKER, checkToolCall, findSerifUses, readEdit } from '../utils/serifGuard.mjs';

const hooksDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const SERIF_FILE = [
  "import { Heading } from '@razorpay/blade/components';",
  '',
  'export const Hero = () => (',
  '  <Heading size="2xlarge" isSerif>',
  '    Good morning',
  '  </Heading>',
  ');',
].join('\n');

const makeProject = (files, packageName = 'merchant-dashboard') => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'blade-serif-guard-'));
  const all = { 'package.json': JSON.stringify({ name: packageName }), ...files };
  for (const [name, content] of Object.entries(all)) {
    fs.mkdirSync(path.dirname(path.join(dir, name)), { recursive: true });
    fs.writeFileSync(path.join(dir, name), content);
  }
  return dir;
};

// Simulates a Write tool call: the file is already on disk when PostToolUse runs.
const writeCall = (dir, name, content) => ({
  cwd: dir,
  tool_name: 'Write',
  tool_input: { file_path: path.join(dir, name), content },
});

test('flags isSerif written into a file that imports Blade', () => {
  const dir = makeProject({ 'src/Hero.tsx': SERIF_FILE });
  const reminder = checkToolCall(writeCall(dir, 'src/Hero.tsx', SERIF_FILE));
  assert.match(reminder, /`isSerif`/);
  assert.match(reminder, /agentic dashboard hero heading/);
  assert.match(reminder, new RegExp(ALLOW_MARKER));
});

test('stays quiet once the file carries the allow marker', () => {
  const content = `${SERIF_FILE}\n// ${ALLOW_MARKER}: agentic dashboard hero`;
  const dir = makeProject({ 'src/Hero.tsx': content });
  assert.equal(checkToolCall(writeCall(dir, 'src/Hero.tsx', content)), null);
});

test('stays quiet when an edit only adds the allow marker', () => {
  const content = `${SERIF_FILE}\n// ${ALLOW_MARKER}: agentic dashboard hero`;
  const dir = makeProject({ 'src/Hero.tsx': content });
  const call = {
    cwd: dir,
    tool_name: 'Edit',
    tool_input: {
      file_path: path.join(dir, 'src/Hero.tsx'),
      old_string: ');',
      new_string: `);\n// ${ALLOW_MARKER}: agentic dashboard hero`,
    },
  };
  assert.equal(checkToolCall(call), null);
});

test('ignores an unrelated isSerif in a file that does not use Blade', () => {
  const content = 'export const FontPicker = ({ isSerif }) => (isSerif ? "serif" : "sans");';
  const dir = makeProject({ 'src/FontPicker.tsx': content });
  assert.equal(checkToolCall(writeCall(dir, 'src/FontPicker.tsx', content)), null);
});

test('flags the raw serif token even without a Blade import', () => {
  const content =
    'const Title = styled.h1`font-family: ${(p) => p.theme.typography.fonts.family.serif};`;';
  const dir = makeProject({ 'src/Title.ts': content });
  assert.match(checkToolCall(writeCall(dir, 'src/Title.ts', content)), /the `serif` font token/);
  assert.deepEqual(findSerifUses("theme.typography.fonts.family['serif']"), [
    'the `serif` font token',
  ]);
  assert.deepEqual(findSerifUses('theme.typography.fonts.family?.serif'), [
    'the `serif` font token',
  ]);
});

test('only checks text the edit added, not code already in the file', () => {
  const dir = makeProject({ 'src/Hero.tsx': `${SERIF_FILE}\nexport const x = 1;` });
  const call = {
    cwd: dir,
    tool_name: 'Edit',
    tool_input: {
      file_path: path.join(dir, 'src/Hero.tsx'),
      old_string: ');',
      new_string: ');\nexport const x = 1;',
    },
  };
  assert.equal(checkToolCall(call), null);
});

test('skips Blade’s own packages, node_modules and non-code files', () => {
  const blade = makeProject({ 'src/Heading.tsx': SERIF_FILE }, '@razorpay/blade');
  assert.equal(checkToolCall(writeCall(blade, 'src/Heading.tsx', SERIF_FILE)), null);

  const plugin = makeProject({ 'docs/Heading.mdx': SERIF_FILE }, '@razorpay/blade-plugin');
  assert.equal(checkToolCall(writeCall(plugin, 'docs/Heading.mdx', SERIF_FILE)), null);

  const app = makeProject({
    'node_modules/pkg/index.js': SERIF_FILE,
    'notes/heading.md': SERIF_FILE,
  });
  assert.equal(checkToolCall(writeCall(app, 'node_modules/pkg/index.js', SERIF_FILE)), null);
  assert.equal(checkToolCall(writeCall(app, 'notes/heading.md', SERIF_FILE)), null);
});

test('reads MultiEdit edits and Codex apply_patch calls', () => {
  const dir = makeProject({ 'src/Hero.tsx': SERIF_FILE });
  const multiEdit = {
    cwd: dir,
    tool_name: 'MultiEdit',
    tool_input: {
      file_path: path.join(dir, 'src/Hero.tsx'),
      edits: [{ old_string: 'x', new_string: '<Heading size="2xlarge" isSerif>' }],
    },
  };
  assert.match(checkToolCall(multiEdit), /`isSerif`/);

  const patch = [
    '*** Begin Patch',
    '*** Update File: src/Hero.tsx',
    '@@',
    '-  <Heading size="2xlarge">',
    '+  <Heading size="2xlarge" isSerif>',
    '*** End Patch',
  ].join('\n');
  assert.deepEqual(readEdit({ input: patch }), {
    added: '  <Heading size="2xlarge" isSerif>',
    files: ['src/Hero.tsx'],
  });
  assert.match(
    checkToolCall({ cwd: dir, tool_name: 'apply_patch', tool_input: { input: patch } }),
    /src\/Hero\.tsx/,
  );
});

const runHook = (payload) =>
  execFileSync(process.execPath, [path.join(hooksDir, 'serif-guard.mjs')], {
    input: typeof payload === 'string' ? payload : JSON.stringify(payload),
    encoding: 'utf8',
  });

test('hook script blocks with a reminder, and prints nothing for clean or broken input', () => {
  const dir = makeProject({ 'src/Hero.tsx': SERIF_FILE, 'src/Plain.tsx': 'export const a = 1;' });

  const output = JSON.parse(runHook(writeCall(dir, 'src/Hero.tsx', SERIF_FILE)));
  assert.equal(output.decision, 'block');
  assert.match(output.reason, /agentic dashboard hero heading/);
  assert.equal(output.hookSpecificOutput.hookEventName, 'PostToolUse');

  assert.equal(runHook(writeCall(dir, 'src/Plain.tsx', 'export const a = 1;')), '');
  assert.equal(runHook('not json'), '');
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import {
  detectFrameworks,
  getBladeVersions,
  getDocName,
  getNudge,
  lockfileMentions,
} from '../utils/frameworks.mjs';

const hooksDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const makeProject = (files) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'blade-plugin-test-'));
  for (const [name, content] of Object.entries(files)) {
    fs.writeFileSync(
      path.join(dir, name),
      typeof content === 'string' ? content : JSON.stringify(content),
    );
  }
  return dir;
};

test('detects react from package.json', () => {
  const dir = makeProject({ 'package.json': { dependencies: { '@razorpay/blade': '^12.0.0' } } });
  assert.deepEqual(detectFrameworks(dir), ['react']);
});

test('detects svelte from package.json without matching react', () => {
  const dir = makeProject({
    'package.json': {
      dependencies: { '@razorpay/blade-svelte': '^0.18.0', '@razorpay/blade-core': '^0.19.0' },
    },
  });
  assert.deepEqual(detectFrameworks(dir), ['svelte']);
  assert.deepEqual(getBladeVersions(dir), { svelte: '^0.18.0' });
});

test('detects both in a monorepo lockfile', () => {
  const dir = makeProject({
    'package.json': { private: true, workspaces: ['apps/*'] },
    'yarn.lock': [
      '"@razorpay/blade-svelte@^0.18.0":',
      '  version "0.18.0"',
      '',
      '"@razorpay/blade@^12.0.0":',
      '  version "12.0.0"',
    ].join('\n'),
  });
  assert.deepEqual(detectFrameworks(dir), ['react', 'svelte']);
});

test('returns nothing for a non-Blade project', () => {
  const dir = makeProject({ 'package.json': { dependencies: { react: '^18.0.0' } } });
  assert.deepEqual(detectFrameworks(dir), []);
  assert.deepEqual(detectFrameworks(undefined), []);
});

test('lockfile matching needs the whole package name', () => {
  const react = '@razorpay/blade';
  const svelte = '@razorpay/blade-svelte';
  // yarn v1, yarn berry, npm, pnpm
  assert.ok(lockfileMentions('"@razorpay/blade@^12.0.0":', react));
  assert.ok(lockfileMentions('"@razorpay/blade@npm:^12.0.0":', react));
  assert.ok(lockfileMentions('    "node_modules/@razorpay/blade": {', react));
  assert.ok(lockfileMentions("      '@razorpay/blade': 12.0.0", react));
  assert.ok(lockfileMentions('  /@razorpay/blade@12.0.0:', react));
  assert.ok(lockfileMentions('"@razorpay/blade-svelte@^0.18.0":', svelte));
  assert.ok(!lockfileMentions('"@razorpay/blade-svelte@^0.18.0":', react));
  assert.ok(!lockfileMentions('    "node_modules/@razorpay/blade-core": {', react));
  assert.ok(!lockfileMentions('"@razorpay/blade@^12.0.0":', svelte));
});

test('nudge names the skill for each framework', () => {
  assert.match(getNudge(['react']), /invoke the blade skill/);
  assert.match(getNudge(['svelte']), /@razorpay\/blade-svelte.*invoke the blade-svelte skill/);
  const both = getNudge(['react', 'svelte']);
  assert.match(both, /blade skill for \.tsx\/\.jsx files/);
  assert.match(both, /blade-svelte skill for \.svelte files/);
});

test('doc names keep React paths bare and prefix other skills', () => {
  assert.equal(getDocName('/x/skills/blade/references/components/Button.md'), 'components/Button');
  assert.equal(
    getDocName('/x/skills/blade-svelte/references/components/Button.md'),
    'blade-svelte/components/Button',
  );
  assert.equal(
    getDocName('C:\\x\\skills\\blade\\references\\general\\Tokens.md'),
    'general/Tokens',
  );
  assert.equal(getDocName('/x/skills/blade-upgrade/SKILL.md'), null);
  assert.equal(getDocName('/x/src/Button.md'), null);
});

test('SessionStart hook prints the svelte nudge in a svelte project', () => {
  const dir = makeProject({
    'package.json': { dependencies: { '@razorpay/blade-svelte': '^0.18.0' } },
  });
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'blade-plugin-data-'));
  const output = execFileSync(process.execPath, [path.join(hooksDir, 'session-start.mjs')], {
    input: JSON.stringify({ cwd: dir, session_id: 'test-session' }),
    env: { ...process.env, CLAUDE_PLUGIN_DATA: dataDir, BLADE_SEGMENT_KEY: '' },
    encoding: 'utf8',
  });
  const { hookSpecificOutput } = JSON.parse(output);
  assert.equal(hookSpecificOutput.hookEventName, 'SessionStart');
  assert.match(hookSpecificOutput.additionalContext, /blade-svelte skill/);
  const session = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'sessions', 'test-session.json'), 'utf8'),
  );
  assert.deepEqual(session.frameworks, ['svelte']);
});

test('SessionStart hook prints nothing outside Blade projects', () => {
  const dir = makeProject({ 'package.json': { dependencies: { react: '^18.0.0' } } });
  const output = execFileSync(process.execPath, [path.join(hooksDir, 'session-start.mjs')], {
    input: JSON.stringify({ cwd: dir, session_id: 'test-none' }),
    env: {
      ...process.env,
      CLAUDE_PLUGIN_DATA: fs.mkdtempSync(path.join(os.tmpdir(), 'blade-plugin-data-')),
    },
    encoding: 'utf8',
  });
  assert.equal(output, '');
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import { getDocsRead } from '../utils/docs.mjs';

const hooksDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const makeProject = () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'blade-plugin-project-'));
  fs.writeFileSync(
    path.join(dir, 'package.json'),
    JSON.stringify({ dependencies: { '@razorpay/blade': '^12.0.0' } }),
  );
  return dir;
};

const lines = (count, prefix = 'line') =>
  Array.from({ length: count }, (_, i) => `${prefix} ${i}`).join('\n') + '\n';

const createSession = (cwd) => {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'blade-plugin-data-'));
  const sessionId = 'test-session';
  const run = (hook, payload) =>
    execFileSync(process.execPath, [path.join(hooksDir, hook)], {
      input: JSON.stringify({ session_id: sessionId, cwd, ...payload }),
      env: {
        ...process.env,
        CLAUDE_PLUGIN_DATA: dataDir,
        BLADE_SEGMENT_KEY: '',
        BLADE_PLUGIN_DEBUG: '1',
      },
      encoding: 'utf8',
    });
  // Simulates one agent edit: PreToolUse, the edit itself, PostToolUse.
  const edit = (filePath, content) => {
    const toolInput = { file_path: filePath };
    run('pre-tool-use.mjs', { tool_name: 'Write', tool_input: toolInput });
    fs.writeFileSync(filePath, content);
    run('post-tool-use.mjs', { tool_name: 'Write', tool_input: toolInput });
  };
  const events = () =>
    fs
      .readFileSync(path.join(dataDir, 'events.log'), 'utf8')
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line).properties);
  const lastMetric = () =>
    events()
      .filter((event) => event.toolName === 'publish_lines_of_code_metric')
      .at(-1);
  run('session-start.mjs', {});
  return { run, edit, lastMetric, dataDir };
};

test('counts new files, excludes the user edits made before the agent, and never re-counts a file', () => {
  const cwd = makeProject();
  const existing = path.join(cwd, 'OneHome.tsx');
  fs.writeFileSync(existing, lines(10));
  const session = createSession(cwd);

  // The user's own uncommitted change, made before the agent touches the file.
  fs.appendFileSync(existing, lines(4, 'user'));

  // Turn 1: agent adds 2 lines to OneHome and creates a 5-line DummyWidget.
  session.edit(existing, fs.readFileSync(existing, 'utf8') + lines(2, 'agent'));
  session.edit(existing, fs.readFileSync(existing, 'utf8'));
  session.edit(path.join(cwd, 'DummyWidget.tsx'), lines(5, 'widget'));
  session.run('stop.mjs', {});
  let metric = session.lastMetric();
  assert.deepEqual(metric.files.split(',').sort(), ['DummyWidget.tsx:5:0', 'OneHome.tsx:2:0']);
  assert.equal(metric.linesAddedTotal, 7);

  // Turn 2: one more line in OneHome. Only that line is reported.
  session.edit(existing, fs.readFileSync(existing, 'utf8') + lines(1, 'agent2'));
  session.run('stop.mjs', {});
  metric = session.lastMetric();
  assert.equal(metric.files, 'OneHome.tsx:1:0');
  assert.equal(metric.linesAddedTotal, 1);

  // Snapshots are removed once the turn is reported.
  const sessions = fs.readdirSync(path.join(session.dataDir, 'sessions'));
  assert.deepEqual(sessions, ['test-session.json']);
});

test('records docs read through Bash as well as Read', () => {
  const cwd = makeProject();
  const session = createSession(cwd);
  session.run('post-tool-use.mjs', {
    tool_name: 'Bash',
    tool_input: {
      command: 'cat ~/.claude/plugins/blade/skills/blade/references/components/Card.md',
    },
  });
  session.run('post-tool-use.mjs', {
    tool_name: 'Read',
    tool_input: { file_path: '/x/skills/blade/references/patterns/ListView.md' },
  });
  session.run('stop.mjs', {});
  assert.equal(session.lastMetric().docsRead, 'components/Card,patterns/ListView');
});

test('getDocsRead matches blade skill docs only', () => {
  assert.deepEqual(
    getDocsRead('Read', { file_path: '/p/skills/blade/references/general/Tokens.md' }),
    ['general/Tokens'],
  );
  assert.deepEqual(
    getDocsRead('Read', { file_path: 'C:\\p\\skills\\blade\\references\\components\\Button.md' }),
    ['components/Button'],
  );
  assert.deepEqual(
    getDocsRead('Bash', {
      command:
        'cd /p/skills/blade && sed -n 1,80p references/components/Table.md references/styled-props-types.md',
    }),
    ['components/Table', 'styled-props-types'],
  );
  assert.deepEqual(
    getDocsRead('Bash', { command: 'cat docs/references/components/Button.md' }),
    [],
  );
  assert.deepEqual(getDocsRead('Read', { file_path: '/p/src/Button.md' }), []);
  assert.deepEqual(
    getDocsRead('Edit', { file_path: '/p/skills/blade/references/components/Button.md' }),
    [],
  );
});

test('SessionStart removes session files older than a week', () => {
  const cwd = makeProject();
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'blade-plugin-data-'));
  const sessionsDir = path.join(dataDir, 'sessions');
  fs.mkdirSync(sessionsDir, { recursive: true });
  const stale = path.join(sessionsDir, 'old.json');
  fs.writeFileSync(stale, '{}');
  const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000);
  fs.utimesSync(stale, eightDaysAgo, eightDaysAgo);
  execFileSync(process.execPath, [path.join(hooksDir, 'session-start.mjs')], {
    input: JSON.stringify({ session_id: 'fresh', cwd }),
    env: { ...process.env, CLAUDE_PLUGIN_DATA: dataDir, BLADE_SEGMENT_KEY: '' },
    encoding: 'utf8',
  });
  assert.deepEqual(fs.readdirSync(sessionsDir), ['fresh.json']);
});

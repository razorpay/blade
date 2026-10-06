import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import http from 'http';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const pluginRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pluginVersion = JSON.parse(
  fs.readFileSync(path.join(pluginRoot, '.claude-plugin', 'plugin.json'), 'utf8'),
).version;

// Runs a script with analytics in debug mode (no network) and collects the
// events it would send.
const run = (script, args, { input, env } = {}) =>
  new Promise((resolve) => {
    const child = spawn(process.execPath, [path.join(pluginRoot, script), ...args], {
      env: { ...process.env, BLADE_SEGMENT_KEY: '', BLADE_PLUGIN_DEBUG: '1', ...env },
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => (stdout += chunk));
    child.stderr.on('data', (chunk) => (stderr += chunk));
    child.on('close', (code) => {
      const events = stderr
        .split('\n')
        .filter((line) => line.startsWith('[blade-analytics] {'))
        .map((line) => JSON.parse(line.slice('[blade-analytics] '.length)));
      resolve({ code, stdout, stderr, events });
    });
    child.stdin.end(input ?? '');
  });

const metric = 'skills/blade/scripts/publish-metric.mjs';
const validArgs = {
  files: [
    { filePath: 'src/components/Button.tsx', linesAdded: 10, linesRemoved: 2 },
    { filePath: 'src/utils/helpers.ts', linesAdded: 3, linesRemoved: 1 },
  ],
  linesAddedTotal: 13,
  linesRemovedTotal: 3,
  bladeUiLinesAddedTotal: 10,
  bladeUiLinesRemovedTotal: 2,
  currentProjectRootDirectory: '/Users/alice/projects/my-app',
  toolsUsed: ['blade', 'blade:blade-upgrade'],
};

test('publish-metric sends the MCP tool metric as a skill-usage event', async () => {
  const { code, stdout, events } = await run(metric, [JSON.stringify(validArgs)]);
  assert.equal(code, 0);
  assert.equal(
    stdout.trim(),
    'Recorded 13 lines added and 3 lines removed across 2 files. Tools used: blade, blade-upgrade.',
  );
  assert.equal(events.length, 1);
  const [event] = events;
  assert.equal(event.event, 'Blade Skill Used');
  assert.equal(event.userId, 'alice');
  assert.deepEqual(
    { ...event.properties, osType: undefined, nodeVersion: undefined },
    {
      osType: undefined,
      nodeVersion: undefined,
      serverVersion: pluginVersion,
      userName: 'alice',
      rootDirectoryName: 'my-app',
      protocol: 'plugin',
      skillName: 'blade',
      toolName: 'publish_lines_of_code_metric',
      linesAddedTotal: 13,
      linesRemovedTotal: 3,
      bladeUiLinesAddedTotal: 10,
      bladeUiLinesRemovedTotal: 2,
      nonBladeUiLinesAddedTotal: 0,
      nonBladeUiLinesRemovedTotal: 0,
      nonUiLinesAddedTotal: 0,
      nonUiLinesRemovedTotal: 0,
      files: 'src/components/Button.tsx:10:2,src/utils/helpers.ts:3:1',
      toolsUsed: 'blade,blade-upgrade',
      currentProjectRootDirectory: '/Users/alice/projects/my-app',
    },
  );
});

test('publish-metric reads JSON from stdin', async () => {
  const { code, events } = await run(metric, [], { input: JSON.stringify(validArgs) });
  assert.equal(code, 0);
  assert.equal(events.length, 1);
});

test('publish-metric rejects what the MCP schema rejects', async () => {
  const cases = [
    ['not json', /not valid JSON/],
    [JSON.stringify({ ...validArgs, files: [] }), /files must be a non-empty array/],
    [
      JSON.stringify({
        ...validArgs,
        files: [{ filePath: 'a.tsx', linesAdded: -1, linesRemoved: 0 }],
      }),
      /linesAdded must be a non-negative integer/,
    ],
    [JSON.stringify({ ...validArgs, linesRemovedTotal: 1.5 }), /linesRemovedTotal/],
    [JSON.stringify({ ...validArgs, nonUiLinesAddedTotal: -2 }), /nonUiLinesAddedTotal/],
    [
      JSON.stringify({ ...validArgs, currentProjectRootDirectory: undefined }),
      /currentProjectRootDirectory/,
    ],
    [
      JSON.stringify({ ...validArgs, toolsUsed: ['frontend-design'] }),
      /toolsUsed: "frontend-design"/,
    ],
  ];
  for (const [input, message] of cases) {
    const { code, stderr, events } = await run(metric, [input]);
    assert.equal(code, 1, input);
    assert.match(stderr, message);
    assert.equal(events.length, 0);
  }
});

test('figma-to-code keeps the screenshot name safe and sends the MCP event', async () => {
  const server = http.createServer((req, res) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          code: '<Button>Pay</Button>',
          componentsUsed: ['Button'],
          base64Image: Buffer.from('jpeg').toString('base64'),
          received: JSON.parse(body),
        }),
      );
    });
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  try {
    const {
      code,
      stdout,
      events,
    } = await run(
      'skills/blade-figma-to-code/scripts/figma-to-code.mjs',
      ['../../escape', '12:345'],
      { env: { BLADE_FIGMA_TO_CODE_URL: url } },
    );
    assert.equal(code, 0);
    const imagePath = /## Design screenshot\n\n(.+)\n/.exec(stdout)?.[1];
    assert.ok(imagePath, stdout);
    assert.equal(path.dirname(imagePath), os.tmpdir());
    assert.equal(path.basename(imagePath), 'blade-figma-------escape-12-345.jpg');
    assert.ok(fs.existsSync(imagePath));
    fs.rmSync(imagePath);
    assert.equal(events.length, 1);
    assert.equal(events[0].event, 'Blade Skill Used');
    assert.equal(events[0].properties.skillName, 'blade-figma-to-code');
    assert.equal(events[0].properties.toolName, 'get_figma_to_code');
    assert.equal(events[0].properties.componentsUsed, 'Button');
    assert.equal(events[0].properties.code, '<Button>Pay</Button>');
  } finally {
    server.close();
  }
});

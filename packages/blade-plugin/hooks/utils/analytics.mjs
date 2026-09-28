import fs from 'fs';
import os from 'os';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Same Segment source as Blade MCP so adoption dashboards compare both.
// The key is a public write key; it is already shipped inside the published
// @razorpay/blade-mcp tarball. Override with BLADE_SEGMENT_KEY for testing.
const SEGMENT_WRITE_KEY = process.env.BLADE_SEGMENT_KEY ?? '';

const pluginRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

export const EVENT_NAME = 'Blade Plugin Tool Called';

export const getPluginVersion = () => {
  try {
    const manifest = JSON.parse(
      fs.readFileSync(path.join(pluginRoot, '.claude-plugin', 'plugin.json'), 'utf8'),
    );
    return manifest.version ?? 'unknown';
  } catch {
    return 'unknown';
  }
};

export const readStdinJSON = () =>
  new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => {
      data += chunk;
    });
    process.stdin.on('end', () => {
      try {
        resolve(JSON.parse(data));
      } catch {
        resolve({});
      }
    });
    process.stdin.on('error', () => resolve({}));
  });

// Session scratch lives outside the consumer repo so hooks never create files
// in the user's project. CLAUDE_PLUGIN_DATA is set by Claude Code when
// available; fall back to the OS temp dir.
export const getDataDir = () => {
  const base = process.env.CLAUDE_PLUGIN_DATA || path.join(os.tmpdir(), 'blade-plugin');
  return base;
};

export const getSessionFile = (sessionId) =>
  path.join(getDataDir(), 'sessions', `${sessionId || 'unknown'}.json`);

export const readJSON = (filePath, fallback) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
};

export const writeJSON = (filePath, value) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value));
};

export const logError = (hook, error) => {
  try {
    const logFile = path.join(getDataDir(), 'errors.log');
    fs.mkdirSync(path.dirname(logFile), { recursive: true });
    fs.appendFileSync(
      logFile,
      `[${new Date().toISOString()}] [${hook}] ${error instanceof Error ? error.message : String(error)}\n`,
    );
  } catch {
    // never let logging fail a hook
  }
};

const readPackageJSON = (cwd) => readJSON(path.join(cwd, 'package.json'), null);

// A Blade project declares @razorpay/blade in package.json. Checking the
// lockfile too catches monorepos where the root package.json is a shell.
export const isBladeProject = (cwd) => {
  if (!cwd) return false;
  const pkg = readPackageJSON(cwd);
  if (pkg) {
    for (const field of ['dependencies', 'devDependencies', 'peerDependencies']) {
      if (pkg[field] && pkg[field]['@razorpay/blade']) return true;
    }
  }
  for (const lock of ['yarn.lock', 'package-lock.json', 'pnpm-lock.yaml']) {
    try {
      const content = fs.readFileSync(path.join(cwd, lock), 'utf8');
      if (content.includes('@razorpay/blade@') || content.includes('"@razorpay/blade"')) return true;
    } catch {
      // lockfile absent
    }
  }
  return false;
};

export const getBladeVersion = (cwd) => {
  const pkg = readPackageJSON(cwd);
  if (!pkg) return '';
  for (const field of ['dependencies', 'devDependencies', 'peerDependencies']) {
    if (pkg[field] && pkg[field]['@razorpay/blade']) return pkg[field]['@razorpay/blade'];
  }
  return '';
};

export const getUserId = (cwd) => {
  try {
    const email = execSync('git config user.email', {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: 2000,
    }).trim();
    if (email) return email;
  } catch {
    // no git or no email configured
  }
  return process.env.USER || process.env.USERNAME || 'unknown';
};

export const getSource = () => {
  if ((process.env.APP_NAME || '').startsWith('swe-agent-')) return 'slash';
  if (process.env.VSCODE_PID) return 'vscode';
  return 'cli';
};

export const sendAnalytics = async ({ userId, properties }) => {
  if (!SEGMENT_WRITE_KEY) return;
  const auth = Buffer.from(`${SEGMENT_WRITE_KEY}:`).toString('base64');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3000);
  try {
    await fetch('https://api.segment.io/v1/track', {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        event: EVENT_NAME,
        properties: {
          osType: os.type(),
          nodeVersion: process.version,
          pluginVersion: getPluginVersion(),
          source: getSource(),
          protocol: 'plugin',
          ...properties,
        },
      }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
};

import fs from 'fs';
import os from 'os';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Same Segment source as Blade MCP so adoption dashboards compare both.
// The key is NOT in this repo: blade-mcp inlines it at build time
// (src/replaceEnv.js), but the plugin installs from a git checkout with no
// build, so events are only sent when BLADE_SEGMENT_KEY is set in the
// environment. Injecting it for all users belongs in the plugin distribution
// step, not in a commit to this public repo.
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

// session_id comes from hook input; keep it to one safe path segment.
export const getSessionFile = (sessionId) =>
  path.join(
    getDataDir(),
    'sessions',
    `${String(sessionId || 'unknown').replace(/[^A-Za-z0-9_-]/g, '_')}.json`,
  );

const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

// Session files hold the project path and edited file paths; drop the ones
// from sessions older than a week.
export const pruneOldSessions = (now = Date.now()) => {
  const sessionsDir = path.join(getDataDir(), 'sessions');
  let entries = [];
  try {
    entries = fs.readdirSync(sessionsDir);
  } catch {
    return;
  }
  for (const entry of entries) {
    const entryPath = path.join(sessionsDir, entry);
    try {
      if (now - fs.statSync(entryPath).mtimeMs > SESSION_MAX_AGE_MS) {
        fs.rmSync(entryPath, { recursive: true, force: true });
      }
    } catch {
      // another session may have removed it
    }
  }
};

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
      `[${new Date().toISOString()}] [${hook}] ${
        error instanceof Error ? error.message : String(error)
      }\n`,
    );
  } catch {
    // never let logging fail a hook
  }
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

// BLADE_PLUGIN_DEBUG=1 appends every event to <data dir>/events.log, with or
// without a Segment key, so metrics can be checked locally.
const debugLog = (event) => {
  if (!process.env.BLADE_PLUGIN_DEBUG) return;
  const logFile = path.join(getDataDir(), 'events.log');
  fs.mkdirSync(path.dirname(logFile), { recursive: true });
  fs.appendFileSync(logFile, `${JSON.stringify(event)}\n`);
};

export const sendAnalytics = async ({ userId, properties }) => {
  const event = {
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
  };
  debugLog(event);
  if (!SEGMENT_WRITE_KEY) return;
  const auth = Buffer.from(`${SEGMENT_WRITE_KEY}:`).toString('base64');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3000);
  try {
    await fetch('https://api.segment.io/v1/track', {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
};

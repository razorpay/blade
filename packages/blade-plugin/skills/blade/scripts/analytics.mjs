// Port of packages/blade-mcp/src/utils/analyticsUtils.ts + getUserName.ts for
// skill scripts. Same user id and properties as Blade MCP, but a separate event
// name so dashboards can tell skill usage from MCP tool calls. `framework`
// comes from the skill directory the script runs from (blade-svelte → svelte).
//
// Each skill that ships a script keeps an identical copy of this file, because
// `npx skills add` installs one skill directory on its own.
// scripts/validatePlugin.mjs fails if the copies differ.
//
// Events are sent only when BLADE_SEGMENT_KEY is set (the MCP inlines it at
// build time; plugins have no build step). BLADE_PLUGIN_DEBUG=1 prints each
// event to stderr instead of relying on Segment.
import os from 'os';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

export const analyticsToolCallEventName = 'Blade Plugin Tool Called';

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));

const framework = path.basename(path.dirname(scriptsDir)) === 'blade-svelte' ? 'svelte' : 'react';

// Version of the installed plugin; skills installed without the plugin
// manifest (npx skills add) report 'unknown'.
const getPluginVersion = () => {
  try {
    const manifest = path.join(scriptsDir, '..', '..', '..', '.claude-plugin', 'plugin.json');
    return JSON.parse(fs.readFileSync(manifest, 'utf8')).version ?? 'unknown';
  } catch {
    return 'unknown';
  }
};

export const getUserName = (currentProjectRootDirectory) => {
  const match = currentProjectRootDirectory.match(/\/(?:Users|home)\/([^/]+)(?:\/|$)/);
  const username = match?.[1];
  const excludedDirs = ['Desktop', 'Documents', 'Downloads', 'Projects', 'workspace'];
  if (username && !excludedDirs.includes(username)) return username;
  return currentProjectRootDirectory.split('/').find((part) => part) ?? 'unknown';
};

const getUniqueIdentifier = () => {
  try {
    const macAddresses = [];
    for (const networkInterface of Object.values(os.networkInterfaces())) {
      for (const details of networkInterface ?? []) {
        if (!details.internal && details.mac && details.mac !== '00:00:00:00:00:00') {
          macAddresses.push(details.mac);
        }
      }
    }
    if (macAddresses.length > 0) {
      const hash = crypto.createHash('sha256').update(macAddresses.join('-')).digest('hex');
      return `blade-${hash.substring(0, 16)}`;
    }
    const hostHash = crypto.createHash('sha256').update(os.hostname()).digest('hex');
    return `blade-host-${hostHash.substring(0, 12)}`;
  } catch {
    return `blade-fallback-${Date.now()}`;
  }
};

const post = async (endpoint, body, writeKey) => {
  await fetch(`https://api.segment.io/v1/${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${writeKey}:`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(3000),
  });
};

// Never throws: analytics must not break the script that calls it.
export const sendAnalytics = async ({ eventName, properties }) => {
  try {
    const projectRootDirectory = properties.currentProjectRootDirectory ?? process.cwd();
    const userId = getUserName(projectRootDirectory.replace(/\\/g, '/'));
    const event = {
      userId,
      event: eventName,
      properties: {
        osType: os.type(),
        nodeVersion: process.version,
        serverVersion: getPluginVersion(),
        userName: userId,
        rootDirectoryName: path.basename(projectRootDirectory),
        protocol: 'plugin',
        framework,
        ...properties,
      },
    };
    if (process.env.BLADE_PLUGIN_DEBUG) {
      process.stderr.write(`[blade-analytics] ${JSON.stringify(event)}\n`);
    }
    const writeKey = process.env.BLADE_SEGMENT_KEY;
    if (!writeKey) return;
    await post('track', event, writeKey);
    await post('alias', { userId, previousId: getUniqueIdentifier() }, writeKey);
  } catch (error) {
    if (process.env.BLADE_PLUGIN_DEBUG) {
      process.stderr.write(
        `[blade-analytics] failed: ${error instanceof Error ? error.message : error}\n`,
      );
    }
  }
};

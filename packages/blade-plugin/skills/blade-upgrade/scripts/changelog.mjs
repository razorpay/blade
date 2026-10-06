// Prints @razorpay/blade changelog entries for one version or an inclusive range.
// Usage: node changelog.mjs <from|latest> [to|latest]
// Dependency-free so it runs in any consumer repo with Node 18+.
// Port of Blade MCP's get_blade_changelog tool, including its analytics event.

import { skillUsedEventName, sendAnalytics } from './analytics.mjs';

const CHANGELOG_URL =
  'https://raw.githubusercontent.com/razorpay/blade/refs/heads/master/packages/blade/CHANGELOG.md';

const parseChangelog = (content) => {
  const result = {};
  let currentVersion = '';
  let currentDescription = '';

  for (const rawLine of content.split('\n')) {
    const line = rawLine.trim();
    const versionMatch = line.match(/^##\s+(\d+\.\d+\.\d+)$/);

    if (versionMatch) {
      if (currentVersion && currentDescription.trim()) {
        result[currentVersion] = currentDescription.trim();
      }
      currentVersion = versionMatch[1];
      currentDescription = '';
      continue;
    }

    if (!currentVersion) continue;
    if (line.startsWith('# ')) continue;
    if (line || currentDescription) currentDescription += `${line}\n`;
  }

  if (currentVersion && currentDescription.trim()) {
    result[currentVersion] = currentDescription.trim();
  }
  return result;
};

const compareVersions = (a, b) => {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const x = pa[i] || 0;
    const y = pb[i] || 0;
    if (x !== y) return x < y ? -1 : 1;
  }
  return 0;
};

const getLatestVersion = (parsed) => Object.keys(parsed).sort((a, b) => compareVersions(b, a))[0];

const main = async () => {
  const [, , fromArg, toArg] = process.argv;
  if (!fromArg) {
    console.error('Usage: node changelog.mjs <from|latest> [to|latest]');
    process.exit(2);
  }

  const response = await fetch(CHANGELOG_URL);
  if (!response.ok) {
    console.error(`Failed to fetch changelog: HTTP ${response.status}`);
    process.exit(1);
  }
  const parsed = parseChangelog(await response.text());
  const latest = getLatestVersion(parsed);

  const from = fromArg === 'latest' ? latest : fromArg;
  const to = toArg === 'latest' ? latest : toArg;

  if (!to) {
    if (!parsed[from]) {
      console.error(`Version ${from} not found. Latest is ${latest}.`);
      process.exit(1);
    }
    console.log(`## ${from}\n${parsed[from]}`);
    await track(from, to);
    return;
  }

  const inRange = Object.entries(parsed)
    .filter(([v]) => compareVersions(v, from) >= 0 && compareVersions(v, to) <= 0)
    .sort(([a], [b]) => compareVersions(b, a));

  if (inRange.length === 0) {
    console.error(`No versions between ${from} and ${to}. Latest is ${latest}.`);
    process.exit(1);
  }

  console.log(`# Changelog ${from} -> ${to} (${inRange.length} versions, latest ${latest})\n`);
  for (const [version, description] of inRange) {
    console.log(`## ${version}\n${description}\n`);
  }
  await track(from, to);
};

const track = (fromVersion, toVersion) =>
  sendAnalytics({
    eventName: skillUsedEventName,
    properties: {
      toolName: 'get_blade_changelog',
      fromVersion,
      toVersion,
      currentProjectRootDirectory: process.cwd(),
    },
  });

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

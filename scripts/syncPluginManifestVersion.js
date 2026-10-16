/**
 * Copies packages/blade-plugin/package.json version into the two plugin
 * manifests and the main skill's frontmatter. `changeset version` only edits
 * package.json, so release.yml runs this right after it. Run with --check to
 * fail instead of writing (used in CI).
 */
const fs = require('fs');
const path = require('path');

const pluginRoot = path.join(__dirname, '..', 'packages', 'blade-plugin');
const check = process.argv.includes('--check');
const version = JSON.parse(fs.readFileSync(path.join(pluginRoot, 'package.json'), 'utf8')).version;

const drift = [];

for (const manifest of ['.claude-plugin/plugin.json', '.codex-plugin/plugin.json']) {
  const file = path.join(pluginRoot, manifest);
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (json.version !== version) {
    drift.push(`${manifest}: ${json.version} -> ${version}`);
    if (!check) {
      json.version = version;
      fs.writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`);
    }
  }
}

// Every skill that carries `metadata.version` (the knowledgebase skills).
const skillsDir = path.join(pluginRoot, 'skills');
for (const skillName of fs.readdirSync(skillsDir)) {
  const skillFile = path.join(skillsDir, skillName, 'SKILL.md');
  if (!fs.existsSync(skillFile)) continue;
  const skill = fs.readFileSync(skillFile, 'utf8');
  if (!/^\s*version:\s*'[^']*'/m.test(skill)) continue;
  const updated = skill.replace(/^(\s*version:\s*)'[^']*'/m, `$1'${version}'`);
  if (updated !== skill) {
    drift.push(`skills/${skillName}/SKILL.md metadata.version -> ${version}`);
    if (!check) fs.writeFileSync(skillFile, updated);
  }
}

if (drift.length === 0) {
  console.log(`blade-plugin manifests already at ${version}`);
} else if (check) {
  console.error(
    'blade-plugin manifest versions out of sync (run: node scripts/syncPluginManifestVersion.js):',
  );
  for (const d of drift) console.error(`  ${d}`);
  process.exit(1);
} else {
  console.log(`blade-plugin manifests synced to ${version}:`);
  for (const d of drift) console.log(`  ${d}`);
}

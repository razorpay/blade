// Structural checks for the blade plugin that run in CI without Claude Code:
// manifests parse and agree on name/version, every skill has valid frontmatter,
// the package.json version matches the manifests, and each knowledgebase
// skill (blade, blade-svelte) lists exactly the component docs on disk.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];

const readJSON = (rel) => JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8'));

const pkg = readJSON('package.json');
const claudeManifest = readJSON('.claude-plugin/plugin.json');
const codexManifest = readJSON('.codex-plugin/plugin.json');

if (claudeManifest.name !== 'blade') errors.push('.claude-plugin/plugin.json name must be "blade"');
if (JSON.stringify(claudeManifest) !== JSON.stringify(codexManifest)) {
  errors.push('.claude-plugin/plugin.json and .codex-plugin/plugin.json differ');
}
if (claudeManifest.version !== pkg.version) {
  errors.push(`plugin.json version ${claudeManifest.version} != package.json ${pkg.version}`);
}
if (claudeManifest.hooks && !fs.existsSync(path.join(root, claudeManifest.hooks))) {
  errors.push(`hooks file missing: ${claudeManifest.hooks}`);
}

const parseFrontmatter = (content) => {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const fields = {};
  for (const line of match[1].split('\n')) {
    const m = line.match(/^([a-zA-Z-]+):\s*(.*)$/);
    if (m) fields[m[1]] = m[2];
  }
  return fields;
};

const skillsDir = path.join(root, 'skills');
const skillNames = fs
  .readdirSync(skillsDir)
  .filter((d) => fs.statSync(path.join(skillsDir, d)).isDirectory());
for (const skill of skillNames) {
  const file = path.join(skillsDir, skill, 'SKILL.md');
  if (!fs.existsSync(file)) {
    errors.push(`skills/${skill}/SKILL.md missing`);
    continue;
  }
  const content = fs.readFileSync(file, 'utf8');
  const fm = parseFrontmatter(content);
  if (!fm) {
    errors.push(`skills/${skill}/SKILL.md has no frontmatter`);
    continue;
  }
  if (fm.name !== skill) errors.push(`skills/${skill}: frontmatter name "${fm.name}" != directory`);
  if (!fm.description) errors.push(`skills/${skill}: description missing`);
  else if (fm.description.length > 250) errors.push(`skills/${skill}: description over 250 chars`);
  else if (!/Use when/i.test(fm.description))
    errors.push(`skills/${skill}: description needs a "Use when" clause`);
  if (content.split('\n').length > 500) errors.push(`skills/${skill}/SKILL.md over 500 lines`);
}

// Knowledgebase skills: one per framework. Each is self-contained because
// `npx skills add` copies a single skill directory.
const KNOWLEDGEBASE_SKILLS = {
  blade: [
    'components/index.md',
    'patterns/index.md',
    'general/index.md',
    'styled-props-types.md',
    'common-utility-types.md',
  ],
  'blade-svelte': ['components/index.md', 'general/index.md', 'general/Usage.md'],
};

for (const [skill, requiredRefs] of Object.entries(KNOWLEDGEBASE_SKILLS)) {
  const skillFile = path.join(skillsDir, skill, 'SKILL.md');
  if (!fs.existsSync(skillFile)) {
    errors.push(`knowledgebase skill skills/${skill} missing`);
    continue;
  }
  const skillContent = fs.readFileSync(skillFile, 'utf8');
  const versionLine = skillContent.match(/version: '([^']+)'/);
  if (!versionLine || versionLine[1] !== pkg.version) {
    errors.push(`skills/${skill}/SKILL.md metadata.version must be '${pkg.version}'`);
  }

  const refs = path.join(skillsDir, skill, 'references');
  for (const required of requiredRefs) {
    if (!fs.existsSync(path.join(refs, required)))
      errors.push(`skills/${skill}/references/${required} missing`);
  }

  const componentsDir = path.join(refs, 'components');
  const listed = skillContent.match(/## Available components\n\n([^\n]+)/);
  if (!listed) {
    errors.push(`skills/${skill}/SKILL.md needs an "## Available components" list`);
    continue;
  }
  const listedNames = listed[1].split(',').map((s) => s.trim());
  const onDisk = fs.existsSync(componentsDir)
    ? fs
        .readdirSync(componentsDir)
        .filter((f) => f.endsWith('.md') && f !== 'index.md')
        .map((f) => f.replace(/\.md$/, ''))
    : [];
  const indexContent = fs.existsSync(path.join(componentsDir, 'index.md'))
    ? fs.readFileSync(path.join(componentsDir, 'index.md'), 'utf8')
    : '';
  for (const name of listedNames) {
    if (!onDisk.includes(name)) {
      errors.push(
        `skills/${skill}/SKILL.md lists ${name} but references/components/${name}.md is missing`,
      );
    }
  }
  for (const name of onDisk) {
    if (!listedNames.includes(name)) {
      errors.push(
        `skills/${skill}/references/components/${name}.md exists but SKILL.md does not list it`,
      );
    }
    if (!indexContent.includes(`**${name}**`)) {
      errors.push(`skills/${skill}/references/components/index.md has no line for ${name}`);
    }
  }
}

// Skills are installed one directory at a time, so each skill script keeps its
// own copy of the analytics helper. The copies must not drift.
const analyticsCopies = skillNames
  .map((skill) => path.join(skillsDir, skill, 'scripts', 'analytics.mjs'))
  .filter((file) => fs.existsSync(file));
for (const file of analyticsCopies.slice(1)) {
  if (fs.readFileSync(file, 'utf8') !== fs.readFileSync(analyticsCopies[0], 'utf8')) {
    errors.push(
      `${path.relative(root, file)} differs from ${path.relative(root, analyticsCopies[0])}`,
    );
  }
}

for (const entry of fs.readdirSync(root, { recursive: true, withFileTypes: true })) {
  if (entry.isSymbolicLink())
    errors.push(
      `symlink not allowed in plugin: ${path.join(entry.parentPath ?? entry.path, entry.name)}`,
    );
}

if (errors.length) {
  console.error('blade plugin validation failed:');
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`blade plugin ok: ${skillNames.length} skills, version ${pkg.version}`);

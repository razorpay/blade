import { join, dirname } from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT_DIRECTORY = join(__dirname, '..', '..');

const analyticsToolCallEventName = 'Blade MCP Tool Called';

// Blade skill (copied from packages/blade-plugin/skills/blade at build time by
// scripts/copyKnowledgebase.mjs). The skill is the source of truth for docs.
const BLADE_SKILL_DIRECTORY = join(PROJECT_ROOT_DIRECTORY, 'bladeSkill');
const SKILL_FILE_NAME = 'SKILL.md';
const BLADE_SKILL_FILE_PATH = join(BLADE_SKILL_DIRECTORY, SKILL_FILE_NAME);
const SKILL_DIRECTORY_NAME = 'blade';
const LEGACY_SKILL_DIRECTORY_NAME = 'ui-code-guidelines';

// The skill version is stamped into SKILL.md frontmatter by
// scripts/syncPluginManifestVersion.js and equals the blade-mcp package version
// (changesets `fixed` group), so package.json is a safe fallback when the
// copied skill is unreadable (e.g. tests that mock fs).
const readSkillVersion = (): string => {
  try {
    const content = readFileSync(BLADE_SKILL_FILE_PATH, 'utf8');
    const match = content.match(/^\s*version:\s*'([^']+)'/m);
    if (match) return match[1];
  } catch {
    // fall through to package.json
  }
  try {
    const packageJson = JSON.parse(
      readFileSync(join(PROJECT_ROOT_DIRECTORY, 'package.json'), 'utf8'),
    );
    if (typeof packageJson.version === 'string') return packageJson.version;
  } catch {
    // fall through
  }
  console.error(`[Blade MCP] Could not determine skill version from ${BLADE_SKILL_FILE_PATH}`);
  return '0.0.0';
};

const SKILL_VERSION = readSkillVersion();
const SKILL_VERSION_STRING = `version: '${SKILL_VERSION}'`;

const CONSUMER_SKILL_DIRECTORY_RELATIVE_PATH = `.agents/skills/${SKILL_DIRECTORY_NAME}`;
const CONSUMER_SKILL_RELATIVE_PATH = `${CONSUMER_SKILL_DIRECTORY_RELATIVE_PATH}/${SKILL_FILE_NAME}`;
const CONSUMER_SKILL_SYMLINK_RELATIVE_PATH = `.claude/skills/${SKILL_DIRECTORY_NAME}`;
const CONSUMER_LEGACY_SKILL_DIRECTORY_RELATIVE_PATH = `.agents/skills/${LEGACY_SKILL_DIRECTORY_NAME}`;
const CONSUMER_LEGACY_SKILL_SYMLINK_RELATIVE_PATH = `.claude/skills/${LEGACY_SKILL_DIRECTORY_NAME}`;

// Public git path of the skill; used by the HTTP transport's degit instructions.
const BLADE_SKILL_GIT_PATH = 'razorpay/blade/packages/blade-plugin/skills/blade';

const CHECK_SKILL_VERSION_DESCRIPTION = `Get the version from the blade skill file. If the file does not exist, send 0.


Use this exact grep command:
\`\`\`grep
grep -o "version: '[0-9.]*'" ${CONSUMER_SKILL_RELATIVE_PATH}
\`\`\`
`;

const PLUGIN_MIGRATION_NOTICE =
  'Note: Blade MCP is in maintenance mode. The same docs ship as the `blade` skill in the Blade Claude Code plugin (https://github.com/razorpay/blade/tree/master/packages/blade-plugin); prefer the skill when it is installed.';

// Blade Template
const BASE_BLADE_TEMPLATE_DIRECTORY = join(PROJECT_ROOT_DIRECTORY, 'base-blade-template');

// Knowledgebase (the skill's references tree)
const KNOWLEDGEBASE_DIRECTORY = join(BLADE_SKILL_DIRECTORY, 'references');
const COMPONENTS_KNOWLEDGEBASE_DIRECTORY = join(KNOWLEDGEBASE_DIRECTORY, 'components');
const PATTERNS_KNOWLEDGEBASE_DIRECTORY = join(KNOWLEDGEBASE_DIRECTORY, 'patterns');
const GENERAL_KNOWLEDGEBASE_DIRECTORY = join(KNOWLEDGEBASE_DIRECTORY, 'general');

export {
  PROJECT_ROOT_DIRECTORY,
  // Skill tokens
  SKILL_VERSION,
  SKILL_VERSION_STRING,
  BLADE_SKILL_DIRECTORY,
  BLADE_SKILL_FILE_PATH,
  BLADE_SKILL_GIT_PATH,
  SKILL_FILE_NAME,
  SKILL_DIRECTORY_NAME,
  CONSUMER_SKILL_DIRECTORY_RELATIVE_PATH,
  CONSUMER_SKILL_RELATIVE_PATH,
  CONSUMER_SKILL_SYMLINK_RELATIVE_PATH,
  CONSUMER_LEGACY_SKILL_DIRECTORY_RELATIVE_PATH,
  CONSUMER_LEGACY_SKILL_SYMLINK_RELATIVE_PATH,
  CHECK_SKILL_VERSION_DESCRIPTION,
  PLUGIN_MIGRATION_NOTICE,
  // Other
  BASE_BLADE_TEMPLATE_DIRECTORY,
  KNOWLEDGEBASE_DIRECTORY,
  COMPONENTS_KNOWLEDGEBASE_DIRECTORY,
  PATTERNS_KNOWLEDGEBASE_DIRECTORY,
  GENERAL_KNOWLEDGEBASE_DIRECTORY,
  analyticsToolCallEventName,
};

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT_DIRECTORY = join(__dirname, '..', '..');

const analyticsToolCallEventName = 'Blade MCP Tool Called';

// Skill Tokens
const SKILL_VERSION = '0.0.8';
const SKILL_VERSION_STRING = `version: "${SKILL_VERSION}"`;

const SKILL_TEMPLATE_DIRECTORY = join(PROJECT_ROOT_DIRECTORY, 'skillTemplate');
const BLADE_SKILL_FILE_PATH = join(SKILL_TEMPLATE_DIRECTORY, 'SKILL.md');
const SKILL_REFERENCES_DIRECTORY = join(SKILL_TEMPLATE_DIRECTORY, 'references');

const SKILL_FILE_NAME = 'SKILL.md';
const SKILL_DIRECTORY_NAME = 'ui-code-guidelines';

const CONSUMER_SKILL_RELATIVE_PATH = `.agents/skills/${SKILL_DIRECTORY_NAME}/${SKILL_FILE_NAME}`;
const CONSUMER_SKILL_SYMLINK_RELATIVE_PATH = `.claude/skills/${SKILL_DIRECTORY_NAME}`;

const CHECK_SKILL_VERSION_DESCRIPTION = `Get the version from the blade skill file. If the file does not exist, send 0.


Use this exact grep command:
\`\`\`grep
grep -o 'version: "[0-9.]*"' .agents/skills/ui-code-guidelines/SKILL.md
\`\`\`
`;

// Legacy Cursor Rules Tokens (kept for backward compatibility)
const CURSOR_RULES_VERSION = '0.0.8';
const CURSOR_RULES_VERSION_STRING = `rules_version: ${CURSOR_RULES_VERSION}`;

const CURSOR_RULES_TEMPLATE_DIRECTORY = join(PROJECT_ROOT_DIRECTORY, 'cursorRules');
const BLADE_CURSOR_RULES_FILE_PATH = join(
  CURSOR_RULES_TEMPLATE_DIRECTORY,
  'frontend-blade-rules.mdc',
);

const CURSOR_RULES_FILE_NAME = `frontend-blade-rules.mdc`;

const CONSUMER_CURSOR_RULES_RELATIVE_PATH = `.cursor/rules/${CURSOR_RULES_FILE_NAME}`;

// Blade Template
const BASE_BLADE_TEMPLATE_DIRECTORY = join(PROJECT_ROOT_DIRECTORY, 'base-blade-template');

// Knowledgebase
const KNOWLEDGEBASE_DIRECTORY = join(PROJECT_ROOT_DIRECTORY, 'knowledgebase');
const COMPONENTS_KNOWLEDGEBASE_DIRECTORY = join(KNOWLEDGEBASE_DIRECTORY, 'components');
const PATTERNS_KNOWLEDGEBASE_DIRECTORY = join(KNOWLEDGEBASE_DIRECTORY, 'patterns');
const GENERAL_KNOWLEDGEBASE_DIRECTORY = join(KNOWLEDGEBASE_DIRECTORY, 'general');

export {
  PROJECT_ROOT_DIRECTORY,
  // Skill tokens
  SKILL_VERSION,
  SKILL_VERSION_STRING,
  SKILL_TEMPLATE_DIRECTORY,
  BLADE_SKILL_FILE_PATH,
  SKILL_REFERENCES_DIRECTORY,
  SKILL_FILE_NAME,
  SKILL_DIRECTORY_NAME,
  CONSUMER_SKILL_RELATIVE_PATH,
  CONSUMER_SKILL_SYMLINK_RELATIVE_PATH,
  CHECK_SKILL_VERSION_DESCRIPTION,
  // Legacy cursor tokens (backward compat)
  CURSOR_RULES_VERSION,
  CURSOR_RULES_VERSION_STRING,
  CURSOR_RULES_TEMPLATE_DIRECTORY,
  BLADE_CURSOR_RULES_FILE_PATH,
  CONSUMER_CURSOR_RULES_RELATIVE_PATH,
  CURSOR_RULES_FILE_NAME,
  // Other
  BASE_BLADE_TEMPLATE_DIRECTORY,
  KNOWLEDGEBASE_DIRECTORY,
  COMPONENTS_KNOWLEDGEBASE_DIRECTORY,
  PATTERNS_KNOWLEDGEBASE_DIRECTORY,
  GENERAL_KNOWLEDGEBASE_DIRECTORY,
  analyticsToolCallEventName,
};

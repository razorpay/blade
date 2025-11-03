import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT_DIRECTORY = join(__dirname, '..', '..');

const analyticsToolCallEventName = 'Blade MCP Tool Called';

// Cursor Rules Tokens
const CURSOR_RULES_VERSION = '0.0.8';
const CURSOR_RULES_VERSION_STRING = `rules_version: ${CURSOR_RULES_VERSION}`;

const CURSOR_RULES_TEMPLATE_DIRECTORY = join(PROJECT_ROOT_DIRECTORY, 'cursorRules');
const BLADE_CURSOR_RULES_FILE_PATH = join(
  CURSOR_RULES_TEMPLATE_DIRECTORY,
  'frontend-blade-rules.mdc',
);

// Generate cursor rules file name with version
const getCursorRulesFileName = (): string => {
  return `frontend-blade-rules-v${CURSOR_RULES_VERSION}.mdc`;
};

const CONSUMER_CURSOR_RULES_RELATIVE_PATH = `.cursor/rules/${getCursorRulesFileName()}`;

// Blade Template
const BASE_BLADE_TEMPLATE_DIRECTORY = join(PROJECT_ROOT_DIRECTORY, 'base-blade-template');

// Knowledgebase
const KNOWLEDGEBASE_DIRECTORY = join(PROJECT_ROOT_DIRECTORY, 'knowledgebase');
const COMPONENTS_KNOWLEDGEBASE_DIRECTORY = join(KNOWLEDGEBASE_DIRECTORY, 'components');
const PATTERNS_KNOWLEDGEBASE_DIRECTORY = join(KNOWLEDGEBASE_DIRECTORY, 'patterns');
const GENERAL_KNOWLEDGEBASE_DIRECTORY = join(KNOWLEDGEBASE_DIRECTORY, 'general');

export {
  PROJECT_ROOT_DIRECTORY,
  CURSOR_RULES_VERSION,
  CURSOR_RULES_VERSION_STRING,
  CURSOR_RULES_TEMPLATE_DIRECTORY,
  BLADE_CURSOR_RULES_FILE_PATH,
  CONSUMER_CURSOR_RULES_RELATIVE_PATH,
  BASE_BLADE_TEMPLATE_DIRECTORY,
  KNOWLEDGEBASE_DIRECTORY,
  COMPONENTS_KNOWLEDGEBASE_DIRECTORY,
  PATTERNS_KNOWLEDGEBASE_DIRECTORY,
  GENERAL_KNOWLEDGEBASE_DIRECTORY,
  analyticsToolCallEventName,
  getCursorRulesFileName,
};

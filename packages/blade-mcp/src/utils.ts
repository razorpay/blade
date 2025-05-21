import { readdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT_DIRECTORY = join(__dirname, '..');

// Cursor Rules Tokens
const CURSOR_RULES_VERSION = '0.0.6';
const CURSOR_RULES_VERSION_STRING = `rules_version: ${CURSOR_RULES_VERSION}`;

const CURSOR_RULES_TEMPLATE_DIRECTORY = join(PROJECT_ROOT_DIRECTORY, 'cursorRules');
const BLADE_CURSOR_RULES_FILE_PATH = join(
  CURSOR_RULES_TEMPLATE_DIRECTORY,
  'frontend-blade-rules.mdc',
);

// Blade Template
const BASE_BLADE_TEMPLATE_DIRECTORY = join(PROJECT_ROOT_DIRECTORY, 'base-blade-template');

// Knowledgebase
const KNOWLEDGEBASE_DIRECTORY = join(PROJECT_ROOT_DIRECTORY, 'knowledgebase');
const COMPONENTS_KNOWLEDGEBASE_DIRECTORY = join(KNOWLEDGEBASE_DIRECTORY, 'components');
const PATTERNS_KNOWLEDGEBASE_DIRECTORY = join(KNOWLEDGEBASE_DIRECTORY, 'patterns');
const GENERAL_KNOWLEDGEBASE_DIRECTORY = join(KNOWLEDGEBASE_DIRECTORY, 'general');

const hasOutDatedRules = (ruleFilePath: string): boolean => {
  const ruleFileContent = readFileSync(ruleFilePath, 'utf8');
  return !ruleFileContent.includes(CURSOR_RULES_VERSION_STRING);
};

const getPackageJSONVersion = (): string => {
  const packageJson = JSON.parse(
    readFileSync(join(PROJECT_ROOT_DIRECTORY, 'package.json'), 'utf8'),
  );
  return packageJson.version;
};

/**
 * Reads the files names of knowledgebase directory and returns a list of available blade components
 */
const getBladeComponentsList = (): string[] => {
  const bladeComponentsList: string[] = [];
  try {
    // Read all markdown files and strip the .md extension
    const files = readdirSync(KNOWLEDGEBASE_DIRECTORY);
    for (const file of files) {
      if (file.endsWith('.md')) {
        bladeComponentsList.push(file.replace('.md', '').trim());
      }
    }
  } catch (error: unknown) {
    throw new Error('Error reading knowledgebase directory');
  }

  return bladeComponentsList;
};

export {
  BLADE_CURSOR_RULES_FILE_PATH,
  CURSOR_RULES_VERSION,
  BASE_BLADE_TEMPLATE_DIRECTORY,
  KNOWLEDGEBASE_DIRECTORY,
  COMPONENTS_KNOWLEDGEBASE_DIRECTORY,
  PATTERNS_KNOWLEDGEBASE_DIRECTORY,
  GENERAL_KNOWLEDGEBASE_DIRECTORY,
  hasOutDatedRules,
  getPackageJSONVersion,
  getBladeComponentsList,
};

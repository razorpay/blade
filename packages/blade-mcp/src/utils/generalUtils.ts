import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import * as Sentry from '@sentry/node';
import { SKILL_VERSION_STRING, KNOWLEDGEBASE_DIRECTORY, PROJECT_ROOT_DIRECTORY } from './tokens.js';

const hasOutdatedSkill = (skillFilePath: string): boolean => {
  const skillFileContent = readFileSync(skillFilePath, 'utf8');
  return !skillFileContent.includes(SKILL_VERSION_STRING);
};

const getPackageJSONVersion = (): string => {
  const packageJson = JSON.parse(
    readFileSync(join(PROJECT_ROOT_DIRECTORY, 'package.json'), 'utf8'),
  );
  return packageJson.version;
};

type DocumentationType = 'components' | 'patterns' | 'general';

/**
 * Reads the given documentation type directory and returns a list of available blade docs
 */
const getBladeDocsList = (documentationType: DocumentationType): string[] => {
  const bladeDocsList: string[] = [];
  try {
    // Read all markdown files and strip the .md extension
    const files = readdirSync(join(KNOWLEDGEBASE_DIRECTORY, documentationType));
    for (const file of files) {
      if (file.endsWith('.md') && !file.includes('index.md')) {
        bladeDocsList.push(file.replace('.md', '').trim());
      }
    }
  } catch (error: unknown) {
    Sentry.captureException(error);
    console.error('Error reading knowledgebase directory:', error);
    return [];
  }

  return bladeDocsList;
};

export { hasOutdatedSkill, getPackageJSONVersion, getBladeDocsList };
export type { DocumentationType };

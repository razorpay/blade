import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import * as Sentry from '@sentry/node';
import {
  SKILL_VERSION_STRING,
  KNOWLEDGEBASE_DIRECTORY,
  SVELTE_KNOWLEDGEBASE_DIRECTORY,
  PROJECT_ROOT_DIRECTORY,
} from './tokens.js';
import type { BladeFramework } from '../types/framework.js';
import { DEFAULT_FRAMEWORK } from '../types/framework.js';

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

const getKnowledgebaseDirectory = (
  documentationType: DocumentationType,
  framework: BladeFramework = DEFAULT_FRAMEWORK,
): string => {
  if (framework === 'svelte') {
    return join(SVELTE_KNOWLEDGEBASE_DIRECTORY, documentationType);
  }

  return join(KNOWLEDGEBASE_DIRECTORY, documentationType);
};

/**
 * Reads the given documentation type directory and returns a list of available blade docs
 */
const getBladeDocsList = (
  documentationType: DocumentationType,
  framework: BladeFramework = DEFAULT_FRAMEWORK,
): string[] => {
  if (framework === 'svelte' && documentationType === 'patterns') {
    return [];
  }

  const bladeDocsList: string[] = [];
  try {
    const files = readdirSync(getKnowledgebaseDirectory(documentationType, framework));
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

export { hasOutdatedSkill, getPackageJSONVersion, getBladeDocsList, getKnowledgebaseDirectory };
export type { DocumentationType };

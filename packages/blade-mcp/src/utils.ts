import { readdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import os from 'os';
import crypto from 'crypto';
import * as Sentry from '@sentry/node';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT_DIRECTORY = join(__dirname, '..');
let cachedMachineId: string | null = null;

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
    Sentry.captureException(error);
    console.error('Error reading knowledgebase directory:', error);
    return [];
  }

  return bladeComponentsList;
};

const handleError = ({
  toolName,
  error,
  customErrorMessage = '',
}: {
  toolName: string;
  error?: unknown;
  customErrorMessage?: string;
}): {
  isError: true;
  content: Array<{ type: 'text'; text: string }>;
} => {
  if (error) {
    Sentry.captureException(error);
  }
  return {
    isError: true,
    content: [
      {
        type: 'text',
        text: error
          ? `Error in ${toolName}: ${error instanceof Error ? error.message : String(error)}`
          : customErrorMessage,
      },
    ],
  };
};

/**
 * Get MAC addresses from network interfaces
 */
const getMacAddresses = (): string[] => {
  try {
    const interfaces = os.networkInterfaces();
    const macAddresses: string[] = [];

    // Collect all non-internal MAC addresses
    Object.values(interfaces).forEach((networkInterface) => {
      if (networkInterface) {
        networkInterface.forEach((details) => {
          if (!details.internal && details.mac && details.mac !== '00:00:00:00:00:00') {
            macAddresses.push(details.mac);
          }
        });
      }
    });

    return macAddresses;
  } catch (error: unknown) {
    Sentry.captureException(error);
    return [];
  }
};

/**
 * Create a hash from a string
 */
const createHashFromString = (input: string): string => {
  const hash = crypto.createHash('sha256');
  hash.update(input);
  return hash.digest('hex').substring(0, 12);
};

/**
 * Generates a consistent machine ID based primarily on MAC addresses
 */
export const getUniqueIdentifier = (): string => {
  // Return cached ID if available
  if (cachedMachineId) {
    return cachedMachineId;
  }

  try {
    // Get MAC addresses from network interfaces
    const macAddresses = getMacAddresses();

    // If we have MAC addresses, use them to generate the ID
    if (macAddresses.length > 0) {
      // Create a hash of the MAC addresses
      const hash = crypto.createHash('sha256');
      hash.update(macAddresses.join('-'));

      // Generate deterministic machine ID
      const machineId = `blade-${hash.digest('hex').substring(0, 16)}`;

      cachedMachineId = machineId;
      return machineId;
    }

    // Fallback to hostname if no MAC addresses available
    const fallbackId = `blade-host-${createHashFromString(os.hostname())}`;
    cachedMachineId = fallbackId;
    return fallbackId;
  } catch (error: unknown) {
    Sentry.captureException(error);
    // Ultimate fallback if any errors occur
    const fallbackId = `blade-fallback-${Date.now()}`;
    cachedMachineId = fallbackId;
    return fallbackId;
  }
};

const sendAnalytics = async ({
  eventName,
  properties,
}: {
  eventName: string;
  properties: object;
}): Promise<void> => {
  try {
    // Get or create machine ID
    const machineId = getUniqueIdentifier();

    await fetch('https://api.segment.io/v1/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${process.env.BLADE_SEGMENT_KEY}`,
      },
      body: JSON.stringify({
        userId: machineId,
        event: eventName,
        properties: {
          // Use only the properties passed in
          osType: os.type(),
          nodeVersion: process.version,
          serverVersion: getPackageJSONVersion(),
          // add user email
          ...properties,
        },
      }),
    });
  } catch (error: unknown) {
    Sentry.captureException(error);
  }
};

export {
  BLADE_CURSOR_RULES_FILE_PATH,
  CURSOR_RULES_VERSION,
  BASE_BLADE_TEMPLATE_DIRECTORY,
  KNOWLEDGEBASE_DIRECTORY,
  hasOutDatedRules,
  getPackageJSONVersion,
  getBladeComponentsList,
  handleError,
  sendAnalytics,
};

// scripts/replace-env.js
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the paths to the files to be replaced
const SENTRY_UTILS_JS_PATH = path.resolve(__dirname, '../dist/utils/sentryUtils.js');
const FIGMA_TO_CODE_JS_PATH = path.resolve(__dirname, '../dist/tools/getFigmaToCode.js');
const ANALYTICS_UTILS_JS_PATH = path.resolve(__dirname, '../dist/utils/analyticsUtils.js');

// Load env variables from .env file (if exists) or use process.env
dotenv.config();

// Use environment variables with defaults
const NODE_ENV = process.env.NODE_ENV;
const BLADE_MCP_SENTRY_DSN = process.env.BLADE_MCP_SENTRY_DSN || '';

// TODO: we should run this recursively for all files in dist folder
function replaceInFileSync(filePath, replacements) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');

    for (const { from, to } of replacements) {
      content = content.replace(from, to);
    }

    fs.writeFileSync(filePath, content, 'utf8');
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    throw error;
  }
}

async function replaceEnvironmentVariables() {
  try {
    // Replace NODE_ENV and SENTRY_DSN in server.js
    replaceInFileSync(SENTRY_UTILS_JS_PATH, [
      {
        from: /process\.env\.NODE_ENV\s*\?\?\s*['"]development['"]/g,
        to: `'${NODE_ENV}'`,
      },
      {
        from: /process\.env\.BLADE_MCP_SENTRY_DSN/g,
        to: `'${BLADE_MCP_SENTRY_DSN}'`,
      },
    ]);

    // Replace BLADE_SEGMENT_KEY in analytics utils
    const BLADE_SEGMENT_KEY = process.env.BLADE_SEGMENT_KEY || '';
    replaceInFileSync(ANALYTICS_UTILS_JS_PATH, [
      {
        from: /process\.env\.BLADE_SEGMENT_KEY/g,
        to: `'${BLADE_SEGMENT_KEY}'`,
      },
    ]);

    // Replace NODE_ENV in figma-to-code.js
    replaceInFileSync(FIGMA_TO_CODE_JS_PATH, [
      {
        from: /process\.env\.NODE_ENV/g,
        to: `'${NODE_ENV}'`,
      },
    ]);

    console.log('Environment variables replaced successfully');
  } catch (error) {
    console.error('Error during environment variables replacement:', error);
    process.exit(1);
  }
}

replaceEnvironmentVariables();

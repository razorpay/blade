// scripts/replace-env.js
import path from 'path';
import { fileURLToPath } from 'url';
import { replaceInFile } from 'replace-in-file';
import * as dotenv from 'dotenv';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path to the server.js file
const SERVER_JS_PATH = path.resolve(__dirname, '../dist/server.js');

// Load env variables from .env file (if exists) or use process.env
dotenv.config();

// Use environment variables with defaults
const NODE_ENV = process.env.NODE_ENV;
const BLADE_MCP_SENTRY_DSN = process.env.BLADE_MCP_SENTRY_DSN || '';

async function replaceEnvironmentVariables() {
  try {
    // Replace NODE_ENV
    await replaceInFile({
      files: SERVER_JS_PATH,
      from: /process\.env\.NODE_ENV\s*\|\|\s*['"]development['"]/g,
      to: `'${NODE_ENV}'`,
    });

    // Replace SENTRY_DSN
    await replaceInFile({
      files: SERVER_JS_PATH,
      from: /process\.env\.BLADE_MCP_SENTRY_DSN/g,
      to: `'${BLADE_MCP_SENTRY_DSN}'`,
    });
  } catch (error) {
    console.error('Error during environment variables replacement:', error);
    process.exit(1);
  }
}

replaceEnvironmentVariables();

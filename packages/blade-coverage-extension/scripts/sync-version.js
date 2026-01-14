/**
 * Syncs the version from package.json to manifest.json
 * This script is run after changesets bumps the version in package.json
 */
const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '..', 'package.json');
const manifestJsonPath = path.join(__dirname, '..', 'manifest.json');

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const manifestJson = JSON.parse(fs.readFileSync(manifestJsonPath, 'utf8'));

// Chrome extension versions don't support pre-release tags
// Convert semver (e.g., "1.3.0") to Chrome format (e.g., "1.3.0" or "1.3")
const version = packageJson.version.split('-')[0]; // Remove any pre-release suffix

manifestJson.version = version;

fs.writeFileSync(manifestJsonPath, JSON.stringify(manifestJson, null, 2) + '\n');

console.log(`✅ Synced version ${version} to manifest.json`);

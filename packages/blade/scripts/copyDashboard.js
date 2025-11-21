const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dashboardPlaygroundDir = path.join(__dirname, '../blade-dashboard-playground');
const dashboardDistDir = path.join(dashboardPlaygroundDir, 'dist');
const storybookSiteDir = path.join(__dirname, '../storybook-site');
const dashboardDir = path.join(storybookSiteDir, 'dashboard');

// Helper function to recursively copy directory
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Check if dashboard dist is already built (e.g., by CI)
// If dist exists, skip build and just copy
const shouldSkipBuild = fs.existsSync(dashboardDistDir);
if (shouldSkipBuild) {
  try {
    const files = fs.readdirSync(dashboardDistDir);
    if (files.length > 0) {
      console.log('✓ Dashboard dist already exists, skipping build and copying directly...');
      // Remove existing dashboard directory if it exists
      if (fs.existsSync(dashboardDir)) {
        fs.rmSync(dashboardDir, { recursive: true, force: true });
      }
      // Create dashboard directory
      fs.mkdirSync(dashboardDir, { recursive: true });
      // Copy all files from dist to dashboard directory
      copyRecursiveSync(dashboardDistDir, dashboardDir);
      console.log('✓ Dashboard build output copied to storybook-site/dashboard/');
      process.exit(0);
    }
  } catch (error) {
    // If we can't read the directory, proceed with build
    console.log('Could not read dashboard dist directory, proceeding with build...');
  }
}

// Install dependencies first
console.log('Installing dependencies...');
try {
  execSync('yarn install', {
    cwd: dashboardPlaygroundDir,
    stdio: 'inherit',
    env: process.env,
    shell: true,
  });
  console.log('✓ Dependencies installed successfully');
} catch (error) {
  console.error('✗ Failed to install dependencies:', error.message);
  process.exit(1);
}

// Build the dashboard playground
console.log('Building blade-dashboard-playground...');
try {
  execSync('yarn run build', {
    cwd: dashboardPlaygroundDir,
    stdio: 'inherit',
  });
  console.log('✓ Dashboard playground built successfully');
} catch (error) {
  console.error('✗ Failed to build dashboard playground:', error.message);
  process.exit(1);
}

// Remove existing dashboard directory if it exists
if (fs.existsSync(dashboardDir)) {
  fs.rmSync(dashboardDir, { recursive: true, force: true });
}

// Create dashboard directory
fs.mkdirSync(dashboardDir, { recursive: true });

// Copy all files from dist to dashboard directory
if (fs.existsSync(dashboardDistDir)) {
  copyRecursiveSync(dashboardDistDir, dashboardDir);
  console.log('✓ Dashboard build output copied to storybook-site/dashboard/');
} else {
  console.error('✗ Dashboard dist directory not found at', dashboardDistDir);
  process.exit(1);
}

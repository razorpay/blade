const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const svelteStorybookDir = path.join(__dirname, '../../blade-svelte');
const svelteDistDir = path.join(svelteStorybookDir, 'storybook-static');
// Allow output directory to be passed as argument or use default
const outputDir = process.argv[2] || path.join(__dirname, '../storybook-site');
const storybookSiteDir = path.resolve(outputDir);
const svelteDir = path.join(storybookSiteDir, 'svelte');

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

// Check if svelte storybook is already built (e.g., by CI)
// If storybook-static exists, skip build and just copy
const shouldSkipBuild = fs.existsSync(svelteDistDir);
if (shouldSkipBuild) {
  try {
    const files = fs.readdirSync(svelteDistDir);
    if (files.length > 0) {
      console.log('✓ Svelte Storybook already exists, skipping build and copying directly...');
      // Remove existing svelte directory if it exists
      if (fs.existsSync(svelteDir)) {
        fs.rmSync(svelteDir, { recursive: true, force: true });
      }
      // Create svelte directory
      fs.mkdirSync(svelteDir, { recursive: true });
      // Copy all files from storybook-static to svelte directory
      copyRecursiveSync(svelteDistDir, svelteDir);
      console.log('✓ Svelte Storybook copied to storybook-site/svelte/');
      process.exit(0);
    }
  } catch (error) {
    // If we can't read the directory, proceed with build
    console.log('Could not read Svelte Storybook directory, proceeding with build...');
  }
}

// Build the Svelte Storybook
console.log('Building Svelte Storybook...');
try {
  execSync('yarn run build-storybook', {
    cwd: svelteStorybookDir,
    stdio: 'inherit',
  });
  console.log('✓ Svelte Storybook built successfully');
} catch (error) {
  console.error('✗ Failed to build Svelte Storybook:', error.message);
  process.exit(1);
}

// Remove existing svelte directory if it exists
if (fs.existsSync(svelteDir)) {
  fs.rmSync(svelteDir, { recursive: true, force: true });
}

// Create svelte directory
fs.mkdirSync(svelteDir, { recursive: true });

// Copy all files from storybook-static to svelte directory
if (fs.existsSync(svelteDistDir)) {
  copyRecursiveSync(svelteDistDir, svelteDir);
  console.log('✓ Svelte Storybook copied to storybook-site/svelte/');
} else {
  console.error('✗ Svelte Storybook directory not found at', svelteDistDir);
  process.exit(1);
}

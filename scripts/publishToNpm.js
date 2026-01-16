/**
 * Context about this approach:
 *
 * Q. Why not use `npm publish --registry https://registry.npmjs.org` instead of creating .npmrc?
 *
 * -> It doesn't support any clean way of providing access token and only works for already logged in users
 *
 * Q. Why not change actual `.npmrc`, drop github package registry and move to NPM only?
 *
 * -> `.npmrc` doesn't support multiple registries on one scope.
 *  So for our internal users who have `@razorpay` scope pointing to github package registry, we have to keep
 *  publishing on github package registry. We can do this when we move all `@razorpay` scope packages (like universe) to NPM.
 *
 * Checkout description of this PR for more context -> https://github.com/razorpay/blade/pull/757
 *
 */

const fs = require('fs');
const path = require('path');
const execa = require('execa');

const publishedPackages = JSON.parse(process.env.PUBLISHED_PACKAGES || '[]');
const MONOREPO_ROOT = path.join(__dirname, '..');
const NPMRC_PATH = path.join(MONOREPO_ROOT, '.npmrc');

// Packages that should only be published to GitHub registry (not public npm)
const GITHUB_REGISTRY_ONLY_PACKAGES = ['@razorpay/blade-core', '@razorpay/blade-svelte'];

const npmRcContent = `@razorpay:registry=https://registry.npmjs.org/
//registry.npmjs.org/:always-auth=true
//registry.npmjs.org/:_authToken=\${NPM_TOKEN}
`;

fs.writeFileSync(NPMRC_PATH, npmRcContent);

// Helper function to get package path from package name
function getPackagePath(packageName) {
  // Remove the scope part and get just the package name
  const packageNameWithoutScope = packageName.replace('@razorpay/', '');
  // Assume the package is in the packages directory with the same name
  return `packages/${packageNameWithoutScope}`;
}

try {
  // Now you can use the array of objects
  for (const pkg of publishedPackages) {
    // Skip packages that should only be published to GitHub registry
    if (GITHUB_REGISTRY_ONLY_PACKAGES.includes(pkg.name)) {
      console.log(
        `[blade]: Skipping ${pkg.name}@${pkg.version} - published to GitHub registry only 🔒`,
      );
      continue;
    }

    const packagePath = getPackagePath(pkg.name);
    console.log(`[blade]: Publishing ${pkg.name}@${pkg.version} on NPM ✨`);

    execa.commandSync('npm publish', {
      cwd: path.join(MONOREPO_ROOT, packagePath),
      stdio: 'inherit',
    });
  }
} finally {
  // Clean up the .npmrc file
  fs.rmSync(NPMRC_PATH, { force: true });
}

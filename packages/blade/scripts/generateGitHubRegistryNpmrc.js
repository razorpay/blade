/**
 * Context about this script:
 *
 * we want to publish to our internal GitHub regitry as well as public npm registry and since we can only have 1 npmrc
 * at a time and we only need it while publishing to registries so we'll generate it with this script for publishing to
 * our internal GitHub registry and to publish to public registry we do it from `./publishToNpm.js`
 *
 */

const fs = require('fs');
const path = require('path');

const MONOREPO_ROOT = path.join(__dirname, '../../..');
const NPMRC_PATH = path.join(MONOREPO_ROOT, '.npmrc');

const npmRcContent = `@razorpay:registry=https://npm.pkg.github.com/
//registry.npmjs.org/:always-auth=true
//registry.npmjs.org/:_authToken=\${GITHUB_ACCESS_TOKEN}
`;

fs.writeFileSync(NPMRC_PATH, npmRcContent);
console.log('[blade]: generated .npmrc for publishing to GitHub registry ✅');

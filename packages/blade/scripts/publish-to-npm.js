const fs = require('fs');
const path = require('path');
const execa = require('execa');

const BLADE_ROOT = path.join(__dirname, '..');
const NPMRC_PATH = path.join(BLADE_ROOT, '.npmrc');

const npmRcContent = `@razorpay:registry=https://registry.npmjs.org/
//registry.npmjs.org/:always-auth=true
//registry.npmjs.org/:_authToken=\${NPM_TOKEN}
`;

fs.writeFileSync(NPMRC_PATH, npmRcContent);

// @TODO: remove --tag next
try {
  execa.commandSync('npm publish --tag next', {
    cwd: BLADE_ROOT,
    env: { NPM_TOKEN: process.env.NPM_TOKEN },
  });
} finally {
  fs.rmSync(NPMRC_PATH);
}

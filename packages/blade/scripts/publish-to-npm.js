const fs = require('fs');
const path = require('path');
const execa = require('execa');

const BLADE_ROOT = path.join(__dirname, '..');
const NPMRC_PATH = path.join(BLADE_ROOT, '.npmrc');

const npmRcContent = `@razorpay:registry=https://registry.npmjs.org/
//registry.npmjs.org/:always-auth=true
//registry.npmjs.org/:_authToken=\${NPM_TOKEN}
`;

console.log('[blade]: Publishing on NPM ✨');

fs.writeFileSync(NPMRC_PATH, npmRcContent);

try {
  execa.commandSync('npm publish', {
    cwd: BLADE_ROOT,
    stdio: 'inherit',
  });
} finally {
  fs.rmSync(NPMRC_PATH);
}

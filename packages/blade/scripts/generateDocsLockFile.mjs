import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read dependencies JSON file
const dependenciesPath = path.resolve(__dirname, '../src/utils/storybook/Sandbox/dependencies.ac');
const dependenciesData = JSON.parse(fs.readFileSync(dependenciesPath, 'utf8'));

const resolve = (resolvePath) => path.resolve(__dirname, resolvePath);

const generateLockFileContent = ({ dependencies, devDependencies }) => {
  const packageJSON = {
    dependencies,
    devDependencies,
  };

  // Read tokens from environment variables
  const npmToken = process.env.NPM_TOKEN;
  fs.mkdirSync(resolve('lock-generation'), { recursive: true });
  try {
    console.log('[lockfile-generation]: Creating package.json');
    fs.writeFileSync(resolve('lock-generation/package.json'), JSON.stringify(packageJSON, null, 2));

    // Build .npmrc content with tokens
    let npmrcContent = 'auto-install-peers = false\n';
    if (npmToken) {
      npmrcContent += `//registry.npmjs.org/:_authToken=${npmToken}\n`;
    }
    fs.writeFileSync(resolve('lock-generation/.npmrc'), npmrcContent);

    // Prepare environment variables for yarn install
    const env = {
      ...process.env,
    };

    console.log('[lockfile-generation]: Installing Dependencies');
    execSync('yarn', { cwd: resolve('lock-generation'), stdio: 'inherit', env });

    console.log('[lockfile-generation]: Moving lock file to /public/docs-yarn-lock.yaml');
    fs.renameSync(resolve('lock-generation/yarn.lock'), resolve('../public/docs-yarn-lock.yaml'));
  } catch (err) {
    console.error(err);
  } finally {
    console.log('[lockfile-generation]: Cleaning up temporary directory');
    fs.rmSync(resolve('lock-generation'), { recursive: true });
  }
};

generateLockFileContent({
  dependencies: dependenciesData.dependencies,
  devDependencies: dependenciesData.devDependencies,
});

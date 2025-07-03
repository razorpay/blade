import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read dependencies JSON file
const dependenciesPath = path.resolve(
  __dirname,
  '../src/utils/storybook/Sandbox/dependencies.json',
);
const dependenciesData = JSON.parse(fs.readFileSync(dependenciesPath, 'utf8'));

const resolve = (resolvePath) => path.resolve(__dirname, resolvePath);

const generateLockFileContent = ({ dependencies, devDependencies }) => {
  const packageJSON = {
    dependencies,
    devDependencies,
  };

  fs.mkdirSync(resolve('lock-generation'));
  try {
    console.log('[lockfile-generation]: Creating package.json');
    fs.writeFileSync(resolve('lock-generation/package.json'), JSON.stringify(packageJSON, null, 2));
    fs.writeFileSync(resolve('lock-generation/.npmrc'), 'auto-install-peers = false');

    console.log('[lockfile-generation]: Installing Dependencies');
    execSync('yarn', { cwd: resolve('lock-generation'), stdio: 'inherit' });

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

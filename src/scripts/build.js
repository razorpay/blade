/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const babel = require('rollup-plugin-babel');
const commonjs = require('@rollup/plugin-commonjs');
const external = require('rollup-plugin-peer-deps-external');
const nodeResolve = require('@rollup/plugin-node-resolve');
const json = require('@rollup/plugin-json');
const rollup = require('rollup');
const chalk = require('chalk');
const sh = require('shelljs');

const components = fs
  .readdirSync('src')
  .filter((srcSubDir) => ['atoms', 'molecules', 'tokens'].includes(srcSubDir))
  .reduce(
    (acc, dir) => [
      ...acc,
      ...fs.readdirSync(`src/${dir}`).map((filePath) => path.join(`src/${dir}`, filePath)),
    ],
    [],
  );

components.forEach(async (component) => {
  const componentName = component.includes('tokens') ? 'theme' : component.split('/').pop();
  const inputFileName = component.includes('tokens')
    ? 'src/tokens/index.js'
    : `${component}/index.js`;

  try {
    //generate web bundle
    const webBundle = await rollup.rollup({
      input: inputFileName,
      plugins: [
        external(),
        babel({
          exclude: 'node_modules/**',
          runtimeHelpers: true,
          externalHelpers: true,
          envName: 'web-production',
        }),
        json(),
        commonjs(),
        nodeResolve({ extensions: ['.mjs', '.web.js', '.js', '.json', '.node'] }),
      ],
    });
    await webBundle.write({ file: `${componentName}/${componentName}.web.js`, format: 'esm' });
  } catch (error) {
    console.log(chalk.red(error));
  }

  // transpile react-native
  sh.exec(
    `BABEL_ENV=production npx babel ${component} --out-dir ${componentName} --ignore "**/*.test.js","**/*.stories.js","**/*.web.js","**/*.desktop.js","**/*.mobile.js","**/index.js"`,
  );

  //generate top level exports
  const componentIndexFile = path.resolve(componentName, `index.js`);
  const componentIndexFileContent = `export { default } from './${componentName}';\nexport * from './${componentName}';\n`;
  fs.writeFile(componentIndexFile, componentIndexFileContent, (writeFileErr) => {
    if (writeFileErr) throw writeFileErr;
    console.log(chalk.green(`✅ generated exports for ${componentName}`));
  });

  //rename ${componentName}.d.ts file to index.d.ts
  const componentDistFile = path.resolve(component, `${componentName}.native.d.ts`);
  fs.rename(componentDistFile, path.resolve(componentName, `index.d.ts`), (renameFileErr) => {
    if (renameFileErr) throw renameFileErr;
    console.log(chalk.green(`✅ generated types for ${componentName}`));
  });
});

//generate package.json
const packageJsonPath = path.resolve(process.env.PWD, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
const newPackageJson = {
  ...packageJson,
  files: components.map((component) =>
    component.includes('tokens') ? 'theme/**/*' : `${component.split('/').pop()}/**/*`,
  ),
};
fs.writeFileSync(packageJsonPath, JSON.stringify(newPackageJson, null, 2));
console.log(chalk.green('✅ publish files created in package.json'));

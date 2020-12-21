/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const figures = require('figures');

const srcPath = path.resolve(__dirname, '../src');
const componentDirectories = ['atoms', 'molecules', 'icons'];
// read all the component directories
const components = fs
  .readdirSync(srcPath)
  .filter((files) => componentDirectories.includes(files))
  .map((componentDirectory) =>
    fs
      .readdirSync(path.resolve(srcPath, componentDirectory))
      .map((componentName) => path.resolve(srcPath, componentDirectory, componentName)),
  )
  .flat()
  .filter((file) => !file.includes('index.ts'));

components.forEach((component) => {
  const ignoreFiles = ['__tests__', 'index.ts'];
  fs.readdirSync(component)
    .filter((componentFile) => !ignoreFiles.includes(componentFile))
    .forEach((componentFile) => {
      if (!componentFile.includes('stories')) {
        const componentName = componentFile.split('.')[0];
        const declarationFile = path.resolve(component, `${componentName}.d.ts`);
        const declarationFileContent = `export { default } from './${componentName}.native';\nexport * from './${componentName}.native';\n`;
        fs.writeFileSync(declarationFile, declarationFileContent);
        console.log(
          chalk.green(`${figures.main.tick} generated declaration file for: ${componentName}`),
        );
      }
    });
});

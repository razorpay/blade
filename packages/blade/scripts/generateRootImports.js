const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const figures = require('figures');

const exportCategories = ['components', 'tokens', 'utils'];
const buildDirectory = 'build';

try {
  exportCategories.forEach((exportCategory) => {
    // generate root export for js
    const exportCategoryContent = `export * from './${buildDirectory}/${exportCategory}';\n`;
    const exportCategoryFile = path.resolve(__dirname, `../${exportCategory}.js`);
    fs.writeFileSync(exportCategoryFile, exportCategoryContent);

    // generate root export for typings
    const typingsContent = `export * from './${buildDirectory}/${exportCategory}';\n`;
    const typingsFile = path.resolve(__dirname, `../${exportCategory}.d.ts`);
    fs.writeFileSync(typingsFile, typingsContent);
  });
  console.log(
    '\n',
    chalk.green(`${figures.main.tick} Generated root imports for ${exportCategories.join(', ')}`),
    '\n',
  );
} catch (error) {
  console.log(
    '\n',
    chalk.red(`${figures.cross} error while generating root imports`),
    '\n',
    chalk.red(error),
    '\n',
  );
}

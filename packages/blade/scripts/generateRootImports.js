const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const figures = require('figures');

const exportCategories = ['components', 'tokens', 'utils'];
const buildDirectory = 'build';

try {
  exportCategories.forEach((exportCategory) => {
    // generate root export for js
    const content = `export * from './${buildDirectory}/${exportCategory}';\n`;
    const componentTypeFile = path.resolve(__dirname, `../${exportCategory}.ts`);
    fs.writeFileSync(componentTypeFile, content);
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

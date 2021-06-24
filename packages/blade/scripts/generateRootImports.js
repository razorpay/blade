const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const figures = require('figures');
const componentTypes = ['components', 'tokens', 'utils'];
const buildDirectory = 'build';

try {
  componentTypes.forEach((componentType) => {
    const content = `export * from './${buildDirectory}/${componentType}';\n`;
    const componentTypeFile = path.resolve(__dirname, `../${componentType}.js`);
    fs.writeFileSync(componentTypeFile, content);
  });
  console.log(
    '\n',
    chalk.green(`${figures.main.tick} Generated root imports for ${componentTypes.join(', ')}`),
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

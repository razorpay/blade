import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import figures from 'figures';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const exportCategories = ['components', 'tokens', 'utils'];
const buildDirectory = 'build';

try {
  exportCategories.forEach((exportCategory) => {
    // generate root export for web
    const exportCategoryContentWeb = `export * from './${buildDirectory}/lib/web/production/${exportCategory}';\n`;
    const exportCategoryFileWeb = path.resolve(__dirname, `../${exportCategory}.js`);
    fs.writeFileSync(exportCategoryFileWeb, exportCategoryContentWeb);

    // generate root export for native
    const exportCategoryContentNative = `export * from './${buildDirectory}/lib/native/${exportCategory}';\n`;
    const exportCategoryFileNative = path.resolve(__dirname, `../${exportCategory}.native.js`);
    fs.writeFileSync(exportCategoryFileNative, exportCategoryContentNative);

    // generate root export for typings
    const typingsContent = `export * from './${buildDirectory}/types/${exportCategory}';\n`;
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

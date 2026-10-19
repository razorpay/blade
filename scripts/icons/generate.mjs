/* eslint-disable import/no-extraneous-dependencies */
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import nodePlop from 'node-plop';

// Usage (from repo root): yarn generate-icons
const here = (relative) => fileURLToPath(new URL(relative, import.meta.url));

const generateIcons = async () => {
  const plop = await nodePlop(here('./plopfile.js'));
  const iconGenerator = plop.getGenerator('generate-icons');
  const indexGenerator = plop.getGenerator('generate-reexports');
  const iconsJsonFile = JSON.parse(fs.readFileSync(here('./icons.json'), 'utf-8'));

  // Sequential on purpose: plop actions for different icons write to the same
  // directories, and running them concurrently produced partial files.
  for (const icon of iconsJsonFile) {
    const name = Object.keys(icon)[0];
    const svg = icon[name];
    // eslint-disable-next-line no-await-in-loop
    const results = await iconGenerator.runActions({ iconName: name, svgContents: svg });
    if (results.failures.length > 0) {
      console.error(results.failures);
      process.exitCode = 1;
    } else {
      console.log(`generated ${name}`);
    }
  }

  const results = await indexGenerator.runActions({});
  if (results.failures.length > 0) {
    console.error(results.failures);
    process.exitCode = 1;
  } else {
    console.log('generated re-exports');
  }
};

generateIcons();

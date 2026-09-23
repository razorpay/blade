/* eslint-disable import/no-extraneous-dependencies */
import fs from 'node:fs';
import nodePlop from 'node-plop';

// Usage: node scripts/generateIcons.mjs [--target react|svelte|all]
const parseTarget = () => {
  const flagIndex = process.argv.indexOf('--target');
  const target = flagIndex === -1 ? 'all' : process.argv[flagIndex + 1];
  if (!['react', 'svelte', 'all'].includes(target)) {
    throw new Error(`Invalid --target "${target}". Expected react, svelte or all.`);
  }
  return target;
};

const generateIcons = async () => {
  const target = parseTarget();
  const plop = await nodePlop('./plopfile.js');
  const iconGenerator = plop.getGenerator('generate-icons');
  const indexGenerator = plop.getGenerator('generate-reexports');
  const iconsJsonFile = JSON.parse(fs.readFileSync('./scripts/icons.json', 'utf-8'));

  // Sequential on purpose: plop actions for different icons write to the same
  // directories, and running them concurrently produced partial files.
  for (const icon of iconsJsonFile) {
    const name = Object.keys(icon)[0];
    const svg = icon[name];
    // eslint-disable-next-line no-await-in-loop
    const results = await iconGenerator.runActions({ iconName: name, svgContents: svg, target });
    if (results.failures.length > 0) {
      console.error(results.failures);
      process.exitCode = 1;
    } else {
      console.log(`generated ${name} (${target})`);
    }
  }

  const results = await indexGenerator.runActions({ target });
  if (results.failures.length > 0) {
    console.error(results.failures);
    process.exitCode = 1;
  } else {
    console.log('generated re-exports');
  }
};

generateIcons();

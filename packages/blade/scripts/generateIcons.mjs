/* eslint-disable import/no-extraneous-dependencies */
import fs from 'node:fs';
import nodePlop from 'node-plop';

const generateIcons = async () => {
  const plop = await nodePlop('./plopfile.js');
  const iconGenerator = plop.getGenerator('generate-icons');
  const indexGenerator = plop.getGenerator('generate-reexports');
  const iconsJsonFile = JSON.parse(fs.readFileSync('./scripts/icons.json', 'utf-8'));

  const processedIcons = iconsJsonFile.map((icon) => {
    const name = Object.keys(icon)[0];
    const svg = icon[name];
    return iconGenerator.runActions({ iconName: name, svgContents: svg }).then((results) => {
      console.log(results);
    });
  });

  Promise.all(processedIcons);
  // wait 1 second
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // generate re-exports
  await indexGenerator.runActions({}).then((results) => {
    console.log(results);
  });
};

generateIcons();

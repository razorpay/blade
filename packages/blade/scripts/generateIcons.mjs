/* eslint-disable import/no-extraneous-dependencies */
import fs from 'node:fs';
import nodePlop from 'node-plop';

const generateIcons = async () => {
  const plop = await nodePlop('./plopfile.js');
  const iconGenerator = plop.getGenerator('icon');

  const iconsJsonFile = JSON.parse(fs.readFileSync('./scripts/icons.json', 'utf-8'));

  iconsJsonFile.forEach((icon) => {
    const name = Object.keys(icon)[0];
    const svg = icon[name];
    iconGenerator.runActions({ iconName: name, svgContents: svg }).then((results) => {
      console.log(results);
    });
  });
};

generateIcons();

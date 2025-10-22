const fs = require('fs');
const path = require('path');
const execa = require('execa');
const randomNameGenerator = require('moniker');

const GITHUB_BOT_EMAIL = 'tools+cibot@razorpay.com';
const GITHUB_BOT_USERNAME = 'rzpcibot';

const uploadColorTokens = async () => {
  try {
    // 1. read the tokens object
    const colorTokens = JSON.parse(process.argv[2]);

    if (
      Object.keys(colorTokens?.themeColorTokens?.onLight).length &&
      Object.keys(colorTokens?.themeColorTokens?.onDark).length
    ) {
      const themeColorTokensRegex = /const colors: ColorsWithModes = {(.|\n)+?};/gm;
      // 2. read the bladeTheme File
      const bladeThemePath = path.resolve(__dirname, '../src/tokens/theme/bladeTheme.ts');
      const bladeTheme = fs.readFileSync(bladeThemePath, 'utf8');

      // 3. write the new tokens to bladeTheme file
      const updatedbladeThemeColors = JSON.stringify(colorTokens.themeColorTokens, null, 2)
        .replace(/"([a-zA-Z_$][a-zA-Z0-9_$]*)":/g, '$1:') // Remove quotes only from valid JS identifiers
        .replace(/: "([^"]+)"/g, ': $1'); // Remove quotes from values
      const updatedbladeTheme = bladeTheme.replace(
        themeColorTokensRegex,
        `const colors: ColorsWithModes = ${updatedbladeThemeColors};`,
      );
      fs.writeFileSync(bladeThemePath, updatedbladeTheme);
      // prettify the file
      execa.commandSync('yarn prettier --write src/tokens/theme/bladeTheme.ts');
    }

    if (Object.keys(colorTokens?.globalColorTokens).length) {
      const globalColorTokensRegex = /export const colors: Color = {(.|\n)+?};/gm;
      // 2. read the bladeTheme File
      const globalColorTokensPath = path.resolve(__dirname, '../src/tokens/global/colors.ts');
      const globalColorTokensFile = fs.readFileSync(globalColorTokensPath, 'utf8');

      // 3. write the new tokens to bladeTheme file
      const updatedGlobalColorTokens = JSON.stringify(colorTokens.globalColorTokens, null, 2)
        .replace(/"([a-zA-Z_$][a-zA-Z0-9_$]*)":/g, '$1:') // Remove quotes only from valid JS identifiers
        .replace(/: "([^"]+)"/g, ': $1'); // Remove quotes from values
      const updatedGlobalColorTokensFile = globalColorTokensFile.replace(
        globalColorTokensRegex,
        `export const colors: Color = ${updatedGlobalColorTokens};`,
      );
      fs.writeFileSync(globalColorTokensPath, updatedGlobalColorTokensFile);
      // prettify the file
      execa.commandSync('yarn prettier --write src/tokens/global/colors.ts');
    }

    // 6. create branch
    const branchName = randomNameGenerator
      .generator([randomNameGenerator.verb, randomNameGenerator.noun])
      .choose();
    execa.commandSync(`git checkout -b ${branchName}`);
    execa.commandSync(`git config user.email ${GITHUB_BOT_EMAIL}`);
    execa.commandSync(`git config user.name ${GITHUB_BOT_USERNAME}`);

    // 7. Commit all changes
    execa.commandSync('git status');
    execa.commandSync('git add -A');
    execa.commandSync(`git commit -m feat(tokens):\\ add\\ new\\ tokens`, {
      env: { HUSKY_SKIP_HOOKS: 1 },
    });

    // // 8. Raise a PR
    execa.commandSync(`git push origin ${branchName}`);
    execa.commandSync(
      `gh pr create --title feat(tokens):\\ add\\ new\\ tokens --head ${branchName} --repo razorpay/blade --body This\\ PR\\ was\\ opened\\ by\\ the\\ Token\\ Upload\\ GitHub\\ action.\\ It\\ updates\\ source\\ token\\ files\\ based\\ on\\ the\\ payload\\ from\\ Figma\\ Plugin.`,
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
uploadColorTokens();

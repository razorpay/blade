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

    const colorRegex = /const colors: ColorsWithModes = {(.|\n)+?};/gm;

    // if (tokens.bladeThemeColors) {
    // 2. read the bladeTheme File
    const bladeThemePath = path.resolve(__dirname, '../src/tokens/theme/bladeTheme.ts');
    const bladeTheme = fs.readFileSync(bladeThemePath, 'utf8');

    // 3. write the new tokens to bladeTheme file
    console.log(colorTokens);
    const updatedbladeThemeColors = JSON.stringify(colorTokens).replace(/"/g, '');
    const updatedbladeTheme = bladeTheme.replace(
      colorRegex,
      `const colors: ColorsWithModes = ${updatedbladeThemeColors};`,
    );
    fs.writeFileSync(bladeThemePath, updatedbladeTheme);
    // }

    // if (tokens.bankingThemeColors) {
    //   // 4. read the bankingTheme File
    //   const bankingThemePath = path.resolve(__dirname, '../src/tokens/theme/bankingTheme.ts');
    //   const bankingTheme = fs.readFileSync(bankingThemePath, 'utf8');

    //   // 5. write the new tokens to bankingTheme file
    //   const updatedBankingThemeColors = JSON.stringify(tokens.bankingThemeColors.colors).replace(
    //     /"/g,
    //     '',
    //   );
    //   const updatedBankingTheme = bankingTheme.replace(
    //     colorRegex,
    //     `const colors: ColorsWithModes = ${updatedBankingThemeColors};`,
    //   );
    //   fs.writeFileSync(bankingThemePath, updatedBankingTheme);
    // }

    // 6. create branch
    const branchName = randomNameGenerator
      .generator([randomNameGenerator.verb, randomNameGenerator.noun])
      .choose();
    execa.commandSync(`git checkout -b ${branchName}`);
    execa.commandSync(`git config user.email ${GITHUB_BOT_EMAIL}`);
    execa.commandSync(`git config user.name ${GITHUB_BOT_USERNAME}`);

    // 7. Commit all changes
    execa.commandSync('yarn prettier --write src/tokens/theme/bladeTheme.ts');
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

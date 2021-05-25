const fs = require('fs');
const path = require('path');
const execa = require('execa');

// const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_BOT_EMAIL = 'tools+cibot@razorpay.com';
const GITHUB_BOT_USERNAME = 'rzpcibot';

const uploadColorTokens = async () => {
  // 1. read the tokens object
  const tokens = JSON.parse(process.argv[2]);

  const colorRegex = /const colors: Colors = {(.|\n)+?};/gm;

  // 2. read the paymentTheme File
  const paymentThemePath = path.resolve(__dirname, '../src/tokens/theme/paymentTheme.ts');
  const paymentTheme = fs.readFileSync(paymentThemePath, 'utf8');

  // 3. write the new tokens to paymentTheme file
  const updatedPaymentThemeColors = JSON.stringify(tokens.paymentThemeColors.colors).replace(
    /"/g,
    '',
  );
  const updatedPaymentTheme = paymentTheme.replace(
    colorRegex,
    `const colors: Colors = ${updatedPaymentThemeColors};`,
  );
  fs.writeFileSync(paymentThemePath, updatedPaymentTheme);

  // 4. read the bankingTheme File
  const bankingThemePath = path.resolve(__dirname, '../src/tokens/theme/bankingTheme.ts');
  const bankingTheme = fs.readFileSync(bankingThemePath, 'utf8');

  // 4. write the new tokens to bankingTheme file
  const updatedBankingThemeColors = JSON.stringify(tokens.bankingThemeColors.colors).replace(
    /"/g,
    '',
  );
  const updatedBankingTheme = bankingTheme.replace(
    colorRegex,
    `const colors: Colors = ${updatedBankingThemeColors};`,
  );
  fs.writeFileSync(bankingThemePath, updatedBankingTheme);

  // 5. create branch
  // execa.commandSync(`git checkout -b add/tokens`);
  execa.commandSync(`git config user.email ${GITHUB_BOT_EMAIL}`);
  execa.commandSync(`git config user.name ${GITHUB_BOT_USERNAME}`);

  // 6. Commit all changes
  execa.commandSync('yarn prettier --write src/tokens/theme/*.ts');
  execa.commandSync('git add -A');
  execa.commandSync(`git commit -m feat(tokens):\\ add\\ new\\ tokens --no-verify`, {
    env: { HUSKY_SKIP_HOOKS: 1 },
  });

  // 7. Raise a PR: Output PR link
  execa.commandSync(`hub pull-request --push --message feat(tokens):\\ add\\ new\\ tokens`);
  // console.log(`[info]: PR created`);
};
uploadColorTokens();

// console.log(paymentTheme.replace(colorRegex, ''));
// console.log(bankingTheme.replace(colorRegex, ''));

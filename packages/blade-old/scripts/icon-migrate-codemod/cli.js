#!/usr/bin/env node
const path = require('path');
const execa = require('execa');
const argParser = require('args-parser');
const jscodeshiftExecutable = require.resolve('.bin/jscodeshift');
const transformerDirectory = path.resolve(__dirname, './transforms');

function run() {
  const transformerPath = path.join(transformerDirectory, `blade-old-icon.ts`);

  const parsedArgs = argParser(process.argv);
  const input = process.argv.slice(2)[0];
  const args = [input, '-t', transformerPath, ...process.argv.slice(3)];
  const parser = parsedArgs.parser || 'jsx';

  if (parser === 'tsx') {
    args.push('--extensions=tsx,ts,jsx,js');
  } else {
    args.push('--extensions=jsx,js');
  }
  args.push('--ignore-pattern=**/node_modules/**');

  // jscodeshift ./packages/blade-old/example -t ./packages/blade-old/scripts/icon-migrate-codemod/transforms/blade-old-icon.ts
  const result = execa.sync(jscodeshiftExecutable, args, {
    stdio: 'inherit',
    stripEof: false,
  });

  if (result.error) {
    throw result.error;
  }
}

run();

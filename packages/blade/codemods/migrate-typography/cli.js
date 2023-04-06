#!/usr/bin/env node
const path = require('path');
const execa = require('execa');
const argParser = require('args-parser');
const transformerDirectory = path.resolve(__dirname, './transformers');

// usage: npx migrate-typography ./src --parser=tsx
function run() {
  const transformerPath = path.join(transformerDirectory, `migrate-typography.ts`);

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

  const result = execa.sync('jscodeshift', args, {
    stdio: 'inherit',
    stripEof: false,
  });

  if (result.failed) {
    throw result.failed;
  }
}

run();

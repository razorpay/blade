/* eslint-disable no-process-exit */
const esbuild = require('esbuild');
const path = require('path');

esbuild
  .build({
    entryPoints: [path.join(__dirname, '../background-scripts/index.js')],
    bundle: true,
    minify: false,
    outfile: path.join(__dirname, '../chrome-extension/background_script.js'),
  })
  .catch(() => process.exit(1));

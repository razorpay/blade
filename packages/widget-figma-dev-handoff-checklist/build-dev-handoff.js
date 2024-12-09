const esbuild = require('esbuild');
require('dotenv').config();

async function build() {
  // Check if the `--watch` argument is passed in the command line
  const isWatchMode = process.argv.includes('--watch');

  // Create the build context
  const ctx = await esbuild.context({
    entryPoints: ['dev-handoff-checklist/code.tsx'],
    bundle: true,
    outfile: 'dev-handoff-checklist/dist/code.js',
    target: 'es6',
    define: {
      'process.env.SEGMENT_WRITE_KEY': JSON.stringify(btoa(process.env.SEGMENT_WRITE_KEY ?? '')),
    },
  });

  if (isWatchMode) {
    // Enable watch mode
    await ctx.watch();
    console.log('Watching for changes...');
  } else {
    // Perform a single build
    await ctx.rebuild();
    console.log('Build completed.');
    await ctx.dispose();
  }
}

// Execute the build function
build().catch((error) => {
  console.error(error);
  process.exit(1);
});

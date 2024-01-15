const fs = require('fs');
const path = require('path');
const babelParser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const execa = require('execa');

const main = () => {
  const sizeLimitConfig = [];

  // Get all the components name exported from the bundle and add them to the size-limit configuration
  const fileContent = fs.readFileSync(
    path.resolve(__dirname, '../build/lib/web/production/components/index.js'),
    'utf8',
  );

  // Parse the file content to get the AST
  const ast = babelParser.parse(fileContent, {
    sourceType: 'module',
  });

  const componentNameList = [];

  // Traverse the AST to get the component names
  traverse(ast, {
    // Get the component name from the export statement
    ExportSpecifier: ({ node }) => {
      const componentName = node.exported.name;
      // We don't want to add Icon components to the size-limit configuration
      // We don't want to add the same component name twice, so we'll check if it's already added
      if (!(componentName.includes('Icon') || componentNameList.includes(componentName))) {
        componentNameList.push(componentName);
        sizeLimitConfig.push({
          name: `Import ${componentName} only`,
          path: './build/lib/web/production/components/index.js',
          import: `{ ${componentName} }`,
          limit: '20 kb',
          running: false,
          gzip: true,
        });
      }
    },
  });

  sizeLimitConfig.push({
    name: 'Import all components',
    path: './build/lib/web/production/components/index.js',
    import: '*',
    limit: '100 kb',
    running: false,
    gzip: true,
  });

  // fs.writeFileSync(
  //   path.resolve(__dirname, '../.size-limit.json'),
  //   JSON.stringify(sizeLimitConfig, null, 2),
  // );

  // Run the size-limit command
  try {
    const { stdout } = execa.commandSync('yarn size-limit --json');

    const jsonLikeString = stdout
      .split('\n') // remove new line chars => []
      .map((item) => item.trim()) // remove whitespace
      .filter((item) => item !== '') // filter empty array items
      .join('');

    const sizes = JSON.parse(
      jsonLikeString.substring(jsonLikeString.indexOf('['), jsonLikeString.indexOf(']') + 1),
    );

    // Create github comment with the size-limit results
    const comment = `
import { Meta } from '@storybook/addon-docs';

<Meta title="Utils/Bundle Size" />

# Size Limit Report

| Component | Size | Limit |
| --- | --- | --- |
${sizes.map((item) => `| ${item.name} | ${item.size / 1000} kB | ${item.sizeLimit} |`).join('\n')}
`;

    const nodes = [
      ...Array.from({ length: 5 }, (_, i) => ({
        id: (i + 1).toString(),
        paymentId: `rzp${Math.floor(Math.random() * 1000000)}`,
        amount: Number((Math.random() * 10000).toFixed(2)),
        date: new Date(2021, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        status: ['Completed', 'Pending', 'Failed'][Math.floor(Math.random() * 3)],
        account: Math.floor(Math.random() * 1000000000).toString(),
      })),
    ];

    const STORYBOOK_BUNDLE_SIZE_DATA = {
      nodes,
    };

    const story = fs.readFileSync(
      path.resolve(__dirname, '../docs/utils/bundleSizeReport.stories.mdx'),
      'utf-8',
    );
    const updatedStory = story.replace(
      /STORYBOOK_BUNDLE_SIZE_DATA/g,
      JSON.stringify(STORYBOOK_BUNDLE_SIZE_DATA),
    );
    fs.writeFileSync(
      path.resolve(__dirname, '../docs/utils/bundleSizeReport.stories.mdx'),
      updatedStory,
    );
  } catch (error) {
    //throw new Error(error);
    //console.log('🚀 ~ main ~ error:', error);
  }
};

main();

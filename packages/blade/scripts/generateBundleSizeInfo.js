const fs = require('fs');
const path = require('path');
const babelParser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const execa = require('execa');

const main = async () => {
  const { globby } = await import('globby');

  const indexPaths = await globby([
    'build/lib/web/production/components/**/index.js',
    '!build/lib/web/production/components/{Icons,Form}/**/index.js',
    '!build/lib/web/production/components/index.js',
    '!build/lib/web/production/components/Box/styledProps/index.js',
  ]);

  const excludedComponents = [
    'useTheme',
    'announce',
    'clearAnnouncer',
    'destroyAnnouncer',
    'getTextProps',
    'screenReaderStyles',
    'useActionListContext',
    'ActionListItemAsset', // This is just an <img> tag
    // These are same as Badge, Amount, Counter, Link, Text components
    'CardHeaderAmount',
    'CardHeaderBadge',
    'CardHeaderCounter',
    'CardHeaderLink',
    'CardHeaderText',
    'ComponentIds',
    // Accessibility components
    'SkipNavContent',
    'SkipNavLink',
    'VisuallyHidden',
  ];
  const sizes = [];
  const sizeLimitConfig = [];
  // Get all the components name exported from the bundle and add them to the size-limit configuration
  indexPaths.forEach((indexPath) => {
    const fileContent = fs.readFileSync(path.resolve(__dirname, `../${indexPath}`), 'utf8');

    // Parse the file content to generate an AST
    const ast = babelParser.parse(fileContent, {
      sourceType: 'module',
    });
    // Arrays to store size-limit stats and component names to exclude
    const exportedComponents = [];

    // Traverse the AST to get the component names
    traverse(ast, {
      // Get the component name from the export statement
      ExportSpecifier: ({ node }) => {
        const componentName = node.exported.name;

        // We don't want to add Icon components to the size-limit configuration
        if (!(excludedComponents.includes(componentName) || componentName.startsWith('Base'))) {
          exportedComponents.push(componentName);
        }
      },
    });

    console.log('🚀 ~ indexPaths.forEach ~ exportedComponents:', exportedComponents);

    if (exportedComponents.length > 0 && !exportedComponents.includes('default')) {
      const imports = exportedComponents.join(', ');
      sizeLimitConfig.push({
        name: imports,
        path: './build/lib/web/production/components/index.js',
        import: `{ ${exportedComponents.join(', ')} }`,
        // Set high limit for the component size so that it doesn't fail the size-limit check
        limit: '2000 kb',
        running: false,
        gzip: true,
      });
    }
  });

  // Write size-limit configuration to .size-limit.json for each component
  fs.writeFileSync(
    path.resolve(__dirname, '../.size-limit.json'),
    JSON.stringify(sizeLimitConfig, null, 2),
  );

  // Run size-limit command and capture the output to gather size information
  const { stdout } = execa.commandSync('yarn size-limit --json');

  // Process the size-limit output to extract relevant information
  const jsonLikeString = stdout
    .split('\n') // remove new line chars => []
    .map((item) => item.trim()) // remove whitespace
    .filter((item) => item !== '') // filter empty array items
    .join('');

  sizes.push(
    JSON.parse(
      jsonLikeString.substring(jsonLikeString.indexOf('[') + 1, jsonLikeString.indexOf(']')),
    ),
  );

  // Write the gathered size information to the specified file
  const filename = process.env.BUNDLE_SIZE_STATS_FILENAME || 'PRBundleSizeStats.json';
  fs.writeFileSync(path.resolve(__dirname, `../${filename}`), JSON.stringify(sizes));
};

main();

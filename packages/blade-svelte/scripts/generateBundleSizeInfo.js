import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import babelParser from '@babel/parser';
import _traverse from '@babel/traverse';
import execa from 'execa';
// eslint-disable-next-line import/no-extraneous-dependencies
import prettier from 'prettier';

const traverse = _traverse.default;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const findIndexPaths = (baseDir) => {
  const results = [];
  const walk = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name === 'index.js') {
        const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
        // Exclude the main index.js and Icons index files
        if (relativePath === 'index.js') continue;
        if (relativePath.startsWith('Icons/')) continue;
        results.push(`dist/lib/components/${relativePath}`);
      }
    }
  };
  walk(baseDir);
  return results;
};

const main = async () => {
  // Find all intermediate index.js files in component subdirectories
  const indexPaths = findIndexPaths(path.resolve(__dirname, '../dist/lib/components'));

  const excludedComponents = [
    'BaseText',
    'BaseButton',
    'BaseSpinner',
    'BaseAmount',
    'BaseLink',
    'BaseCounter',
    'BaseIconButton',
    // Type-only exports are not actual components
    'ComponentIds',
  ];
  const sizes = [];

  const runSizeLimit = ({ name, importedComponents }) => {
    // Write size-limit configuration to .size-limit.json for each component
    fs.writeFileSync(
      path.resolve(__dirname, '../.size-limit.json'),
      JSON.stringify(
        [
          {
            name,
            path: './dist/lib/components/index.js',
            import: importedComponents,
            // Set high limit for the component size so that it doesn't fail the size-limit check
            limit: '2000 kb',
            running: false,
            gzip: true,
          },
        ],
        null,
        2,
      ),
    );

    // Run size-limit command and capture the output to gather size information
    const { stdout } = execa.commandSync('yarn size-limit --json');

    // Process the size-limit output to extract relevant information
    const jsonLikeString = stdout
      .split('\n') // remove new line chars => []
      .map((item) => item.trim()) // remove whitespace
      .filter((item) => item !== '') // filter empty array items
      .join('');

    // Use first '[' and last ']' to robustly extract the full JSON array from size-limit output
    const firstBracket = jsonLikeString.indexOf('[');
    const lastBracket = jsonLikeString.lastIndexOf(']');
    try {
      sizes.push(...JSON.parse(jsonLikeString.substring(firstBracket, lastBracket + 1)));
    } catch (e) {
      throw new Error(`Failed to parse size-limit JSON output. Raw stdout:\n${stdout}`);
    }
  };

  // Run size-limit for the empty import to get the base project size
  runSizeLimit({ name: 'Base', importedComponents: '{}' });

  // Collect all export names from intermediate index files to avoid duplicates
  const groupedExports = new Set();

  // Process intermediate index files (e.g., Accordion/index.js, Card/index.js)
  indexPaths.forEach((indexPath) => {
    const fileContent = fs.readFileSync(path.resolve(__dirname, `../${indexPath}`), 'utf8');

    // Parse the file content to generate an AST
    const ast = babelParser.parse(fileContent, {
      sourceType: 'module',
    });
    const exportedComponents = [];

    // Traverse the AST to get the component names
    traverse(ast, {
      // Get the component name from the export statement
      ExportSpecifier: ({ node }) => {
        const componentName = node.exported.name;

        // We don't want to add Icon components to the size-limit configuration
        if (
          !(
            excludedComponents.includes(componentName) ||
            componentName.startsWith('Base') ||
            componentName === 'default'
          )
        ) {
          exportedComponents.push(componentName);
          groupedExports.add(componentName);
        }
      },
    });

    if (exportedComponents.length > 0) {
      const imports = exportedComponents.join(', ');

      try {
        runSizeLimit({ name: imports, importedComponents: `{ ${imports} }` });
      } catch (e) {
        console.warn(`Skipping size-limit for ${imports}: not exported from main index`);
      }
    }
  });

  // Also handle standalone component exports from the main index.js
  // These are exports like: export { default as Text } from './Typography/Text/Text.js'
  // that don't have intermediate index files
  const mainIndexContent = fs.readFileSync(
    path.resolve(__dirname, '../dist/lib/components/index.js'),
    'utf8',
  );

  const mainAst = babelParser.parse(mainIndexContent, {
    sourceType: 'module',
  });

  // Group standalone exports by their top-level component directory
  const standaloneGroups = new Map();

  traverse(mainAst, {
    ExportNamedDeclaration: ({ node }) => {
      if (node.source) {
        const sourcePath = node.source.value;
        // Skip exports from index files (already handled above)
        if (sourcePath.endsWith('index.js')) {
          return;
        }
        // Skip Icons
        if (sourcePath.includes('Icons')) {
          return;
        }

        if (node.specifiers) {
          node.specifiers.forEach((spec) => {
            const componentName = spec.exported.name;
            if (
              !(
                excludedComponents.includes(componentName) ||
                componentName.startsWith('Base') ||
                componentName === 'default' ||
                groupedExports.has(componentName)
              )
            ) {
              // Extract top-level directory from source path (e.g., 'Typography' from './Typography/Text/Text.js')
              const match = sourcePath.match(/\.\/([^/]+)\//);
              const groupKey = match ? match[1] : sourcePath;

              if (!standaloneGroups.has(groupKey)) {
                standaloneGroups.set(groupKey, []);
              }
              standaloneGroups.get(groupKey).push(componentName);
            }
          });
        }
      }
    },
  });

  // Run size-limit for each standalone component group
  standaloneGroups.forEach((componentNames, _groupKey) => {
    const imports = componentNames.join(', ');
    try {
      runSizeLimit({ name: imports, importedComponents: `{ ${imports} }` });
    } catch (e) {
      console.warn(`Skipping size-limit for ${imports}: not exported from main index`);
    }
  });

  // Write the gathered size information to the specified file
  const filename = process.env.BUNDLE_SIZE_STATS_FILENAME || 'prBundleSizeStats.json';
  // Format the file content using prettier & write it to the file
  fs.writeFileSync(
    path.resolve(__dirname, `../${filename}`),
    await prettier.format(JSON.stringify(sizes), {
      parser: 'json',
    }),
  );
};

main().catch((err) => {
  console.error('Failed to generate bundle size info:', err);
  process.exit(1);
});

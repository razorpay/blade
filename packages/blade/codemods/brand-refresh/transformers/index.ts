import type { Transform } from 'jscodeshift';
import migrateAmountComponent from './migrate-amount';
import migrateDividerComponent from './migrate-divider';
import migrateCardComponent from './migrate-card';
import migrateBadgeComponent from './migrate-badge';
import migrateContrastIntentAndColorProps from './migrate-contrast-intent-color-props';
import migrateTypographyComponents from './migrate-typography';
import migrateActionListAndTable from './migrate-actionlist-and-table';
import { red, isExpression } from './utils';
// eslint-disable-next-line import/extensions
import colorTokensMapping from './colorTokensMapping.json';
import migrateDropdownComponent from './migrate-dropdown';

const transformer: Transform = (file, api, options) => {
  // Maps for fontSize, lineHeight, and token prefixes
  const fontSizeMap = {
    600: 500,
    700: 600,
    800: 600,
    900: 700,
    1000: 700,
    1100: 800,
    1200: 900,
    1300: 1000,
    1600: 1100,
  };

  const lineHeightMap = {
    700: 600,
    800: 700,
    900: 800,
    1000: 900,
    1100: 1000,
    1500: 1100,
  };

  const fontTokenPrefix = 'theme.typography.fonts.size';
  const lineHeightTokenPrefix = 'theme.typography.lineHeights';

  // Replace old color tokens to new color tokens
  const newSource = file.source
    .replace(
      /(brand|feedback|action|static|white|badge|surface)\.?([aA-zZ0-9]+)\.?([aA-zZ0-9]+)\.?([a-z0-9]+)\.?([aA-zZ0-9]+)\.?([aA-zZ0-9]+)\.?([aA-zZ0-9]+)/g,
      (originalString) => {
        if (originalString.includes('highContrast') && !originalString.includes('feedback')) {
          return 'UPDATE_THIS_VALUE_WITH_A_NEW_COLOR_TOKEN';
        }

        // Get the token from the original string, e.g. "brand.primary[500]" -> "brand.primary.500"
        const token = originalString.replace('[', '.').replace(/\]|'|"/g, '');
        const replacement = colorTokensMapping[token];

        if (!replacement) {
          return originalString;
        }
        return replacement;
      },
    )
    // Replace old font sizes & line height in the source code with new font sizes & line height
    .replace(
      // gets both .50 and ['50'] or ["50"]
      /theme\.typography\.fonts\.size\.?((\w+)|(\W.*\]))/g,
      (originalString, match) => {
        const token = match.replace(/\[|\]|'|"/g, '');
        const replacement = fontSizeMap[token];
        if (!replacement) {
          return originalString;
        }
        return `${fontTokenPrefix}[${fontSizeMap[token]}]`;
      },
    )
    .replace(
      // gets both .50 and ['50'] or ["50"]
      /theme\.typography\.lineHeights\.?((\w+)|(\W.*\]))/g,
      (originalString, match) => {
        const token = match.replace(/\[|\]|'|"/g, '');
        const replacement = lineHeightMap[token];
        if (!replacement) {
          return originalString;
        }
        return `${lineHeightTokenPrefix}[${lineHeightMap[token]}]`;
      },
    );

  // Don't transform if the file doesn't import `@razorapy/blade/components` because it's not using Blade components
  // Allow the migration test file to be transformed
  if (!newSource.includes('@razorpay/blade/components') && file.path !== undefined) {
    return newSource;
  }

  const j = api.jscodeshift;
  const root = j.withParser('tsx')(newSource);

  // Update the themeTokens prop in BladeProvider
  try {
    root
      .find(j.JSXElement, {
        openingElement: {
          name: {
            name: 'BladeProvider',
          },
        },
      })
      .find(j.JSXAttribute, {
        name: {
          name: 'themeTokens',
        },
      })
      .replaceWith(({ node }) => {
        node.value.expression.name = 'bladeTheme';

        return node;
      });
  } catch (error) {
    console.error(
      red(
        `⛔️ ${file.path}: Oops! Ran into an issue while updating the themeTokens prop in BladeProvider.`,
      ),
      `\n${red(error.stack)}\n`,
    );
  }

  // Update color token value based on the context
  try {
    root
      .find(j.JSXElement, {
        openingElement: {
          name: {
            name: (name) => /(Text|Title|Code|Display|Heading|Box|Icon)/i.test(name),
          },
        },
      })
      // Find all color props
      .find(j.JSXAttribute, {
        name: {
          name: (name) => name.toLowerCase().includes('color'),
        },
      })
      .replaceWith((path) => {
        const { node, parent } = path;

        // If the color prop is an expression, don't bother updating it contextually
        if (isExpression(node)) {
          return node;
        }

        const isBoxComponent = parent.value.name.name === 'Box';
        const isIconComponent = parent.value.name.name?.includes('Icon');
        const isBorderColorProp = (node.name.name as string).includes('border');
        const isColorProp = node.name.name === 'color';

        if (isBoxComponent && isBorderColorProp) {
          node.value.value = node.value.value
            .replace('background', 'border')
            .replace('intense', 'normal');
        } else if (
          isIconComponent &&
          isColorProp &&
          /surface.(background|text).(gray|staticWhite|positive|negative|notice|information|neutral|primary|staticBlack)/i.test(
            node.value.value,
          )
        ) {
          node.value.value = node.value.value
            .replace(/surface.(background|text)/i, 'interactive.icon')
            .replace('intense', 'normal');

          // Typography components
        } else if (!isBoxComponent && !isIconComponent && isColorProp) {
          node.value.value = node.value.value.replace('background', 'text');

          if (!node.value.value.includes('feedback')) {
            node.value.value = node.value.value.replace('intense', 'normal');
          }
        }

        return node;
      });
  } catch (error) {
    console.error(
      red(
        `⛔️ ${file.path}: Oops! Ran into an issue while updating the color token value based on the context.`,
      ),
      `\n${red(error.stack)}\n`,
    );
  }

  migrateTypographyComponents({ root, j, file });
  migrateContrastIntentAndColorProps({ root, j, file });
  migrateBadgeComponent({ root, j, file });
  migrateCardComponent({ root, j, file });
  migrateAmountComponent({ root, j, file });
  migrateDividerComponent({ root, j, file });
  migrateActionListAndTable({ root, j, file });
  migrateDropdownComponent({ root, j, file });

  // Update ImportSpecifier from "paymentTheme"/"bankingTheme" to "bladeTheme"
  try {
    root
      .find(j.ImportDeclaration, {
        source: {
          value: '@razorpay/blade/tokens',
        },
      })
      .find(j.ImportSpecifier, {
        imported: {
          name: (name) => ['paymentTheme', 'bankingTheme'].includes(name),
        },
      })
      .replaceWith((path) => {
        path.value.imported.name = 'bladeTheme';

        return path.node;
      });
  } catch (error) {
    console.error(
      red(
        `⛔️ ${file.path}: Oops! Ran into an issue while updating the ImportSpecifier from "paymentTheme"/"bankingTheme" to "bladeTheme".`,
      ),
      `\n${red(error.stack)}\n`,
    );
  }

  return root.toSource(options.printOptions);
};

export default transformer;

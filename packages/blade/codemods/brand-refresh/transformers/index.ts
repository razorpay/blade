import type { Transform, JSXAttribute, JSXExpressionContainer } from 'jscodeshift';
import colorTokensMapping from './colorTokensMapping';

const isExpression = (prop: unknown): prop is JSXExpressionContainer => {
  return (prop as JSXAttribute)?.value?.type === 'JSXExpressionContainer';
};

export const red = (message: string): string => `\u001b[1m\u001b[31m${message}\u001b[39m\u001b[22m`;

const transformer: Transform = (file, api, options) => {
  // Maps to transform Title sizes to Heading sizes
  const titleToHeadingMap = {
    xlarge: '2xlarge',
    large: 'xlarge',
    medium: 'xlarge',
    small: 'large',
  };

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

        const replacement = colorTokensMapping[originalString];

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
      .find(j.JSXElement)
      .filter((path) => path.value.openingElement.name.name === 'BladeProvider')
      .find(j.JSXAttribute)
      .filter((path) => path.node.name.name === 'themeTokens')
      .replaceWith((path) => {
        path.node.value.expression.name = 'bladeTheme';

        return path.node;
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
      .find(j.JSXElement)
      .filter((path) =>
        /(Text|Title|Code|Display|Heading|Box|Icon)/i.test(path.value.openingElement.name.name),
      )
      // Find all color props
      .find(j.JSXAttribute)
      .filter((path) => path.node.name.name.toLowerCase().includes('color'))
      .replaceWith((path) => {
        const { node, parent } = path;

        // If the color prop is an expression, don't bother updating it contextually
        if (isExpression(node)) {
          return node;
        }

        const isBoxComponent = parent.value.name.name === 'Box';
        const isIconComponent = parent.value.name.name?.includes('Icon');
        const isBorderColorProp = node.name.name.includes('border');
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

  // Select Typography elements based on their names
  const typographyJSXElements = root
    .find(j.JSXElement)
    .filter((path) =>
      ['Text', 'Title', 'Code', 'Display', 'Heading'].includes(path.value.openingElement.name.name),
    );

  // Update <Heading size="large|medium"> to <Heading size="medium|small">,
  // <Heading size="small">, <Heading variant="regular"> to <Text size="large">, and
  // <Heading variant="subheading"> to <Text size="small">
  try {
    typographyJSXElements
      .filter((path) => path.value.openingElement.name.name === 'Heading')
      // replace with Heading
      .replaceWith((path) => {
        const { node } = path;

        const sizeAttribute = node.openingElement.attributes.find(
          (attribute) => attribute.name?.name === 'size',
        );

        const variantAttribute = node.openingElement.attributes.find(
          (attribute) => attribute.name?.name === 'variant',
        );

        if (isExpression(sizeAttribute) || isExpression(variantAttribute)) {
          console.warn(
            red(
              '\n⛔️ Expression found in the "size"/"variant" attribute, please update manually:',
            ),
            red(`${file.path}:${sizeAttribute.loc.start.line}:${node.loc.start.column}\n`),
          );
          return node;
        }

        const otherAttributes = node.openingElement.attributes.filter(
          (attribute) => attribute.name?.name !== 'variant' && attribute.name?.name !== 'size',
        );

        const headingSizeMap = {
          large: 'medium',
          medium: 'small',
          small: 'large',
        };

        // If size is small or variant is subheading, replace with Text
        if (
          !sizeAttribute ||
          (sizeAttribute && sizeAttribute.value.value === 'small') ||
          (variantAttribute && variantAttribute.value.value === 'subheading')
        ) {
          node.openingElement.name.name = 'Text';
          node.closingElement.name.name = 'Text';
        }

        if (
          !sizeAttribute &&
          (!variantAttribute || (variantAttribute && variantAttribute.value.value === 'regular'))
        ) {
          otherAttributes.push(j.jsxAttribute(j.jsxIdentifier('size'), j.literal('large')));
        } else if (sizeAttribute) {
          otherAttributes.push(
            j.jsxAttribute(
              j.jsxIdentifier('size'),
              j.literal(headingSizeMap[sizeAttribute.value.value]),
            ),
          );
        } else if (variantAttribute && variantAttribute.value.value === 'subheading') {
          otherAttributes.push(j.jsxAttribute(j.jsxIdentifier('size'), j.literal('small')));
        }

        node.openingElement.attributes = otherAttributes;

        return node;
      })
      .find(j.JSXAttribute)
      .filter(
        (path, index, self) =>
          path.node.name.name === 'variant' &&
          index === self.findIndex((obj) => path.node.start === obj.node.start),
      ) // Filter by name `variant` and remove any duplicates
      .remove();
  } catch (error) {
    console.error(
      red(
        `⛔️ ${file.path}: Oops! Ran into an issue while updating the Heading size and variant props.`,
      ),
      `\n${red(error.stack)}\n`,
    );
  }

  // Replace Title with Heading and update the 'size' attribute
  // <Title size="medium"> to <Heading size="xlarge">
  try {
    typographyJSXElements
      .filter((path) => path.value.openingElement.name.name === 'Title')
      // replace with Heading
      .replaceWith((path) => {
        const { node } = path;

        node.openingElement.name.name = 'Heading';
        node.closingElement.name.name = 'Heading';

        const sizeAttribute = node.openingElement.attributes.find(
          (attribute) => attribute.name?.name === 'size',
        );

        if (isExpression(sizeAttribute)) {
          console.warn(
            red('\n⛔️ Expression found in the "size" attribute, please update manually:'),
            red(`${file.path}:${sizeAttribute.loc.start.line}:${node.loc.start.column}\n`),
          );
          return node;
        }

        if (!sizeAttribute) {
          node.openingElement.attributes.push(
            j.jsxAttribute(j.jsxIdentifier('size'), j.literal('large')),
          );

          return node;
        }

        const otherAttributes = node.openingElement.attributes.filter(
          (attribute) => attribute.name?.name !== 'size',
        );
        otherAttributes.push(
          j.jsxAttribute(
            j.jsxIdentifier('size'),
            j.literal(titleToHeadingMap[sizeAttribute.value.value] || 'large'),
          ),
        );

        node.openingElement.attributes = otherAttributes;

        return node;
      });
  } catch (error) {
    console.error(
      red(`⛔️ ${file.path}: Oops! Ran into an issue while migrating the Title component`),
      `\n${red(error.stack)}\n`,
    );
  }

  // Remove/Update the Title import from "@razorpay/blade/components"
  try {
    root
      .find(j.ImportDeclaration)
      .filter(
        (path) =>
          path.value.source.value === '@razorpay/blade/components' ||
          path.value.source.value === '@razorpay/blade/tokens',
      )
      .find(j.ImportSpecifier)
      .filter((path) =>
        ['Title', 'paymentTheme', 'bankingTheme'].includes(path.value.imported.name),
      )
      .replaceWith((path) => {
        // Check if Heading import is already present
        const isHeadingImportPresent = path.parent.value.specifiers.some(
          (node) => node.imported.name === 'Heading',
        );
        const isThemeImportPresent =
          path.value.imported.name === 'paymentTheme' ||
          path.value.imported.name === 'bankingTheme';

        if (isThemeImportPresent) {
          path.value.imported.name = 'bladeTheme';
        }
        // If Heading import is not present, update the "Title" import to use "Heading"
        else if (!isHeadingImportPresent) {
          path.value.imported.name = 'Heading';
        } else {
          // If "Heading" import is present, remove the "Title" import
          path.parent.value.specifiers = path.parent.value.specifiers.filter(
            (node) => node.imported.name !== 'Title',
          );
        }

        return path.node;
      });
  } catch (error) {
    console.error(
      red(`⛔️ ${file.path}: Oops! Ran into an issue while updating the Title import.`),
      `\n${red(error.stack)}\n`,
    );
  }

  // Remove `type` and contrast="low" prop from Typography & ProgressBar Components
  try {
    root
      .find(j.JSXElement)
      .filter((path) =>
        /(Text|Title|Display|Heading|ProgressBar)/i.test(path.value.openingElement.name.name),
      )
      .replaceWith((path) => {
        const { node } = path;

        // If the node is a ProgressBar, return the node
        if (node.openingElement.name.name === 'ProgressBar') {
          return node;
        }

        const colorAttribute = node.openingElement.attributes.find(
          (attribute) => attribute.name?.name === 'color',
        );

        if (colorAttribute) {
          node.openingElement.attributes = node.openingElement.attributes.filter(
            (attribute) => attribute.name?.name !== 'contrast' && attribute.name?.name !== 'type',
          );

          return node;
        }

        const typeAttribute = node.openingElement.attributes.find(
          (attribute) => attribute.name?.name === 'type',
        );

        const contrastAttribute = node.openingElement.attributes.find(
          (attribute) => attribute.name?.name === 'contrast',
        );

        // If type and contrast are not present, return the node
        if (!(typeAttribute || contrastAttribute)) {
          return node;
        }

        const typeValue = typeAttribute?.value.value || 'normal';
        const contrastValue = contrastAttribute?.value.value || 'low';

        const oldColorToken = `surface.text.${typeValue}.${contrastValue}Contrast`;
        const newColorToken = colorTokensMapping[oldColorToken];

        if (newColorToken) {
          node.openingElement.attributes?.push(
            j.jsxAttribute(j.jsxIdentifier('color'), j.literal(newColorToken)),
          );
        }

        return node;
      })
      .find(j.JSXAttribute) // Find all Heading props
      .filter(
        (path, index, self) =>
          (path.node.name.name === 'type' ||
            (path.node.name.name === 'contrast' && path.node.value.value === 'low')) &&
          index === self.findIndex((obj) => path.node.start === obj.node.start),
      ) // Filter by name `type` and remove any duplicates
      .remove();
  } catch (error) {
    console.error(
      red(
        `⛔️ ${file.path}: Oops! Ran into an issue while removing the "type" prop from Typography Components:`,
      ),
      `\n${red(error.stack)}\n`,
    );
  }

  // Break `contrast="high"` prop from Typography & ProgressBar Components
  try {
    root
      .find(j.JSXElement)
      .filter((path) =>
        /(Text|Title|Display|Heading|ProgressBar)/i.test(path.value.openingElement.name.name),
      )
      .find(j.JSXAttribute) // Find all Heading props
      .filter(
        (path, index, self) =>
          // Only Typography components
          /(Text|Title|Display|Heading|ProgressBar)/i.test(path.parent.value.name.name) &&
          path.node.name.name === 'contrast' &&
          path.node.value.value === 'high' &&
          index === self.findIndex((obj) => path.node.start === obj.node.start),
      )
      .replaceWith((path) => {
        path.node.value.value = 'UPDATE_THIS_VALUE_WITH_A_NEW_COLOR_TOKEN';
        return path.node;
      });
  } catch (error) {
    console.error(
      red(
        `⛔️ ${file.path}: Oops! Ran into an issue while breaking the "contrast" prop from Typography Components:`,
      ),
      `\n${red(error.stack)}\n`,
    );
  }

  // Change 'weight="bold"' to 'weight="semibold"' in Heading, Text, Display
  // Code still uses 'weight="bold"' and Title has been modified to the Heading Component
  try {
    typographyJSXElements
      .filter((path) =>
        ['Heading', 'Text', 'Display'].includes(path.value.openingElement.name.name),
      )
      .find(j.JSXAttribute)
      .filter((path) => path.node.name.name === 'weight' && path.node.value.value === 'bold')
      .replaceWith((path) => {
        path.node.value.value = 'semibold';
        return path.node;
      });
  } catch (error) {
    console.error(
      red(
        `⛔️ ${file.path}: Oops! Ran into an issue while updating the "weight" prop in Typography Components:`,
      ),
      `\n${red(error.stack)}\n`,
    );
  }

  // Bade/Counter/IconButton
  try {
    root
      .find(j.JSXElement)
      .filter((path) =>
        ['Badge', 'Counter', 'IconButton'].includes(path.value.openingElement.name.name),
      )
      .find(j.JSXAttribute)
      .filter((path) => path.node.name.name === 'contrast')
      .replaceWith((path) => {
        path.node.name.name = 'emphasis';

        const contrastToEmphasisMap = {
          badge: {
            low: 'subtle',
            high: 'intense',
          },
          counter: {
            low: 'subtle',
            high: 'intense',
          },
          iconbutton: {
            low: 'intense',
            high: 'subtle',
          },
        };

        path.node.value.value =
          contrastToEmphasisMap[path.parent.value.name.name.toLowerCase()][[path.node.value.value]];

        return path.node;
      });
  } catch (error) {
    console.error(
      red(
        `⛔️ ${file.path}: Oops! Ran into an issue while updating the "contrast" prop in Bade/Counter/IconButton Components:`,
      ),
      `\n${red(error.stack)}\n`,
    );
  }

  // Remove deprecated 'intent'/'variant' props in favor of color
  try {
    root
      .find(j.JSXElement)
      .filter((path) =>
        [
          'Alert',
          'Badge',
          'Counter',
          'Chip',
          'ChipGroup',
          'Indicator',
          'ProgressBar',
          'Amount',
        ].includes(path.value.openingElement.name.name),
      )
      .replaceWith((path) => {
        const { node } = path;

        const colorAttribute = node.openingElement.attributes.find(
          (attribute) => attribute.name?.name === 'color',
        );

        if (colorAttribute) {
          node.openingElement.attributes = node.openingElement.attributes.filter(
            (attribute) => attribute.name?.name !== 'intent' && attribute.name?.name !== 'variant',
          );

          return node;
        }

        const variantAttribute = node.openingElement.attributes.find(
          (attribute) => attribute.name?.name === 'variant',
        );

        const intentAttribute = node.openingElement.attributes.find(
          (attribute) => attribute.name?.name === 'intent',
        );

        // If type and contrast are not present, return the node
        if (!(variantAttribute || intentAttribute)) {
          return node;
        }

        const variantValue = variantAttribute?.value.value;
        const intentValue = intentAttribute?.value.value;

        node.openingElement.attributes?.push(
          j.jsxAttribute(
            j.jsxIdentifier('color'),
            j.literal(
              ['blue', 'none'].includes(variantValue || intentValue)
                ? 'primary'
                : variantValue || intentValue,
            ),
          ),
        );

        return node;
      })
      .find(j.JSXAttribute)
      .filter((path) => path.node.name.name === 'intent' || path.node.name.name === 'variant')
      .filter(
        (path, index, self) =>
          (path.node.name.name === 'intent' || path.node.name.name === 'variant') &&
          index === self.findIndex((obj) => path.node.start === obj.node.start),
      )
      .replaceWith((path) => {
        if (path.node.value.value === 'blue' || path.node.value.value === 'default') {
          path.node.value.value = 'primary';
        }

        return path.node;
      })
      .remove();
  } catch (error) {
    console.error(
      red(
        `⛔️ ${file.path}: Oops! Ran into an issue while removing the deprecated "intent" and "variant" props.`,
      ),
      `\n${red(error.stack)}\n`,
    );
  }

  // Change color="default" to color="primary" in Button/Link/Badge/Counter
  // <Button variant="secondary" color="default"> -> <Button variant="secondary" color="primary">
  try {
    root
      .find(j.JSXElement)
      .filter((path) =>
        ['Button', 'Link', 'Badge', 'Counter'].includes(path.value.openingElement.name.name),
      )
      .find(j.JSXAttribute)
      .filter((path) => path.node.name.name === 'color' && path.node.value.value === 'default')
      .replaceWith((path) => {
        path.node.value.value = 'primary';

        return path.node;
      });
  } catch (error) {
    console.error(
      red(`⛔️ ${file.path}: Oops! Ran into an issue while updating the Button color prop.`),
      `\n${red(error.stack)}\n`,
    );
  }

  // Remove forntWeight prop from Badge
  try {
    root
      .find(j.JSXElement)
      .filter((path) => path.value.openingElement.name.name === 'Badge')
      .find(j.JSXAttribute)
      .filter((path) => path.node.name.name === 'fontWeight')
      .remove();
  } catch (error) {
    console.error(
      red(`⛔️ ${file.path}: Oops! Ran into an issue while removing the fontWeight prop.`),
      `\n${red(error.stack)}\n`,
    );
  }

  // Card component <Card surfaceLevel={2|3} > -> <Card backgroundColor=”surface.background.gray.intense|surface.background.gray.moderate”>
  try {
    root
      .find(j.JSXElement)
      .filter((path) => ['Card'].includes(path.value.openingElement.name.name))
      .find(j.JSXAttribute)
      .filter((path) => path.node.name.name === 'surfaceLevel')
      .replaceWith((path) => {
        const { node } = path;

        const surfaceLevelMap = {
          2: 'surface.background.gray.intense',
          3: 'surface.background.gray.moderate',
        };

        node.name.name = 'backgroundColor';

        node.value = j.literal(surfaceLevelMap[node.value.expression.value]);

        delete node.value.expression;

        return node;
      });
  } catch (error) {
    console.error(
      red(`⛔️ ${file.path}: Oops! Ran into an issue while updating the Card component.`),
      `\n${red(error.stack)}\n`,
    );
  }

  // Divider component <Divider variant=”normal”> -> <Divider variant=”muted”>
  try {
    root
      .find(j.JSXElement)
      .filter((path) => ['Divider'].includes(path.value.openingElement.name.name))
      .find(j.JSXAttribute)
      .filter((path) => path.node.name.name === 'variant' && path.node.value.value === 'normal')
      .replaceWith((path) => {
        const { node } = path;

        node.value.value = 'muted';

        return node;
      });
  } catch (error) {
    console.error(
      red(`⛔️ ${file.path}: Oops! Ran into an issue while updating the Divider component.`),
      `\n${red(error.stack)}\n`,
    );
  }

  // Amount component <Amount size=”heading-small-bold”> -> <Amount type=”heading” size=”small” weight=”semibold”>
  try {
    root
      .find(j.JSXElement)
      .filter((path) => ['Amount'].includes(path.value.openingElement.name.name))
      .replaceWith((path) => {
        const { node } = path;

        const sizeAttribute = node.openingElement.attributes.find(
          (attribute) => attribute.name?.name === 'size',
        );

        if (!sizeAttribute) {
          return node;
        }

        if (isExpression(sizeAttribute)) {
          console.warn(
            red('\n⛔️ Expression found in the "size" attribute, please update manually:'),
            red(`${file.path}:${sizeAttribute.loc.start.line}:${node.loc.start.column}\n`),
          );
          return node;
        }

        const otherAttributes = node.openingElement.attributes.filter(
          (attribute) => attribute.name?.name !== 'size',
        );

        const sizeMap = {
          'body-small': {
            type: 'body',
            size: 'small',
          },
          'body-small-bold': {
            type: 'body',
            size: 'small',
            weight: 'semibold',
          },
          'body-medium': {
            type: 'body',
            size: 'medium',
          },
          'body-medium-bold': {
            type: 'body',
            size: 'medium',
            weight: 'semibold',
          },
          'heading-small': {
            type: 'body',
            size: 'large',
          },
          'heading-small-bold': {
            type: 'body',
            size: 'large',
            weight: 'semibold',
          },
          'heading-large': {
            type: 'heading',
            size: 'medium',
          },
          'heading-large-bold': {
            type: 'heading',
            size: 'medium',
            weight: 'semibold',
          },
          'title-small': {
            type: 'heading',
            size: 'large',
          },
          'title-medium': {
            type: 'heading',
            size: 'xlarge',
          },
        };

        const sizeAttributeValue = sizeAttribute.value.value;

        Object.keys(sizeMap[sizeAttribute.value.value]).forEach((key) => {
          otherAttributes.push(
            j.jsxAttribute(
              j.jsxIdentifier(key),
              j.literal(sizeMap[sizeAttributeValue][key as keyof typeof sizeMap]),
            ),
          );
        });

        node.openingElement.attributes = otherAttributes;

        return node;
      });
  } catch {
    console.error(
      red(`⛔️ ${file.path}: Oops! Ran into an issue while updating the Amount component.`),
      `\n${red(error.stack)}\n`,
    );
  }

  // Update ImportDeclaration from "@razorpay/blade/components" to "@razorpay/blade-rebranded/components"
  try {
    root
      .find(j.ImportDeclaration)
      .filter((path) =>
        /@razorpay\/blade\/(components|utils|tokens)/i.test(path.value.source.value),
      )
      .replaceWith((path) => {
        path.value.source.value = path.value.source.value.replace('blade', 'blade-rebranded');

        return path.node;
      });
  } catch (error) {
    console.error(
      red(
        `⛔️ ${file.path}: Oops! Ran into an issue while updating the ImportDeclaration from "@razorpay/blade" to "@razorpay/blade-rebranded".`,
      ),
      `\n${red(error.stack)}\n`,
    );
  }

  return root.toSource(options.printOptions);
};

export default transformer;

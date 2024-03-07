import { red, isExpression } from './utils';
// eslint-disable-next-line import/extensions
import colorTokensMapping from './colorTokensMapping.json';

function migrateTypographyComponents({ root, j, file }): void {
  // Select Typography elements based on their names
  const typographyJSXElements = root.find(j.JSXElement, {
    openingElement: {
      name: {
        name: (name) =>
          ['Text', 'Title', 'Code', 'Display', 'Heading', 'CardHeaderText'].includes(name),
      },
    },
  });

  // Update <Text variant="caption" size="medium" > to <Text variant="caption" size="small" >
  try {
    typographyJSXElements
      .filter(
        (path) =>
          path.value.openingElement.name.name.includes('Text') &&
          path.value.openingElement.attributes.some(
            (attribute) =>
              attribute.name?.name === 'variant' && attribute.value?.value === 'caption',
          ),
      )
      .find(j.JSXAttribute, {
        name: {
          name: 'size',
        },
        value: {
          value: 'medium',
        },
      })
      .replaceWith((path) => {
        path.node.value.value = 'small';
        return path.node;
      });
  } catch (error) {
    console.error(
      red(`⛔️ ${file.path}: Oops! Ran into an issue while updating the Text size prop.`),
      `\n${red(error.stack)}\n`,
    );
  }

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

          // Add 'Text' import if not present
          // Note that we don't remove the 'Heading' import as it might be used elsewhere
          root
            .find(j.ImportDeclaration, {
              source: {
                value: '@razorpay/blade/components',
              },
            })
            .replaceWith((path) => {
              // Check if Heading import is already present
              const isTextImportPresent = path.node.specifiers.some(
                (node) => node.imported.name === 'Text',
              );

              // If Heading import is not present, update the "Title" import to use "Heading"
              if (!isTextImportPresent) {
                path.node.specifiers.push(j.importSpecifier(j.identifier('Text')));
              }

              return path.node;
            });
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
            red(`${file.path}:${sizeAttribute.loc?.start.line}:${node.loc.start.column}\n`),
          );
          return node;
        }

        if (!sizeAttribute) {
          node.openingElement.attributes.push(
            j.jsxAttribute(j.jsxIdentifier('size'), j.literal('large')),
          );

          return node;
        }

        // Maps to transform Title sizes to Heading sizes
        const titleToHeadingMap = {
          xlarge: '2xlarge',
          large: 'xlarge',
          medium: 'xlarge',
          small: 'large',
        };

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
      .find(j.ImportDeclaration, {
        source: {
          value: '@razorpay/blade/components',
        },
      })
      .find(j.ImportSpecifier, {
        imported: {
          name: 'Title',
        },
      })
      .replaceWith((path) => {
        // Check if Heading import is already present
        const isHeadingImportPresent = path.parent.value.specifiers.some(
          (node) => node.imported.name === 'Heading',
        );

        // If Heading import is not present, update the "Title" import to use "Heading"
        if (!isHeadingImportPresent) {
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
      .find(j.JSXElement, {
        openingElement: {
          name: {
            name: (name) =>
              ['Text', 'Title', 'Display', 'Heading', 'ProgressBar', 'CardHeaderText'].includes(
                name,
              ),
          },
        },
      })
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
      .find(j.JSXAttribute, {
        name: {
          name: (name) => name === 'type' || name === 'contrast',
        },
        value: {
          value: (value) => value !== 'high',
        },
      })
      .filter(
        (path, index, self) =>
          index === self.findIndex((obj) => path.node.start === obj.node.start),
      ) // remove any duplicates
      .remove();
  } catch (error) {
    console.error(
      red(
        `⛔️ ${file.path}: Oops! Ran into an issue while removing the "type" prop from Typography Components:`,
      ),
      `\n${red(error.stack)}\n`,
    );
  }

  // Change 'weight="bold"' to 'weight="semibold"' in Heading, Text, Display
  // Code still uses 'weight="bold"' and Title has been modified to the Heading Component
  try {
    typographyJSXElements
      .filter((path) =>
        ['Heading', 'Text', 'Display', 'CardHeaderText'].includes(
          path.value.openingElement.name.name,
        ),
      )
      .find(j.JSXAttribute, {
        name: {
          name: 'weight',
        },
        value: {
          value: 'bold',
        },
      })
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
}

export default migrateTypographyComponents;

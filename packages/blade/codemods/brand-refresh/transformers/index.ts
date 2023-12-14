import type { Transform, JSXAttribute, JSXExpressionContainer } from 'jscodeshift';
import colorTokensMapping from './colorTokensMapping';

const isExpression = (prop: unknown): prop is JSXExpressionContainer => {
  return (prop as JSXAttribute)?.value?.type === 'JSXExpressionContainer';
};

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
      // gets both .50 and ['50'] or ["50"]
      /(brand|feedback|action|static|white|badge|surface)\.?([aA-zZ0-9]+)\.?([aA-zZ0-9]+)\.?([a-z0-9]+)\.?([aA-zZ0-9]+)\.?([aA-zZ0-9]+)\.?([aA-zZ0-9]+)/g,
      (originalString) => {
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

  const j = api.jscodeshift;
  const root = j.withParser('tsx')(newSource);

  // Select Typography elements based on their names
  const typographyJSXElements = root
    .find(j.JSXElement)
    .filter((path) =>
      ['Text', 'Title', 'Code', 'Display', 'Heading'].includes(path.value.openingElement.name.name),
    );

  // Update <Heading size="large|medium"> to <Heading size="medium|small">,
  // <Heading size="small">, <Heading variant="regular"> to <Text size="large">, and
  // <Heading variant="subheading"> to <Text size="small">
  typographyJSXElements
    .filter((path) => path.value.openingElement.name.name === 'Heading')
    // replace with Heading
    .replaceWith((path) => {
      const { node } = path;

      const sizeAttribute = node.openingElement.attributes.find(
        (attribute) => attribute.name.name === 'size',
      );

      const variantAttribute = node.openingElement.attributes.find(
        (attribute) => attribute.name.name === 'variant',
      );

      const otherAttributes = node.openingElement.attributes.filter(
        (attribute) => attribute.name.name !== 'variant' && attribute.name.name !== 'size',
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
    .filter((path) => path.node.name.name === 'variant')
    .filter(
      (path, index, self) =>
        (path.node.name.name === 'size' || path.node.name.name === 'variant') &&
        index === self.findIndex((obj) => path.node.start === obj.node.start),
    ) // Filter by name `variant` and remove any duplicates
    .remove();

  // Replace Title with Heading and update the 'size' attribute
  // <Title size="medium"> to <Heading size="xlarge">
  typographyJSXElements
    .filter((path) => path.value.openingElement.name.name === 'Title')
    // replace with Heading
    .replaceWith((path) => {
      const { node } = path;

      node.openingElement.name.name = 'Heading';
      node.closingElement.name.name = 'Heading';

      const sizeAttribute = node.openingElement.attributes.find(
        (attribute) => attribute.name.name === 'size',
      );

      if (isExpression(sizeAttribute)) {
        console.log(
          'Expression found in size attribute, please update manually:',
          `${file.path}:${sizeAttribute.loc.start.line}`,
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
        (attribute) => attribute.name.name !== 'size',
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

  // Remove/Update the Title import from "@razorpay/blade/components"
  root
    .find(j.ImportDeclaration)
    .filter((path) => path.value.source.value === '@razorpay/blade/components')
    .find(j.ImportSpecifier)
    .filter((path) => path.value.imported.name === 'Title')
    .replaceWith((path) => {
      // Check if Heading import is already present
      const isHeadingImportPresent = path.parent.value.specifiers.some(
        (node) => node.imported.name === 'Heading',
      );
      // // If Heading import is not present, update the "Title" import to use "Heading"
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

  // Remove `type` prop from Typography Components
  typographyJSXElements
    .filter((path) => path.value.openingElement.name.name !== 'Code')
    .replaceWith((path) => {
      const { node } = path;

      const typeAttribute = node.openingElement.attributes.find(
        (attribute) => attribute.name.name === 'type',
      );

      const contrastAttribute = node.openingElement.attributes.find(
        (attribute) => attribute.name.name === 'contrast',
      );

      const colorAttribute = node.openingElement.attributes.find(
        (attribute) => attribute.name.name === 'color',
      );

      // If type and contrast are not present or color is present, return the node
      // if (colorAttribute || !(typeAttribute && contrastAttribute)) {
      //   return node;
      // }

      const typeValue = typeAttribute?.value.value || 'normal';
      const contrastValue = contrastAttribute?.value.value || 'low';

      const oldColorToken = `surface.text.${typeValue}.${contrastValue}Contrast`;
      const newColorToken = colorTokensMapping[oldColorToken];

      if (!colorAttribute && newColorToken) {
        node.openingElement.attributes?.push(
          j.jsxAttribute(j.jsxIdentifier('color'), j.literal(newColorToken)),
        );
      }

      return node;
    })
    .find(j.JSXAttribute) // Find all Heading props
    .filter(
      (path, index, self) =>
        (path.node.name.name === 'type' || path.node.name.name === 'contrast') &&
        index === self.findIndex((obj) => path.node.start === obj.node.start),
    ) // Filter by name `type` and remove any duplicates
    .remove();

  // Change 'weight="bold"' to 'weight="semibold"' in Heading, Text, Display
  // Code still uses 'weight="bold"' and Title has been modified to the Heading Component
  typographyJSXElements
    .filter((path) => ['Heading', 'Text', 'Display'].includes(path.value.openingElement.name.name))
    .find(j.JSXAttribute)
    .filter((path) => path.node.name.name === 'weight' && path.node.value.value === 'bold')
    .replaceWith((path) => {
      path.node.value.value = 'semibold';
      return path.node;
    });

  // Return the updated source code
  return root.toSource(options.printOptions);
};

export default transformer;

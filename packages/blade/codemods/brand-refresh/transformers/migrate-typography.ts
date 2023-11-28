import type { Transform, JSXAttribute, JSXExpressionContainer } from 'jscodeshift';

const isExpression = (prop: unknown): prop is JSXExpressionContainer => {
  return (prop as JSXAttribute)?.value?.type === 'JSXExpressionContainer';
};

const transformer: Transform = (file, api, options) => {
  const titleToHeadingMap = {
    xlarge: '2xlarge',
    large: 'xlarge',
    medium: 'xlarge',
    small: 'large',
  };

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
  const newSource = file.source
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

  const typographyJSXElements = root
    .find(j.JSXElement)
    .filter((path) =>
      ['Text', 'Title', 'Code', 'Display', 'Heading'].includes(path.value.openingElement.name.name),
    );

  // Change <Title size="medium"> to <Heading size="xlarge">
  typographyJSXElements
    .filter((path) => path.value.openingElement.name.name === 'Title')
    // replace with Heading
    .replaceWith((path) => {
      const { node } = path;

      node.openingElement.name.name = 'Heading';
      node.closingElement.name.name = 'Heading';

      return node;
    })
    .find(j.JSXAttribute)
    .filter((path) => path.node.name.name === 'size')
    .replaceWith((path) => {
      if (isExpression(path.node)) return path.node;

      path.node.value.value = titleToHeadingMap[path.node.value.value] || 'large';

      return path.node;
    });

  // Remove/Update the Title import from "@razorpay/blade/components"
  root
    .find(j.ImportDeclaration)
    .filter((path) => path.value.source.value === '@razorpay/blade/components')
    .find(j.ImportSpecifier)
    .filter((path) => path.value.imported.name === 'Title')
    .replaceWith((path) => {
      const isHeadingImportPresent = path.parent.value.specifiers.some(
        (node) => node.imported.name === 'Heading',
      );
      // Remove the Title import if isHeadingImportPresent is true, otherwise change Title to Heading
      if (!isHeadingImportPresent) {
        path.value.imported.name = 'Heading';
      } else {
        path.parent.value.specifiers = path.parent.value.specifiers.filter(
          (node) => node.imported.name !== 'Title',
        );
      }

      return path.node;
    });

  // `type=` prop will be removed from Typography Components
  typographyJSXElements
    .find(j.JSXAttribute) // Find all JSX props
    .filter(
      (path, index, self) =>
        path.node.name.name === 'type' &&
        index === self.findIndex((obj) => path.node.start === obj.node.start),
    ) // Filter by name `type` and remove any duplicates
    .remove();

  // `variant=` prop will be removed from Heading Component
  typographyJSXElements
    .filter((path) => path.value.openingElement.name.name === 'Heading')
    .find(j.JSXAttribute) // Find all Heading props
    .filter(
      (path, index, self) =>
        path.node.name.name === 'variant' &&
        index === self.findIndex((obj) => path.node.start === obj.node.start),
    ) // Filter by name `type` and remove any duplicates
    .remove();

  // weight=”bold” to weight=”semibold” in Heading, Text, Display
  typographyJSXElements
    .filter((path) => ['Heading', 'Text', 'Display'].includes(path.value.openingElement.name.name))
    .find(j.JSXAttribute)
    .filter((path) => path.node.name.name === 'weight' && path.node.value.value === 'bold')
    .replaceWith((path) => {
      path.node.value.value = 'semibold';
      return path.node;
    });

  return root.toSource(options.printOptions);
};

export default transformer;

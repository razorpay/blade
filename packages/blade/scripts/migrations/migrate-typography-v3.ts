export default function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const importVal = root.find(j.ImportDeclaration, {
    source: {
      type: 'Literal',
      value: '@razorpay/blade/components',
    },
  });

  const isBladeImported = importVal.__paths[0]?.value;

  if (!isBladeImported) {
    return root.toSource();
  }
  // Title: Rename `variant` -> `size`
  root
    .findJSXElements('Title')
    .find(j.JSXAttribute, {
      name: {
        type: 'JSXIdentifier',
        name: 'variant',
      },
    })
    .forEach((jsxAttribute) => {
      const identifier = jsxAttribute.node.name;
      identifier.name = 'size';
    });

  // Heading: Rename `variant` -> `size` if value is `small` `medium` or `large`
  root
    .findJSXElements('Heading')
    .find(j.JSXAttribute, {
      name: {
        type: 'JSXIdentifier',
        name: 'variant',
      },
    })
    .forEach((jsxAttribute) => {
      const identifier = jsxAttribute.node.name;
      const value = jsxAttribute.node.value.value;
      if (['small', 'medium', 'large'].includes(value)) {
        identifier.name = 'size';
      }
    });

  return root.toSource();
}

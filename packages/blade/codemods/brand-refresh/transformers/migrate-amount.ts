import { red, isExpression } from './utils';

// Amount component: changes to intent, size, & prefix props
function migrateAmountComponent({ root, j, file }): void {
  try {
    // <Amount size=”heading-small-bold”> -> <Amount type=”heading” size=”small” weight=”semibold”>
    root
      .find(j.JSXElement, {
        openingElement: {
          name: {
            name: (name) => ['Amount', 'CardHeaderAmount'].includes(name),
          },
        },
      })
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
            red(`${file.path}:${sizeAttribute?.loc?.start.line}:${node.loc.start.column}\n`),
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
  } catch (error) {
    console.error(
      red(
        `⛔️ ${file.path}: Oops! Ran into an issue while updating the "size" prop in "Amount" component.`,
      ),
      `\n${red(error.stack)}\n`,
    );
  }

  // <Amount intent=”positive”> -> <Amount color="feedback.text.positive.intense">
  try {
    root
      .find(j.JSXElement, {
        openingElement: {
          name: {
            name: (name) => ['Amount', 'CardHeaderAmount'].includes(name),
          },
        },
      })
      .find(j.JSXAttribute, {
        name: {
          name: (name) => name === 'intent',
        },
      })
      .replaceWith((path) => {
        const { node } = path;

        node.name.name = 'color';
        node.value.value = `feedback.text.${node.value.value}.intense`;

        return node;
      });
  } catch (error) {
    console.error(
      red(
        `⛔️ ${file.path}: Oops! Ran into an issue while updating the "intent" prop in "Amount" component.`,
      ),
      `\n${red(error.stack)}\n`,
    );
  }

  // <Amount prefix=”currency-symbol”> -> <Amount currencyIndicator=”currency-symbol”>
  try {
    root
      .find(j.JSXElement, {
        openingElement: {
          name: {
            name: (name) => ['Amount', 'CardHeaderAmount'].includes(name),
          },
        },
      })
      .find(j.JSXAttribute, {
        name: {
          name: (name) => name === 'prefix',
        },
      })
      .replaceWith((path) => {
        const { node } = path;

        node.name.name = 'currencyIndicator';

        return node;
      });
  } catch (error) {
    console.error(
      red(
        `⛔️ ${file.path}: Oops! Ran into an issue while updating the "prefix" prop in "Amount" component.`,
      ),
      `\n${red(error.stack)}\n`,
    );
  }
}

export default migrateAmountComponent;

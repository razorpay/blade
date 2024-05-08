import type { Transform } from 'jscodeshift';

import { red, isExpression } from '../../brand-refresh/transformers/utils';

const transformer: Transform = (file, api, options) => {
  // Don't transform if the file doesn't import `@razorapy/blade/components` because it's not using Blade components
  // Allow the migration test file to be transformed
  if (!file.source.includes('@razorpay/blade/components') && file.path !== undefined) {
    return file.source;
  }

  const j = api.jscodeshift;
  const root = j.withParser('tsx')(file.source);

  // Add type prop if variant prop is not defined
  try {
    root
      .find(j.JSXElement, {
        openingElement: {
          name: {
            name: 'ProgressBar',
          },
        },
      })
      .replaceWith(({ node }) => {
        const variantAttribute = node.openingElement.attributes.find(
          (attribute) => attribute.name?.name === 'variant',
        );

        if (!variantAttribute) {
          node.openingElement.attributes?.push(
            j.jsxAttribute(j.jsxIdentifier('type'), j.literal('progress')),
          );
        }

        return node;
      });
  } catch (error) {
    console.error(
      red(
        `⛔️ ${file.path}: Oops! Ran into an issue while adding the "type" prop to the ProgressBar component.`,
      ),
      `\n${red(error.stack)}\n`,
    );
  }

  // Update the variant prop to type prop if defined
  try {
    root
      .find(j.JSXElement, {
        openingElement: {
          name: {
            name: 'ProgressBar',
          },
        },
      })
      .find(j.JSXAttribute, {
        name: {
          name: 'variant',
        },
      })
      .replaceWith(({ node }) => {
        if (isExpression(node)) {
          console.warn(
            red('\n⛔️ Expression found in the "variant" attribute, please update manually:'),
            red(`${file.path}:${node.loc?.start.line}:${node.loc.start.column}\n`),
          );
          return node;
        }

        if (node.value?.value === 'progress' || node.value?.value === 'meter') {
          node.name.name = 'type';
        }

        return node;
      });
  } catch (error) {
    console.error(
      red(
        `⛔️ ${file.path}: Oops! Ran into an issue while updating the "variant" prop  of the ProgressBar component.`,
      ),
      `\n${red(error.stack)}\n`,
    );
  }

  return root.toSource(options.printOptions);
};

export default transformer;

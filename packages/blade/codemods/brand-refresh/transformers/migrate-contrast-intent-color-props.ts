import { red } from './utils';

function migrateContrastIntentAndColorProps({ root, j, file }): void {
  // Break `contrast="high"` prop from Typography & ProgressBar Components
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
      .find(j.JSXAttribute)
      .filter(
        (path, index, self) =>
          ['Text', 'Title', 'Display', 'Heading', 'ProgressBar', 'CardHeaderText'].includes(
            path.parent.value.name.name,
          ) &&
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

  // Bade/Counter/IconButton/Alert Components: Change `contrast` prop to `emphasis`
  try {
    root
      .find(j.JSXElement, {
        openingElement: {
          name: {
            name: (name) =>
              [
                'Badge',
                'Counter',
                'IconButton',
                'Alert',
                'CardHeaderBadge',
                'CardHeaderCounter',
              ].includes(name),
          },
        },
      })
      .find(j.JSXAttribute, {
        name: {
          name: 'contrast',
        },
      })
      .replaceWith((path) => {
        path.node.name.name = 'emphasis';

        const contrastToEmphasisMap = {
          alert: {
            low: 'subtle',
            high: 'intense',
          },
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

  // Spinner: Change `contrast` prop to `color`
  // <Spinner contrast="low|high" /> -> <Spinner color="primary|white" />
  try {
    root
      .find(j.JSXElement, {
        openingElement: {
          name: {
            name: 'Spinner',
          },
        },
      })
      .find(j.JSXAttribute, {
        name: {
          name: 'contrast',
        },
      })
      .replaceWith((path) => {
        path.node.name.name = 'color';

        const contrastToColorMap = {
          high: 'white',
          low: 'primary',
        };

        path.node.value.value = contrastToColorMap[path.node.value.value];

        return path.node;
      });
  } catch (error) {
    console.error(
      red(
        `⛔️ ${file.path}: Oops! Ran into an issue while updating the "contrast" prop in Spinner.`,
      ),
      `\n${red(error.stack)}\n`,
    );
  }

  // Remove 'contrast' prop from the Skeleton Component
  try {
    root
      .find(j.JSXElement, {
        openingElement: {
          name: {
            name: 'Skeleton',
          },
        },
      })
      .find(j.JSXAttribute, {
        name: {
          name: 'contrast',
        },
      })
      .remove();
  } catch (error) {
    console.error(
      red(
        `⛔️ ${file.path}: Oops! Ran into an issue while removing the "contrast" prop from Skeleton.`,
      ),
      `\n${red(error.stack)}\n`,
    );
  }

  // Remove deprecated 'intent'/'variant' props in favor of color
  try {
    root
      .find(j.JSXElement, {
        openingElement: {
          name: {
            name: (name) =>
              [
                'Alert',
                'Badge',
                'Counter',
                'Chip',
                'ChipGroup',
                'Indicator',
                'ProgressBar',
                'CardHeaderBadge',
                'CardHeaderCounter',
              ].includes(name),
          },
        },
      })
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
      .find(j.JSXAttribute, {
        name: {
          name: (name) => name === 'intent' || name === 'variant',
        },
      })
      // Remove duplicate intent/variant props
      .filter(
        (path, index, self) =>
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

  // Change color="default" to color="primary" in Button/Link/Badge/Counter/Chip/ChipGroup/Spinner
  // <Button variant="secondary" color="default"> -> <Button variant="secondary" color="primary">
  try {
    root
      .find(j.JSXElement, {
        openingElement: {
          name: {
            name: (name) =>
              [
                'Button',
                'Link',
                'Badge',
                'Counter',
                'Chip',
                'ChipGroup',
                'CardHeaderBadge',
                'CardHeaderCounter',
                'CardHeaderIconButton',
                'CardHeaderLink',
                'Spinner',
              ].includes(name),
          },
        },
      })
      .find(j.JSXAttribute, {
        name: {
          name: 'color',
        },
        value: {
          value: 'default',
        },
      })
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
}

export default migrateContrastIntentAndColorProps;

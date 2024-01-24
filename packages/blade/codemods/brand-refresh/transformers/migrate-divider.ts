import { red } from './utils';

// Divider component migration: Change the variant prop value from “normal” to “muted”
// <Divider variant=”normal”> -> <Divider variant=”muted”>
function migrateDividerComponent({ root, j, file }): void {
  try {
    root
      .find(j.JSXElement, {
        openingElement: {
          name: {
            name: 'Divider',
          },
        },
      })
      .find(j.JSXAttribute, {
        name: {
          name: 'variant',
        },
        value: {
          value: 'normal',
        },
      })
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
}

export default migrateDividerComponent;

import { red } from './utils';

// Divider component <Divider variant=”normal”> -> <Divider variant=”muted”>
function migrateDividerComponent({ root, j, file }): void {
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
}

export default migrateDividerComponent;

import { red } from './utils';

// Badge component Migration, remove the `fortWeight` prop
function migrateBadgeComponent({ root, j, file }): void {
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
}

export default migrateBadgeComponent;

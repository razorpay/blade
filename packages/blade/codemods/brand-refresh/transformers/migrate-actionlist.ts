import { red } from './utils';

function migrateActionListComponent({ root, j, file }): void {
  // ActionList component: Remove surfaceLevel prop
  // <ActionList surfaceLevel={2}> -> <ActionList >
  try {
    root
      .find(j.JSXElement)
      .filter((path) => path.value.openingElement.name.name === 'ActionList')
      .find(j.JSXAttribute)
      .filter((path) => path.node.name.name === 'surfaceLevel')
      .remove();
  } catch (error) {
    console.error(
      red(
        `⛔️ ${file.path}: Oops! Ran into an issue while removing the "surfaceLevel" prop from "ActionList".`,
      ),
      `\n${red(error.stack)}\n`,
    );
  }
}

export default migrateActionListComponent;

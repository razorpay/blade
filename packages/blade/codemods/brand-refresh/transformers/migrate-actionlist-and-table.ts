import { red } from './utils';

function migrateActionListAndTable({ root, j, file }): void {
  // ActionList & Table components: Remove the `surfaceLevel` prop
  // <ActionList surfaceLevel={2}> -> <ActionList >
  // <Table surfaceLevel={2}> -> <Table >
  try {
    root
      .find(j.JSXElement)
      .filter(
        (path) =>
          path.value.openingElement.name.name === 'ActionList' ||
          path.value.openingElement.name.name === 'Table',
      )
      .find(j.JSXAttribute)
      .filter((path) => path.node.name.name === 'surfaceLevel')
      .remove();
  } catch (error) {
    console.error(
      red(
        `⛔️ ${file.path}: Oops! Ran into an issue while removing the "surfaceLevel" prop from "ActionList"/"Table".`,
      ),
      `\n${red(error.stack)}\n`,
    );
  }
}

export default migrateActionListAndTable;

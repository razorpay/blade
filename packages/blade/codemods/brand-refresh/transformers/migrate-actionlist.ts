import { red } from './utils';

function migrateActionListComponent({ root, j, file }): void {
  // ActionList & Table components: Remove the `surfaceLevel` prop
  // <ActionList surfaceLevel={2}> -> <ActionList >
  // <Table surfaceLevel={2}> -> <Table >
  try {
    root
      .find(j.JSXElement, {
        openingElement: {
          name: {
            name: 'ActionList',
          },
        },
      })
      .find(j.JSXAttribute, {
        name: {
          name: 'surfaceLevel',
        },
      })
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

export default migrateActionListComponent;

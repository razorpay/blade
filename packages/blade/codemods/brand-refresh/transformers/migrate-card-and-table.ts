import { red } from './utils';

// Card & Table components Migration
// <Card surfaceLevel={2|3} > -> <Card backgroundColor=”surface.background.gray.moderate”|surface.background.gray.intense>
// <Table surfaceLevel={2|3} > -> <Table backgroundColor=”surface.background.gray.subtle|surface.background.gray.moderate|surface.background.gray.intense”>
function migrateCardAndTable({ root, j, file }): void {
  try {
    root
      .find(j.JSXElement)
      .filter((path) => ['Card', 'Table'].includes(path.value.openingElement.name.name))
      .find(j.JSXAttribute)
      .filter((path) => path.node.name.name === 'surfaceLevel')
      .replaceWith((path) => {
        const { node } = path;

        const surfaceLevelMap = {
          1: 'surface.background.subtle',
          2: 'surface.background.gray.moderate',
          3: 'surface.background.gray.intense',
        };

        node.name.name = 'backgroundColor';

        node.value = j.literal(surfaceLevelMap[node.value.expression.value]);

        delete node.value.expression;

        return node;
      });
  } catch (error) {
    console.error(
      red(`⛔️ ${file.path}: Oops! Ran into an issue while updating the Card component.`),
      `\n${red(error.stack)}\n`,
    );
  }
}

export default migrateCardAndTable;

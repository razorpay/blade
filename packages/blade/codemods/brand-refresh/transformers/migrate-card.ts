import { red } from './utils';

// Card component Migration
// <Card surfaceLevel={2|3} > -> <Card backgroundColor=”surface.background.gray.intense|surface.background.gray.moderate”>
function migrateCardComponent({ root, j, file }): void {
  try {
    root
      .find(j.JSXElement)
      .filter((path) => ['Card'].includes(path.value.openingElement.name.name))
      .find(j.JSXAttribute)
      .filter((path) => path.node.name.name === 'surfaceLevel')
      .replaceWith((path) => {
        const { node } = path;

        const surfaceLevelMap = {
          2: 'surface.background.gray.intense',
          3: 'surface.background.gray.moderate',
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

export default migrateCardComponent;

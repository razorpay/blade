import { red } from './utils';

// Badge component Migration, remove the `fontWeight` prop
function migrateBadgeComponent({ root, j, file }): void {
  try {
    root
      .find(j.JSXElement, {
        openingElement: {
          name: {
            name: (name) => ['Badge', 'CardHeaderBadge'].includes(name),
          },
        },
      })
      .find(j.JSXAttribute, {
        name: {
          name: 'fontWeight',
        },
      })
      .remove();
  } catch (error) {
    console.error(
      red(`⛔️ ${file.path}: Oops! Ran into an issue while removing the fontWeight prop.`),
      `\n${red(error.stack)}\n`,
    );
  }
}

export default migrateBadgeComponent;

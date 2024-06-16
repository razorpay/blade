import { red } from './utils';

function migrateDropdownComponent({ root, j, file }): void {
  // Dropdown component: Remove onDismiss prop in favor of onOpenChange
  // <Dropdown onDismiss={() => console.log('dismissed')}> ->
  // <Dropdown
  //    onOpenChange={(isOpen) => {
  //        if (!isOpen) {
  //         console.log('dismissed');
  //     }
  // >
  try {
    root
      .find(j.JSXElement, {
        openingElement: {
          name: {
            name: 'Dropdown',
          },
        },
      })
      .find(j.JSXAttribute, {
        name: {
          name: 'onDismiss',
        },
      })
      .replaceWith((path) => {
        const { node } = path;

        node.name.name = 'onOpenChange';

        // If the onDismiss prop is a function, we need to wrap the function body in an if statement that checks if the dropdown is open or not
        // If the onDismiss prop is not a function, but a variable reference, we need to call the variable reference without arguments
        // Following are the different ways the onDismiss prop can be defined:
        // onDismiss={handleDismiss}
        //      -> onOpenChange={(isOpen) => { if (!isOpen) { handleDismiss() } }}
        // onDismiss={() => console.log("Dismissed!!!")}
        //      -> onOpenChange={(isOpen) => { if (!isOpen) { console.log("Dismissed!!!") } }}
        // onDismiss={function () { console.log("Dismissed!!!") }}
        //      -> onOpenChange={(isOpen) => { if (!isOpen) { console.log("Dismissed!!!") } }}
        // onDismiss={() => { console.log("Dismissed!!!") }}
        //      -> onOpenChange={(isOpen) => { if (!isOpen) { console.log("Dismissed!!!") } }}
        let isOpenIfBlockStatement = j.blockStatement([
          j.expressionStatement(j.callExpression(node.value.expression, [])),
        ]);

        // If the onDismiss prop is arrow function or function expression
        if (
          j.ArrowFunctionExpression.check(node.value.expression) ||
          j.FunctionExpression.check(node.value.expression)
        ) {
          // If the function body is a block statement, we can just use that
          if (node.value.expression.body.type === 'BlockStatement') {
            isOpenIfBlockStatement = node.value.expression.body;
          } else {
            // If the function body is not a block statement, we need to wrap it in one
            isOpenIfBlockStatement = j.blockStatement([
              j.expressionStatement(node.value.expression.body),
            ]);
          }
        }

        node.value.expression = j.arrowFunctionExpression(
          [j.identifier('isOpen')],
          j.blockStatement([
            j.ifStatement(j.unaryExpression('!', j.identifier('isOpen')), isOpenIfBlockStatement),
          ]),
        );

        return node;
      });
  } catch (error) {
    console.error(
      red(
        `⛔️ ${file.path}: Oops! Ran into an issue while updating the "onDismiss" prop in the "Dropdown" component.`,
      ),
      `\n${red(error.stack)}\n`,
    );
  }
}

export default migrateDropdownComponent;

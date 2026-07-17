import showNotification from './showNotification';

const COMPONENT_TOKENS_COLLECTION = 'screenSize';

const makeDevTokenNames = async (): Promise<void> => {
  // set code syntax for all the variables but component variables
  const variables = await figma.variables.getLocalVariablesAsync();
  variables.forEach((variable) => {
    variable.setVariableCodeSyntax(
      'WEB',
      variable.name
        .replace(/\//g, '.')
        .replace(/\.[0-9]+/, (matchedString) => `[${matchedString.replace('.', '')}]`),
    );
  });

  // set code syntax for component variables
  const scopesToFilter = ['CORNER_RADIUS', 'GAP', 'STROKE_FLOAT'];

  const componentTokensCollection = (await figma.variables.getLocalVariableCollectionsAsync()).find(
    (collection) => collection.name === COMPONENT_TOKENS_COLLECTION,
  );

  if (!componentTokensCollection) {
    showNotification({
      figma,
      type: 'error',
      text: `⛔️ Could not find the "${COMPONENT_TOKENS_COLLECTION}" variable collection in this file.`,
    });
    return;
  }

  const variablesToSetCodeSyntaxFor: Variable[] = [];
  for (const variableId of componentTokensCollection.variableIds) {
    const variable = await figma.variables.getVariableByIdAsync(variableId);
    if (variable && scopesToFilter.includes(variable.scopes[0])) {
      variablesToSetCodeSyntaxFor.push(variable);
    }
  }

  for (const variable of variablesToSetCodeSyntaxFor) {
    const variableModeValue = await figma.variables.getVariableByIdAsync(
      // @ts-expect-error because valuesByMode can be undefined and bunch of other things that is not worthy to put conditions for hence ignoring because for our dataset it will always be true
      variable.valuesByMode[Object.keys(variable.valuesByMode)[0]].id,
    );

    let tokenName = '';

    if (variableModeValue) {
      if (variableModeValue.name.includes('Radius')) {
        tokenName = `border.radius.${variableModeValue.name.split('/').pop()}`;
        // set the syntax for border radius
      } else if (variableModeValue.name.includes('Width')) {
        // set the syntax for border width
        tokenName = `border.width.${variableModeValue.name.split('/').pop()}`;
      } else if (variableModeValue.name.includes('spacing')) {
        // set the syntax for spacing
        tokenName = variableModeValue.name
          .replace(/\//g, '.')
          .replace(/\.[0-9]+/, (matchedString) => `[${matchedString.replace('.', '')}]`);
      }
    }

    if (tokenName) {
      variable.setVariableCodeSyntax('WEB', tokenName);
    }
  }

  showNotification({
    figma,
    type: 'success',
    text: '✅ Dev friendly token names generated!',
  });
};

export default makeDevTokenNames;

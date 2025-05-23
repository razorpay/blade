import showNotification from './showNotification';

const COMPONENT_TOKENS_COLLECTION = 'screenSize';

const makeDevTokenNames = (): void => {
  // set code syntax for all the variables but component variables
  const variables = figma.variables.getLocalVariables();
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

  const componentTokensCollection = figma.variables
    .getLocalVariableCollections()
    .find((collection) => collection.name === COMPONENT_TOKENS_COLLECTION);

  const variablesToSetCodeSyntaxFor = componentTokensCollection.variableIds
    .map((variableId) => {
      const variable = figma.variables.getVariableById(variableId);
      if (scopesToFilter.includes(variable.scopes[0])) {
        return variable;
      }
      return null;
    })
    .filter(Boolean);

  variablesToSetCodeSyntaxFor.forEach((variable) => {
    const variableModeValue = figma.variables.getVariableById(
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
  });

  showNotification({
    figma,
    type: 'success',
    text: '✅ Dev friendly token names generated!',
  });
};

export default makeDevTokenNames;

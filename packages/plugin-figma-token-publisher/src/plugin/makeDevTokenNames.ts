import showNotification from './showNotification';

const makeDevTokenNames = (): void => {
  const variables = figma.variables.getLocalVariables();
  variables.forEach((variable) => {
    variable.setVariableCodeSyntax(
      'WEB',
      variable.name
        .replace(/\//g, '.')
        .replace(/\.[0-9]+/, (matchedString) => `[${matchedString.replace('.', '')}]`),
    );
  });
  showNotification({
    figma,
    type: 'information',
    text: '✅ Dev friendly token names generated!',
  });
};

export default makeDevTokenNames;

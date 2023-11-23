import showNotification from './showNotification';

const makeDevTokenNames = (): void => {
  const variables = figma.variables.getLocalVariables();
  console.log('runningg');
  variables.forEach((variable) => {
    console.log(variable.name, variable.name.replace(/\//g, '.'));
    variable.setVariableCodeSyntax('WEB', variable.name.replace(/\//g, '.'));
  });
  showNotification({
    figma,
    type: 'information',
    text: '✅ Dev friendly token names generated!',
  });
};

export default makeDevTokenNames;

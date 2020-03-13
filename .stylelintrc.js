module.exports = {
  processors: ['stylelint-processor-styled-components'],
  extends: ['stylelint-config-recommended', 'stylelint-config-styled-components'],
  rules: {
    'property-no-unknown': [
      true,
      {
        ignoreProperties: ['shadow-color', 'shadow-offset', 'shadow-radius', 'shadow-opacity'], // stylelint does not understand these react-native properties
      },
    ],
  },
};

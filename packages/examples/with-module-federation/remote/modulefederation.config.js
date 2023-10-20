// eslint-disable-next-line import/extensions
const { dependencies } = require('./package.json');

module.exports = {
  name: 'remote',
  exposes: {
    './Button': './src/bootstrap',
  },
  filename: 'remoteEntry.js',
  shared: {
    ...dependencies,
    react: {
      singleton: true,
      requiredVersion: dependencies['react'],
    },
    '@razorpay/blade': {
      requiredVersion: dependencies['@razorpay/blade'],
      singleton: true,
    },
    'styled-components': {
      requiredVersion: dependencies['styled-components'],
      singleton: true,
    },
    'react-dom': {
      singleton: true,
      requiredVersion: dependencies['react-dom'],
    },
  },
};

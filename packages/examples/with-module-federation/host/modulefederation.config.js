const { dependencies } = require('./package.json');

module.exports = {
  name: 'host',
  remotes: {
    remote: 'remote@http://localhost:3002/remoteEntry.js',
  },
  shared: {
    ...dependencies,
    react: {
      singleton: true,
      requiredVersion: dependencies['react'],
    },
    '@razorpay/blade': {
      requiredVersion: dependencies['@razorpay/blade'],
      version: dependencies['@razorpay/blade'],
      singleton: false,
    },
    'styled-components': {
      requiredVersion: dependencies['styled-components'],
      version: dependencies['styled-components'],
      singleton: false,
    },
    'react-dom': {
      singleton: true,
      requiredVersion: dependencies['react-dom'],
    },
  },
};

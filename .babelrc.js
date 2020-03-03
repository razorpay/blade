module.exports = {
  env: {
    development: {
      presets: ['module:metro-react-native-babel-preset'],
      plugins: [
        [
          'module-resolver',
          {
            alias: {
              '@storybook/react': '@storybook/react-native',
            },
          },
        ],
      ],
    },
    production: {
      presets: ['module:metro-react-native-babel-preset'],
      plugins: [
        [
          'module-resolver',
          {
            alias: {
              '@storybook/react': '@storybook/react-native',
            },
          },
        ],
      ],
    },
    'web-test': {
      presets: ['@babel/preset-env', '@babel/preset-react'],
      plugins: [
        [
          'babel-plugin-styled-components',
          {
            displayName: true,
            pure: true,
            ssr: true,
          },
        ],
      ],
    },
    'web-development': {
      presets: [['@babel/preset-env', { modules: false }], '@babel/preset-react'],
      plugins: [
        [
          'babel-plugin-styled-components',
          {
            displayName: true,
            pure: false,
            ssr: true,
          },
        ],
      ],
    },
    'web-production': {
      presets: [['@babel/preset-env', { modules: false }], '@babel/preset-react'],
      plugins: [
        [
          'babel-plugin-styled-components',
          {
            displayName: true,
            pure: true,
            ssr: true,
          },
        ],
      ],
    },
  },
};

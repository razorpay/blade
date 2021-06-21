module.exports = {
  env: {
    development: {
      presets: ['@babel/preset-typescript', 'module:metro-react-native-babel-preset'],
      plugins: [
        [
          'module-resolver',
          {
            alias: {
              '@storybook/react': '@storybook/react-native',
            },
          },
        ],
        [
          '@babel/plugin-transform-react-jsx',
          {
            runtime: 'automatic',
          },
        ],
      ],
    },
    production: {
      presets: [
        '@babel/preset-typescript',
        ['module:metro-react-native-babel-preset', { disableImportExportTransform: true }],
      ],
      plugins: [
        [
          'module-resolver',
          {
            alias: {
              '@storybook/react': '@storybook/react-native',
            },
          },
        ],
        [
          '@babel/plugin-transform-react-jsx',
          {
            runtime: 'automatic',
          },
        ],
        // [
        //   '@babel/plugin-transform-runtime',
        //   {
        //     corejs: 3,
        //     helpers: true,
        //     regenerator: true,
        //   },
        // ],
      ],
    },
    'web-test': {
      presets: [
        '@babel/preset-env',
        '@babel/preset-typescript',
        ['@babel/preset-react', { runtime: 'automatic' }],
      ],
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
      presets: [
        ['@babel/preset-env', { modules: false }],
        '@babel/preset-typescript',
        ['@babel/preset-react', { runtime: 'automatic' }],
      ],
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
      presets: [
        ['@babel/preset-env', { modules: false }],
        '@babel/preset-typescript',
        ['@babel/preset-react', { runtime: 'automatic' }],
      ],
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

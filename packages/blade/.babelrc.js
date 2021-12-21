const configs = {
  reactNative: {
    test: {
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
      ],
    },
  },
  react: {
    test: {
      presets: [
        '@babel/preset-env',
        '@babel/preset-typescript',
        ['@babel/preset-react', { runtime: 'automatic' }],
      ],
      plugins: [
        [
          '@babel/plugin-transform-runtime',
          {
            corejs: 3,
            helpers: true,
            regenerator: true,
          },
        ],
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
    development: {
      presets: [
        ['@babel/preset-env', { modules: false, loose: true }],
        '@babel/preset-typescript',
        ['@babel/preset-react', { runtime: 'automatic' }],
      ],
      plugins: [
        [
          '@babel/plugin-transform-runtime',
          {
            corejs: 3,
            helpers: true,
            regenerator: true,
          },
        ],
        [
          'babel-plugin-styled-components',
          {
            displayName: true,
            pure: false,
            ssr: true,
          },
        ],
        // ['react-hot-loader/babel', { skipEnvCheck: true }],
      ],
    },
    production: {
      presets: [
        ['@babel/preset-env', { modules: false }],
        '@babel/preset-typescript',
        ['@babel/preset-react', { runtime: 'automatic' }],
      ],
      plugins: [
        [
          '@babel/plugin-transform-runtime',
          {
            corejs: 3,
            helpers: true,
            regenerator: true,
          },
        ],
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

const framework = process.env.FRAMEWORK;
if (framework === 'REACT') {
  module.exports = { env: configs.react };
} else if (framework === 'REACT_NATIVE') {
  module.exports = { env: configs.reactNative };
} else {
  throw new Error(
    `Blade requires "FRAMEWORK" environment variable to be set. Valid values are "REACT" and "REACT_NATIVE". Instead, received: ${JSON.stringify(
      framework,
    )}`,
  );
}

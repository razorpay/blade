const path = require('path');

module.exports = {
  entry: './src/components/index.ts', // Specify the entry point of your application
  experiments: {
    outputModule: true,
  },
  output: {
    path: path.resolve(__dirname, 'webpack-build/components'), // Specify the output directory
    filename: 'index.production.js', // Specify the output filename
    module: true,
  },
  mode: 'production',
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
  module: {
    rules: [
      // Add any necessary loaders for your project (e.g., Babel for transpiling JavaScript)
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  resolve: {
    modules: [
      'node_modules',
      // Since the utils are not transpiled, we need to explicitly mention it to webpack to transpile them
      // and not to ignore them like any other node_modules
      `${path.resolve(__dirname, './node_modules/@razorpay/universe-utils')}`, // the path to the universe-utils package
    ],
    alias: {
      '~utils': path.resolve(__dirname, './src/utils/'),
      '~components': path.resolve(__dirname, './src/components/'),
      '~tokens': path.resolve(__dirname, './src/tokens/'),
      '~src': path.resolve(__dirname, './src/'),
    },
    extensions: [
      '.wasm',
      '.desktop.ts',
      '.web.ts',
      '.ts',
      '.desktop.tsx',
      '.web.tsx',
      '.tsx',
      '.desktop.jsx',
      '.web.jsx',
      '.jsx',
      '.mjs',
      '.desktop.js',
      '.web.js',
      '.js',
      '.json',
    ],
  },
  // Add any necessary plugins or other configuration options for your project
};

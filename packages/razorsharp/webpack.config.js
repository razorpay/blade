const path = require('path');

const webpack = require('webpack');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

/** @type {import('webpack').Configuration} */
module.exports = {
  mode: prod ? 'production' : 'development',

  // This is necessary because Figma's 'eval' works differently than normal eval
  devtool: prod ? false : 'inline-source-map',

  entry: {
    code: './src/code/index.ts', // The entry point for your plugin code
  },

  module: {
    rules: [
      // Converts TypeScript code to JavaScript
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },

  // Webpack tries these extensions for you if you omit the extension like "import './file'"
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.web.js'],
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'), // Compile into a folder called "dist"
    clean: true,
    publicPath: '/',
  },

  // Tells Webpack to generate "ui.html" and to inline "ui.ts" into it
  plugins: [
    new webpack.DefinePlugin({
      global: {}, // Fix missing symbol error when running in developer VM
    }),
  ],

  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
    cacheDirectory: path.resolve(__dirname, `./node_modules/.cache/webpack`),
  },
};

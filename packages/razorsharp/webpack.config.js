const path = require('path');
const InlineChunkHtmlPlugin = require('inline-chunk-html-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpack = require('webpack');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

/** @type {import('webpack').Configuration} */
module.exports = {
  mode: prod ? 'production' : 'development',

  // This is necessary because Figma's 'eval' works differently than normal eval
  devtool: prod ? false : 'inline-source-map',

  entry: {
    ui: './src/ui/index.tsx', // The entry point for your UI code
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

      // Enables including CSS by doing "import './file.css'" in your TypeScript code
      {
        // include files ending in .css but not .module.css
        test: /^(?!.*\.module\.css$).*\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      // include files ending in .module.css
      {
        test: /\.module\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
            },
          },
        ],
      },
      // Allows you to use "<%= require('./file.svg') %>" in your HTML code to get a data URI
      // { test: /\.(png|jpg|gif|webp|svg|zip)$/i, loader: [{ loader: 'url-loader' }] },
      {
        test: /\.svg/,
        type: 'asset/inline',
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
    new HtmlWebpackPlugin({
      inject: 'body',
      template: './src/ui/index.html',
      filename: 'index.html',
      chunks: ['ui'],
      cache: false,
    }),
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/ui/]),
  ],

  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
    cacheDirectory: path.resolve(__dirname, `./node_modules/.cache/webpack`),
  },
};

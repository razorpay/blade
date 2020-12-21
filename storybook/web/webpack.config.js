/* eslint-disable no-param-reassign */
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = ({ config }) => {
  config.resolve.extensions = [
    '.web.tsx',
    '.web.ts',
    '.ts',
    '.web.js',
    '.mjs',
    '.js',
    '.jsx',
    '.json',
  ];
  config.module.rules.push({
    test: /\.(woff|woff2|eot|ttf|otf)$/,
    use: [
      {
        loader: 'file-loader',
        query: {
          name: 'fonts/[name].[ext]',
        },
      },
    ],
  });
  config.plugins.push(
    new CopyWebpackPlugin([
      {
        from: 'public/fonts',
        to: 'fonts',
      },
    ]),
  );

  return config;
};

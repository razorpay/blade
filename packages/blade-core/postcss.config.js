const postcssBladeLayer = require('./postcss-blade-layer.cjs');

module.exports = {
  plugins: [require('postcss-nested'), postcssBladeLayer, require('autoprefixer')],
};

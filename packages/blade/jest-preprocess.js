const babelOptions = require('./.babelrc.js');

module.exports = require('babel-jest').createTransformer(babelOptions);

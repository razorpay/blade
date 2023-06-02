const babelOptions = require('./.babelrc');

module.exports = require('babel-jest').createTransformer(babelOptions);

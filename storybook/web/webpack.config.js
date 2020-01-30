/* eslint-disable no-param-reassign */
module.exports = ({ config }) => {
  config.resolve.extensions = ['.web.js', '.mjs', '.js', '.jsx', '.json'];
  return config;
};

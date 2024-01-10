require('dotenv').config();

module.exports = function buildFigma(buildOptions) {
  const define = {};

  // eslint-disable-next-line guard-for-in
  for (const secretKey in process.env) {
    let secretValue = process.env[secretKey];
    if (secretKey === 'SEGMENT_WRITE_KEY') {
      secretValue = btoa(process.env[secretKey]);
    }
    define[`process.env.${secretKey}`] = JSON.stringify(secretValue);
  }

  return {
    ...buildOptions,
    platform: 'browser',
    define,
    plugins: buildOptions.plugins.filter((plugin) => {
      return plugin.name !== 'preact-compat';
    }),
  };
};

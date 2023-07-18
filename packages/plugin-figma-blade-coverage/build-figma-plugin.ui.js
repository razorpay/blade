module.exports = function buildFigma(buildOptions) {
  return {
    ...buildOptions,
    platform: 'browser',
    plugins: buildOptions.plugins.filter((plugin) => {
      return plugin.name !== 'preact-compat';
    }),
  };
};

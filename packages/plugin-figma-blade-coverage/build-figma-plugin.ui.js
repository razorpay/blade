module.exports = function buildFigma(buildOptions) {
  return {
    ...buildOptions,
    plugins: buildOptions.plugins.filter((plugin) => {
      return plugin.name !== 'preact-compat';
    }),
  };
};

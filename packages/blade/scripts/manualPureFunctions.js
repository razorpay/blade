const pureFunctions = ['assignWithoutSideEffects'];

/**
 * This plugin marks defined function name as PURE. This is temporary implementation of manualPureFunctions.
 *
 * Once we upgrade to rollup 3.5.0, we can use treeshake.manualPureFunctions config from rollup instead of this plugin.
 * https://rollupjs.org/configuration-options/#treeshake-manualpurefunctions
 */
export const manualPureFunctions = () => ({
  visitor: {
    Identifier(path) {
      if (pureFunctions.includes(path.node.name)) {
        path.addComment('leading', '#__PURE__');
      }
    },
  },
});

const postcss = require('postcss');

const BLADE_LAYER_NAME = 'blade';

/**
 * Wraps blade-core `*.module.css` output in `@layer blade` so unlayered consumer
 * classes win the cascade without `!important`.
 */
function postcssBladeLayer() {
  return {
    postcssPlugin: 'postcss-blade-layer',
    OnceExit(root, { result }) {
      const from = result.opts.from ?? '';

      if (!from.includes('.module.css')) {
        return;
      }

      const isBladeCoreModule =
        from.includes(`${'blade-core'}/`) || from.includes(`${'blade-core'}\\`);
      if (!isBladeCoreModule) {
        return;
      }

      const alreadyWrapped = root.nodes.some(
        (node) =>
          node.type === 'atrule' &&
          node.name === 'layer' &&
          node.params.trim() === BLADE_LAYER_NAME,
      );
      if (alreadyWrapped) {
        return;
      }

      const layerAtRule = postcss.atRule({ name: 'layer', params: BLADE_LAYER_NAME });
      root.each((node) => {
        layerAtRule.append(node);
      });
      root.removeAll();
      root.append(layerAtRule);
    },
  };
}

postcssBladeLayer.postcss = true;

module.exports = postcssBladeLayer;

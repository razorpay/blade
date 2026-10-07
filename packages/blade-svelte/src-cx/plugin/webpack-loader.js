// @ts-check
/**
 * The loader behind bladeIconFontPlugin for webpack, in three modes:
 * `imports` rewrites barrel imports to per-icon files, `glyph` turns an icon
 * SVG into its glyph module, `face` writes the module registering the font.
 * State lives with the plugin instance, found by `id`.
 */
import { REGISTRY } from './webpack-state.js';

/**
 * @this {import('webpack').LoaderContext<{ mode: 'imports' | 'glyph' | 'face'; id: string }>}
 * @param {string} source
 * @param {any} [map]
 */
export default function bladeIconsLoader(source, map) {
  const { mode, id } = this.getOptions();
  const state = REGISTRY.get(id);
  if (!state) throw new Error('bladeIconFontPlugin: the loader ran without its plugin');
  if (mode === 'imports') {
    const next = state.core.rewriteImports(source, this.resourcePath);
    this.callback(null, next ?? source, next === null ? map : undefined);
    return;
  }
  if (mode === 'glyph') {
    const glyph = state.core.glyphFor(this.resourcePath);
    if (!glyph) throw new Error(`bladeIconFontPlugin: ${this.resourcePath} is not an icon`);
    // Codes come from the lockfile and from each folder's file list.
    this.addDependency(state.core.codesFile);
    for (const folder of state.core.folders) this.addContextDependency(folder);
    return state.core.glyphModule(glyph, state.faceFile);
  }
  // The face points at the font of this compilation: never from cache.
  this.cacheable(false);
  return state.faceSource();
}

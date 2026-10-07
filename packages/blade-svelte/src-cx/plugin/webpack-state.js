// @ts-check
// Plugin instances by id, for the loader: webpack hands loaders their options
// but not the plugin that added them.
/** @type {Map<string, { core: ReturnType<typeof import('./core.js').createIconCore>; faceFile: string; faceSource: () => string }>} */
export const REGISTRY = (/** @type {any} */ (globalThis)[Symbol.for('blade-icons.webpack')] ??= new Map());

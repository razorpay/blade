// @ts-check
/* global globalThis */
// Plugin instances by id, for the loader: webpack hands loaders their options
// but not the plugin that added them.
/** @type {Map<string, { core: ReturnType<typeof import('./core.js').createIconCore>; faceFile: string; faceSource: () => string }>} */
export const REGISTRY = registry();

function registry() {
  const key = Symbol.for('blade-icons.webpack');
  /** @type {any} */
  const host = globalThis;
  if (!host[key]) {
    host[key] = new Map();
  }
  return host[key];
}

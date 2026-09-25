/**
 * Internal indefinite loading indicator, shared across components.
 *
 * Intentionally NOT re-exported from `~components/index.ts` — it is consumed
 * internally (e.g. by `Button`) and is not part of the public Blade API.
 */
export { DotLoader } from './DotLoader';
export { dotLoaderTokens } from './dotLoaderTokens';
export type { DotLoaderProps } from './types';

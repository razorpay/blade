/**
 * sveld entry for glob-based `.svelte.d.ts` generation.
 * Glob mode discovers all `.svelte` files under this directory. Exports are empty on purpose —
 * tsc emits the real components barrel from index.ts after sveld runs.
 */
export {};

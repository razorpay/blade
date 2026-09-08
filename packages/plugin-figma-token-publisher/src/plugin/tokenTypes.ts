/**
 * How a token value is written into TypeScript source.
 *
 * The write side used to guess: it stripped the quotes off every string value, which turned the
 * literal `'transparent'` into a bare `transparent` identifier that nothing imported. The plugin
 * knows which of the two a value is, so it says so rather than leaving it to a regex.
 */
export const EXPRESSION = 'e'; // written bare:          globalColors.chromatic.azure[500]
export const STRING = 's'; // written quoted:        'transparent'
export const TEMPLATE = 't'; // written in backticks:  `hsla(0, 0%, 0%, ${opacity[8]})`

export type TokenValueKind = typeof EXPRESSION | typeof STRING | typeof TEMPLATE;

/** Short keys keep the gzipped workflow_dispatch payload under GitHub's 65,535 character limit. */
export type TokenValue = {
  k: TokenValueKind;
  v: string;
};

export type TokenTree = { [key: string]: TokenValue | TokenTree };

export type ThemeModes = {
  onLight: TokenTree;
  onDark: TokenTree;
};

/**
 * `errors` block the publish. `warnings` and `diagnostics` are carried through to the PR body so a
 * reviewer sees what the payload was unsure about instead of finding out from CI.
 */
export type TokenReport = {
  errors: string[];
  warnings: string[];
  diagnostics: string[];
};

/**
 * The payload carries the tokens twice.
 *
 * `themeColorTokens` / `globalColorTokens` are the flat-string shape every version of
 * `uploadTokens.js` has always understood. `taggedThemeColorTokens` / `taggedGlobalColorTokens`
 * carry the `{ k, v }` values, which a current script prefers.
 *
 * This is not belt-and-braces. The plugin dispatches the workflow against `master` (see
 * `app/api/api.ts`), so the script that runs is whatever is on master at that moment, while the
 * plugin build is installed by hand. A payload that only the new script can read takes down every
 * push until the script lands — which is exactly what happened.
 */
export type TokenPayload = {
  version: 2;
  themeColorTokens: Record<string, LegacyThemeModes>;
  globalColorTokens: LegacyTokenTree;
  taggedThemeColorTokens: Record<string, ThemeModes>;
  taggedGlobalColorTokens: TokenTree;
  report: TokenReport;
};

export type LegacyTokenTree = { [key: string]: string | LegacyTokenTree };

export type LegacyThemeModes = {
  onLight: LegacyTokenTree;
  onDark: LegacyTokenTree;
};

export const isTokenValue = (value: unknown): value is TokenValue =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as TokenValue).k === 'string' &&
  typeof (value as TokenValue).v === 'string';

/**
 * Projects tagged values down to the flat-string shape older scripts expect.
 *
 * Those scripts write the value out verbatim after stripping one layer of JSON quotes
 * (`.replace(/: "([^"]+)"/g, ': $1')`), so the quoting has to be baked into the string itself:
 * backticks make a template literal, single quotes make a string, and anything bare is written as
 * an expression. Wrapping strings this way also fixes the original `transparent` bug on those
 * scripts, since the quotes now survive their regex instead of being invented by it.
 */
export const toLegacyTokenTree = (tree: TokenTree): LegacyTokenTree => {
  const legacy: LegacyTokenTree = {};

  for (const key of Object.keys(tree)) {
    const value = tree[key];
    if (!isTokenValue(value)) {
      legacy[key] = toLegacyTokenTree(value);
    } else if (value.k === TEMPLATE) {
      legacy[key] = `\`${value.v}\``;
    } else if (value.k === STRING) {
      legacy[key] = `'${value.v}'`;
    } else {
      legacy[key] = value.v;
    }
  }

  return legacy;
};

/** Every leaf path in a token tree, dotted and sorted. */
export const collectTokenPaths = (
  tree: TokenTree,
  prefix = '',
  collected: string[] = [],
): string[] => {
  for (const key of Object.keys(tree)) {
    const value = tree[key];
    const tokenPath = prefix ? `${prefix}.${key}` : key;
    if (isTokenValue(value)) {
      collected.push(tokenPath);
    } else {
      collectTokenPaths(value, tokenPath, collected);
    }
  }
  return collected.sort();
};

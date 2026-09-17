/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-implicit-any-catch */
/* eslint-disable no-template-curly-in-string */
import setValue from '../utils/setValue';
import { opacity as opacityTokens } from '../../../blade/src/tokens/global/opacity';
import showNotification from './showNotification';
import validateColorTokens from './validateColorTokens';
import type {
  LegacyThemeModes,
  ThemeModes,
  TokenPayload,
  TokenReport,
  TokenTree,
  TokenValue,
} from './tokenTypes';
import { EXPRESSION, STRING, TEMPLATE, toLegacyTokenTree } from './tokenTypes';

const THEME_TOKENS_COLLECTION = 'Blade Theme Tokens';

const GLOBAL_TOKENS_COLLECTION = '_global-tokens';

// Figma modes are named `<figmaThemePrefix><separator><scheme>` (eg: blade/onLight,
// bladeNeutral - onDark). This maps the Figma theme prefix to the corresponding code theme name.
const FIGMA_MODE_THEME_MAP: Record<string, string> = {
  blade: 'bladeTheme',
  bladeNeutral: 'bladeNeutralTheme',
};

// Identifiers a token value may be written unquoted against. They correspond to the imports the
// theme files carry; anything else has to be a string literal or it throws on import.
const EXPRESSION_ROOTS = ['globalColors', 'opacity'];

// Values that are genuinely meant to be plain strings in the source, so no warning for them.
const KNOWN_LITERAL_VALUES = ['transparent'];

/** Collected while walking the Figma variables and carried through to the PR body. */
let report: TokenReport = { errors: [], warnings: [], diagnostics: [] };

const makeGlobalColorTokenName = (variableName: string): string => {
  return variableName.split('/').slice(1).join('.');
};

const makeThemeTokenName = (variableName: string, isValue = false): string => {
  const transformed = variableName
    .replace(/\//g, '.')
    .replace('_global-colors', 'globalColors')
    .replace('-', '.');

  // For values, convert numeric keys to bracket notation (e.g., azure.50 -> azure[50])
  // For keys, keep dot notation so setValue can create nested objects
  if (isValue) {
    return transformed.replace(/\.(\d+)/g, '[$1]');
  }

  return transformed;
};

/**
 * `-` becomes `.`, which nests the token one level deeper than its name reads. Reported separately
 * from the transform so it is only raised for variables that actually reach the payload — the
 * filtered ones (`_`, `❌`, `elevation`) are dropped before this runs.
 */
const reportStrayHyphen = (variableName: string): void => {
  if (!variableName.replace('_global-colors', 'globalColors').includes('-')) return;
  report.diagnostics.push(
    `The Figma variable \`${variableName}\` contains a hyphen, which becomes a \`.\` in the token path. Rename it if that nesting was not intended.`,
  );
};

/**
 * The scheme is the fixed part of a mode name, so anchoring on it survives theme prefixes that
 * themselves contain the separator (eg: `blade-neutral/onLight`).
 */
const parseModeName = (
  modeName: string,
): { figmaThemePrefix: string; scheme: keyof ThemeModes } | null => {
  const match = /^(.*?)\s*[-/]\s*(onLight|onDark)$/.exec(modeName.trim());
  if (!match) return null;
  return { figmaThemePrefix: match[1], scheme: match[2] as keyof ThemeModes };
};

const opacityMap: Record<string, string> = {};
for (const [key, value] of Object.entries(opacityTokens)) {
  opacityMap[value.toFixed(2)] = `\${opacity[${key}]}`;
}

const rgbaToHsla = ({ r, g, b, a }: RGBA): string => {
  // Find greatest and smallest channel values
  const cmin = Math.min(r, g, b);
  const cmax = Math.max(r, g, b);
  const delta = cmax - cmin;
  let h = 0;
  let s = 0;
  let l = 0;

  if (delta == 0) {
    h = 0;
  } else if (cmax == r) {
    // Red is max
    h = ((g - b) / delta) % 6;
  } else if (cmax == g) {
    // Green is max
    h = (b - r) / delta + 2;
  } else {
    // Blue is max
    h = (r - g) / delta + 4;
  }

  h = Math.round(h * 60);

  // Make negative hues positive behind 360°
  if (h < 0) {
    h += 360;
  }

  l = (cmax + cmin) / 2;

  // Calculate saturation
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  // Multiply l and s by 100
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  // An alpha with no matching opacity token would otherwise interpolate as `undefined`.
  const alpha = opacityMap[a.toFixed(2)];
  if (!alpha) {
    report.diagnostics.push(
      `Alpha ${a.toFixed(
        2,
      )} has no matching token in \`opacity\`, so it was written as a raw number.`,
    );
  }

  return `hsla(${h}, ${Math.round(s)}%, ${Math.round(l)}%, ${alpha ?? a.toFixed(2)})`;
};

/**
 * An alias resolves to another variable's name. If that name starts with an identifier the theme
 * files import, it is an expression; otherwise it is a plain string. Guessing this on the write
 * side is what turned `'transparent'` into a bare identifier and broke theme initialisation.
 *
 * The variable's own `codeSyntax` field is deliberately not consulted here. It is written by this
 * plugin's own "Generate Token's Dev Names" command from the same variable name, using different
 * rules (no `_global-colors` mapping, and only the first numeric segment bracketed), and only
 * refreshed when someone runs that command by hand. It is documentation derived from the name, not
 * an independent statement of what the token is called in code.
 */
const makeAliasValue = (referencedName: string, tokenName: string): TokenValue => {
  const expression = makeThemeTokenName(referencedName, true);
  const root = expression.split(/[.[]/)[0];

  if (EXPRESSION_ROOTS.includes(root)) {
    reportStrayHyphen(referencedName);
    return { k: EXPRESSION, v: expression };
  }

  // A value shaped like a path is a reference to a variable that is not published to code. Writing
  // it as a string produces a colour of `'_styles.button.primary.default[000]'`, which typechecks
  // (the token type is just `string`), renders as nothing, and survives every downstream check —
  // the write side's resolve check only catches bare identifiers. Nothing else will catch this.
  if (/[.[]/.test(expression)) {
    report.errors.push(
      `\`${tokenName}\` aliases \`${referencedName}\`, which is not published to code. Theme tokens have to point at a variable under \`_global-colors\`; publishing this writes the literal string \`'${expression}'\` where a colour belongs.`,
    );
    return { k: STRING, v: expression };
  }

  // A bare word is a CSS keyword like `transparent` — legitimate, but worth naming if unfamiliar.
  if (!KNOWN_LITERAL_VALUES.includes(expression)) {
    report.warnings.push(
      `\`${tokenName}\` aliases \`${referencedName}\`, which will be written as the plain string \`'${expression}'\`. That is correct for a CSS keyword and wrong for anything else.`,
    );
  }

  return { k: STRING, v: expression };
};

const makeThemeColorTokens = async (): Promise<Record<string, ThemeModes>> => {
  const themeColorTokens: Record<string, ThemeModes> = {};
  for (const themeName of Object.values(FIGMA_MODE_THEME_MAP)) {
    themeColorTokens[themeName] = { onLight: {}, onDark: {} };
  }

  // filter colors collection
  const colorsCollection = (await figma.variables.getLocalVariableCollectionsAsync()).find(
    (collection) => collection.name === THEME_TOKENS_COLLECTION,
  );

  if (!colorsCollection) {
    throw new Error(
      `Could not find the "${THEME_TOKENS_COLLECTION}" variable collection in this file.`,
    );
  }

  // create modes set in the collection eg: onLight, onDark, etc.
  const colorModes = colorsCollection.modes.reduce<Record<string, string>>(
    (acc, mode) => Object.assign(acc, { [mode.name]: mode.modeId }),
    {},
  );

  // A mode nobody maps is a mode nobody writes. Report it once, up front, rather than dropping
  // every one of its variables silently the way the previous version did.
  const unmappedModes = Object.keys(colorModes).filter((modeName) => {
    const parsed = parseModeName(modeName);
    return !parsed || !FIGMA_MODE_THEME_MAP[parsed.figmaThemePrefix];
  });
  if (unmappedModes.length) {
    report.errors.push(
      `The "${THEME_TOKENS_COLLECTION}" collection has ${unmappedModes
        .map((mode) => `\`${mode}\``)
        .join(', ')}, which no theme maps to. Modes must be named \`<${Object.keys(
        FIGMA_MODE_THEME_MAP,
      ).join('|')}>/<onLight|onDark>\`, or the theme has to be added to the plugin.`,
    );
  }

  for (const variableId of colorsCollection.variableIds) {
    // get all the variables by their ids in our collection
    const variable = await figma.variables.getVariableByIdAsync(variableId);
    if (!variable) {
      continue;
    }

    // replace the "/" from token name with "." to store in json structure
    const tokenName = makeThemeTokenName(variable.name);
    if (tokenName.includes('❌') || tokenName.includes('_') || tokenName.includes('elevation')) {
      continue;
    }
    reportStrayHyphen(variable.name);

    // prepare for storing variables in code in the format of dark and light modes
    for (const [modeName, modeId] of Object.entries(colorModes)) {
      const parsedMode = parseModeName(modeName);
      if (!parsedMode) continue;

      const themeName = FIGMA_MODE_THEME_MAP[parsedMode.figmaThemePrefix];
      if (!themeName) continue;

      const variableModeValue: VariableValue = variable.valuesByMode[modeId];

      // if the variable references another variable then we take the name of the referenced
      // variable and set that as a value
      // eg: surface.background.neutral.subtle -> globalColors.gray.200
      if (typeof variableModeValue === 'object' && 'id' in variableModeValue) {
        const referencedVariable = await figma.variables.getVariableByIdAsync(variableModeValue.id);
        if (!referencedVariable) {
          // dropping this leaves a hole that the write side reads as a deliberate token deletion
          report.errors.push(
            `\`${tokenName}\` in \`${modeName}\` aliases a variable that could not be read. Publishing now would delete the token from the theme files.`,
          );
          continue;
        }
        setValue(
          themeColorTokens[themeName][parsedMode.scheme],
          tokenName,
          makeAliasValue(referencedVariable.name, tokenName),
        );
      } else if (typeof variableModeValue === 'object') {
        // a raw colour rather than an alias — kept, because dropping it deletes the token, but
        // flagged, because a theme token is supposed to point at a global one
        if (!tokenName.includes('transparent')) {
          report.warnings.push(
            `\`${tokenName}\` in \`${modeName}\` holds a hardcoded colour instead of pointing at a global token.`,
          );
        }
        setValue(themeColorTokens[themeName][parsedMode.scheme], tokenName, {
          k: TEMPLATE,
          v: rgbaToHsla(variableModeValue as RGBA),
        });
      } else {
        report.errors.push(
          `\`${tokenName}\` in \`${modeName}\` has a value the plugin cannot read (${typeof variableModeValue}).`,
        );
      }
    }
  }

  return themeColorTokens;
};

const makeGlobalColorTokens = async (): Promise<TokenTree> => {
  const globalColorTokens: TokenTree = {};

  // filter colors collection
  const globalColorTokensCollection = (
    await figma.variables.getLocalVariableCollectionsAsync()
  ).find((collection) => collection.name === GLOBAL_TOKENS_COLLECTION);

  if (!globalColorTokensCollection) {
    throw new Error(
      `Could not find the "${GLOBAL_TOKENS_COLLECTION}" variable collection in this file.`,
    );
  }

  const colorModes: { default: string } = globalColorTokensCollection.modes.reduce(
    (acc, mode) => Object.assign(acc, { default: mode.modeId }),
    { default: '' },
  );

  for (const variableId of globalColorTokensCollection.variableIds) {
    // get all the variables by their ids in our collection
    const variable = await figma.variables.getVariableByIdAsync(variableId);
    if (variable && variable.name.includes('_global-colors')) {
      // replace the "/" from token name with "." to store in json structure
      const tokenName = makeGlobalColorTokenName(variable.name);
      const variableColor = variable.valuesByMode[colorModes.default] as RGBA;
      if (typeof variableColor === 'object') {
        setValue(globalColorTokens, tokenName, { k: TEMPLATE, v: rgbaToHsla(variableColor) });
      }
    }
  }

  return globalColorTokens;
};

export const makeColorTokens = async (): Promise<void> => {
  report = { errors: [], warnings: [], diagnostics: [] };

  const themeColorTokens = await makeThemeColorTokens();
  const globalColorTokens = await makeGlobalColorTokens();

  // One badly bound variable is walked once per theme per mode, so its message would otherwise be
  // repeated four times over.
  report.errors = [...new Set(report.errors)];
  report.warnings = [...new Set(report.warnings)];
  report.diagnostics = [...new Set(report.diagnostics)];

  validateColorTokens({ themeColorTokens, globalColorTokens, report });

  const hasErrors = report.errors.length > 0;

  showNotification({
    figma,
    type: hasErrors ? 'error' : 'information',
    text: hasErrors
      ? `⛔️ ${report.errors.length} problem(s) found — see the plugin window.`
      : '✅ Color tokens created!',
  });

  // Both shapes go out: the flat-string one every version of `uploadTokens.js` can read, and the
  // tagged one a current script prefers. The workflow runs the script from `master`, so the plugin
  // cannot assume the other half of the pipeline has caught up with it.
  const legacyThemeColorTokens: Record<string, LegacyThemeModes> = {};
  for (const themeName of Object.keys(themeColorTokens)) {
    legacyThemeColorTokens[themeName] = {
      onLight: toLegacyTokenTree(themeColorTokens[themeName].onLight),
      onDark: toLegacyTokenTree(themeColorTokens[themeName].onDark),
    };
  }

  const data: TokenPayload = {
    version: 2,
    themeColorTokens: legacyThemeColorTokens,
    globalColorTokens: toLegacyTokenTree(globalColorTokens),
    taggedThemeColorTokens: themeColorTokens,
    taggedGlobalColorTokens: globalColorTokens,
    report,
  };

  figma.ui.postMessage({ type: 'export-color-tokens', data });
  console.log(data);

  // The default window only fits the token field. A report needs room to be read rather than
  // scrolled a line at a time, so grow with roughly how much there is to say.
  const reportLines = report.errors.length + report.warnings.length + report.diagnostics.length;
  if (reportLines) {
    figma.ui.resize(460, Math.min(640, 260 + reportLines * 54));
  }

  figma.ui.show();
};

export default makeColorTokens;

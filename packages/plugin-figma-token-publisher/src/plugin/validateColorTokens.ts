/**
 * Checks the payload against itself before it ever leaves Figma.
 *
 * Every rule here is a comment somebody had to leave on a token PR: a theme that only got half its
 * modes, `onNeutral` carrying the same value at all four emphasis levels in one theme but stepped
 * values in the other, and `primary.highlighted` collapsing onto `primary.default` so hover had no
 * visual feedback. None of these are things the write side can judge — they are authoring mistakes
 * in the Figma variables, and this is the last point where the person who made them is still here.
 */
import type { TokenReport, TokenTree, TokenValue, ThemeModes } from './tokenTypes';
import { collectTokenPaths, isTokenValue } from './tokenTypes';

const SCHEMES: (keyof ThemeModes)[] = ['onLight', 'onDark'];

/** Emphasis groups smaller than this are too small for "every value is identical" to mean much. */
const MIN_UNIFORM_GROUP_SIZE = 3;

const formatList = (items: string[], limit = 8): string => {
  const shown = items.slice(0, limit).map((item) => `\`${item}\``);
  const remaining = items.length - shown.length;
  return remaining > 0 ? `${shown.join(', ')} and ${remaining} more` : shown.join(', ');
};

const missingFrom = (expected: string[], actual: string[]): string[] => {
  const actualSet = new Set(actual);
  return expected.filter((tokenPath) => !actualSet.has(tokenPath));
};

/**
 * Walks every group whose children are all leaves — the emphasis groups (`normal` / `subtle` /
 * `muted` / `disabled`, `default` / `highlighted` / …).
 */
const forEachLeafGroup = (
  tree: TokenTree,
  visit: (path: string, leaves: Record<string, TokenValue>) => void,
  prefix = '',
): void => {
  const leaves: Record<string, TokenValue> = {};
  let hasChildGroup = false;

  for (const key of Object.keys(tree)) {
    const value = tree[key];
    const path = prefix ? `${prefix}.${key}` : key;
    if (isTokenValue(value)) {
      leaves[key] = value;
    } else {
      hasChildGroup = true;
      forEachLeafGroup(value, visit, path);
    }
  }

  if (!hasChildGroup && Object.keys(leaves).length && prefix) {
    visit(prefix, leaves);
  }
};

/** A theme with only one mode filled in would silently overwrite the other with stale values. */
const checkCompleteness = (
  themeColorTokens: Record<string, ThemeModes>,
  report: TokenReport,
): string[] => {
  const usableThemes: string[] = [];

  for (const themeName of Object.keys(themeColorTokens)) {
    const modes = themeColorTokens[themeName];
    const emptyModes = SCHEMES.filter((scheme) => !Object.keys(modes[scheme] ?? {}).length);

    if (emptyModes.length) {
      report.errors.push(
        `\`${themeName}\` produced no tokens for ${formatList(
          emptyModes,
        )}. Check that the Figma collection has a mode named \`${themeName.replace(/Theme$/, '')}/${
          emptyModes[0]
        }\`.`,
      );
    } else {
      usableThemes.push(themeName);
    }
  }

  return usableThemes;
};

/**
 * Both themes are typed `ColorsWithModes`, so a token present in one and absent from the other is
 * a compile error waiting to happen — which is exactly how `onNeutral` landed in `bladeTheme` but
 * not in `blade-core`'s copy on the last push.
 */
const checkPathParity = (
  themeColorTokens: Record<string, ThemeModes>,
  usableThemes: string[],
  report: TokenReport,
): void => {
  for (const themeName of usableThemes) {
    const [light, dark] = SCHEMES.map((scheme) =>
      collectTokenPaths(themeColorTokens[themeName][scheme]),
    );

    const missingInDark = missingFrom(light, dark);
    const missingInLight = missingFrom(dark, light);
    if (missingInDark.length) {
      report.errors.push(`\`${themeName}\` is missing ${formatList(missingInDark)} in \`onDark\`.`);
    }
    if (missingInLight.length) {
      report.errors.push(
        `\`${themeName}\` is missing ${formatList(missingInLight)} in \`onLight\`.`,
      );
    }
  }

  const [referenceTheme, ...otherThemes] = usableThemes;
  if (!referenceTheme) return;

  for (const themeName of otherThemes) {
    for (const scheme of SCHEMES) {
      const reference = collectTokenPaths(themeColorTokens[referenceTheme][scheme]);
      const candidate = collectTokenPaths(themeColorTokens[themeName][scheme]);

      const missing = missingFrom(reference, candidate);
      const extra = missingFrom(candidate, reference);
      if (missing.length) {
        report.errors.push(
          `\`${themeName}.${scheme}\` is missing ${formatList(
            missing,
          )}, which \`${referenceTheme}.${scheme}\` defines. Both themes share one type, so every token has to exist in both.`,
        );
      }
      if (extra.length) {
        report.errors.push(
          `\`${themeName}.${scheme}\` defines ${formatList(
            extra,
          )}, which \`${referenceTheme}.${scheme}\` does not.`,
        );
      }
    }
  }
};

/**
 * Runs a per-group predicate over every theme and mode and collapses the hits into one line per
 * distinct set of locations.
 *
 * The obvious shape — one warning per theme per mode — repeats the same sentence four times for a
 * finding that is really "this token looks like this everywhere", which buries the one finding that
 * only affects a single mode. Grouping by where a path was hit keeps each finding to one line and
 * makes the odd one out stand out.
 */
const groupFindingsByLocation = (
  themeColorTokens: Record<string, ThemeModes>,
  usableThemes: string[],
  isHit: (leaves: Record<string, TokenValue>) => boolean,
): { paths: string[]; scope: string }[] => {
  const locationsByPath = new Map<string, string[]>();
  const allLocations: string[] = [];

  for (const themeName of usableThemes) {
    for (const scheme of SCHEMES) {
      const location = `${themeName}.${scheme}`;
      allLocations.push(location);

      forEachLeafGroup(themeColorTokens[themeName][scheme], (path, leaves) => {
        if (!isHit(leaves)) return;
        locationsByPath.set(path, [...(locationsByPath.get(path) ?? []), location]);
      });
    }
  }

  // paths hit in exactly the same places belong on the same line
  const pathsByScope = new Map<string, string[]>();
  for (const [path, locations] of locationsByPath) {
    const key = locations.join(', ');
    pathsByScope.set(key, [...(pathsByScope.get(key) ?? []), path]);
  }

  return [...pathsByScope].map(([key, paths]) => ({
    paths,
    scope: key.split(', ').length === allLocations.length ? 'every theme and mode' : key,
  }));
};

/**
 * `default` and `highlighted` holding the same value means hover and active states are invisible.
 * A real design decision occasionally, an unbound variable more often — so it warns rather than
 * blocks.
 */
const checkCollapsedStates = (
  themeColorTokens: Record<string, ThemeModes>,
  usableThemes: string[],
  report: TokenReport,
): void => {
  const findings = groupFindingsByLocation(
    themeColorTokens,
    usableThemes,
    (leaves) =>
      Boolean(leaves.default && leaves.highlighted) && leaves.default.v === leaves.highlighted.v,
  );

  for (const { paths, scope } of findings) {
    report.warnings.push(
      `${formatList(
        paths,
      )} share one value for \`default\` and \`highlighted\` in ${scope}. Hover and active will look identical.`,
    );
  }
};

/**
 * An emphasis group where every level resolves to the same colour. Legitimate now and then, but it
 * is also what an unbound or half-authored group looks like.
 */
const checkUniformEmphasis = (
  themeColorTokens: Record<string, ThemeModes>,
  usableThemes: string[],
  report: TokenReport,
): void => {
  const findings = groupFindingsByLocation(themeColorTokens, usableThemes, (leaves) => {
    const values = Object.keys(leaves).map((key) => leaves[key].v);
    return values.length >= MIN_UNIFORM_GROUP_SIZE && new Set(values).size === 1;
  });

  for (const { paths, scope } of findings) {
    report.warnings.push(
      `${formatList(
        paths,
      )} use one value for every emphasis level in ${scope}. Confirm this is intentional rather than an unbound variable.`,
    );
  }
};

export const validateColorTokens = ({
  themeColorTokens,
  globalColorTokens,
  report,
}: {
  themeColorTokens: Record<string, ThemeModes>;
  globalColorTokens: TokenTree;
  report: TokenReport;
}): TokenReport => {
  if (!Object.keys(themeColorTokens).length) {
    report.errors.push('No theme tokens were generated.');
    return report;
  }
  if (!Object.keys(globalColorTokens).length) {
    report.warnings.push(
      'No global color tokens were generated, so `colors.ts` will be left untouched.',
    );
  }

  const usableThemes = checkCompleteness(themeColorTokens, report);
  checkPathParity(themeColorTokens, usableThemes, report);
  checkCollapsedStates(themeColorTokens, usableThemes, report);
  checkUniformEmphasis(themeColorTokens, usableThemes, report);

  return report;
};

export default validateColorTokens;

/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-commonjs */
/**
 * What publishing would change, worked out before anything is sent.
 *
 * The comparison is against `master`, because that is what the workflow writes into. It uses the
 * same diff and the same target list as `uploadTokens.js`, so this preview and the PR it opens
 * agree on what counts as a change. Only the text-based helpers are used: the downloaded files are
 * read line by line and never evaluated.
 */
const {
  diffTokenTreeAgainstSource,
  extractDeclarationBody,
} = require('../../../blade/scripts/tokenSerializer');
const targets = require('../../../blade/scripts/tokenTargets.json');

export type TokenChange = { path: string; before: string; after: string };
export type TokenDiff = { added: string[]; removed: string[]; changed: TokenChange[] };

export const BASE_REF = 'master';

/**
 * razorpay/blade is public, so this needs no token. The personal access token typed into the
 * plugin is only for dispatching the workflow and is deliberately not sent here.
 */
const fetchSourceFile = async (path: string): Promise<string> => {
  const response = await fetch(
    `https://api.github.com/repos/razorpay/blade/contents/${path}?ref=${BASE_REF}`,
    { headers: { Accept: 'application/vnd.github.raw' } },
  );
  if (!response.ok) {
    throw new Error(`GitHub returned ${response.status} for ${path}`);
  }
  return response.text();
};

export const diffAgainstBase = async ({
  themeColorTokens,
  globalColorTokens,
}: {
  themeColorTokens?: Record<string, unknown>;
  globalColorTokens?: Record<string, unknown>;
}): Promise<TokenDiff> => {
  const jobs = [
    ...Object.entries(targets.themes).map(([label, config]) => ({
      label,
      tree: themeColorTokens?.[label],
      config,
    })),
    { label: 'globalColors', tree: globalColorTokens, config: targets.globalColors },
  ].filter(({ tree }) => tree && Object.keys(tree as object).length);

  const diffs = await Promise.all(
    jobs.map(async ({ label, tree, config }: any) => {
      const path = config.files[0];
      const fileContent = await fetchSourceFile(path);
      const declarationRegex = new RegExp(config.declaration, 'gm');

      // An unmatched declaration reads as "every token is new", which is worse than no preview.
      if (extractDeclarationBody(fileContent, declarationRegex).matchCount !== 1) {
        throw new Error(`Could not find the token declaration in ${path}`);
      }

      const diff: TokenDiff = diffTokenTreeAgainstSource({
        tree,
        fileContent,
        declarationRegex,
        expressionRoots: targets.expressionRoots,
        preservedPaths: targets.preservedTokenPaths,
      });
      const withLabel = (tokenPath: string): string => `${label}.${tokenPath}`;
      return {
        added: diff.added.map(withLabel),
        removed: diff.removed.map(withLabel),
        changed: diff.changed.map((change) => ({ ...change, path: withLabel(change.path) })),
      };
    }),
  );

  return diffs.reduce<TokenDiff>(
    (all, diff) => ({
      added: [...all.added, ...diff.added],
      removed: [...all.removed, ...diff.removed],
      changed: [...all.changed, ...diff.changed],
    }),
    { added: [], removed: [], changed: [] },
  );
};

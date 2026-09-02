/**
 * Writes a Figma token payload into the repo and opens a PR.
 *
 * Everything here that looks defensive is a bug that reached review on a previous token push:
 * values written as bare identifiers that nothing imports, tokens silently deleted because Figma
 * no longer had them, `blade-core` left stale because only `blade` was in the target list, and a
 * PR opened before anything had been typechecked. The rule is now: find problems here, and if any
 * survive, open the PR as a draft with them written down rather than looking mergeable.
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const execa = require('execa');
const randomNameGenerator = require('moniker');

// eslint-disable-next-line import/extensions
const targets = require('./tokenTargets.json');
const {
  collectTokenPaths,
  collectTokenPathsFromSource,
  diffTokenPaths,
  findUnresolvableValueRoots,
  mergePreservedTokens,
  replaceDeclaration,
  scanDeclaration,
  serializeTokens,
} = require('./tokenSerializer');

const GITHUB_BOT_EMAIL = 'tools+cibot@razorpay.com';
const GITHUB_BOT_USERNAME = 'rzpcibot';

const BLADE_ROOT = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(BLADE_ROOT, '../..');

const SERIALIZED_PLACEHOLDER = '{{SERIALIZED}}';

// `--dry-run` writes and verifies the files but touches neither git nor GitHub, so a payload can
// be replayed locally. The skip flags exist for that loop too — the full snapshot run is slow.
const flags = process.argv.slice(3);
const isDryRun = flags.includes('--dry-run');
const skipTypecheck = flags.includes('--skip-typecheck');
const skipSnapshots = flags.includes('--skip-snapshots');

/** Problems that must not ship. A non-empty list downgrades the PR to a draft. */
const blockers = [];
/** Worth a reviewer's attention but not a reason to hold the push. */
const warnings = [];

const touchedFiles = new Set();
/** Code-owned tokens carried over because the payload has never heard of them. */
const preservedTokens = new Set();

// ---------------------------------------------------------------------------------------------
// payload
// ---------------------------------------------------------------------------------------------

/**
 * The plugin gzip + base64 encodes the payload to stay under GitHub's 65,535 character
 * workflow_dispatch input limit. Older plugin builds send raw JSON.
 */
const parseTokensArg = (arg) => {
  try {
    return JSON.parse(zlib.gunzipSync(Buffer.from(arg, 'base64')).toString('utf8'));
  } catch (error) {
    return JSON.parse(arg);
  }
};

// ---------------------------------------------------------------------------------------------
// writing
// ---------------------------------------------------------------------------------------------

const toRepoPath = (relativePath) => path.resolve(REPO_ROOT, relativePath);

/**
 * Writes one serialized declaration into one file, and refuses to leave behind anything it cannot
 * vouch for: the declaration has to match exactly once, and every bare identifier the new values
 * lean on has to resolve inside that file.
 *
 * Returns the token paths the file held *before* the write, or null if nothing was written.
 */
const writeDeclaration = ({ relativePath, declarationRegex, replacementTemplate, tree }) => {
  const absolutePath = toRepoPath(relativePath);

  if (!fs.existsSync(absolutePath)) {
    blockers.push(
      `\`${relativePath}\` is listed in \`scripts/tokenTargets.json\` but does not exist, so the token push skipped it.`,
    );
    return null;
  }

  const fileContent = fs.readFileSync(absolutePath, 'utf8');
  const { paths: previousPaths, matchCount: previousMatchCount } = collectTokenPathsFromSource(
    fileContent,
    declarationRegex,
  );

  // Figma has no idea a token is deprecated, so the deprecated aliases and the `// @deprecated`
  // markers above them live only in the source — and each mirror carries its own. Both are read
  // back per file rather than letting a regeneration quietly drop them.
  const { comments, values, childOrder } = scanDeclaration(fileContent, declarationRegex);
  const { tree: mergedTree, preserved } = mergePreservedTokens({
    tree,
    existingValues: values,
    preservedPaths: targets.preservedTokenPaths,
    childOrder,
  });
  preserved.forEach((tokenPath) => preservedTokens.add(tokenPath));

  const serialized = serializeTokens(mergedTree, targets.expressionRoots, { comments });

  if (previousMatchCount !== 1) {
    blockers.push(
      `Expected exactly one token declaration in \`${relativePath}\` but found ${previousMatchCount}. The file was left untouched — check whether the declaration was renamed or reformatted, and update \`scripts/tokenTargets.json\`.`,
    );
    return null;
  }

  const { content, matchCount } = replaceDeclaration({
    fileContent,
    declarationRegex,
    // function form so `$` sequences inside token values are not read as replacement patterns
    replacement: replacementTemplate.replace(SERIALIZED_PLACEHOLDER, () => serialized),
  });
  if (matchCount !== 1) {
    blockers.push(`Could not replace the token declaration in \`${relativePath}\`.`);
    return null;
  }

  // this is the `faint: transparent` class of bug — a value that looks like a member expression
  // but resolves to nothing, throwing the moment the theme is imported
  const unresolvableRoots = findUnresolvableValueRoots({
    fileContent: content,
    declarationSource: serialized,
  });
  if (unresolvableRoots.length) {
    blockers.push(
      `\`${relativePath}\` would reference ${unresolvableRoots
        .map((root) => `\`${root}\``)
        .join(', ')}, which ${
        unresolvableRoots.length === 1 ? 'is' : 'are'
      } neither imported nor declared in that file. Either the Figma variable should resolve to a global token, or its value belongs in quotes as a plain string.`,
    );
    return null;
  }

  fs.writeFileSync(absolutePath, content);
  touchedFiles.add(absolutePath);
  return { previousPaths, mergedPaths: collectTokenPaths(mergedTree) };
};

/**
 * Writes one token tree into every file that mirrors it. `blade` and `blade-core` hold identical
 * copies of the theme files; writing only one of them is what left `blade-core` failing to
 * typecheck on the last push.
 */
const writeTokenTree = ({ label, tree, config }) => {
  const declarationRegex = new RegExp(config.declaration, 'gm');
  let newPaths = collectTokenPaths(tree);

  let previousPaths = null;
  for (const relativePath of config.files) {
    const written = writeDeclaration({
      relativePath,
      declarationRegex,
      replacementTemplate: config.replacement,
      tree,
    });
    if (!written) continue;

    if (previousPaths && previousPaths.join('\n') !== written.previousPaths.join('\n')) {
      warnings.push(
        `The mirrored copies of \`${label}\` were out of sync before this push — \`${relativePath}\` held a different set of token paths than the file before it. Both have been overwritten with the Figma payload.`,
      );
    }
    previousPaths = written.previousPaths;
    // preserved tokens are part of what landed, so the diff must not call them removed
    newPaths = written.mergedPaths;
  }

  return diffTokenPaths(previousPaths ?? newPaths, newPaths);
};

// ---------------------------------------------------------------------------------------------
// checks
// ---------------------------------------------------------------------------------------------

/**
 * Reduces a reported path to the text components actually write.
 *
 * Theme tokens are reported as `<theme>.<mode>.<rest>` but consumed as `theme.colors.<rest>`, so
 * both prefixes come off. Global colors are reported and consumed under the same `globalColors.`
 * root, so that one stays.
 */
const toSearchablePath = (tokenPaths) => [
  ...new Set(tokenPaths.map((tokenPath) => tokenPath.replace(/^[\w$]+\.(onLight|onDark)\./, ''))),
];

/** A token path is written both ways in source: `azure.50` in Figma, `azure[50]` in code. */
const searchVariantsFor = (tokenPath) => [tokenPath, tokenPath.replace(/\.(\d+)(?=\.|$)/g, '[$1]')];

const walkFiles = (directory, extensions, collected = []) => {
  if (!fs.existsSync(directory)) return collected;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === 'build')
        continue;
      walkFiles(entryPath, extensions, collected);
    } else if (extensions.includes(path.extname(entry.name))) {
      collected.push(entryPath);
    }
  }
  return collected;
};

/**
 * A token that disappears from Figma is deleted from the source files, and that is exactly how the
 * deprecated `popup.*` aliases were dropped out from under `Popover.native.tsx` and the
 * brand-refresh codemod map. Anything still naming a removed token blocks the push.
 */
const findConsumersOfRemovedTokens = (removedPaths) => {
  if (!removedPaths.length) return [];

  const searchFiles = targets.referenceScanRoots
    .flatMap((root) => walkFiles(toRepoPath(root), targets.referenceScanExtensions))
    .filter((filePath) => !touchedFiles.has(filePath));

  const searchTerms = removedPaths.map((tokenPath) => ({
    tokenPath,
    variants: searchVariantsFor(tokenPath),
  }));

  const consumers = [];
  for (const filePath of searchFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    for (const { tokenPath, variants } of searchTerms) {
      if (variants.some((variant) => content.includes(variant))) {
        consumers.push({ tokenPath, file: path.relative(REPO_ROOT, filePath) });
      }
    }
  }
  return consumers;
};

const runStep = ({ name, cwd, command }) => {
  console.log(`\n▶ ${name}: ${command}`);
  try {
    execa.commandSync(command, { cwd: toRepoPath(cwd), stdio: 'inherit', shell: true });
    return true;
  } catch (error) {
    blockers.push(`\`${name}\` failed (\`${command}\`). See the workflow logs for the output.`);
    return false;
  }
};

// ---------------------------------------------------------------------------------------------
// reporting
// ---------------------------------------------------------------------------------------------

const bulletList = (items, emptyText) =>
  items.length ? items.map((item) => `- ${item}`).join('\n') : emptyText;

const collapsibleList = (title, items) => {
  if (!items.length) return null;
  return [
    '<details>',
    `<summary>${title} (${items.length})</summary>`,
    '',
    items.map((item) => `- \`${item}\``).join('\n'),
    '',
    '</details>',
    '',
  ].join('\n');
};

const buildPullRequestBody = ({ added, removed, consumers, report }) => {
  const sections = [
    'This PR was opened by the Token Upload GitHub action. It updates source token files based on the payload from the Figma plugin.',
    '',
  ];

  if (blockers.length) {
    sections.push(
      '## ⛔️ Blocking',
      '',
      'Opened as a draft because the push could not verify itself. Fix these before marking it ready:',
      '',
      bulletList(blockers, ''),
      '',
    );
  }

  sections.push(
    '## Token changes',
    '',
    `**${added.length}** added · **${removed.length}** removed`,
    '',
    collapsibleList('Added token paths', added),
    collapsibleList('Removed token paths', removed),
  );

  if (removed.length) {
    sections.push(
      '> Removals happen when a token exists in code but not in the Figma payload. If a removal is not intentional, the Figma variable is probably missing or renamed rather than deliberately deleted.',
      '',
    );
  }

  if (preservedTokens.size) {
    sections.push(
      `${preservedTokens.size} code-owned token${
        preservedTokens.size === 1 ? '' : 's'
      } were kept as-is because Figma does not define them, per \`preservedTokenPaths\` in \`packages/blade/scripts/tokenTargets.json\`.`,
      '',
      collapsibleList('Preserved token paths', [...preservedTokens].sort()),
    );
  }

  if (consumers.length) {
    sections.push(
      '## ⚠️ Removed tokens that still have consumers',
      '',
      bulletList(
        consumers.map(({ tokenPath, file }) => `\`${tokenPath}\` — \`${file}\``),
        '',
      ),
      '',
    );
  }

  const pluginErrors = report?.errors ?? [];
  const pluginWarnings = [...(report?.warnings ?? []), ...(report?.diagnostics ?? [])];

  if (pluginErrors.length) {
    sections.push('## Figma validation errors', '', bulletList(pluginErrors, ''), '');
  }
  if (pluginWarnings.length || warnings.length) {
    sections.push('## Warnings', '', bulletList([...warnings, ...pluginWarnings], '_none_'), '');
  }

  // `''` entries are deliberate blank lines between markdown blocks, so only drop the nulls that
  // an empty section returns
  return sections.filter((section) => section !== null).join('\n');
};

/**
 * Removing a token from the public `Colors` type breaks downstream compilation, so it is a major.
 * Adding one is a minor. Deriving this stops the version from being argued out in review.
 */
const determineBump = ({ added, removed }) => {
  if (removed.length) return 'major';
  if (added.length) return 'minor';
  return 'patch';
};

const writeChangeset = ({ branchName, added, removed }) => {
  const bump = determineBump({ added, removed });
  const plural = (count) => (count === 1 ? '' : 's');
  const summary = [
    'update design tokens from Figma',
    '',
    `Added ${added.length} token${plural(added.length)} and removed ${removed.length} token${plural(
      removed.length,
    )}.`,
  ];

  if (removed.length) {
    summary.push(
      '',
      'Removed tokens are a breaking change for consumers referencing them:',
      '',
      ...removed.map((tokenPath) => `- \`${tokenPath}\``),
    );
  }

  const frontmatter = targets.changesetPackages
    .map((packageName) => `'${packageName}': ${bump}`)
    .join('\n');
  const changesetPath = toRepoPath(`.changeset/figma-token-push-${branchName}.md`);
  fs.writeFileSync(changesetPath, `---\n${frontmatter}\n---\n\n${summary.join('\n')}\n`);
  touchedFiles.add(changesetPath);
};

// ---------------------------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------------------------

const uploadColorTokens = async () => {
  const payload = parseTokensArg(process.argv[2]);
  // A current plugin sends the tokens twice — tagged `{ k, v }` values and the flat-string shape
  // older scripts read. Prefer the tagged ones; fall back for payloads from an older plugin build,
  // where `serializeTokens` infers the kind from `expressionRoots` instead.
  const themeColorTokens = payload?.taggedThemeColorTokens ?? payload?.themeColorTokens ?? {};
  const globalColorTokens = payload?.taggedGlobalColorTokens ?? payload?.globalColorTokens ?? {};
  const report = payload?.report;

  // The plugin runs the same validations before publishing, but a payload from an older build
  // arrives without a report — so its errors are surfaced rather than trusted to have been seen.
  for (const error of report?.errors ?? []) {
    blockers.push(`Figma validation: ${error}`);
  }

  let added = [];
  let removed = [];

  for (const [themeName, config] of Object.entries(targets.themes)) {
    const tree = themeColorTokens[themeName];
    const hasBothModes =
      Object.keys(tree?.onLight ?? {}).length && Object.keys(tree?.onDark ?? {}).length;

    if (!hasBothModes) {
      // Skipping quietly is how a theme goes stale without anyone noticing.
      blockers.push(
        `The payload contained no usable tokens for \`${themeName}\` (both \`onLight\` and \`onDark\` are required), so ${config.files
          .map((file) => `\`${file}\``)
          .join(' and ')} still hold the previous values.`,
      );
      continue;
    }

    const diff = writeTokenTree({ label: themeName, tree, config });
    added = [...added, ...diff.added.map((tokenPath) => `${themeName}.${tokenPath}`)];
    removed = [...removed, ...diff.removed.map((tokenPath) => `${themeName}.${tokenPath}`)];
  }

  for (const themeName of Object.keys(themeColorTokens)) {
    if (!targets.themes[themeName]) {
      blockers.push(
        `The payload contains a theme called \`${themeName}\` with no target files configured. Add it to \`packages/blade/scripts/tokenTargets.json\`, otherwise it is never written anywhere.`,
      );
    }
  }

  if (Object.keys(globalColorTokens).length) {
    const diff = writeTokenTree({
      label: 'globalColors',
      tree: globalColorTokens,
      config: targets.globalColors,
    });
    added = [...added, ...diff.added.map((tokenPath) => `globalColors.${tokenPath}`)];
    removed = [...removed, ...diff.removed.map((tokenPath) => `globalColors.${tokenPath}`)];
  } else {
    warnings.push('The payload contained no global color tokens, so `colors.ts` was not touched.');
  }

  if (!touchedFiles.size) {
    console.error('Nothing was written.');
    blockers.forEach((blocker) => console.error(`- ${blocker}`));
    process.exit(1);
  }

  // formatting first: everything after this reads the files back
  execa.sync('yarn', ['prettier', '--write', ...touchedFiles], { cwd: BLADE_ROOT });

  const consumers = findConsumersOfRemovedTokens(toSearchablePath(removed));
  if (consumers.length) {
    blockers.push(
      `${consumers.length} reference${
        consumers.length === 1 ? '' : 's'
      } to removed tokens are still in the repo (listed below). Migrate them, or restore the tokens in Figma.`,
    );
  }

  if (!skipTypecheck) {
    targets.verify.typecheck.forEach(runStep);
  }
  if (!skipSnapshots) {
    // token values are baked into component snapshots, so a push always dirties them
    targets.verify.snapshots.forEach(runStep);
  }

  console.log(
    `\n${added.length} token(s) added, ${removed.length} token(s) removed, ${preservedTokens.size} preserved.`,
  );
  warnings.forEach((warning) => console.warn(`⚠️  ${warning}`));
  blockers.forEach((blocker) => console.error(`⛔️  ${blocker}`));

  const body = buildPullRequestBody({ added, removed, consumers, report });

  if (isDryRun) {
    console.log(`\n--dry-run: files written, git and GitHub untouched.\n\n${body}`);
    return;
  }

  const branchName = randomNameGenerator
    .generator([randomNameGenerator.verb, randomNameGenerator.noun])
    .choose();

  writeChangeset({ branchName, added, removed });

  execa.commandSync(`git checkout -b ${branchName}`, { cwd: REPO_ROOT });
  execa.commandSync(`git config user.email ${GITHUB_BOT_EMAIL}`, { cwd: REPO_ROOT });
  execa.commandSync(`git config user.name ${GITHUB_BOT_USERNAME}`, { cwd: REPO_ROOT });
  execa.commandSync('git add -A', { cwd: REPO_ROOT });
  execa.sync('git', ['commit', '-m', 'feat(tokens): update tokens from figma'], {
    cwd: REPO_ROOT,
    env: { HUSKY_SKIP_HOOKS: 1 },
  });
  execa.commandSync(`git push origin ${branchName}`, { cwd: REPO_ROOT });

  // The title is constant. Draft state carries "this could not verify itself", and the reasons are
  // written into the body — both of which clear themselves as the PR is fixed and marked ready. A
  // marker in the title does not: it survives into the squashed commit on master unless somebody
  // remembers to strip it, which is exactly the kind of cleanup that gets missed.
  execa.sync(
    'gh',
    [
      'pr',
      'create',
      '--title',
      'feat(tokens): update tokens from figma',
      '--head',
      branchName,
      '--repo',
      'razorpay/blade',
      '--body',
      body,
      ...(blockers.length ? ['--draft'] : []),
    ],
    { cwd: REPO_ROOT, stdio: 'inherit' },
  );
};

uploadColorTokens().catch((error) => {
  console.error(error);
  process.exit(1);
});

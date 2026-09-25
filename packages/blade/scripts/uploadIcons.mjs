/* eslint-disable import/no-extraneous-dependencies */
/**
 * Turns an icon payload from the Figma plugin into icon components and opens a PR.
 *
 * The payload is the same `[{ [iconName]: svgString }]` array that `scripts/icons.json` holds, so
 * a local export can be replayed with:
 *
 *   node ./scripts/uploadIcons.mjs ./scripts/icons.json --targets=react,svelte --dry-run
 *
 * In CI it arrives gzip + base64 encoded through the `ICONS_PAYLOAD` environment variable, and the
 * packages to generate for through `ICONS_TARGETS`.
 *
 * Targets:
 * - `react`  → `@razorpay/blade`. One component serves web and native, since `Icons/_Svg` has a
 *              `.web` and a `.native` implementation of every element.
 * - `svelte` → `@razorpay/blade-svelte`, which keeps its own, smaller icon set.
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import execa from 'execa';
import lodash from 'lodash';
import nodePlop from 'node-plop';
import randomNameGenerator from 'moniker';
import { parseSync } from 'svgson';

const GITHUB_BOT_EMAIL = 'tools+cibot@razorpay.com';
const GITHUB_BOT_USERNAME = 'rzpcibot';

const BLADE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO_ROOT = path.resolve(BLADE_ROOT, '../..');
const REACT_ICONS_DIRECTORY = path.join(BLADE_ROOT, 'src/components/Icons');
const SVELTE_ROOT = path.join(REPO_ROOT, 'packages/blade-svelte');
const SVELTE_ICONS_DIRECTORY = path.join(SVELTE_ROOT, 'src/components/Icons');

const TARGETS = {
  react: { packageName: '@razorpay/blade', label: 'React (web + native)' },
  svelte: { packageName: '@razorpay/blade-svelte', label: 'Svelte' },
};

const args = process.argv.slice(2);
const flags = args.filter((arg) => arg.startsWith('--'));
const payloadArg = args.find((arg) => !arg.startsWith('--'));
const targetsFlag = flags.find((flag) => flag.startsWith('--targets='))?.split('=')[1];
const isDryRun = flags.includes('--dry-run');
const skipTypecheck = flags.includes('--skip-typecheck');
const skipSnapshots = flags.includes('--skip-snapshots');

/** Problems that must not ship. A non-empty list downgrades the PR to a draft. */
const blockers = [];
/** Worth a reviewer's attention but not a reason to hold the push. */
const warnings = [];

// ---------------------------------------------------------------------------------------------
// payload
// ---------------------------------------------------------------------------------------------

const readPayload = () => {
  const raw = process.env.ICONS_PAYLOAD || payloadArg;
  if (!raw) {
    throw new Error('No payload. Pass a JSON file path, or set ICONS_PAYLOAD.');
  }
  if (fs.existsSync(raw)) {
    return JSON.parse(fs.readFileSync(raw, 'utf8'));
  }
  try {
    return JSON.parse(zlib.gunzipSync(Buffer.from(raw, 'base64')).toString('utf8'));
  } catch (error) {
    return JSON.parse(raw);
  }
};

/** A dispatch from a plugin build that predates targets carries none, and meant React. */
const readTargets = () => {
  const requested = (process.env.ICONS_TARGETS || targetsFlag || 'react')
    .split(',')
    .map((target) => target.trim())
    .filter(Boolean);
  const unknown = requested.filter((target) => !TARGETS[target]);
  if (unknown.length || !requested.length) {
    throw new Error(
      `Unknown target(s): ${unknown.join(', ')}. Expected one or more of: ${Object.keys(
        TARGETS,
      ).join(', ')}.`,
    );
  }
  return new Set(requested);
};

/** Must match `plopfile.js`, which names the folder and the component. */
const toComponentName = (iconName) => `${lodash.startCase(iconName).trim().replace(/\s/g, '')}Icon`;

/**
 * Everything that would make the generator write the wrong thing, or write nothing, is rejected
 * before a single file changes. A half-generated icon set is harder to review than none.
 */
const parseIcons = (payload) => {
  if (!Array.isArray(payload) || !payload.length) {
    throw new Error('Expected a non-empty array of `{ [iconName]: svgString }` entries.');
  }

  const icons = payload.map((entry, index) => {
    const [iconName, svg] = Object.entries(entry ?? {})[0] ?? [];
    if (typeof iconName !== 'string' || typeof svg !== 'string' || !svg.includes('<svg')) {
      throw new Error(`Entry ${index} is not an \`{ [iconName]: svgString }\` pair.`);
    }
    const componentName = toComponentName(iconName);
    if (!/^[A-Z][A-Za-z0-9]*Icon$/.test(componentName)) {
      throw new Error(
        `"${iconName}" does not make a valid component name (got \`${componentName}\`). Rename the layer in Figma.`,
      );
    }
    return { iconName, svg, componentName };
  });

  const seen = new Map();
  icons.forEach(({ iconName, componentName }) => {
    if (seen.has(componentName)) {
      throw new Error(
        `"${seen.get(
          componentName,
        )}" and "${iconName}" both become \`${componentName}\`. Rename one of them in Figma.`,
      );
    }
    seen.set(componentName, iconName);
  });

  return icons;
};

/**
 * Both generators hardcode `viewBox="0 0 24 24"`, so artwork drawn on any other frame size is
 * squashed or cropped without any error.
 */
const checkViewBox = ({ svg, componentName }) => {
  const viewBox = /viewBox="([^"]*)"/.exec(svg)?.[1]?.trim();
  if (viewBox !== '0 0 24 24') {
    blockers.push(
      `\`${componentName}\` was exported with \`viewBox="${viewBox}"\`, but icons are generated on a 24×24 frame. Resize the icon in Figma to 24×24 and export again.`,
    );
  }
};

// ---------------------------------------------------------------------------------------------
// shared helpers
// ---------------------------------------------------------------------------------------------

const readIfExists = (filePath) =>
  fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;

const runStep = ({ name, cwd, command }) => {
  console.log(`\n▶ ${name}: ${command}`);
  try {
    // `preferLocal` puts node_modules/.bin (e.g. cross-env) on PATH outside of `yarn run`
    execa.commandSync(command, { cwd, stdio: 'inherit', shell: true, preferLocal: true });
    return true;
  } catch (error) {
    blockers.push(`\`${name}\` failed (\`${command}\`). See the workflow logs for the output.`);
    return false;
  }
};

const prettierWrite = (paths) => {
  if (paths.length) execa.sync('yarn', ['prettier', '--write', ...paths], { cwd: BLADE_ROOT });
};

// ---------------------------------------------------------------------------------------------
// react (@razorpay/blade — web + native)
// ---------------------------------------------------------------------------------------------

const reactComponentFile = (componentName) =>
  path.join(REACT_ICONS_DIRECTORY, componentName, `${componentName}.tsx`);

const reportPlopFailures = (label, { failures }) => {
  failures.forEach((failure) => {
    blockers.push(`${label}: ${failure.error ?? failure.message ?? JSON.stringify(failure)}`);
  });
};

const generateReactIcons = async (icons) => {
  // the plop generators resolve `./src/...` against the working directory
  process.chdir(BLADE_ROOT);
  const plop = await nodePlop(path.join(BLADE_ROOT, 'plopfile.js'));
  const iconGenerator = plop.getGenerator('generate-icons');
  const reexportsGenerator = plop.getGenerator('generate-reexports');

  const previousSources = new Map(
    icons.map(({ componentName }) => [
      componentName,
      readIfExists(reactComponentFile(componentName)),
    ]),
  );

  // sequential: each run modifies files the next one reads
  for (const icon of icons) {
    // eslint-disable-next-line no-await-in-loop
    const results = await iconGenerator.runActions({
      iconName: icon.iconName,
      svgContents: icon.svg,
    });
    reportPlopFailures(icon.componentName, results);
  }

  reportPlopFailures('Icon re-exports', await reexportsGenerator.runActions({}));

  // Plop formats with its own options, so its raw output never matches a committed file. Compare
  // only after the repo's formatting, or every re-exported icon reads as changed.
  prettierWrite([
    ...icons.map(({ componentName }) => path.join(REACT_ICONS_DIRECTORY, componentName)),
    path.join(REACT_ICONS_DIRECTORY, 'iconMap.ts'),
    path.join(REACT_ICONS_DIRECTORY, 'index.ts'),
  ]);

  const result = { added: [], updated: [], unchanged: [], skipped: [] };
  previousSources.forEach((previous, componentName) => {
    if (previous === null) result.added.push(componentName);
    else if (previous !== readIfExists(reactComponentFile(componentName)))
      result.updated.push(componentName);
    else result.unchanged.push(componentName);
  });

  const changed = [...result.added, ...result.updated];
  result.touchedPaths = changed.length
    ? [
        ...changed.map((componentName) => path.join(REACT_ICONS_DIRECTORY, componentName)),
        path.join(REACT_ICONS_DIRECTORY, 'iconMap.ts'),
        path.join(REACT_ICONS_DIRECTORY, 'index.ts'),
      ]
    : [];
  return result;
};

const verifyReactIcons = (changed) => {
  if (!skipTypecheck) {
    runStep({ name: '@razorpay/blade typecheck', cwd: BLADE_ROOT, command: 'yarn typecheck' });
  }
  if (!skipSnapshots) {
    const testPaths = changed.map((name) => `src/components/Icons/${name}/`).join(' ');
    runStep({
      name: 'web snapshots',
      cwd: BLADE_ROOT,
      command: `cross-env FRAMEWORK=REACT yarn jest -c ./jest.web.config.js --updateSnapshot --forceExit --ci=false ${testPaths}`,
    });
    runStep({
      name: 'native snapshots',
      cwd: BLADE_ROOT,
      command: `cross-env FRAMEWORK=REACT_NATIVE yarn jest -c ./jest.native.config.js --updateSnapshot --forceExit --ci=false ${testPaths}`,
    });
  }
};

// ---------------------------------------------------------------------------------------------
// svelte (@razorpay/blade-svelte)
// ---------------------------------------------------------------------------------------------

/** `blade-svelte`'s `Icons/_Svg` only has `Svg` and `Path`, and `Path` only takes these props. */
const SVELTE_PATH_PROPS = {
  d: 'string',
  fill: 'color',
  fillOpacity: 'number',
  fillRule: 'string',
  clipRule: 'string',
  stroke: 'color',
  strokeWidth: 'number',
  strokeLinecap: 'string',
  strokeLinejoin: 'string',
};

const toSvelteProp = (name, value) => {
  const kind = SVELTE_PATH_PROPS[name];
  if (kind === 'color' && value !== 'none') return `${name}={iconProps.iconColor}`;
  if (kind === 'number') return `${name}={${Number(value)}}`;
  return `${name}="${value}"`;
};

/**
 * Returns the component source, or the reason the icon cannot be expressed with `blade-svelte`'s
 * primitives. Adding `Circle`, `G`, `ClipPath`... to `_Svg` is a design decision for that package,
 * not something to slip in through an icon push.
 */
const toSvelteComponent = (svg) => {
  const root = parseSync(svg, { camelcase: true });
  const paths = root.children.filter((node) => node.type === 'element');

  const unsupportedElements = [
    ...new Set(paths.filter((node) => node.name !== 'path').map((node) => `<${node.name}>`)),
  ];
  if (unsupportedElements.length) {
    return {
      reason: `uses ${unsupportedElements.join(
        ', ',
      )}, and blade-svelte's \`Icons/_Svg\` only has \`Svg\` and \`Path\``,
    };
  }

  const unsupportedProps = [
    ...new Set(
      paths.flatMap((node) =>
        Object.keys(node.attributes).filter((key) => !SVELTE_PATH_PROPS[key]),
      ),
    ),
  ];
  if (unsupportedProps.length) {
    return {
      reason: `sets ${unsupportedProps
        .map((prop) => `\`${prop}\``)
        .join(', ')} on a path, which blade-svelte's \`Path\` does not accept`,
    };
  }

  const pathSources = paths.map((node) => {
    const props = Object.entries(node.attributes).map(([name, value]) => toSvelteProp(name, value));
    return ['  <Path', ...props.map((prop) => `    ${prop}`), '  />'].join('\n');
  });

  return {
    source: `<script lang="ts">
  import { Svg, Path } from '../_Svg';
  import { getIconProps } from '../getIconProps';
  import type { IconProps } from '../types';

  let { size = 'medium', color = 'surface.icon.gray.normal', ...rest }: IconProps = $props();

  const iconProps = $derived(getIconProps({ size, color }));
</script>

<Svg
  width={iconProps.width}
  height={iconProps.height}
  viewBox="0 0 24 24"
  {...rest}
>
${pathSources.join('\n')}
</Svg>
`,
  };
};

/** Hand-written icons order attributes their own way; the artwork is what has to match. */
const pathDataOf = (source) => [...source.matchAll(/\bd="([^"]*)"/g)].map((match) => match[1]);

/**
 * `blade-svelte`'s `index.ts`, `iconMap.ts` and stories are grouped by hand, so a new icon goes at
 * the end of the group it belongs to rather than through a regenerated file.
 */
const insertAfterBlock = ({ content, marker, line, blockPattern }) => {
  const lines = content.split('\n');
  const markerIndex = lines.findIndex((candidate) => candidate.trim() === marker);
  if (markerIndex === -1) return null;
  let insertAt = markerIndex + 1;
  while (insertAt < lines.length && blockPattern.test(lines[insertAt])) insertAt += 1;
  lines.splice(insertAt, 0, line);
  return lines.join('\n');
};

const registerSvelteIcon = (componentName) => {
  const isFilled = componentName.endsWith('FilledIcon');
  const touched = [];

  const indexPath = path.join(SVELTE_ICONS_DIRECTORY, 'index.ts');
  const index = insertAfterBlock({
    content: fs.readFileSync(indexPath, 'utf8'),
    marker: isFilled ? '// Filled Icons' : '// Stroked Icons',
    line: `export { ${componentName} } from './${componentName}';`,
    blockPattern: /^export \{/,
  });
  if (index) {
    fs.writeFileSync(indexPath, index);
    touched.push(indexPath);
  } else {
    blockers.push(
      `Could not find where to export \`${componentName}\` in \`packages/blade-svelte/src/components/Icons/index.ts\`. Add the export by hand.`,
    );
  }

  const iconMapPath = path.join(SVELTE_ICONS_DIRECTORY, 'iconMap.ts');
  let iconMap = fs.readFileSync(iconMapPath, 'utf8');
  const lastImport = [...iconMap.matchAll(/^import \{ \w+ \} from '\.\/\w+';$/gm)].pop();
  const mapEnd = iconMap.lastIndexOf('\n};');
  if (lastImport && mapEnd !== -1) {
    iconMap = `${iconMap.slice(0, mapEnd)}\n  ${componentName},${iconMap.slice(mapEnd)}`;
    const importEnd = lastImport.index + lastImport[0].length;
    iconMap = `${iconMap.slice(
      0,
      importEnd,
    )}\nimport { ${componentName} } from './${componentName}';${iconMap.slice(importEnd)}`;
    fs.writeFileSync(iconMapPath, iconMap);
    touched.push(iconMapPath);
  } else {
    blockers.push(
      `Could not add \`${componentName}\` to \`packages/blade-svelte/src/components/Icons/iconMap.ts\`. Add it by hand.`,
    );
  }

  const storiesPath = path.join(SVELTE_ICONS_DIRECTORY, 'Icons.stories.svelte');
  const storiesWithImport = insertAfterBlock({
    content: fs.readFileSync(storiesPath, 'utf8'),
    marker: isFilled ? '// Filled Icons' : '// Stroked Icons',
    line: `  import { ${componentName} } from './${componentName}';`,
    blockPattern: /^\s*import \{/,
  });
  const stories = storiesWithImport
    ? insertAfterBlock({
        content: storiesWithImport,
        marker: isFilled ? 'const filledIcons = {' : 'const strokedIcons = {',
        line: `    ${componentName},`,
        blockPattern: /^\s+\w+,$/,
      })
    : null;
  if (stories) {
    fs.writeFileSync(storiesPath, stories);
    touched.push(storiesPath);
  } else {
    warnings.push(`\`${componentName}\` was not added to the blade-svelte Icons stories.`);
  }

  return touched;
};

const generateSvelteIcons = (icons) => {
  const result = { added: [], updated: [], unchanged: [], skipped: [] };
  const touchedPaths = new Set();

  icons.forEach(({ svg, componentName }) => {
    const { source, reason } = toSvelteComponent(svg);
    if (!source) {
      result.skipped.push(componentName);
      blockers.push(`\`${componentName}\` was not generated for Svelte: it ${reason}.`);
      return;
    }

    const iconDirectory = path.join(SVELTE_ICONS_DIRECTORY, componentName);
    const componentPath = path.join(iconDirectory, `${componentName}.svelte`);
    const previous = readIfExists(componentPath);

    if (previous !== null && pathDataOf(previous).join('\n') === pathDataOf(source).join('\n')) {
      result.unchanged.push(componentName);
      return;
    }

    fs.mkdirSync(iconDirectory, { recursive: true });
    fs.writeFileSync(componentPath, source);
    touchedPaths.add(iconDirectory);

    if (previous !== null) {
      result.updated.push(componentName);
      return;
    }

    fs.writeFileSync(
      path.join(iconDirectory, 'index.ts'),
      `export { default as ${componentName} } from './${componentName}.svelte';\n`,
    );
    registerSvelteIcon(componentName).forEach((touched) => touchedPaths.add(touched));
    result.added.push(componentName);
  });

  // .svelte files are written pre-formatted; the repo has no Svelte parser for prettier
  prettierWrite([...touchedPaths].filter((touched) => touched.endsWith('.ts')));
  result.touchedPaths = [...touchedPaths];
  return result;
};

const verifySvelteIcons = () => {
  if (skipTypecheck) return;
  // svelte-check resolves `@razorpay/blade-core/utils` through its built output
  const isCoreBuilt = runStep({
    name: '@razorpay/blade-core build',
    cwd: path.join(REPO_ROOT, 'packages/blade-core'),
    command: 'yarn build',
  });
  if (isCoreBuilt) {
    runStep({
      name: '@razorpay/blade-svelte svelte-check',
      cwd: SVELTE_ROOT,
      command: 'yarn svelte-check --threshold error',
    });
  }
};

// ---------------------------------------------------------------------------------------------
// reporting
// ---------------------------------------------------------------------------------------------

const changedIn = (result) => [...result.added, ...result.updated];

const describeIcons = (componentNames) => {
  const shown = componentNames.slice(0, 3).join(', ');
  const rest = componentNames.length - 3;
  return rest > 0 ? `${shown} and ${rest} more` : shown;
};

const buildTitle = (results) => {
  const unique = (names) => [...new Set(names)];
  const added = unique(Object.values(results).flatMap((result) => result.added));
  const updated = unique(
    Object.values(results)
      .flatMap((result) => result.updated)
      .filter((name) => !added.includes(name)),
  );
  const scope = Object.keys(results).length === 1 && results.svelte ? 'blade-svelte' : 'icons';

  if (added.length && updated.length) {
    return `feat(${scope}): add ${describeIcons(added)}, update ${describeIcons(updated)}`;
  }
  if (added.length) return `feat(${scope}): add ${describeIcons(added)}`;
  return `fix(${scope}): update ${describeIcons(updated)}`;
};

const bulletList = (componentNames) => componentNames.map((name) => `- \`${name}\``).join('\n');

const buildTargetSection = (target, result) => {
  const { packageName, label } = TARGETS[target];
  const sections = [`## ${label} — \`${packageName}\``, ''];

  if (!changedIn(result).length && !result.skipped.length) {
    sections.push('_No changes._', '');
  }
  if (result.added.length) sections.push('**Added**', '', bulletList(result.added), '');
  if (result.updated.length) {
    sections.push(
      '**Updated** — these already existed and their artwork changed:',
      '',
      bulletList(result.updated),
      '',
    );
  }
  if (result.skipped.length) {
    sections.push(
      '**Skipped** — could not be generated, see Blocking:',
      '',
      bulletList(result.skipped),
      '',
    );
  }
  if (result.unchanged.length) {
    sections.push(
      '<details>',
      `<summary>Exported but unchanged (${result.unchanged.length})</summary>`,
      '',
      bulletList(result.unchanged),
      '',
      '</details>',
      '',
    );
  }
  return sections;
};

const buildPullRequestBody = (results) => {
  const sections = [
    'This PR was opened by the Icons Upload GitHub action from icons exported with the Blade Token Publisher Figma plugin.',
    '',
  ];

  if (blockers.length) {
    sections.push(
      '## ⛔️ Blocking',
      '',
      'Opened as a draft because the push could not verify itself. Fix these before marking it ready:',
      '',
      ...blockers.map((blocker) => `- ${blocker}`),
      '',
    );
  }
  if (warnings.length) {
    sections.push('## Warnings', '', ...warnings.map((warning) => `- ${warning}`), '');
  }

  Object.entries(results).forEach(([target, result]) => {
    sections.push(...buildTargetSection(target, result));
  });

  return sections.join('\n');
};

const writeChangeset = ({ branchName, title, results }) => {
  const frontmatter = Object.entries(results)
    .filter(([, result]) => changedIn(result).length)
    .map(([target]) => `'${TARGETS[target].packageName}': patch`)
    .join('\n');
  const changesetPath = path.join(REPO_ROOT, `.changeset/figma-icons-${branchName}.md`);
  fs.writeFileSync(changesetPath, `---\n${frontmatter}\n---\n\n${title}\n`);
  return changesetPath;
};

// ---------------------------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------------------------

const uploadIcons = async () => {
  const targets = readTargets();
  const icons = parseIcons(readPayload());
  icons.forEach(checkViewBox);

  const results = {};
  if (targets.has('react')) results.react = await generateReactIcons(icons);
  if (targets.has('svelte')) results.svelte = generateSvelteIcons(icons);

  const touchedPaths = Object.values(results).flatMap((result) => result.touchedPaths);
  if (!touchedPaths.length) {
    console.log('Every exported icon already matches the repo. Nothing to do.');
    blockers.forEach((blocker) => console.error(`⛔️  ${blocker}`));
    return;
  }

  if (results.react && changedIn(results.react).length) verifyReactIcons(changedIn(results.react));
  if (results.svelte && changedIn(results.svelte).length) verifySvelteIcons();

  Object.entries(results).forEach(([target, result]) => {
    console.log(
      `\n${TARGETS[target].label}: ${result.added.length} added, ${result.updated.length} updated, ${result.unchanged.length} unchanged, ${result.skipped.length} skipped.`,
    );
  });
  warnings.forEach((warning) => console.warn(`⚠️  ${warning}`));
  blockers.forEach((blocker) => console.error(`⛔️  ${blocker}`));

  const title = buildTitle(results);
  const body = buildPullRequestBody(results);

  if (isDryRun) {
    console.log(`\n--dry-run: files written, git and GitHub untouched.\n\n# ${title}\n\n${body}`);
    return;
  }

  const branchName = `figma-icons-${randomNameGenerator
    .generator([randomNameGenerator.verb, randomNameGenerator.noun])
    .choose()}`;
  const changesetPath = writeChangeset({ branchName, title, results });

  execa.sync('git', ['checkout', '-b', branchName], { cwd: REPO_ROOT });
  execa.sync('git', ['config', 'user.email', GITHUB_BOT_EMAIL], { cwd: REPO_ROOT });
  execa.sync('git', ['config', 'user.name', GITHUB_BOT_USERNAME], { cwd: REPO_ROOT });
  execa.sync('git', ['add', '--', ...touchedPaths, changesetPath], { cwd: REPO_ROOT });
  execa.sync('git', ['commit', '-m', title], {
    cwd: REPO_ROOT,
    env: { HUSKY_SKIP_HOOKS: 1 },
  });
  execa.sync('git', ['push', 'origin', branchName], { cwd: REPO_ROOT });

  execa.sync(
    'gh',
    [
      'pr',
      'create',
      '--title',
      title,
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

uploadIcons().catch((error) => {
  console.error(error);
  process.exit(1);
});

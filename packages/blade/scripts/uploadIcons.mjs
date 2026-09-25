/* eslint-disable import/no-extraneous-dependencies */
/**
 * Turns an icon payload from the Figma plugin into icon components and opens a PR.
 *
 * The payload is the same `[{ [iconName]: svgString }]` array that `scripts/icons.json` holds, so
 * a local export can be replayed with:
 *
 *   node ./scripts/uploadIcons.mjs ./scripts/icons.json --dry-run
 *
 * In CI it arrives gzip + base64 encoded through the `ICONS_PAYLOAD` environment variable.
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import execa from 'execa';
import lodash from 'lodash';
import nodePlop from 'node-plop';
import randomNameGenerator from 'moniker';

const GITHUB_BOT_EMAIL = 'tools+cibot@razorpay.com';
const GITHUB_BOT_USERNAME = 'rzpcibot';

const BLADE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO_ROOT = path.resolve(BLADE_ROOT, '../..');
const ICONS_DIRECTORY = path.join(BLADE_ROOT, 'src/components/Icons');

const args = process.argv.slice(2);
const flags = args.filter((arg) => arg.startsWith('--'));
const payloadArg = args.find((arg) => !arg.startsWith('--'));
const isDryRun = flags.includes('--dry-run');
const skipTypecheck = flags.includes('--skip-typecheck');
const skipSnapshots = flags.includes('--skip-snapshots');

/** Problems that must not ship. A non-empty list downgrades the PR to a draft. */
const blockers = [];

// ---------------------------------------------------------------------------------------------
// payload
// ---------------------------------------------------------------------------------------------

const readPayload = () => {
  const raw = process.env.ICONS_PAYLOAD ?? payloadArg;
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
 * The generator hardcodes `viewBox="0 0 24 24"`, so artwork drawn on any other frame size is
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
// generation
// ---------------------------------------------------------------------------------------------

const componentFilePath = (componentName) =>
  path.join(ICONS_DIRECTORY, componentName, `${componentName}.tsx`);

const readIfExists = (filePath) =>
  fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;

const reportFailures = (label, { failures }) => {
  failures.forEach((failure) => {
    blockers.push(`${label}: ${failure.error ?? failure.message ?? JSON.stringify(failure)}`);
  });
};

const generateIcons = async (icons) => {
  // the plop generators resolve `./src/...` against the working directory
  process.chdir(BLADE_ROOT);
  const plop = await nodePlop(path.join(BLADE_ROOT, 'plopfile.js'));
  const iconGenerator = plop.getGenerator('generate-icons');
  const reexportsGenerator = plop.getGenerator('generate-reexports');

  const previousSources = new Map(
    icons.map(({ componentName }) => [
      componentName,
      readIfExists(componentFilePath(componentName)),
    ]),
  );

  // sequential: each run modifies files the next one reads
  for (const icon of icons) {
    // eslint-disable-next-line no-await-in-loop
    const results = await iconGenerator.runActions({
      iconName: icon.iconName,
      svgContents: icon.svg,
    });
    reportFailures(icon.componentName, results);
  }

  reportFailures('Icon re-exports', await reexportsGenerator.runActions({}));

  // Plop formats with its own options, so its raw output never matches a committed file. Compare
  // only after the repo's formatting, or every re-exported icon reads as changed.
  execa.sync(
    'yarn',
    [
      'prettier',
      '--write',
      ...icons.map(({ componentName }) => path.join(ICONS_DIRECTORY, componentName)),
      path.join(ICONS_DIRECTORY, 'iconMap.ts'),
      path.join(ICONS_DIRECTORY, 'index.ts'),
    ],
    { cwd: BLADE_ROOT },
  );

  const added = [];
  const updated = [];
  const unchanged = [];
  previousSources.forEach((previous, componentName) => {
    if (previous === null) added.push(componentName);
    else if (previous !== readIfExists(componentFilePath(componentName)))
      updated.push(componentName);
    else unchanged.push(componentName);
  });

  return { added, updated, unchanged };
};

const runStep = ({ name, command }) => {
  console.log(`\n▶ ${name}: ${command}`);
  try {
    // `preferLocal` puts node_modules/.bin (e.g. cross-env) on PATH outside of `yarn run`
    execa.commandSync(command, {
      cwd: BLADE_ROOT,
      stdio: 'inherit',
      shell: true,
      preferLocal: true,
    });
  } catch (error) {
    blockers.push(`\`${name}\` failed (\`${command}\`). See the workflow logs for the output.`);
  }
};

// ---------------------------------------------------------------------------------------------
// reporting
// ---------------------------------------------------------------------------------------------

const describeIcons = (componentNames) => {
  const shown = componentNames.slice(0, 3).join(', ');
  const rest = componentNames.length - 3;
  return rest > 0 ? `${shown} and ${rest} more` : shown;
};

const buildTitle = ({ added, updated }) => {
  if (added.length && updated.length) {
    return `feat(icons): add ${describeIcons(added)}, update ${describeIcons(updated)}`;
  }
  if (added.length) return `feat(icons): add ${describeIcons(added)}`;
  return `fix(icons): update ${describeIcons(updated)}`;
};

const bulletList = (componentNames) => componentNames.map((name) => `- \`${name}\``).join('\n');

const buildPullRequestBody = ({ added, updated, unchanged }) => {
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

  if (added.length) sections.push('## Added', '', bulletList(added), '');
  if (updated.length) {
    sections.push(
      '## Updated',
      '',
      'These icons already existed and their artwork changed. Check the snapshot diffs.',
      '',
      bulletList(updated),
      '',
    );
  }
  if (unchanged.length) {
    sections.push(
      '<details>',
      `<summary>Exported but unchanged (${unchanged.length})</summary>`,
      '',
      bulletList(unchanged),
      '',
      '</details>',
      '',
    );
  }

  return sections.join('\n');
};

const writeChangeset = ({ branchName, title }) => {
  const changesetPath = path.join(REPO_ROOT, `.changeset/figma-icons-${branchName}.md`);
  fs.writeFileSync(changesetPath, `---\n'@razorpay/blade': patch\n---\n\n${title}\n`);
  return changesetPath;
};

// ---------------------------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------------------------

const uploadIcons = async () => {
  const icons = parseIcons(readPayload());
  icons.forEach(checkViewBox);

  const { added, updated, unchanged } = await generateIcons(icons);
  const changedIcons = [...added, ...updated];

  if (!changedIcons.length) {
    console.log(`All ${unchanged.length} exported icon(s) already match the repo. Nothing to do.`);
    blockers.forEach((blocker) => console.error(`⛔️  ${blocker}`));
    return;
  }

  const touchedPaths = [
    ...changedIcons.map((componentName) => path.join(ICONS_DIRECTORY, componentName)),
    path.join(ICONS_DIRECTORY, 'iconMap.ts'),
    path.join(ICONS_DIRECTORY, 'index.ts'),
  ];

  if (!skipTypecheck) {
    runStep({ name: 'typecheck', command: 'yarn typecheck' });
  }
  if (!skipSnapshots) {
    const testPaths = changedIcons.map((name) => `src/components/Icons/${name}/`).join(' ');
    runStep({
      name: 'web snapshots',
      command: `cross-env FRAMEWORK=REACT yarn jest -c ./jest.web.config.js --updateSnapshot --forceExit --ci=false ${testPaths}`,
    });
    runStep({
      name: 'native snapshots',
      command: `cross-env FRAMEWORK=REACT_NATIVE yarn jest -c ./jest.native.config.js --updateSnapshot --forceExit --ci=false ${testPaths}`,
    });
  }

  console.log(`\n${added.length} added, ${updated.length} updated, ${unchanged.length} unchanged.`);
  blockers.forEach((blocker) => console.error(`⛔️  ${blocker}`));

  const title = buildTitle({ added, updated });
  const body = buildPullRequestBody({ added, updated, unchanged });

  if (isDryRun) {
    console.log(`\n--dry-run: files written, git and GitHub untouched.\n\n# ${title}\n\n${body}`);
    return;
  }

  const branchName = `figma-icons-${randomNameGenerator
    .generator([randomNameGenerator.verb, randomNameGenerator.noun])
    .choose()}`;
  const changesetPath = writeChangeset({ branchName, title });

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

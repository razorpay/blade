// Which Blade packages a project uses, and which skill documents each one.
import fs from 'fs';
import path from 'path';

const DEPENDENCY_FIELDS = ['dependencies', 'devDependencies', 'peerDependencies'];

export const FRAMEWORKS = {
  react: { packageName: '@razorpay/blade', skill: 'blade', fileTypes: '.tsx/.jsx' },
  // No skill documents blade-svelte. It is still detected so a Svelte app whose
  // lockfile pulls in @razorpay/blade transitively is not told it uses React.
  svelte: { packageName: '@razorpay/blade-svelte', skill: null, fileTypes: '.svelte' },
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');

// Matches the package as a whole name, so '@razorpay/blade' does not match
// '@razorpay/blade-svelte' or '@razorpay/blade-core'. Covers yarn v1
// (`"@razorpay/blade@^12"`, `@razorpay/blade@^12`), yarn berry
// (`"@razorpay/blade@npm:^12"`), npm (`"node_modules/@razorpay/blade"`,
// `"@razorpay/blade": "^12"`) and pnpm (`/@razorpay/blade@12.0.0`,
// `'@razorpay/blade': 12.0.0`).
export const lockfileMentions = (content, packageName) =>
  new RegExp(`(^|["'\\s/,])${escapeRegExp(packageName)}(["']?\\s*:|@)`, 'm').test(content);

const LOCKFILES = ['yarn.lock', 'package-lock.json', 'pnpm-lock.yaml', 'bun.lock'];

const readFile = (file) => {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return null;
  }
};

const readPackageJSON = (dir) => {
  try {
    return JSON.parse(readFile(path.join(dir, 'package.json')));
  } catch {
    return null;
  }
};

const directFrameworks = (pkg, found) => {
  for (const [framework, { packageName }] of Object.entries(FRAMEWORKS)) {
    if (DEPENDENCY_FIELDS.some((field) => pkg?.[field]?.[packageName])) found.add(framework);
  }
};

const workspacePatterns = (dir, pkg) => {
  const fromPackage = Array.isArray(pkg?.workspaces) ? pkg.workspaces : pkg?.workspaces?.packages;
  if (Array.isArray(fromPackage)) return fromPackage;
  const yaml = readFile(path.join(dir, 'pnpm-workspace.yaml'));
  if (!yaml) return [];
  const block = yaml.split(/^packages:\s*$/m)[1] ?? '';
  return [...block.matchAll(/^\s+-\s+['"]?([^'"#\n]+?)['"]?\s*$/gm)].map((match) => match[1]);
};

// Supports literal paths and a trailing `/*`, which covers almost every
// workspace config. Anything else (`**`, negations) is skipped and the
// lockfile fallback handles it.
const workspaceDirs = (root, patterns) =>
  patterns.flatMap((pattern) => {
    const clean = pattern.replace(/^\.\//, '').replace(/\/$/, '');
    if (clean.startsWith('!') || clean.includes('**')) return [];
    if (!clean.endsWith('/*')) return clean.includes('*') ? [] : [path.join(root, clean)];
    const parent = path.join(root, clean.slice(0, -2));
    try {
      return fs
        .readdirSync(parent, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => path.join(parent, entry.name));
    } catch {
      return [];
    }
  });

const toList = (found) => Object.keys(FRAMEWORKS).filter((framework) => found.has(framework));

// Returns the Blade frameworks a project depends on: ['react'], ['svelte'] or
// ['react', 'svelte'] for a monorepo with both. Walks up from cwd so sessions
// started in a subdirectory or workspace still resolve. Declared dependencies
// win over the lockfile, because a lockfile also lists transitive packages: a
// Svelte app whose shared library pulls in @razorpay/blade must not be told it
// uses React. Stops at the repository root so a parent folder never leaks in.
export const detectFrameworks = (cwd) => {
  if (!cwd) return [];
  for (let dir = path.resolve(cwd); ; dir = path.dirname(dir)) {
    const found = new Set();
    const pkg = readPackageJSON(dir);
    directFrameworks(pkg, found);
    if (found.size > 0) return toList(found);

    const patterns = workspacePatterns(dir, pkg);
    for (const workspace of workspaceDirs(dir, patterns)) {
      directFrameworks(readPackageJSON(workspace), found);
    }
    if (found.size > 0) return toList(found);

    const lockfiles = LOCKFILES.map((lock) => readFile(path.join(dir, lock))).filter(Boolean);
    for (const content of lockfiles) {
      for (const [framework, { packageName }] of Object.entries(FRAMEWORKS)) {
        if (lockfileMentions(content, packageName)) found.add(framework);
      }
    }
    // A lockfile or workspace config marks the project root.
    if (lockfiles.length > 0 || patterns.length > 0) return toList(found);

    const parent = path.dirname(dir);
    if (parent === dir || fs.existsSync(path.join(dir, '.git'))) return [];
  }
};

// Returns null when no detected framework has a skill (a blade-svelte-only
// project), so the hook prints nothing.
export const getNudge = (frameworks) => {
  if (!frameworks.includes('react')) return null;
  const { packageName, skill } = FRAMEWORKS.react;
  const nudge = `This project uses ${packageName}. Before writing or reviewing UI code, invoke the ${skill} skill and read the component docs it points to.`;
  if (!frameworks.includes('svelte')) return nudge;
  return `${nudge} The ${skill} skill covers ${FRAMEWORKS.react.fileTypes} files only; do not apply its APIs to .svelte files that use ${FRAMEWORKS.svelte.packageName}.`;
};

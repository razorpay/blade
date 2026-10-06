// Which Blade packages a project uses, and which skill documents each one.
import fs from 'fs';
import path from 'path';

const DEPENDENCY_FIELDS = ['dependencies', 'devDependencies', 'peerDependencies'];

export const FRAMEWORKS = {
  react: { packageName: '@razorpay/blade', skill: 'blade', fileTypes: '.tsx/.jsx' },
  svelte: { packageName: '@razorpay/blade-svelte', skill: 'blade-svelte', fileTypes: '.svelte' },
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

const readPackageJSON = (cwd) => {
  try {
    return JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'));
  } catch {
    return null;
  }
};

// Returns the Blade frameworks a project depends on: ['react'], ['svelte'] or
// ['react', 'svelte'] for a monorepo with both. The lockfile check catches
// monorepos where the root package.json is a shell.
export const detectFrameworks = (cwd) => {
  if (!cwd) return [];
  const pkg = readPackageJSON(cwd);
  const found = new Set();
  for (const [framework, { packageName }] of Object.entries(FRAMEWORKS)) {
    if (pkg && DEPENDENCY_FIELDS.some((field) => pkg[field] && pkg[field][packageName])) {
      found.add(framework);
    }
  }
  for (const lock of ['yarn.lock', 'package-lock.json', 'pnpm-lock.yaml']) {
    let content;
    try {
      content = fs.readFileSync(path.join(cwd, lock), 'utf8');
    } catch {
      continue;
    }
    for (const [framework, { packageName }] of Object.entries(FRAMEWORKS)) {
      if (lockfileMentions(content, packageName)) found.add(framework);
    }
  }
  return Object.keys(FRAMEWORKS).filter((framework) => found.has(framework));
};

export const getNudge = (frameworks) => {
  if (frameworks.length === 1) {
    const { packageName, skill } = FRAMEWORKS[frameworks[0]];
    return `This project uses ${packageName}. Before writing or reviewing UI code, invoke the ${skill} skill and read the component docs it points to.`;
  }
  const perFramework = frameworks
    .map((framework) => {
      const { packageName, skill, fileTypes } = FRAMEWORKS[framework];
      return `the ${skill} skill for ${fileTypes} files that use ${packageName}`;
    })
    .join(' and ');
  return `This project uses more than one Blade package. Before writing or reviewing UI code, invoke ${perFramework}, then read the component docs it points to. Do not mix APIs between them.`;
};

/**
 * Finds drift between blade-svelte's components (source of truth) and the
 * prop types written in the blade-svelte knowledgebase docs.
 *
 * Every public component (`@razorpay/blade-svelte/components`) must have a
 * `{Name}Props` interface (or type) in a ```typescript block of some doc in
 * `skills/blade-svelte/references/components/` (sub-components in their
 * parent's doc), listing its props one by one. Reported:
 * - components with no `{Name}Props` in any doc
 * - props the component takes that the doc leaves out
 * - props the doc lists that the component does not take.
 * The component's props are read from its `$props()` (svelteKnowledgebase.js).
 *
 * Known exceptions live in `scripts/knowledgebaseDriftIgnore.svelte.json`:
 * `components` (no doc needed) and `props` (`{ Name: { prop: reason } }`).
 * Every entry needs a reason.
 *
 * Usage:
 *   yarn check:knowledgebase-drift --target svelte          # all components
 *   yarn check:knowledgebase-drift --target svelte Button   # selected ones
 *   yarn check:knowledgebase-drift --target svelte --fail   # exit 1 on drift
 */
const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const { Project, Node } = require('ts-morph');
const {
  rootDir,
  knowledgebasePath,
  exportedNames,
  getComponentProps,
} = require('./svelteKnowledgebase');

const args = process.argv.slice(2);
const shouldFail = args.includes('--fail');
const targetIndex = args.indexOf('--target');
const selected = args.filter((arg, index) => !arg.startsWith('--') && index !== targetIndex + 1);
const reportPath = path.join(rootDir, 'knowledgebase-drift-report.svelte.json');
const ignore = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'knowledgebaseDriftIgnore.svelte.json'), 'utf8'),
);

// Doc types are read for their member names only: unknown types are fine.
const docs = new Project({ useInMemoryFileSystem: true, compilerOptions: { strict: true } });

/**
 * A doc type's member names: its apparent properties, and an interface's
 * own property signatures (kept when a member's type is unknown).
 * @param {import('ts-morph').InterfaceDeclaration | import('ts-morph').TypeAliasDeclaration} declaration
 */
function memberNames(declaration) {
  const props = new Set();
  const type = declaration.getType();
  const members = type.isUnion() ? type.getUnionTypes() : [type];
  members
    .flatMap((member) => member.getApparentProperties())
    .forEach((symbol) => {
      props.add(symbol.getName());
    });
  if (Node.isInterfaceDeclaration(declaration)) {
    declaration
      .getMembers()
      .filter((member) => Node.isPropertySignature(member))
      .forEach((member) => props.add(member.getName()));
  }
  return props;
}

/** `{Name}Props` declared in the docs → { file, props }. */
const documented = new Map();
for (const file of glob.sync(`${knowledgebasePath}/components/*.md`).sort()) {
  const content = fs.readFileSync(file, 'utf8');
  const blocks = [...content.matchAll(/^```typescript[^\n]*\n([\s\S]*?)^```/gm)];
  blocks.forEach(([, code], block) => {
    const source = docs.createSourceFile(`${path.basename(file)}.${block}.ts`, code, {
      overwrite: true,
    });
    [...source.getInterfaces(), ...source.getTypeAliases()]
      .filter((declaration) => declaration.getName().endsWith('Props'))
      .forEach((declaration) => {
        documented.set(declaration.getName(), {
          file: path.relative(rootDir, file),
          props: memberNames(declaration),
        });
      });
  });
}

const report = [];
let checked = 0;
const components = [...exportedNames.components]
  .filter((name) => /^[A-Z]/.test(name))
  .filter((name) => !selected.length || selected.includes(name))
  .sort();

for (const name of components) {
  const actual = getComponentProps(name);
  if (!actual) continue; // a type or a value that is not a component
  if (ignore.components?.[name]) continue;
  checked += 1;
  const doc = documented.get(`${name}Props`);
  if (!doc) {
    report.push({ component: name, issue: `no ${name}Props in any component doc` });
    continue;
  }
  const ignoredProps = ignore.props?.[name] ?? {};
  const missing = [...actual].filter((prop) => !doc.props.has(prop) && !ignoredProps[prop]);
  const extra = [...doc.props].filter((prop) => !actual.has(prop) && !ignoredProps[prop]);
  if (missing.length || extra.length) {
    report.push({ component: name, file: doc.file, missingInDoc: missing, notInCode: extra });
  }
}

fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
console.log('--------------------------------');
if (report.length) {
  console.log(`⚠️  ${report.length} blade-svelte components drift from the knowledgebase\n`);
  for (const entry of report) {
    if (entry.issue) {
      console.log(`${entry.component}: ${entry.issue}`);
      continue;
    }
    console.log(`${entry.component} (${entry.file})`);
    if (entry.missingInDoc.length)
      console.log(`  missing in doc: ${entry.missingInDoc.join(', ')}`);
    if (entry.notInCode.length) console.log(`  not in code: ${entry.notInCode.join(', ')}`);
  }
  console.log('--------------------------------');
  process.exit(shouldFail ? 1 : 0);
}
console.log(`✅ ${checked} blade-svelte components match their docs`);
console.log('--------------------------------');

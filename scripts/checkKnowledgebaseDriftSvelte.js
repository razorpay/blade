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
 * Given a package built on blade-svelte (`--package <dir> --docs <dir>`, or
 * `--config <file>`: see `svelteKnowledgebase.js`), it compares that
 * package's own components with the `{Name}Props` in its docs
 * (`--component-docs`, default `--docs`), with `--drift-ignore <file>` as
 * its ignore file.
 *
 * Usage:
 *   yarn check:knowledgebase-drift --target svelte          # all components
 *   yarn check:knowledgebase-drift --target svelte Button   # selected ones
 *   yarn check:knowledgebase-drift --target svelte --fail   # exit 1 on drift
 *   yarn check:knowledgebase-drift --target svelte --config ../app/packages/ui/knowledgebase.json --fail
 */
const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const { Project, Node } = require('ts-morph');
const { rootDir, createKnowledgebase, parseArgs } = require('./svelteKnowledgebase');

const { options, positionals: selected, booleans } = parseArgs(process.argv.slice(2));
const kb = createKnowledgebase(options);
const shouldFail = booleans.has('--fail');
const reportPath = kb.report ?? path.join(rootDir, 'knowledgebase-drift-report.svelte.json');
const ignore = kb.driftIgnore ? JSON.parse(fs.readFileSync(kb.driftIgnore, 'utf8')) : {};

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
for (const file of glob.sync(`${kb.componentDocsDir}/*.md`).sort()) {
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
          file: path.relative(kb.baseDir, file),
          props: memberNames(declaration),
        });
      });
  });
}

const report = [];
let checked = 0;
const components = kb
  .ownComponents()
  .flatMap(([spec, names]) => names.map((name) => ({ spec, name })))
  .filter(({ name }) => /^[A-Z]/.test(name))
  .filter(({ name }) => !selected.length || selected.includes(name))
  .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));

for (const { spec, name } of components) {
  const actual = kb.getComponentProps(name, spec);
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
  console.log(`⚠️  ${report.length} ${kb.name} components drift from the knowledgebase\n`);
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
if (!checked) {
  console.log(
    `⚠️  no ${kb.name} components were found: the entry's re-exports lead to no .svelte file (see --entry, --components-dir)`,
  );
  console.log('--------------------------------');
  process.exit(shouldFail ? 1 : 0);
}
console.log(`✅ ${checked} ${kb.name} components match their docs`);
console.log('--------------------------------');

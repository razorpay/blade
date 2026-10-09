/**
 * Lints the ```svelte examples in the blade-svelte knowledgebase.
 *
 * `tsc` can't check Svelte markup, so each example is instead:
 * - compiled with `svelte/compiler` in runes mode (catches syntax errors,
 *   Svelte 4 leftovers like `export let` / `on:click`, and a11y warnings)
 * - checked so every name imported from `@razorpay/blade-svelte/components`
 *   is a real export, and every `<PascalCase>` tag is imported or declared.
 * Every attribute and snippet passed to a Blade component must be one of its
 * props (from the exported `{Name}Props` type), so invented props fail.
 * Every `*Icon` name anywhere in a doc must also be a blade-svelte export, and
 * general/AvailableIcons.md must list exactly the exported icons.
 *
 * Usage: yarn tsc:knowledgebase --target svelte
 */
const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const { Project } = require('ts-morph');
const { compile, parse } = require('svelte/compiler');

const rootDir = path.join(__dirname, '..');
const knowledgebasePath = path.join(
  rootDir,
  'packages/blade-plugin/skills/blade-svelte/references',
);
const svelteDir = path.join(rootDir, 'packages/blade-svelte');
const reportPath = path.join(rootDir, 'knowledgebase-ts-errors.svelte.json');
const COMPONENTS_IMPORT = '@razorpay/blade-svelte/components';

const project = new Project({
  tsConfigFilePath: path.join(svelteDir, 'tsconfig.json'),
  skipAddingFilesFromTsConfig: true,
  // blade-core is read from source so the lint runs without building it.
  compilerOptions: {
    paths: {
      '~components/*': ['src/components/*'],
      '~src/*': ['src/*'],
      '@razorpay/blade-core/*': ['../blade-core/src/*'],
    },
  },
});
const exportedNames = new Set(
  project
    .addSourceFileAtPath(path.join(svelteDir, 'src/components/index.ts'))
    .getExportedDeclarations()
    .keys(),
);

const iconsIndex = fs.readFileSync(path.join(svelteDir, 'src/components/Icons/index.ts'), 'utf8');
const exportedIcons = new Set(
  [...iconsIndex.matchAll(/export \{ (\w+Icon) \}/g)].map(([, name]) => name),
);

const propsCache = new Map();
const { propsTypes = {} } = require('./knowledgebaseDriftIgnore.svelte.json');

/**
 * Prop names a component accepts, from its exported `{Name}Props` type
 * (`IconProps` for icons). Returns null when no props type is exported.
 * @param {string} name
 * @returns {Set<string> | null}
 */
const getComponentProps = (name) => {
  if (propsCache.has(name)) return propsCache.get(name);
  const isIcon = exportedIcons.has(name);
  const expression = isIcon ? 'IconProps' : propsTypes[name] ?? `${name}Props`;
  const typeNames = expression.split(/[|&]/).map((part) => part.trim());
  let props = null;
  if (typeNames.every((typeName) => exportedNames.has(typeName))) {
    const sourceFile = project.createSourceFile(
      path.join(svelteDir, `src/__knowledgebaseLint__${name}.ts`),
      `import type { ${typeNames.join(
        ', ',
      )} } from './components';\nexport type __Resolved = ${expression};`,
      { overwrite: true },
    );
    const type = sourceFile.getTypeAliasOrThrow('__Resolved').getType();
    if (type.isAny()) {
      throw new Error(
        `${expression} resolves to any; add a propsTypes override in knowledgebaseDriftIgnore.svelte.json`,
      );
    }
    props = new Set();
    for (const member of type.isUnion() ? type.getUnionTypes() : [type]) {
      for (const symbol of member.getProperties()) props.add(symbol.getName());
    }
  }
  propsCache.set(name, props);
  return props;
};

/**
 * Yields every AST node below `node`.
 * @param {any} node
 */
function* walk(node) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    for (const child of node) yield* walk(child);
    return;
  }
  if (typeof node.type === 'string') yield node;
  for (const [key, value] of Object.entries(node)) {
    if (key !== 'parent' && value && typeof value === 'object') yield* walk(value);
  }
}

/**
 * Attributes and snippets passed to Blade components must be real props.
 * @param {string} code
 * @param {Map<string, string>} bladeComponents local name -> exported name
 * @returns {string[]}
 */
const lintComponentProps = (code, bladeComponents) => {
  const problems = [];
  let ast;
  try {
    ast = parse(code, { modern: true });
  } catch {
    return problems;
  }
  for (const node of walk(ast.fragment)) {
    if (node.type !== 'Component' || !bladeComponents.has(node.name)) continue;
    const exportName = bladeComponents.get(node.name);
    const props = getComponentProps(exportName);
    if (!props) continue;
    const passed = [];
    for (const attribute of node.attributes) {
      if (attribute.type === 'Attribute') passed.push(attribute.name);
      if (attribute.type === 'BindDirective' && attribute.name !== 'this')
        passed.push(attribute.name);
    }
    for (const child of node.fragment.nodes) {
      if (child.type === 'SnippetBlock' && child.expression.name !== 'children')
        passed.push(child.expression.name);
    }
    for (const name of passed) {
      if (name.startsWith('data-') || name.startsWith('aria-') || props.has(name)) continue;
      problems.push(`<${node.name}> has no "${name}" prop`);
    }
  }
  return problems;
};

const codeBlockRegex = /^```svelte[^\n]*\n([\s\S]*?)^```/gm;
const importRegex = /import\s+(type\s+)?\{([^}]*)\}\s+from\s+['"]([^'"]+)['"]/g;

/**
 * @param {string} code
 * @returns {string[]}
 */
const lintBlock = (code) => {
  const problems = [];

  try {
    const { warnings } = compile(code, {
      runes: true,
      generate: 'client',
      filename: 'Example.svelte',
    });
    for (const warning of warnings)
      problems.push(`svelte warning ${warning.code}: ${warning.message}`);
  } catch (error) {
    problems.push(`svelte compile error: ${error.message}`);
  }

  const declared = new Set();
  const bladeComponents = new Map();
  for (const [, , names, source] of code.matchAll(importRegex)) {
    const imported = names
      .split(',')
      .map((name) => name.trim())
      .filter(Boolean)
      .map((name) => {
        const [original, alias] = name.replace(/^type\s+/, '').split(/\s+as\s+/);
        declared.add((alias ?? original).trim());
        if (source === COMPONENTS_IMPORT)
          bladeComponents.set((alias ?? original).trim(), original.trim());
        return original.trim();
      });
    if (source === '@razorpay/blade/components') {
      problems.push(`imports from the React package "${source}"; use "${COMPONENTS_IMPORT}"`);
    }
    if (source === COMPONENTS_IMPORT) {
      for (const name of imported) {
        if (!exportedNames.has(name))
          problems.push(`"${name}" is not exported by ${COMPONENTS_IMPORT}`);
      }
    }
  }
  for (const [, name] of code.matchAll(/import\s+([A-Z]\w*)\s+from/g)) declared.add(name);
  for (const [, name] of code.matchAll(/(?:const|let|function)\s+([A-Z]\w*)/g)) declared.add(name);
  for (const [, name] of code.matchAll(/\{#snippet\s+([A-Za-z]\w*)/g)) declared.add(name);

  const markup = code.replace(/<script[\s\S]*?<\/script>/g, '');
  for (const [, tag] of markup.matchAll(/<([A-Z]\w*)[\s/>]/g)) {
    if (!declared.has(tag)) problems.push(`<${tag}> is used but not imported`);
  }
  problems.push(...lintComponentProps(code, bladeComponents));
  return [...new Set(problems)];
};

const errors = [];
let blockCount = 0;
for (const file of glob.sync(`${knowledgebasePath}/**/*.md`).sort()) {
  const content = fs.readFileSync(file, 'utf8');
  const fileErrors = [];
  // blade-svelte ships far fewer icons than React Blade; any icon named in a
  // doc (prose included) must exist.
  const unknownIcons = new Set(
    [...content.matchAll(/\b([A-Z][A-Za-z0-9]*Icon)\b/g)]
      .map(([, name]) => name)
      .filter((name) => !exportedNames.has(name)),
  );
  for (const name of unknownIcons) {
    fileErrors.push({
      error: `"${name}" is not exported by ${COMPONENTS_IMPORT}`,
      markdownLineNumber: 0,
    });
  }
  for (const match of content.matchAll(codeBlockRegex)) {
    blockCount += 1;
    const markdownLineNumber = content.slice(0, match.index).split('\n').length;
    for (const error of lintBlock(match[1])) fileErrors.push({ error, markdownLineNumber });
  }
  if (fileErrors.length) errors.push({ file: path.relative(rootDir, file), errors: fileErrors });
}

// AvailableIcons.md must list exactly the icons blade-svelte exports.
const iconsDocPath = path.join(knowledgebasePath, 'general/AvailableIcons.md');
const listedIcons = new Set(
  [...fs.readFileSync(iconsDocPath, 'utf8').matchAll(/^- (\w+Icon)$/gm)].map(([, name]) => name),
);
const iconListErrors = [
  ...[...exportedIcons]
    .filter((name) => !listedIcons.has(name))
    .map((name) => `${name} is exported but not listed`),
  ...[...listedIcons]
    .filter((name) => !exportedIcons.has(name))
    .map((name) => `${name} is listed but not exported`),
].map((error) => ({ error, markdownLineNumber: 0 }));
if (iconListErrors.length)
  errors.push({ file: path.relative(rootDir, iconsDocPath), errors: iconListErrors });

fs.writeFileSync(reportPath, JSON.stringify(errors, null, 2), 'utf-8');

console.log('--------------------------------');
if (errors.length > 0) {
  console.log(`❌ ${errors.length} files have errors in the blade-svelte knowledgebase\n`);
  for (const { file, errors: fileErrors } of errors) {
    console.log(file);
    for (const { error, markdownLineNumber } of fileErrors) {
      console.log(markdownLineNumber ? `  line ${markdownLineNumber}: ${error}` : `  ${error}`);
    }
  }
  console.log('--------------------------------');
  process.exit(1);
}
console.log(`✅ ${blockCount} svelte examples compile in the blade-svelte knowledgebase`);
console.log('--------------------------------');
process.exit(0);

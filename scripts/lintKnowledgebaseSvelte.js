/**
 * Lints the ```svelte examples in the blade-svelte knowledgebase.
 *
 * `tsc` can't check Svelte markup, so each example is instead:
 * - compiled with `svelte/compiler` in runes mode (syntax errors, Svelte 4
 *   leftovers like `export let` / `on:click`, a11y warnings);
 * - checked so every name imported from `@razorpay/blade-svelte/components`,
 *   `/runes` or `/icons` is a real export of that entry, every `<PascalCase>`
 *   tag is imported or declared, and no icon is used as a tag (icons are
 *   sources: `<Icon source={InfoIcon} />`, or a component's `icon` prop);
 * - checked so every attribute, binding and snippet passed to a Blade
 *   component is one of its props (read from the component's `$props()`);
 * - run through Blade's class lint (`@razorpay/blade-svelte/configs/lint`):
 *   no conflicting, interpolated or misspelled classes, and a Blade
 *   component's `class` places it, never restyles it.
 * Every `*Icon` named anywhere in a doc must be a blade-svelte icon, and
 * general/AvailableIcons.md must list exactly the icons the package exports.
 *
 * Usage: yarn tsc:knowledgebase --target svelte
 */
const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
// Hoisted from blade-svelte's dependencies in the workspace.
// eslint-disable-next-line import/no-extraneous-dependencies
const { compile, parse } = require('svelte/compiler');
const {
  rootDir,
  svelteDir,
  knowledgebasePath,
  ENTRIES,
  exportedNames,
  getComponentProps,
  propTakesIcon,
} = require('./svelteKnowledgebase');

const reportPath = path.join(rootDir, 'knowledgebase-ts-errors.svelte.json');
const entryOf = new Map(Object.entries(ENTRIES).map(([key, specifier]) => [specifier, key]));

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
 * Attributes, bindings and snippets passed to Blade components must be props.
 * @param {any} ast
 * @param {Map<string, string>} bladeComponents local name -> exported name
 * @returns {string[]}
 */
const lintComponentProps = (ast, bladeComponents) => {
  const problems = [];
  for (const node of walk(ast.fragment)) {
    if (node.type !== 'Component' || !bladeComponents.has(node.name)) continue;
    const props = getComponentProps(bladeComponents.get(node.name));
    if (!props) continue;
    const passed = [];
    for (const attribute of node.attributes) {
      if (attribute.type === 'Attribute') passed.push(attribute.name);
      if (attribute.type === 'BindDirective' && attribute.name !== 'this')
        passed.push(attribute.name);
    }
    for (const child of node.fragment.nodes) {
      if (child.type === 'SnippetBlock') passed.push(child.expression.name);
    }
    for (const name of passed) {
      if (name.startsWith('data-') || name.startsWith('aria-') || props.has(name)) continue;
      problems.push(`<${node.name}> has no "${name}" prop`);
    }
    // An icon passed to a prop that takes no icon source (`string | Snippet`).
    for (const attribute of node.attributes) {
      const value = Array.isArray(attribute.value) ? attribute.value[0] : attribute.value;
      const expression = value?.expression;
      if (
        attribute.type === 'Attribute' &&
        expression?.type === 'Identifier' &&
        exportedNames.icons.has(expression.name) &&
        props.has(attribute.name) &&
        !propTakesIcon(bladeComponents.get(node.name), attribute.name)
      ) {
        problems.push(
          `<${node.name}> ${attribute.name}={${expression.name}}: "${attribute.name}" takes no icon; draw it in a snippet with <Icon source={${expression.name}} />`,
        );
      }
    }
  }
  return problems;
};

const codeBlockRegex = /^```svelte[^\n]*\n([\s\S]*?)^```/gm;
const importRegex = /import\s+(type\s+)?\{([^}]*)\}\s+from\s+['"]([^'"]+)['"]/g;

let lintClasses;

/**
 * @param {string} code
 * @returns {string[]}
 */
const lintBlock = (code) => {
  const problems = [];
  let ast;
  try {
    const { warnings } = compile(code, {
      runes: true,
      generate: 'client',
      filename: 'Example.svelte',
    });
    for (const warning of warnings) {
      problems.push(`svelte warning ${warning.code}: ${warning.message}`);
    }
    ast = parse(code, { modern: true });
  } catch (error) {
    problems.push(`svelte compile error: ${error.message}`);
  }

  const declared = new Set();
  const bladeComponents = new Map();
  for (const [, , names, source] of code.matchAll(importRegex)) {
    const entry = entryOf.get(source);
    if (source.startsWith('@razorpay/blade/') || source === '@razorpay/blade') {
      problems.push(`imports from the React package "${source}"`);
    } else if (source.startsWith('@razorpay/blade-svelte') && !entry) {
      problems.push(`"${source}" is not an entry: use ${Object.values(ENTRIES).join(', ')}`);
    }
    for (const part of names
      .split(',')
      .map((name) => name.trim())
      .filter(Boolean)) {
      const [original, alias] = part
        .replace(/^type\s+/, '')
        .split(/\s+as\s+/)
        .map((s) => s.trim());
      declared.add(alias ?? original);
      if (!entry) continue;
      if (!exportedNames[entry].has(original)) {
        problems.push(`"${original}" is not exported by ${source}`);
      } else if (entry === 'components') {
        bladeComponents.set(alias ?? original, original);
      }
    }
  }
  for (const [, name] of code.matchAll(/import\s+([A-Z]\w*)\s+from/g)) declared.add(name);
  for (const [, name] of code.matchAll(/(?:const|let|function)\s+([A-Z]\w*)/g)) declared.add(name);
  for (const [, name] of code.matchAll(/\{#snippet\s+([A-Za-z]\w*)/g)) declared.add(name);
  for (const [, name] of code.matchAll(/\{@const\s+([A-Z]\w*)/g)) declared.add(name);

  const markup = code.replace(/<script[\s\S]*?<\/script>/g, '');
  for (const [, tag] of markup.matchAll(/<([A-Z]\w*)[\s/>]/g)) {
    if (exportedNames.icons.has(tag)) {
      problems.push(
        `<${tag}> is an icon used as a component: icons are sources, <Icon source={${tag}} />`,
      );
    } else if (!declared.has(tag)) {
      problems.push(`<${tag}> is used but not imported`);
    }
  }
  if (ast) problems.push(...lintComponentProps(ast, bladeComponents));
  for (const finding of lintClasses(code, 'Example.svelte')) {
    problems.push(
      `blade/${finding.ruleId} [${finding.line}:${finding.column}]: ${finding.message}`,
    );
  }
  return [...new Set(problems)];
};

async function main() {
  ({ lintClasses } = await import(path.join(svelteDir, 'src/lint/plugin.js')));
  const errors = [];
  let blockCount = 0;
  for (const file of glob.sync(`${knowledgebasePath}/**/*.md`).sort()) {
    const content = fs.readFileSync(file, 'utf8');
    const fileErrors = [];
    // Any icon a doc names (prose included) must exist.
    const unknownIcons = new Set(
      [...content.matchAll(/\b([A-Z][A-Za-z0-9]*Icon)\b/g)]
        .map(([, name]) => name)
        .filter((name) => !exportedNames.icons.has(name)),
    );
    for (const name of unknownIcons) {
      fileErrors.push({ error: `"${name}" is not a blade-svelte icon`, markdownLineNumber: 0 });
    }
    for (const match of content.matchAll(codeBlockRegex)) {
      blockCount += 1;
      const markdownLineNumber = content.slice(0, match.index).split('\n').length;
      for (const error of lintBlock(match[1])) fileErrors.push({ error, markdownLineNumber });
    }
    if (fileErrors.length) errors.push({ file: path.relative(rootDir, file), errors: fileErrors });
  }

  // AvailableIcons.md lists exactly the icons blade-svelte exports.
  const iconsDocPath = path.join(knowledgebasePath, 'general/AvailableIcons.md');
  const listedIcons = new Set(
    fs.existsSync(iconsDocPath)
      ? [...fs.readFileSync(iconsDocPath, 'utf8').matchAll(/^- (\w+Icon)$/gm)].map(([, n]) => n)
      : [],
  );
  const iconListErrors = [
    ...[...exportedNames.icons]
      .filter((name) => !listedIcons.has(name))
      .map((name) => `${name} is exported but not listed`),
    ...[...listedIcons]
      .filter((name) => !exportedNames.icons.has(name))
      .map((name) => `${name} is listed but not exported`),
  ].map((error) => ({ error, markdownLineNumber: 0 }));
  if (iconListErrors.length) {
    errors.push({ file: path.relative(rootDir, iconsDocPath), errors: iconListErrors });
  }

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
  console.log(`✅ ${blockCount} svelte examples pass in the blade-svelte knowledgebase`);
  console.log('--------------------------------');
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

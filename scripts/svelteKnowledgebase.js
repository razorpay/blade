/**
 * What the blade-svelte knowledgebase is checked against: the package's
 * public names and each component's props. Shared by the example lint
 * (`lintKnowledgebaseSvelte.js`) and the drift check
 * (`checkKnowledgebaseDriftSvelte.js`).
 *
 * Components declare their props on `$props()` inside the `.svelte` file
 * (`let { … }: Props = $props()`), not as an exported `{Name}Props` type, so
 * the props are read from there: the component's script, placed beside it
 * so its imports resolve, with that annotation resolved to its members.
 */
const fs = require('fs');
const path = require('path');
const { Project } = require('ts-morph');
// Hoisted from blade-svelte's dependencies in the workspace.
// eslint-disable-next-line import/no-extraneous-dependencies
const { parse } = require('svelte/compiler');

const rootDir = path.join(__dirname, '..');
const svelteDir = path.join(rootDir, 'packages/blade-svelte');
const componentsDir = path.join(svelteDir, 'src/components');
const knowledgebasePath = path.join(
  rootDir,
  'packages/blade-plugin/skills/blade-svelte/references',
);

const ENTRIES = {
  components: '@razorpay/blade-svelte/components',
  runes: '@razorpay/blade-svelte/runes',
  icons: '@razorpay/blade-svelte/icons',
};

const project = new Project({
  tsConfigFilePath: path.join(svelteDir, 'tsconfig.json'),
  skipAddingFilesFromTsConfig: true,
});

/** @param {string} file */
const exportedNamesOf = (file) =>
  new Set(project.addSourceFileAtPath(file).getExportedDeclarations().keys());

const exportedNames = {
  components: exportedNamesOf(path.join(componentsDir, 'index.ts')),
  runes: exportedNamesOf(path.join(svelteDir, 'src/runes/index.ts')),
  icons: new Set(
    [
      ...fs
        .readFileSync(path.join(svelteDir, 'src/icons/glyphs.d.ts'), 'utf8')
        .matchAll(/export declare const (\w+Icon):/g),
    ].map(([, name]) => name),
  ),
};

/**
 * Component name → its `.svelte` file, following `/components`' re-exports
 * (`export { default as X } from './x/X.svelte'`, and `export { X } from
 * './modal'` into that folder's index).
 * @returns {Map<string, string>}
 */
function componentFiles() {
  const files = new Map();
  /** @param {string} indexFile @param {Set<string> | null} only */
  const scan = (indexFile, only) => {
    const dir = path.dirname(indexFile);
    const source = fs.readFileSync(indexFile, 'utf8');
    for (const [, names, from] of source.matchAll(/export\s*\{([^}]*)\}\s*from\s*'([^']+)'/g)) {
      for (const part of names.split(',')) {
        const match = /^\s*(?:default\s+as\s+)?(\w+)\s*$/.exec(part.replace(/\btype\b/, ''));
        if (!match) continue;
        const name = match[1];
        if (only && !only.has(name)) continue;
        const target = path.resolve(dir, from);
        if (from.endsWith('.svelte')) {
          if (/default\s+as/.test(part)) files.set(name, target);
        } else if (fs.existsSync(path.join(target, 'index.ts'))) {
          scan(path.join(target, 'index.ts'), new Set([name]));
        }
      }
    }
  };
  scan(path.join(componentsDir, 'index.ts'), null);
  return files;
}

const files = componentFiles();
const propsCache = new Map();
/** Per component file: the props an icon may be passed to. */
const iconPropsCache = new Map();

/**
 * Collects a props type's member names, and those whose type takes an icon
 * source (or is unknown here, as a borrowed prop's is) into `iconProps`.
 * @param {import('ts-morph').Type} type
 * @param {import('ts-morph').Node} at
 * @param {Set<string>} props
 * @param {Set<string>} iconProps
 */
function collect(type, at, props, iconProps) {
  for (const member of type.isUnion() ? type.getUnionTypes() : [type]) {
    for (const symbol of member.getApparentProperties()) {
      props.add(symbol.getName());
      const propType = symbol.getTypeAtLocation(at);
      if (propType.isAny() || propType.isUnknown() || /IconSource|Glyph/.test(propType.getText())) {
        iconProps.add(symbol.getName());
      }
    }
  }
}

/**
 * The props a component file takes, by name. Generic parameters
 * (`generics="T"`) are `unknown`; props borrowed from another component
 * (`ComponentProps<typeof Row>`) are read from that component's file, as a
 * `.svelte` import is opaque outside Svelte's compiler.
 * @param {string} file
 * @returns {Set<string>}
 */
function propsOfFile(file) {
  if (propsCache.has(file)) return propsCache.get(file);
  propsCache.set(file, new Set()); // a cycle reads as no props
  const code = fs.readFileSync(file, 'utf8');
  const { instance } = parse(code, { modern: true });
  const props = new Set();
  const iconProps = new Set();
  if (instance) {
    let script = code.slice(instance.content.start, instance.content.end);
    const generics = instance.attributes.find((attribute) => attribute.name === 'generics');
    const genericNames = generics
      ? [...String(generics.value[0]?.data ?? '').matchAll(/(?:^|,)\s*(\w+)/g)].map(([, n]) => n)
      : [];
    const imported = new Map(
      [...script.matchAll(/import\s+(\w+)\s+from\s+'([^']+\.svelte)'/g)].map(([, local, from]) => [
        local,
        path.resolve(path.dirname(file), from),
      ]),
    );
    /** Props borrowed from another component: whether each takes an icon there. */
    const borrowedIcons = new Map();
    script = script.replace(/ComponentProps<typeof (\w+)(?:<[^>]*>)?>/g, (whole, local) => {
      const borrowed = imported.get(local);
      if (!borrowed) return whole;
      const names = [...propsOfFile(borrowed)];
      const icons = iconPropsCache.get(borrowed) ?? new Set();
      names.forEach((n) => borrowedIcons.set(n, icons.has(n)));
      return `{ ${names.map((n) => `'${n}'?: any`).join('; ')} }`;
    });
    const annotation = /\}\s*:\s*([^=;]+?)\s*=\s*\$props\(\)/.exec(script);
    if (annotation) {
      const probe = project.createSourceFile(
        path.join(path.dirname(file), `__knowledgebase_${path.basename(file, '.svelte')}.ts`),
        `${genericNames
          .map((n) => `type ${n} = unknown;`)
          .join('\n')}\n${script}\nexport type __Props = ${annotation[1]};\n`,
        { overwrite: true },
      );
      const alias = probe.getTypeAliasOrThrow('__Props');
      collect(alias.getType(), alias, props, iconProps);
      project.removeSourceFile(probe);
      borrowedIcons.forEach((takesIcon, n) => {
        if (!takesIcon) iconProps.delete(n);
      });
    }
  }
  propsCache.set(file, props);
  iconPropsCache.set(file, iconProps);
  return props;
}

/**
 * The props a public component takes, by name, or null for a name that is
 * not a component (a function, a type). A component exported as a typed
 * value (`export const Text: TextComponent`) is read from its type.
 * @param {string} name
 * @returns {Set<string> | null}
 */
function getComponentProps(name) {
  const file = files.get(name);
  if (file) return propsOfFile(file);
  if (!exportedNames.components.has(name) || !/^[A-Z]/.test(name)) return null;
  const probe = project.createSourceFile(
    path.join(componentsDir, `__knowledgebase_${name}.ts`),
    `import type { ComponentProps } from 'svelte';\nimport { ${name} } from './index';\nexport type __Props = typeof ${name} extends import('svelte').Component<any> ? ComponentProps<typeof ${name}> : never;\n`,
    { overwrite: true },
  );
  const alias = probe.getTypeAliasOrThrow('__Props');
  const type = alias.getType();
  const props = new Set();
  const iconProps = new Set();
  if (!type.isNever() && !type.isAny()) collect(type, alias, props, iconProps);
  project.removeSourceFile(probe);
  if (type.isNever() || type.isAny()) return null;
  iconPropsCache.set(name, iconProps);
  return props;
}

/**
 * Whether a component's prop takes an icon source (`icon={InfoIcon}`): a
 * prop typed `string | Snippet` would render an icon as text, or call it.
 * @param {string} name
 * @param {string} prop
 */
function propTakesIcon(name, prop) {
  if (!getComponentProps(name)) return true;
  const icons = iconPropsCache.get(files.get(name) ?? name);
  return !icons || icons.has(prop);
}

module.exports = {
  rootDir,
  svelteDir,
  knowledgebasePath,
  ENTRIES,
  exportedNames,
  componentFiles: () => files,
  getComponentProps,
  propTakesIcon,
};

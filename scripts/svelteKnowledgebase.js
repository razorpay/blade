/**
 * What a Svelte knowledgebase is checked against: the public names of its
 * package and of blade-svelte, and each component's props. Shared by the
 * example lint (`lintKnowledgebaseSvelte.js`) and the drift check
 * (`checkKnowledgebaseDriftSvelte.js`).
 *
 * By default that is blade-svelte's own knowledgebase
 * (`packages/blade-plugin/skills/blade-svelte/references`). Given a package
 * (`--package <dir>` or `--config <file>`, see `parseArgs`), it is that
 * package's knowledgebase instead: a package an app builds on blade-svelte,
 * whose examples import from its own entries and from blade-svelte's.
 *
 * Components declare their props on `$props()` inside the `.svelte` file
 * (`let { … }: Props = $props()`), not as an exported `{Name}Props` type, so
 * the props are read from there: the component's script, placed beside it
 * so its imports resolve, with that annotation resolved to its members.
 */
const fs = require('fs');
const path = require('path');
const { Project, ts } = require('ts-morph');
// Hoisted from blade-svelte's dependencies in the workspace.
// eslint-disable-next-line import/no-extraneous-dependencies
const { parse } = require('svelte/compiler');

const rootDir = path.join(__dirname, '..');
const repoSvelteDir = path.join(rootDir, 'packages/blade-svelte');

const ENTRIES = {
  components: '@razorpay/blade-svelte/components',
  runes: '@razorpay/blade-svelte/runes',
  icons: '@razorpay/blade-svelte/icons',
};

/** Flags that take a value, by the option they set. */
const VALUE_FLAGS = {
  '--config': 'config',
  '--package': 'packageDir',
  '--tsconfig': 'tsconfig',
  '--entry': 'entries',
  '--components': 'components',
  '--components-dir': 'componentsDir',
  '--docs': 'docsDir',
  '--component-docs': 'componentDocsDir',
  '--drift-ignore': 'driftIgnore',
  '--blade-svelte': 'bladeSvelteDir',
  '--name': 'name',
  '--report': 'report',
  '--target': 'target',
};

/**
 * Splits argv into the knowledgebase options, boolean flags and the rest.
 * Paths on the command line are relative to where the command ran
 * (`INIT_CWD` under yarn); paths in a config file to the file.
 * @param {string[]} argv
 */
function parseArgs(argv) {
  const cwd = process.env.INIT_CWD || process.cwd();
  /** @type {Record<string, any>} */
  const flags = {};
  const positionals = [];
  const booleans = new Set();
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const [flag, inline] = arg.startsWith('--') ? arg.split(/[=](.*)/s) : [arg];
    const key = VALUE_FLAGS[flag];
    if (key) {
      const value = inline ?? argv[(i += 1)];
      if (value === undefined) throw new Error(`${flag} needs a value`);
      if (key === 'entries' || key === 'components') (flags[key] ??= []).push(value);
      else flags[key] = value;
    } else if (arg.startsWith('--')) {
      booleans.add(flag);
    } else {
      positionals.push(arg);
    }
  }
  let config = {};
  let base = cwd;
  if (flags.config) {
    const file = path.resolve(cwd, flags.config);
    config = JSON.parse(fs.readFileSync(file, 'utf8'));
    base = path.dirname(file);
  }
  // `--entry <specifier>=<file>`, repeated.
  if (flags.entries) {
    flags.entries = Object.fromEntries(
      flags.entries.map((pair) => {
        const at = pair.lastIndexOf('=');
        if (at < 1) throw new Error(`--entry takes <specifier>=<file>, got "${pair}"`);
        return [pair.slice(0, at), pair.slice(at + 1)];
      }),
    );
  }
  const options = { ...config, ...flags };
  delete options.config;
  delete options.target;
  // Flags resolve against cwd, config values against the config file;
  // entry files and the tsconfig against the package.
  for (const key of [
    'packageDir',
    'componentsDir',
    'docsDir',
    'componentDocsDir',
    'driftIgnore',
    'bladeSvelteDir',
    'report',
  ]) {
    if (options[key] !== undefined) {
      options[key] = path.resolve(key in flags ? cwd : base, options[key]);
    }
  }
  return { options, positionals, booleans };
}

/**
 * A package's public entries from its package.json `exports`: each
 * subpath's `svelte`, `default` or plain target that is a script.
 * @param {string} name
 * @param {unknown} exportsField
 */
function entriesFromExports(name, exportsField) {
  const entries = {};
  const map = typeof exportsField === 'string' ? { '.': exportsField } : exportsField ?? {};
  for (const [subpath, target] of Object.entries(map)) {
    const file =
      typeof target === 'string' ? target : target?.svelte ?? target?.default ?? target?.types;
    if (typeof file !== 'string' || !/\.(ts|js|mjs)$/.test(file)) continue;
    entries[subpath === '.' ? name : `${name}/${subpath.replace(/^\.\//, '')}`] = file;
  }
  return entries;
}

/**
 * Reads a package's components: their files, following its entry's
 * re-exports, and the props each takes.
 * @param {import('ts-morph').Project} project
 * @param {string} entryFile the entry the components are exported from
 */
function componentReader(project, entryFile, external) {
  const entrySource = project.addSourceFileAtPath(entryFile);
  const exported = new Set(entrySource.getExportedDeclarations().keys());
  /** Component name → the specifier it is re-exported from (`export { Modal } from '@razorpay/blade-svelte/components'`). */
  const reexports = new Map();

  /**
   * Component name → its `.svelte` file, following the entry's re-exports
   * (`export { default as X } from './x/X.svelte'`, `export { X } from
   * './modal'` into that folder's index, and `export * from './modal'`).
   * A name re-exported from another package's entry lands in `reexports`.
   * @returns {Map<string, string>}
   */
  function componentFiles() {
    const files = new Map();
    const seen = new Set();
    /** The module a `from` names: a `.ts` file, or a folder's index. */
    const moduleFile = (dir, from) => {
      const target = path.resolve(dir, from);
      for (const candidate of [target, `${target}.ts`, path.join(target, 'index.ts')]) {
        if (/\.(ts|js|mjs)$/.test(candidate) && fs.existsSync(candidate)) return candidate;
      }
      return undefined;
    };
    /** @param {string} indexFile @param {Set<string> | null} only */
    const scan = (indexFile, only) => {
      const key = `${indexFile}:${only ? [...only].sort().join(',') : '*'}`;
      if (seen.has(key)) return;
      seen.add(key);
      const dir = path.dirname(indexFile);
      const source = fs.readFileSync(indexFile, 'utf8');
      for (const [, from] of source.matchAll(/export\s*\*\s*from\s*'([^']+)'/g)) {
        const target = from.startsWith('.') ? moduleFile(dir, from) : undefined;
        if (target) scan(target, only);
      }
      for (const [, names, from] of source.matchAll(/export\s*\{([^}]*)\}\s*from\s*'([^']+)'/g)) {
        for (const part of names.split(',')) {
          const match = /^\s*(?:default\s+as\s+)?(\w+)\s*$/.exec(part.replace(/\btype\b/, ''));
          if (!match) continue;
          const name = match[1];
          if (only && !only.has(name)) continue;
          if (!from.startsWith('.')) {
            reexports.set(name, from);
            continue;
          }
          if (from.endsWith('.svelte')) {
            if (/default\s+as/.test(part)) files.set(name, path.resolve(dir, from));
            continue;
          }
          const target = moduleFile(dir, from);
          if (target) scan(target, new Set([name]));
        }
      }
    };
    scan(entryFile, null);
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
        if (
          propType.isAny() ||
          propType.isUnknown() ||
          /IconSource|Glyph/.test(propType.getText())
        ) {
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
        [
          ...script.matchAll(/import\s+(\w+)\s+from\s+'([^']+\.svelte)'/g),
        ].map(([, local, from]) => [local, path.resolve(path.dirname(file), from)]),
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
      const probe = project.createSourceFile(
        path.join(path.dirname(file), `__knowledgebase_${path.basename(file, '.svelte')}.ts`),
        `${genericNames.map((n) => `type ${n} = unknown;`).join('\n')}\n${script}\n`,
        { overwrite: true },
      );
      // The annotation on `let { … }: Props = $props()`, read from the
      // syntax tree so an inline object type (`{ a: string; b: number }`)
      // or a generic one reads as well as a named one.
      const annotation = probe
        .getVariableDeclarations()
        .find((declaration) => /^\$props\s*\(/.test(declaration.getInitializer()?.getText() ?? ''))
        ?.getTypeNode()
        ?.getText();
      if (annotation) {
        const alias = probe.addTypeAlias({ name: '__Props', type: annotation, isExported: true });
        collect(alias.getType(), alias, props, iconProps);
        borrowedIcons.forEach((takesIcon, n) => {
          if (!takesIcon) iconProps.delete(n);
        });
      }
      project.removeSourceFile(probe);
    }
    propsCache.set(file, props);
    iconPropsCache.set(file, iconProps);
    return props;
  }

  const entryImport = `./${path.basename(entryFile).replace(/\.(ts|js|mjs)$/, '')}`;

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
    // Another package's component, re-exported: that package's reader has it.
    if (reexports.has(name))
      return external?.(reexports.get(name))?.getComponentProps(name) ?? null;
    if (!exported.has(name) || !/^[A-Z]/.test(name)) return null;
    const probe = project.createSourceFile(
      path.join(path.dirname(entryFile), `__knowledgebase_${name}.ts`),
      `import type { ComponentProps } from 'svelte';\nimport { ${name} } from '${entryImport}';\nexport type __Self = typeof ${name};\nexport type __Props = typeof ${name} extends import('svelte').Component<any> ? ComponentProps<typeof ${name}> : never;\n`,
      { overwrite: true },
    );
    const alias = probe.getTypeAliasOrThrow('__Props');
    const type = alias.getType();
    // A `.svelte` module TypeScript cannot resolve types as `any`, and
    // `any extends …` is not `never`: it is unreadable here, not propless.
    const unreadable =
      probe.getTypeAliasOrThrow('__Self').getType().isAny() || type.isNever() || type.isAny();
    const props = new Set();
    const iconProps = new Set();
    if (!unreadable) collect(type, alias, props, iconProps);
    project.removeSourceFile(probe);
    if (unreadable) return null;
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
    if (reexports.has(name))
      return external?.(reexports.get(name))?.propTakesIcon(name, prop) ?? true;
    const icons = iconPropsCache.get(files.get(name) ?? name);
    return !icons || icons.has(prop);
  }

  /** The file a public name is declared in (its `.svelte` file for a component). */
  function fileOf(name) {
    if (files.has(name)) return files.get(name);
    if (reexports.has(name)) return undefined;
    const declaration = entrySource.getExportedDeclarations().get(name)?.[0];
    return declaration?.getSourceFile().getFilePath();
  }

  return { exported, files, getComponentProps, propTakesIcon, fileOf };
}

/**
 * Loads what a knowledgebase is checked against.
 *
 * With no `packageDir`: blade-svelte's own knowledgebase, as always. With
 * one, that package's (all paths absolute):
 * - `packageDir`: the package; its package.json `name` prefixes its entries
 * - `entries`: `{ specifier: file }` (file relative to the package); default
 *   the script targets of its package.json `exports`
 * - `components`: the entries whose components are checked; default all
 * - `componentsDir`: only components declared under it are the package's
 *   own (drift-checked); default the package
 * - `docsDir`: the docs whose ```svelte examples are linted (`**\/*.md`)
 * - `componentDocsDir`: where `{Name}Props` are looked for; default `docsDir`
 * - `driftIgnore`: the drift check's ignore file; default none
 * - `tsconfig`: default `<packageDir>/tsconfig.json`
 * - `bladeSvelteDir`: the blade-svelte its examples are checked against;
 *   default the one the package resolves, else this repo's
 * - `name`: the label in messages; default the package's name
 * @param {Record<string, any>} [options]
 */
function createKnowledgebase(options = {}) {
  const pkgDir = options.packageDir;
  const pkgJson = pkgDir
    ? JSON.parse(fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf8'))
    : undefined;
  let svelteDir = options.bladeSvelteDir;
  if (!svelteDir && pkgDir) {
    try {
      svelteDir = path.dirname(
        require.resolve('@razorpay/blade-svelte/package.json', { paths: [pkgDir] }),
      );
    } catch {
      svelteDir = undefined;
    }
  }
  svelteDir = svelteDir ?? repoSvelteDir;
  const componentsDir = path.join(svelteDir, 'src/components');

  const pkgProject = pkgDir
    ? new Project({
        tsConfigFilePath: options.tsconfig
          ? path.resolve(pkgDir, options.tsconfig)
          : path.join(pkgDir, 'tsconfig.json'),
        skipAddingFilesFromTsConfig: true,
      })
    : undefined;
  // An installed blade-svelte ships no tsconfig: read it as the package
  // that installed it compiles it.
  const svelteTsconfig = path.join(svelteDir, 'tsconfig.json');
  const project = fs.existsSync(svelteTsconfig)
    ? new Project({ tsConfigFilePath: svelteTsconfig, skipAddingFilesFromTsConfig: true })
    : pkgProject ??
      new Project({
        compilerOptions: {
          moduleResolution: ts.ModuleResolutionKind.Bundler,
          target: ts.ScriptTarget.ES2022,
          allowArbitraryExtensions: true,
        },
      });

  const blade = componentReader(project, path.join(componentsDir, 'index.ts'));
  const exportedNames = {
    components: blade.exported,
    runes: new Set(
      project
        .addSourceFileAtPath(path.join(svelteDir, 'src/runes/index.ts'))
        .getExportedDeclarations()
        .keys(),
    ),
    icons: new Set(
      [
        ...fs
          .readFileSync(path.join(svelteDir, 'src/icons/glyphs.d.ts'), 'utf8')
          .matchAll(/export declare const (\w+Icon):/g),
      ].map(([, name]) => name),
    ),
  };

  /** Specifier → its public names. */
  const names = new Map(Object.entries(ENTRIES).map(([key, spec]) => [spec, exportedNames[key]]));
  /** Specifier → the reader of the components it exports. */
  const readers = new Map([[ENTRIES.components, blade]]);
  /** Package name → its entry specifiers: an import under it must be one. */
  const packages = new Map([['@razorpay/blade-svelte', Object.values(ENTRIES)]]);

  let pkg;
  if (pkgDir) {
    const entries = options.entries ?? entriesFromExports(pkgJson.name, pkgJson.exports);
    if (!Object.keys(entries).length) {
      throw new Error(`${pkgDir}: no entries (pass --entry <specifier>=<file>)`);
    }
    const componentEntries = options.components ?? Object.keys(entries);
    for (const [spec, file] of Object.entries(entries)) {
      // A component the package re-exports from blade-svelte (or another of
      // its entries) is read by that entry's reader.
      const reader = componentReader(pkgProject, path.resolve(pkgDir, file), (from) =>
        readers.get(from),
      );
      names.set(spec, reader.exported);
      if (componentEntries.includes(spec)) readers.set(spec, reader);
    }
    for (const spec of componentEntries) {
      if (!entries[spec]) throw new Error(`components entry "${spec}" is not an entry`);
    }
    packages.set(pkgJson.name, Object.keys(entries));
    const ownDir = options.componentsDir ?? pkgDir;
    const own = (spec, name) => {
      const file = readers.get(spec).fileOf(name);
      return Boolean(file) && !path.relative(ownDir, file).startsWith('..');
    };
    pkg = { dir: pkgDir, name: pkgJson.name, entries, componentEntries, own };
  }

  const docsDir =
    options.docsDir ??
    (pkgDir
      ? undefined
      : path.join(rootDir, 'packages/blade-plugin/skills/blade-svelte/references'));
  if (!docsDir) throw new Error('--docs <dir> is required with --package');

  return {
    name: options.name ?? pkg?.name ?? 'blade-svelte',
    /** Where reported file paths are relative to. */
    baseDir: pkg?.dir ?? rootDir,
    svelteDir,
    docsDir,
    componentDocsDir:
      options.componentDocsDir ?? (pkg ? docsDir : path.join(docsDir, 'components')),
    driftIgnore:
      options.driftIgnore ??
      (pkg ? undefined : path.join(__dirname, 'knowledgebaseDriftIgnore.svelte.json')),
    report: options.report,
    pkg,
    exportedNames,
    names,
    packages,
    /** The entries whose components get their props checked. */
    componentEntries: [...readers.keys()],
    /** The components the drift check compares: the package's own, by entry. */
    ownComponents() {
      if (!pkg) return [[ENTRIES.components, [...exportedNames.components]]];
      const seen = new Set();
      return pkg.componentEntries.map((spec) => [
        spec,
        [...names.get(spec)].filter((name) => {
          if (seen.has(name) || !pkg.own(spec, name)) return false;
          seen.add(name);
          return true;
        }),
      ]);
    },
    /** @param {string} name @param {string} [spec] */
    getComponentProps: (name, spec = ENTRIES.components) =>
      readers.get(spec)?.getComponentProps(name) ?? null,
    /** @param {string} name @param {string} prop @param {string} [spec] */
    propTakesIcon: (name, prop, spec = ENTRIES.components) =>
      readers.get(spec)?.propTakesIcon(name, prop) ?? true,
  };
}

let defaultKnowledgebase;
/** blade-svelte's own knowledgebase, loaded on first use. */
const getDefault = () => (defaultKnowledgebase ??= createKnowledgebase());

module.exports = {
  rootDir,
  ENTRIES,
  createKnowledgebase,
  parseArgs,
  /** blade-svelte's props for a component (the authoring prompt prints these). */
  getComponentProps: (name) => getDefault().getComponentProps(name),
  propTakesIcon: (name, prop) => getDefault().propTakesIcon(name, prop),
};

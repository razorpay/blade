/**
 * Extracts Blade's icon set (packages/blade/src/components/Icons) into
 * `@razorpay/blade-svelte/icons`: one currentColor SVG per glyph, the
 * codepoint lockfile, the exports (each icon is its SVG file) and the name
 * union. Never builds a font: apps do, with `bladeIconFontPlugin` (Vite or
 * webpack), from the icons they import.
 *
 * Usage (from packages/blade-svelte): yarn icons:generate (or `icons:check`)
 * `--check` writes nothing: it exits 1, naming the files, when `src/icons`
 * is not what Blade React's icons make (an icon added or changed in React
 * without this run). The icon workflows run it after React's icons are
 * written (blade-icon-to-code.yml, blade-icons-upload.yml).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const REACT_ICONS = path.resolve(here, '../../../blade/src/components/Icons');
const PACKAGE = path.resolve(here, '../..');
const OUT = path.join(PACKAGE, 'src/icons');
const SVG_OUT = path.join(OUT, 'svg');
const LOCKFILE = path.join(OUT, 'codepoints.json');
/** The blade-svelte skill's icon list, which must name exactly the exports. */
const ICONS_DOC = path.resolve(
  PACKAGE,
  '../blade-plugin/skills/blade-svelte/references/general/AvailableIcons.md',
);

/** Blade's own codepoint block; consumers' custom glyphs start at U+F000. */
const FIRST_CODE = 0xe000;
const LAST_CODE = 0xefff;

/**
 * A font fills shapes; it cannot draw a stroke. A stroke-drawn icon is left
 * out, and named, until it is outlined at the source.
 */
export const isStroked = (source) => /\bstroke=(?!"none")/.test(source);

/** `ArrowRightIcon` → `arrow-right`, `CheckCircle2Icon` → `check-circle-2`. */
export const toKebab = (component) =>
  component
    .replace(/Icon$/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-zA-Z])([0-9])/g, '$1-$2')
    .toLowerCase();

const ATTRIBUTES = {
  d: 'd',
  fillRule: 'fill-rule',
  clipRule: 'clip-rule',
  cx: 'cx',
  cy: 'cy',
  r: 'r',
  x: 'x',
  y: 'y',
  width: 'width',
  height: 'height',
  rx: 'rx',
  ry: 'ry',
  transform: 'transform',
};

/**
 * The JSX of one icon → SVG markup. Shapes keep their geometry; colour is
 * always currentColor. Clip paths only ever clip to the 24px box, so they and
 * their groups are flattened away.
 */
export function jsxToSvg(source, component) {
  const body = /<Svg\b[^>]*>([\s\S]*?)<\/Svg>/.exec(source)?.[1];
  if (!body) throw new Error(`${component}: no <Svg> element`);
  const withoutDefs = body.replace(/<Defs>[\s\S]*?<\/Defs>/g, '');
  const shapes = [...withoutDefs.matchAll(/<(Path|Circle|Rect)\b([\s\S]*?)\/>/g)].map(
    ([, tag, attributes]) => {
      const pairs = [...attributes.matchAll(/(\w+)=(?:"([^"]*)"|\{([^}]*)\})/g)]
        .filter(([, name]) => name in ATTRIBUTES)
        .map(([, name, value]) => `${ATTRIBUTES[name]}="${value}"`);
      return `<${tag.toLowerCase()} ${pairs.join(' ')}/>`;
    },
  );
  if (shapes.length === 0) throw new Error(`${component}: no shapes`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">${shapes.join(
    '',
  )}</svg>\n`;
}

/**
 * Keeps every name's code; appends new names in sorted order after the
 * highest code ever handed out; retires removed names so their codes are
 * never reused.
 */
export function updateLockfile(previous, names) {
  const glyphs = { ...previous.glyphs };
  const retired = { ...previous.retired };
  for (const name of Object.keys(glyphs)) {
    if (!names.includes(name)) {
      retired[name] = glyphs[name];
      delete glyphs[name];
    }
  }
  const used = [...Object.values(glyphs), ...Object.values(retired)];
  let next = used.length ? Math.max(...used) + 1 : FIRST_CODE;
  for (const name of [...names].sort()) {
    if (name in glyphs) continue;
    if (name in retired) {
      // Back after a removal: it gets its old code again.
      glyphs[name] = retired[name];
      delete retired[name];
      continue;
    }
    if (next > LAST_CODE) throw new Error('Blade codepoint block U+E000–U+EFFF is full');
    glyphs[name] = next;
    next += 1;
  }
  const sorted = (record) =>
    Object.fromEntries(Object.entries(record).sort(([a], [b]) => a.localeCompare(b)));
  return { glyphs: sorted(glyphs), retired: sorted(retired) };
}

/** `components` maps each glyph name to its Blade component name, the export's name. */
function tokenFiles(lock, components) {
  const header = "// Generated from Blade React's icons: do not edit.\n";
  const names = Object.keys(lock.glyphs);
  // Each icon is its SVG file: a URL in any bundler, a font glyph once a
  // bladeIconFontPlugin (Vite or webpack) is in the build. Plain JS, so the
  // barrel needs no TypeScript tooling; the types sit beside it.
  return {
    'glyphs.js': `${header}${names
      .map((name) => `export { default as ${components[name]} } from './svg/${name}.svg';`)
      .join('\n')}\n`,
    'glyphs.d.ts': `${header}import type { IconSource } from '../runes/icon/source';\n\n${names
      .map((name) => `export declare const ${components[name]}: IconSource;`)
      .join('\n')}\n`,
    'names.ts': `${header}/** Every predefined glyph, by its SVG's file name. */\nexport type BladeIconName =\n${names
      .map((name) => `  | '${name}'`)
      .join('\n')};\n`,
  };
}

/**
 * The icon list in the blade-svelte skill's AvailableIcons.md: its count and
 * its `- NameIcon` lines, in code-point order. The prose around them stays.
 */
export function iconsDoc(doc, components) {
  const names = [...components].sort();
  const list = names.map((name) => `- ${name}`).join('\n');
  return doc
    .replace(/^\d+ icons\./m, `${names.length} icons.`)
    .replace(/^- \w+Icon$(?:\n- \w+Icon$)*/m, list);
}

/**
 * Everything the icons make, by path relative to packages/blade-svelte: what
 * `src/icons` holds and the skill's icon list. And the stroke-drawn icons
 * left out.
 */
function extract() {
  const components = fs
    .readdirSync(REACT_ICONS)
    .filter((entry) => /Icon$/.test(entry))
    .filter((entry) => fs.existsSync(path.join(REACT_ICONS, entry, `${entry}.tsx`)));

  const icons = {};
  const stroked = [];
  const byName = {};
  for (const component of components) {
    const source = fs.readFileSync(path.join(REACT_ICONS, component, `${component}.tsx`), 'utf8');
    if (isStroked(source)) {
      stroked.push(component);
      continue;
    }
    const name = toKebab(component);
    if (name in byName) throw new Error(`${component} and ${byName[name]} both become "${name}"`);
    byName[name] = component;
    icons[`svg/${name}.svg`] = jsxToSvg(source, component);
  }

  const previous = fs.existsSync(LOCKFILE)
    ? JSON.parse(fs.readFileSync(LOCKFILE, 'utf8'))
    : { glyphs: {}, retired: {} };
  const lock = updateLockfile(previous, Object.keys(byName));
  icons['codepoints.json'] = `${JSON.stringify(lock, null, 2)}\n`;
  Object.assign(icons, tokenFiles(lock, byName));

  const files = Object.fromEntries(
    Object.entries(icons).map(([file, content]) => [
      path.relative(PACKAGE, path.join(OUT, file)),
      content,
    ]),
  );
  if (fs.existsSync(ICONS_DOC)) {
    files[path.relative(PACKAGE, ICONS_DOC)] = iconsDoc(
      fs.readFileSync(ICONS_DOC, 'utf8'),
      Object.values(byName),
    );
  }
  return { files, stroked };
}

const readIfExists = (file) => (fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null);
const svgDir = path.relative(PACKAGE, SVG_OUT);

/** The files that differ from what the icons make. */
function stale(files) {
  const committed = fs.existsSync(SVG_OUT)
    ? fs.readdirSync(SVG_OUT).map((file) => path.join(svgDir, file))
    : [];
  const changed = Object.entries(files)
    .filter(([file, content]) => readIfExists(path.join(PACKAGE, file)) !== content)
    .map(([file]) => file);
  const removed = committed.filter((file) => !(file in files));
  return [...changed, ...removed].sort();
}

/**
 * Writes `src/icons` and the skill's icon list from Blade React's icons, or
 * with `check` only reports whether they are out of date. Returns the stale
 * files (paths relative to packages/blade-svelte, before a write) and the
 * stroke-drawn icons left out.
 */
export function extractBladeIcons({ check = false } = {}) {
  const { files, stroked } = extract();
  const outdated = stale(files);
  if (!check && outdated.length) {
    fs.rmSync(SVG_OUT, { recursive: true, force: true });
    fs.mkdirSync(SVG_OUT, { recursive: true });
    for (const [file, content] of Object.entries(files)) {
      fs.writeFileSync(path.join(PACKAGE, file), content);
    }
  }
  return {
    outdated,
    stroked,
    glyphs: Object.keys(files).filter((file) => file.startsWith(`${svgDir}/`)).length,
  };
}

function main() {
  const check = process.argv.includes('--check');
  const { outdated, stroked, glyphs } = extractBladeIcons({ check });
  if (stroked.length) {
    console.warn(`skipped stroke-drawn icons (outline them to ship them): ${stroked.join(', ')}`);
  }
  if (!check) {
    console.log(`extracted ${glyphs} glyphs, ${outdated.length} file(s) changed`);
    return;
  }
  if (outdated.length) {
    console.error(
      `blade-svelte's icons are out of date with Blade React's (paths from packages/blade-svelte):\n${outdated
        .map((file) => `  ${file}`)
        .join(
          '\n',
        )}\nRun \`yarn workspace @razorpay/blade-svelte icons:generate\` and commit the result.`,
    );
    process.exitCode = 1;
    return;
  }
  console.log(`src/icons is up to date (${glyphs} glyphs)`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();

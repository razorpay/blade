// @ts-check
/**
 * What the Vite and webpack font plugins share. An icon is an SVG file: Blade's
 * set lives in src-cx/icons/svg, the app's in the folders it declares. Without
 * a plugin, importing one gives its URL. With one, the import becomes a glyph
 * module (`glyph(name, code)`), and the font holds the glyphs whose modules the
 * build loaded. Barrel imports are rewritten to per-file imports first, so
 * importing one icon loads one module, not the whole set.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { buildFont, FONT_FAMILY } from './font.js';

export { FONT_FAMILY };

const real = (/** @type {string} */ file) => {
  try {
    return fs.realpathSync(file);
  } catch {
    return file;
  }
};

const SRC_CX = real(fileURLToPath(new URL('..', import.meta.url)));
export const ICONS = path.join(SRC_CX, 'icons');
export const ICON_SVGS = path.join(ICONS, 'svg');
export const SOURCE_MODULE = path.join(SRC_CX, 'runes', 'icon', 'source.ts');
export const PACKAGE_ICONS = '@razorpay/blade-svelte/icons';
/** The barrel's own files: importing any of them takes the whole set. */
const BARREL_FILES = new Set(
  ['', '/index', '/index.js', '/glyphs', '/glyphs.js'].map((suffix) => `${ICONS}${suffix}`),
);

/** The app's own glyphs take the block after Blade's (U+E000–U+EFFF). */
const FIRST_EXTRA = 0xf000;
const LAST_EXTRA = 0xf8ff;
/** Bumped when the font's build changes, so cached fonts are rebuilt. */
const BUILD_VERSION = '3';

/** @typedef {'woff2' | 'ttf'} Format */
/** @typedef {{ name: string; code: number; file: string }} GlyphFile */

export const formatName = (/** @type {Format} */ format) => (format === 'ttf' ? 'truetype' : format);

/**
 * @param {{ root: string; extra?: string | readonly string[] }} options
 */
export function createIconCore({ root, extra }) {
  const lock = JSON.parse(fs.readFileSync(path.join(ICONS, 'codepoints.json'), 'utf8'));
  /** @type {Record<string, number>} */
  const codes = lock.glyphs;
  /** Export name → glyph name, from the generated barrel. */
  const exportsToName = new Map();
  const barrel = fs.readFileSync(path.join(ICONS, 'glyphs.js'), 'utf8');
  for (const [, exportName, name] of barrel.matchAll(/export \{ default as (\w+) \} from '\.\/svg\/([^']+)\.svg'/g)) {
    exportsToName.set(exportName, name);
  }

  const folders = (typeof extra === 'string' ? [extra] : extra ?? []).map((folder) =>
    real(path.resolve(root, folder)),
  );
  /** @type {Map<string, GlyphFile>} file → glyph, for the app's folders */
  let extraByFile = new Map();

  /** Codes follow the sorted file names, so a glyph's code does not depend on what is used. */
  function scanExtra() {
    /** @type {{ name: string; file: string }[]} */
    const found = [];
    for (const folder of folders) {
      if (!fs.existsSync(folder)) throw new Error(`bladeIconFontPlugin: no icon folder at ${folder}`);
      for (const entry of fs.readdirSync(folder)) {
        if (entry.endsWith('.svg')) found.push({ name: entry.slice(0, -4), file: path.join(folder, entry) });
      }
    }
    found.sort((a, b) => a.name.localeCompare(b.name));
    if (FIRST_EXTRA + found.length - 1 > LAST_EXTRA) throw new Error('bladeIconFontPlugin: too many extra icons');
    const seen = new Set();
    extraByFile = new Map(
      found.map(({ name, file }, index) => {
        if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) {
          throw new Error(`bladeIconFontPlugin: icon file "${file}" must be named in kebab-case, e.g. rocket-launch.svg`);
        }
        if (name in codes) {
          throw new Error(`bladeIconFontPlugin: "${file}" has a Blade icon's name ("${name}"); rename it`);
        }
        if (seen.has(name)) throw new Error(`bladeIconFontPlugin: two icon files are named "${name}.svg"`);
        seen.add(name);
        return [file, { name, code: FIRST_EXTRA + index, file }];
      }),
    );
  }
  scanExtra();

  /**
   * The glyph an SVG file stands for, or null when it is not an icon.
   * @returns {GlyphFile | null}
   */
  function glyphFor(/** @type {string} */ file) {
    if (!file.endsWith('.svg')) return null;
    const dir = path.dirname(file);
    if (dir === ICON_SVGS) {
      const name = path.basename(file, '.svg');
      return name in codes ? { name, code: codes[name], file } : null;
    }
    return extraByFile.get(file) ?? extraByFile.get(real(file)) ?? null;
  }

  function isBarrel(/** @type {string} */ from, /** @type {string} */ importer) {
    if (from === PACKAGE_ICONS) return true;
    if (!from.startsWith('.')) return false;
    return BARREL_FILES.has(path.resolve(path.dirname(importer), from));
  }

  /**
   * Named imports and re-exports of the barrel, rewritten to the icons' own
   * files. Namespace, default and dynamic imports are left alone: they take
   * the whole set, which is then what the font holds.
   * @returns {string | null} the new code, or null when nothing changed
   */
  function rewriteImports(/** @type {string} */ code, /** @type {string} */ importer) {
    if (!code.includes('icons')) return null;
    let changed = false;
    const statement = /\b(import|export)\s*(type\s+)?\{([^}]*)\}\s*from\s*(['"])([^'"]+)\4\s*;?/g;
    const next = code.replace(statement, (whole, kind, typeOnly, list, _quote, from) => {
      if (typeOnly || !isBarrel(from, importer)) return whole;
      const kept = [];
      const lines = [];
      for (const raw of list.split(',')) {
        const specifier = raw.trim();
        if (!specifier) continue;
        if (specifier.startsWith('type ')) continue;
        const [imported, local = imported] = specifier.split(/\s+as\s+/);
        const name = exportsToName.get(imported);
        if (!name) {
          kept.push(specifier);
          continue;
        }
        const file = JSON.stringify(path.join(ICON_SVGS, `${name}.svg`));
        lines.push(kind === 'import' ? `import ${local} from ${file};` : `export { default as ${local} } from ${file};`);
      }
      if (lines.length === 0) return whole;
      changed = true;
      if (kept.length) lines.push(`${kind} { ${kept.join(', ')} } from ${JSON.stringify(from)};`);
      return lines.join(' ');
    });
    return changed ? next : null;
  }

  /**
   * A glyph's module: the token (what `glyph()` in runes/icon/source.ts
   * makes, written out so the module needs no TypeScript), and the face that
   * draws it.
   */
  function glyphModule(/** @type {GlyphFile} */ glyph, /** @type {string} */ faceImport) {
    // Built at runtime: a minifier would write a literal character out as raw
    // UTF-8, which a page served without a charset misreads.
    const code = `0x${glyph.code.toString(16).toUpperCase()}`;
    return `import ${JSON.stringify(faceImport)};
export default Object.freeze({ name: ${JSON.stringify(glyph.name)}, code: String.fromCodePoint(${code}) });
`;
  }

  /**
   * The font for these glyphs, from the cache under the root when its inputs
   * have not changed. Files are named by content.
   * @param {Iterable<string>} files the glyphs' SVG files
   * @param {readonly Format[]} formats
   * @returns {Promise<Record<Format, { path: string; name: string; source: Buffer }>>}
   */
  async function font(files, formats) {
    const glyphs = [...new Set(files)]
      .map((file) => glyphFor(file))
      .filter((glyph) => glyph !== null)
      .sort((a, b) => a.code - b.code)
      .map(({ name, code, file }) => ({ name, code, svg: fs.readFileSync(file, 'utf8') }));
    const hash = createHash('sha256').update(JSON.stringify([BUILD_VERSION, glyphs])).digest('hex').slice(0, 10);
    const dir = path.join(root, 'node_modules', '.cache', 'blade-icons');
    const name = (/** @type {Format} */ format) => `${FONT_FAMILY}.${hash}.${format}`;
    if (!formats.every((format) => fs.existsSync(path.join(dir, name(format))))) {
      const built = await buildFont(glyphs);
      fs.mkdirSync(dir, { recursive: true });
      for (const format of formats) fs.writeFileSync(path.join(dir, name(format)), built[format]);
    }
    return /** @type {Record<Format, { path: string; name: string; source: Buffer }>} */ (
      Object.fromEntries(
        formats.map((format) => {
          const file = path.join(dir, name(format));
          return [format, { path: file, name: name(format), source: fs.readFileSync(file) }];
        }),
      )
    );
  }

  return { folders, glyphFor, rewriteImports, glyphModule, font, scanExtra, codesFile: path.join(ICONS, 'codepoints.json') };
}

/**
 * The module that registers the font face. `urls` are JS expressions, one
 * per format. A newer copy (a hot update) replaces the face an older one added.
 * @param {string[]} urls
 * @param {readonly Format[]} formats
 * @param {string} [hot] the bundler's self-accept statement
 */
export function faceModule(urls, formats, hot = '') {
  return `const urls = [${urls.join(', ')}];
const formats = ${JSON.stringify(formats.map(formatName))};
const current = Symbol.for('blade-icons.face');
if (typeof document !== 'undefined' && typeof FontFace !== 'undefined' && urls.length) {
  const face = new FontFace(
    ${JSON.stringify(FONT_FAMILY)},
    urls.map((url, i) => \`url(\${JSON.stringify(url)}) format('\${formats[i]}')\`).join(', '),
    { display: 'block' },
  );
  if (globalThis[current]) document.fonts.delete(globalThis[current]);
  globalThis[current] = face;
  document.fonts.add(face);
  face.load().catch(() => {});
}
${hot}
`;
}

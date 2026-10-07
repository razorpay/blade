// @vitest-environment node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { prepareSvg } from '../svg.js';
import { buildFont } from '../font.js';
import { createIconCore, ICON_SVGS, PACKAGE_ICONS } from '../core.js';
import { bladeIconFontPlugin as vitePlugin } from '../vite.js';
import { bladeIconFontPlugin as webpackPlugin } from '../webpack.js';

const ICONS = path.resolve(__dirname, '../../icons');
const svgOf = (name: string): string => fs.readFileSync(path.join(ICONS, 'svg', `${name}.svg`), 'utf8');
const ROCKET = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 4h16v16H4z" fill="currentColor"/></svg>';

const roots: string[] = [];
afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

/** A project of its own, with an icon folder holding rocket.svg and gift-card.svg. */
function tempRoot(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'blade-icons-'));
  roots.push(root);
  fs.mkdirSync(path.join(root, 'src', 'icons'), { recursive: true });
  fs.writeFileSync(path.join(root, 'src', 'icons', 'rocket.svg'), ROCKET);
  fs.writeFileSync(path.join(root, 'src', 'icons', 'gift-card.svg'), ROCKET.replace('M4 4', 'M2 2'));
  return root;
}

/** The private-use codepoints a woff2 maps, read from its cmap. */
async function glyphCodes(woff2: Buffer): Promise<number[]> {
  const { default: wawoff2 } = await import('wawoff2');
  const ttf = Buffer.from(await wawoff2.decompress(woff2));
  const codes: number[] = [];
  for (let i = 0; i < ttf.readUInt16BE(4); i += 1) {
    const record = 12 + i * 16;
    if (ttf.toString('latin1', record, record + 4) !== 'cmap') continue;
    const cmap = ttf.readUInt32BE(record + 8);
    for (let j = 0; j < ttf.readUInt16BE(cmap + 2); j += 1) {
      const offset = cmap + ttf.readUInt32BE(cmap + 8 + j * 8);
      if (ttf.readUInt16BE(offset) !== 4) continue;
      const segments = ttf.readUInt16BE(offset + 6) / 2;
      for (let k = 0; k < segments; k += 1) {
        const end = ttf.readUInt16BE(offset + 14 + k * 2);
        const begin = ttf.readUInt16BE(offset + 16 + segments * 2 + k * 2);
        for (let code = begin; code <= end; code += 1) if (code >= 0xe000 && code <= 0xf8ff) codes.push(code);
      }
      return codes;
    }
  }
  return codes;
}

describe('prepareSvg', () => {
  it('turns evenodd holes into nonzero ones: the hole runs the other way', () => {
    // An outer square and an inner one drawn the same way: a hole only under evenodd.
    const svg =
      '<svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="M0 0H24V24H0ZM6 6H18V18H6Z"/></svg>';
    const { d } = prepareSvg(svg, 'framed');
    const [outer, inner] = d.split('Z').filter(Boolean);
    const area = (subpath: string): number => {
      const points = [...subpath.matchAll(/(-?[\d.]+) (-?[\d.]+)/g)].map(([, x, y]) => [Number(x), Number(y)]);
      return points.reduce((sum, [x, y], i) => {
        const [nx, ny] = points[(i + 1) % points.length];
        return sum + x * ny - nx * y;
      }, 0);
    };
    expect(Math.sign(area(outer))).toBe(1);
    expect(Math.sign(area(inner))).toBe(-1);
  });

  it('squares a wide drawing around its centre', () => {
    expect(prepareSvg('<svg viewBox="0 0 32 16"><path d="M0 0H32V16H0Z"/></svg>', 'wide').viewBox).toBe(
      '0 -8 32 32',
    );
  });

  it.each([
    ['strokes', '<path d="M0 0L5 5" stroke="currentColor" stroke-width="2"/>', /strokes/],
    ['two colours', '<path d="M0 0H5V5Z" fill="#f00"/><path d="M6 6H9V9Z" fill="#00f"/>', /more than one colour/],
    ['gradients', '<path d="M0 0H5V5Z" fill="url(#g)"/>', /gradients|more than one colour/],
    ['transforms', '<path d="M0 0H5V5Z" transform="scale(2)"/>', /transform/],
    ['opacity', '<path d="M0 0H5V5Z" fill-opacity=".5"/>', /opacity/],
  ])('rejects %s: icons are single-colour filled shapes', (_, body, error) => {
    expect(() => prepareSvg(`<svg viewBox="0 0 24 24">${body}</svg>`, 'bad')).toThrow(error);
  });
});

describe('buildFont', () => {
  it('is deterministic: the same glyphs give the same bytes', async () => {
    const glyphs = [
      { name: 'info', code: 0xe0d0, svg: svgOf('info') },
      { name: 'close', code: 0xe07c, svg: svgOf('close') },
    ];
    const [a, b] = await Promise.all([buildFont(glyphs), buildFont([...glyphs].reverse())]);
    expect(a.woff2.equals(b.woff2)).toBe(true);
    expect(a.woff2.subarray(0, 4).toString('latin1')).toBe('wOF2');
  });
});


describe('createIconCore', () => {
  it('rewrites named barrel imports and re-exports to the icons\' files', () => {
    const core = createIconCore({ root: tempRoot() });
    const out = core.rewriteImports(
      `import { InfoIcon, CloseIcon as X } from "${PACKAGE_ICONS}";\nexport { WalletIcon } from '${PACKAGE_ICONS}';`,
      '/app/src/App.js',
    )!;
    expect(out).toContain(`import InfoIcon from ${JSON.stringify(path.join(ICON_SVGS, 'info.svg'))};`);
    expect(out).toContain(`import X from ${JSON.stringify(path.join(ICON_SVGS, 'close.svg'))};`);
    expect(out).toContain(`export { default as WalletIcon } from ${JSON.stringify(path.join(ICON_SVGS, 'wallet.svg'))};`);
    expect(out).not.toContain(PACKAGE_ICONS);
  });

  it('leaves namespace imports and other modules alone; keeps non-icon names on the barrel', () => {
    const core = createIconCore({ root: tempRoot() });
    expect(core.rewriteImports(`import * as icons from '${PACKAGE_ICONS}';`, '/app/a.js')).toBeNull();
    expect(core.rewriteImports("import { InfoIcon } from './icons';", '/app/a.js')).toBeNull();
    const mixed = core.rewriteImports(`import { InfoIcon, Other } from '${PACKAGE_ICONS}';`, '/app/a.js')!;
    expect(mixed).toContain(`import { Other } from "${PACKAGE_ICONS}";`);
  });

  it('rewrites the package\'s own relative barrel imports', () => {
    const core = createIconCore({ root: tempRoot() });
    const importer = path.resolve(__dirname, '../../components/alert/styles.ts');
    expect(core.rewriteImports("import { InfoIcon } from '../../icons';", importer)).toContain('info.svg');
  });

  it('knows Blade\'s glyphs and the folders\' glyphs, coded by sorted file name', () => {
    const root = tempRoot();
    const core = createIconCore({ root, extra: './src/icons' });
    expect(core.glyphFor(path.join(ICON_SVGS, 'info.svg'))).toMatchObject({ name: 'info', code: 0xe0d0 });
    expect(core.glyphFor(path.join(root, 'src/icons/gift-card.svg'))).toMatchObject({ name: 'gift-card', code: 0xf000 });
    expect(core.glyphFor(path.join(root, 'src/icons/rocket.svg'))).toMatchObject({ name: 'rocket', code: 0xf001 });
    expect(core.glyphFor(path.join(root, 'src/logo.svg'))).toBeNull();
  });

  it('rejects folder files a font cannot name', () => {
    const root = tempRoot();
    fs.writeFileSync(path.join(root, 'src/icons/info.svg'), ROCKET);
    expect(() => createIconCore({ root, extra: './src/icons' })).toThrow(/Blade icon's name/);
    fs.rmSync(path.join(root, 'src/icons/info.svg'));
    fs.writeFileSync(path.join(root, 'src/icons/Bad Name.svg'), ROCKET);
    expect(() => createIconCore({ root, extra: './src/icons' })).toThrow(/kebab-case/);
  });
});

type Hook = (this: unknown, ...args: unknown[]) => unknown;

/** The Vite plugin pair past configResolved, with a Rollup-like context. */
function startVite(options: Parameters<typeof vitePlugin>[0], root: string, command = 'build') {
  const [glyphs, imports] = vitePlugin(options);
  const call = (plugin: object, name: string, ctx: unknown, ...args: unknown[]) =>
    ((plugin as Record<string, Hook>)[name]).call(ctx, ...args);
  call(glyphs, 'configResolved', glyphs, { root, command });
  const sources = new Map<string, Buffer>();
  let emitted = 0;
  const context = {
    addWatchFile: vi.fn(),
    emitFile: vi.fn(() => `ref${(emitted += 1)}`),
    setAssetSource: vi.fn((ref: string, source: Buffer) => sources.set(ref, source)),
  };
  return {
    context,
    sources,
    load: (id: string, ssr = false) => call(glyphs, 'load', context, id, { ssr }) as Promise<string | null>,
    transform: (code: string, id: string) => call(imports, 'transform', context, code, id) as { code: string } | null,
    end: () => call(glyphs, 'buildEnd', context) as Promise<void>,
  };
}

describe('bladeIconFontPlugin (Vite)', () => {
  it('turns icon SVGs into glyph modules and leaves other SVGs and ?url alone', async () => {
    const root = tempRoot();
    const vite = startVite({ extra: './src/icons' }, root);
    const info = await vite.load(path.join(ICON_SVGS, 'info.svg'));
    expect(info).toContain('export default Object.freeze({ name: "info", code: String.fromCodePoint(0xE0D0) });');
    expect(info).toContain("import \"virtual:blade-icons/face\";");
    expect(await vite.load(path.join(root, 'src/icons/rocket.svg?import'))).toContain('String.fromCodePoint(0xF001)');
    expect(await vite.load(path.join(root, 'src/icons/rocket.svg?url'))).toBeNull();
    expect(await vite.load(path.join(root, 'src/logo.svg'))).toBeNull();
  });

  it('builds the font from the glyph modules loaded, at buildEnd', async () => {
    const root = tempRoot();
    const vite = startVite({ extra: './src/icons' }, root);
    const face = (await vite.load('\0virtual:blade-icons/face'))!;
    expect(face).toContain('import.meta.ROLLUP_FILE_URL_ref1');
    await vite.load(path.join(ICON_SVGS, 'info.svg'));
    await vite.load(path.join(ICON_SVGS, 'wallet.svg'));
    await vite.load(path.join(root, 'src/icons/rocket.svg'));
    expect(vite.context.setAssetSource).not.toHaveBeenCalled();
    await vite.end();
    // gift-card sits in the folder but nothing imported it.
    expect(await glyphCodes(vite.sources.get('ref1')!)).toEqual([0xe0d0, 0xe1b4, 0xf001]);
  });

  it('leaves ?raw and ?url modules alone: their import lines are text', () => {
    const vite = startVite({}, tempRoot());
    const raw = `export default "import { InfoIcon } from '${PACKAGE_ICONS}';"`;
    expect(vite.transform(raw, '/app/src/Basic.svelte?raw')).toBeNull();
    expect(vite.transform(raw, '/app/src/Basic.svelte?url')).toBeNull();
  });

  it('rewrites barrel imports in compiled modules, not in styles', () => {
    const vite = startVite({}, tempRoot());
    expect(vite.transform(`import { InfoIcon } from '${PACKAGE_ICONS}';`, '/app/src/App.svelte')?.code).toContain('info.svg');
    expect(vite.transform(`import { InfoIcon } from '${PACKAGE_ICONS}';`, '/app/src/App.svelte?svelte&type=style&lang.css')).toBeNull();
  });

  it('a server build loads the face module but emits no font', async () => {
    const vite = startVite({}, tempRoot());
    expect(await vite.load('\0virtual:blade-icons/face', true)).toContain('const urls = [];');
    expect(vite.context.emitFile).not.toHaveBeenCalled();
  });
});

describe('bladeIconFontPlugin (webpack)', () => {
  it('compiles a font of the imported icons and points the face at it', async () => {
    const { default: webpack } = await import('webpack');
    const root = tempRoot();
    fs.writeFileSync(
      path.join(root, 'src', 'index.js'),
      `import { InfoIcon } from '@razorpay/blade-svelte/icons';
import RocketIcon from './icons/rocket.svg';
export const icons = [InfoIcon, RocketIcon];`,
    );
    const compiler = webpack({
      mode: 'production',
      context: root,
      entry: './src/index.js',
      output: { path: path.join(root, 'dist'), publicPath: '/', library: { type: 'module' } },
      experiments: { outputModule: true },
      // As installed: the barrel by its package name.
      resolve: { alias: { '@razorpay/blade-svelte/icons': path.join(ICONS, 'index.js') } },
      plugins: [webpackPlugin({ extra: './src/icons' })],
      optimization: { minimize: false },
    });
    const stats = await new Promise<import('webpack').Stats>((resolve, reject) =>
      compiler.run((error, result) => (error ? reject(error) : resolve(result!))),
    );
    await new Promise((resolve) => compiler.close(resolve));
    expect(stats.hasErrors(), stats.toString({ errors: true, all: false })).toBe(false);
    const files = fs.readdirSync(path.join(root, 'dist'));
    const font = files.find((file) => file.endsWith('.woff2'))!;
    expect(font).toMatch(/^blade-icons\.\w+\.woff2$/);
    expect(await glyphCodes(fs.readFileSync(path.join(root, 'dist', font)))).toEqual([0xe0d0, 0xf001]);
    const js = fs.readFileSync(path.join(root, 'dist', files.find((file) => /\.m?js$/.test(file))!), 'utf8');
    expect(js).toContain(font);
    expect(js).toContain('new FontFace(');
  });
});

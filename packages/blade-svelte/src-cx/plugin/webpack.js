// @ts-check
/**
 * `bladeIconFontPlugin()` for webpack 5. As the Vite plugin: SVG imports from
 * Blade's set and the app's icon folders become glyphs, and the build emits a
 * `blade-icons` font of exactly the glyphs it loaded.
 *
 * ```js
 * const { bladeIconFontPlugin } = require('@razorpay/blade-svelte/webpack');
 * module.exports = { plugins: [bladeIconFontPlugin({ extra: './src/icons' })] };
 * ```
 */
import { fileURLToPath } from 'node:url';
import { createIconCore, faceModule } from './core.js';
import { REGISTRY } from './webpack-state.js';

const NAME = 'BladeIconFontPlugin';
const LOADER = fileURLToPath(new URL('./webpack-loader.js', import.meta.url));
const FACE_FILE = fileURLToPath(new URL('./face.js', import.meta.url));

/** @typedef {import('./types.js').BladeIconFontPluginOptions} BladeIconFontPluginOptions */
/** @typedef {import('./core.js').Format} Format */

let instances = 0;

export class BladeIconFontPlugin {
  /** @param {BladeIconFontPluginOptions} [options] */
  constructor(options = {}) {
    this.options = options;
    this.id = `blade-icons-${(instances += 1)}`;
  }

  /** @param {import('webpack').Compiler} compiler */
  apply(compiler) {
    const { formats = ['woff2'] } = this.options;
    const core = createIconCore({ root: compiler.context, extra: this.options.extra });
    const { Compilation, sources } = compiler.webpack;
    /** The current font's URL expressions, and its files to emit. */
    /** @type {string[]} */
    let urls = [];
    /** @type {{ name: string; source: Buffer }[]} */
    let files = [];
    const hot = 'if (import.meta.webpackHot) import.meta.webpackHot.accept();';
    REGISTRY.set(this.id, { core, faceFile: FACE_FILE, faceSource: () => faceModule(urls, formats, hot) });

    const loader = (/** @type {'imports' | 'glyph' | 'face'} */ mode) => ({
      loader: LOADER,
      options: { mode, id: this.id },
      ident: `${this.id}-${mode}`,
      type: 'module',
    });

    // Barrel imports become per-icon imports, after other loaders compile to JS.
    compiler.options.module.rules.push({
      test: /\.(m?[jt]sx?|svelte)$/,
      // A `?raw` import is the file as text: its import lines aren't imports.
      resourceQuery: { not: [/raw|url/] },
      enforce: 'post',
      use: [loader('imports')],
    });

    // Glyph modules import the face only for what it does; the package marks
    // its files side-effect free, which would drop that import.
    compiler.options.module.rules.push({ resource: FACE_FILE, sideEffects: true });

    compiler.hooks.watchRun.tap(NAME, () => core.scanExtra());

    compiler.hooks.normalModuleFactory.tap(NAME, (factory) => {
      factory.hooks.afterResolve.tap(NAME, (resolveData) => {
        const data = /** @type {any} */ (resolveData.createData);
        const file = data.resourceResolveData?.path;
        const query = data.resourceResolveData?.query ?? '';
        const isFace = file === FACE_FILE;
        if (!file || query || (!isFace && !core.glyphFor(file))) return;
        // Whatever rule matched the SVG (an asset rule, a URL loader), an icon
        // is a JS module here.
        data.loaders = [loader(isFace ? 'face' : 'glyph')];
        data.type = 'javascript/auto';
        data.settings = { ...data.settings, type: 'javascript/auto' };
        data.parser = factory.getParser('javascript/auto');
        data.generator = factory.getGenerator('javascript/auto');
      });
    });

    compiler.hooks.thisCompilation.tap(NAME, (compilation) => {
      // Every module is built: the glyph set is final, so the font can be made
      // and the face module rebuilt to point at it.
      compilation.hooks.finishModules.tapPromise(NAME, async (modules) => {
        /** @type {any} */
        let face;
        const glyphFiles = [];
        for (const module of modules) {
          const resource = /** @type {any} */ (module).resource;
          if (!resource) continue;
          const [file, query = ''] = resource.split('?');
          if (file === FACE_FILE) face = module;
          else if (!query && core.glyphFor(file)) glyphFiles.push(file);
        }
        if (!face) return;
        const font = await core.font(glyphFiles, formats);
        files = formats.map((format) => ({ name: font[format].name, source: font[format].source }));
        urls = formats.map((format) => `__webpack_public_path__ + ${JSON.stringify(font[format].name)}`);
        await new Promise((resolve, reject) => {
          compilation.rebuildModule(face, (error) => (error ? reject(error) : resolve(undefined)));
        });
      });
      compilation.hooks.processAssets.tap({ name: NAME, stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL }, () => {
        for (const { name, source } of files) {
          if (!compilation.getAsset(name)) compilation.emitAsset(name, new sources.RawSource(source));
        }
      });
    });
  }
}

/** @param {BladeIconFontPluginOptions} [options] */
export function bladeIconFontPlugin(options) {
  return new BladeIconFontPlugin(options);
}

export default bladeIconFontPlugin;

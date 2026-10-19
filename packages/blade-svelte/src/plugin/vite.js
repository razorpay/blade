// @ts-check
/**
 * `bladePlugin()` for Vite. Icons stay SVG imports in the app's code;
 * this turns the ones from Blade's set and from the app's icon folders into
 * glyphs, and builds the `blade-icons` font from exactly the glyphs the build
 * loads. Plain JS: Vite loads it from node_modules, where Node strips no types.
 */
import { posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createIconCore, faceModule, FONT_FAMILY, SOURCE_MODULE } from './core.js';

/** The plugin's own files (and tests, whose strings hold sample imports). */
const PLUGIN_DIR = fileURLToPath(new URL('.', import.meta.url));

const FACE_ID = 'virtual:blade-icons/face';
const RESOLVED_FACE_ID = '\0virtual:blade-icons/face';
/** Dev: how long to wait for more newly loaded glyphs before rebuilding. */
const REBUILD_DELAY = 30;

/** @typedef {import('./types.js').BladePluginOptions} BladePluginOptions */
/** @typedef {import('./core.js').Format} Format */

/** An SVG request the plugin may answer: a bare import, not `?url` or `?raw`. */
function svgFile(/** @type {string} */ id) {
  const [file, query = ''] = id.split('?');
  if (!file.endsWith('.svg')) return null;
  return query === '' || query === 'import' ? file : null;
}

/**
 * @param {BladePluginOptions} [options]
 * @returns {import('vite').Plugin[]}
 */
export default function bladePlugin(options = {}) {
  const { formats = ['woff2'] } = options;
  /** @type {ReturnType<typeof createIconCore>} */
  let core;
  let isBuild = false;
  /** The SVG files of the glyphs loaded so far. */
  const used = new Set();
  /**
   * Build: the font files, made at buildEnd once every glyph is known and
   * emitted with the bundle. Vite 8's bundler cannot fill in an asset
   * emitted earlier, so the face module carries a placeholder per format
   * that generateBundle swaps for the emitted file's path.
   * @type {{ files?: Awaited<ReturnType<ReturnType<typeof createIconCore>['font']>> }}
   */
  const built = {};
  let wantsFont = false;
  const placeholder = (/** @type {Format} */ format) => `__BLADE_ICONS_FONT_${format}__`;
  /** Dev: the glyph set the current font was built from. */
  let devKey = '';
  /**
   * Dev: the server once configured, and the rebuild waiting on it.
   * @type {{ server?: import('vite').ViteDevServer; rebuildTimer?: ReturnType<typeof setTimeout> }}
   */
  const dev = {};

  const setKey = () => [...used].sort().join('|');

  /** Dev: rebuild once newly loaded glyphs settle, then swap the face in place. */
  function scheduleRebuild() {
    if (!dev.server || setKey() === devKey) return;
    clearTimeout(dev.rebuildTimer);
    dev.rebuildTimer = setTimeout(() => {
      if (setKey() === devKey) return;
      const face = dev.server?.moduleGraph.getModuleById(RESOLVED_FACE_ID);
      if (face) dev.server?.reloadModule(face);
    }, REBUILD_DELAY);
  }

  return [
    {
      name: 'blade-icons:glyphs',
      // Ahead of Vite's asset handling, which would make every SVG a URL.
      enforce: 'pre',
      config() {
        // Pre-bundling would hide the icon imports inside the package.
        return { optimizeDeps: { exclude: ['@razorpay/blade-svelte'] } };
      },
      configResolved(config) {
        isBuild = config.command === 'build';
        core = createIconCore({ root: config.root, extra: options.extra });
      },
      resolveId(id) {
        return id === FACE_ID ? RESOLVED_FACE_ID : null;
      },
      async load(id, loadOptions) {
        if (id === RESOLVED_FACE_ID) {
          // The client build owns the font; a server build only needs the module.
          if (loadOptions?.ssr) return faceModule([], formats);
          if (isBuild) {
            // The glyph set is only known once every module is loaded: the
            // URL is resolved against the chunk once the font is emitted.
            wantsFont = true;
            return faceModule(
              formats.map(
                // Not a file yet: Vite's asset handling must leave it alone.
                (format) =>
                  `new URL(/* @vite-ignore */ ${JSON.stringify(
                    placeholder(format),
                  )}, import.meta.url).href`,
              ),
              formats,
            );
          }
          devKey = setKey();
          const files = await core.font(used, formats);
          return faceModule(
            formats.map((format) => JSON.stringify(`/@fs${files[format].path}`)),
            formats,
            'import.meta.hot?.accept();',
          );
        }
        const file = svgFile(id);
        const glyph = file && core.glyphFor(file);
        if (!glyph) return null;
        used.add(glyph.file);
        this.addWatchFile(core.codesFile);
        scheduleRebuild();
        return core.glyphModule(glyph, FACE_ID);
      },
      async buildEnd(error) {
        if (error || !isBuild || !wantsFont) return;
        built.files = await core.font(used, formats);
      },
      generateBundle(_options, bundle) {
        const { files } = built;
        if (!files) return;
        built.files = undefined;
        for (const format of formats) {
          const reference = this.emitFile({
            type: 'asset',
            name: `${FONT_FAMILY}.${format}`,
            source: files[format].source,
          });
          const fileName = this.getFileName(reference);
          // The bare token: a minifier may requote the string (backticks).
          const token = placeholder(format);
          for (const chunk of Object.values(bundle)) {
            if (chunk.type !== 'chunk' || !chunk.code.includes(token)) continue;
            // Relative to the chunk, which `new URL(…, import.meta.url)` reads it from.
            const relative = posix.relative(posix.dirname(chunk.fileName), fileName);
            chunk.code = chunk.code.replaceAll(
              token,
              relative.startsWith('.') ? relative : `./${relative}`,
            );
          }
        }
      },
      configureServer(devServer) {
        dev.server = devServer;
        if (core.folders.length === 0) return;
        devServer.watcher.add(core.folders);
        const inFolders = (/** @type {string} */ file) =>
          core.folders.some((folder) => file.startsWith(`${folder}/`));
        // A new or removed file shifts the codes after it: start over.
        const onFolderChange = (/** @type {string} */ file) => {
          if (!inFolders(file) || !file.endsWith('.svg')) return;
          core.scanExtra();
          devServer.moduleGraph.invalidateAll();
          devServer.ws.send({ type: 'full-reload' });
        };
        devServer.watcher.on('add', onFolderChange);
        devServer.watcher.on('unlink', onFolderChange);
        // A redrawn icon keeps its code: only the font changes.
        devServer.watcher.on('change', (file) => {
          if (!inFolders(file) || !used.has(file)) return;
          devKey = '';
          const face = devServer.moduleGraph.getModuleById(RESOLVED_FACE_ID);
          if (face) devServer.reloadModule(face);
        });
      },
    },
    {
      name: 'blade-icons:imports',
      // After Svelte and TypeScript have compiled to JS, so imports are plain.
      transform(code, id) {
        const [file, query = ''] = id.split('?');
        // A `?raw`/`?url` import is the file as data (a story's source shown as
        // text, say): its import lines are text, not imports.
        if (/(^|&)(raw|url|inline|worker)(&|=|$)/.test(query)) return null;
        if (query.includes('type=style') || !/\.(svelte|[cm]?[jt]sx?)$/.test(file)) return null;
        if (file === SOURCE_MODULE || file.startsWith(PLUGIN_DIR)) return null;
        const next = core.rewriteImports(code, file);
        return next === null ? null : { code: next, map: null };
      },
    },
  ];
}

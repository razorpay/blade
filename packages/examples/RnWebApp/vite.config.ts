import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const rnwPath = path.resolve(__dirname, 'node_modules/react-native-web');
const bladePath = path.resolve(__dirname, 'node_modules/@razorpay/blade');

export default defineConfig({
  plugins: [
    {
      // isReactNative() reads navigator.product === 'ReactNative'. Patch the source so
      // the native blade bundle always returns 'react-native' when running via react-native-web.
      name: 'blade-platform-type',
      enforce: 'pre',
      transform(code, id) {
        if (!id.includes('getPlatformType.js') || id.includes('index.js')) return null;
        return {
          code: `export const getPlatformType = () => 'react-native';\n`,
          map: null,
        };
      },
    },
    {
      // BaseBox.native.js passes `style: [shadow, props.style]` (array) to styled(View).
      // Browser styled-components merges styles via Object.assign({}, ..., arrayValue) which
      // turns array indices into numeric keys {0: shadow, 1: propsStyle}. React then tries to
      // set domStyle[0] = ... on CSSStyleDeclaration, which doesn't support indexed property setters.
      // Fix: flatten the style array into a plain object before styled-components sees it.
      name: 'blade-basebox-style-flatten',
      enforce: 'pre',
      transform(code, id) {
        if (!id.includes('BaseBox.native.js')) return null;
        if (!code.includes('shadow?[shadow,props.style]:props.style')) return null;
        return {
          code: code.replace(
            'shadow?[shadow,props.style]:props.style',
            'shadow?Object.assign({},shadow,Array.isArray(props.style)?Object.assign({},...props.style.filter(Boolean)):props.style||{}):props.style',
          ),
          map: null,
        };
      },
    },
    {
      // styled-components merges style props via Object.assign({}, t4.style, {}, v3.style).
      // When t4.style is an array (RN-style arrays from blade native bundle), Object.assign
      // copies array indices as numeric keys {0: obj, 1: obj}. React then fails with
      // "Indexed property setter is not supported" when trying to set domStyle[0].
      // Fix: flatten any style arrays before the merge.
      name: 'styled-components-flatten-style',
      enforce: 'pre',
      transform(code, id) {
        if (!id.includes('styled-components') || id.includes('node_modules/.vite/deps')) return null;
        const target = 'A3.style = y({}, t4.style, {}, v3.style)';
        if (!code.includes(target)) return null;
        const flattenHelper =
          'var _flatStyle=function(s){return Array.isArray(s)?Object.assign.apply(Object,[{}].concat(s.filter(Boolean))):s||{};};';
        const replacement = `A3.style = y({}, _flatStyle(t4.style), {}, _flatStyle(v3.style))`;
        return { code: flattenHelper + code.replace(target, replacement), map: null };
      },
    },
    {
      name: 'reanimated-blade',
      enforce: 'pre',
      async transform(code, id) {
        if (!id.includes('@razorpay/blade') || !code.includes('useAnimatedStyle')) return null;
        const babel = await import('@babel/core');
        const result = await babel.transformAsync(code, {
          filename: id.replace(/\?.*$/, ''),
          plugins: ['react-native-reanimated/plugin'],
          sourceType: 'module',
          configFile: false,
          babelrc: false,
        });
        return result?.code ? { code: result.code, map: result.map ?? undefined } : null;
      },
    },
    react({
      babel: {
        plugins: ['react-native-reanimated/plugin'],
      },
    }),
  ],
  resolve: {
    // Array form preserves order — specific aliases must come before catch-alls
    alias: [
      // Use web-specific implementations for RN packages that have them
      {
        find: /react-native-safe-area-context\/lib\/module\/NativeSafeAreaProvider$/,
        replacement: path.resolve(
          __dirname,
          'node_modules/react-native-safe-area-context/lib/module/NativeSafeAreaProvider.web.js',
        ),
      },
      // Stub react-native sub-path modules not present in react-native-web
      {
        find: 'react-native/Libraries/Utilities/codegenNativeComponent',
        replacement: path.resolve(__dirname, 'src/mocks/nativeShims.js'),
      },
      {
        find: 'react-native/Libraries/Utilities/codegenNativeCommands',
        replacement: path.resolve(__dirname, 'src/mocks/nativeShims.js'),
      },
      {
        find: 'react-native/Libraries/Pressability/PressabilityDebug',
        replacement: path.resolve(__dirname, 'src/mocks/nativeShims.js'),
      },
      {
        find: 'react-native/Libraries/Renderer/shims/ReactNativeViewConfigRegistry',
        replacement: path.resolve(__dirname, 'src/mocks/nativeShims.js'),
      },
      {
        find: 'react-native/Libraries/ReactNative/ReactFabricPublicInstance/ReactFabricPublicInstance',
        replacement: path.resolve(__dirname, 'src/mocks/nativeShims.js'),
      },
      {
        find: 'react-native/Libraries/Renderer/shims/ReactFabric',
        replacement: path.resolve(__dirname, 'src/mocks/nativeShims.js'),
      },
      {
        find: 'react-native/Libraries/Renderer/shims/ReactNative',
        replacement: path.resolve(__dirname, 'src/mocks/nativeShims.js'),
      },
      // @formatjs packages have polyfill.js but no exports map entry for ./polyfill
      {
        find: '@formatjs/intl-locale/polyfill',
        replacement: path.resolve(__dirname, 'node_modules/@formatjs/intl-locale/polyfill.js'),
      },
      {
        find: '@formatjs/intl-displaynames/polyfill',
        replacement: path.resolve(
          __dirname,
          'node_modules/@formatjs/intl-displaynames/polyfill.js',
        ),
      },
      // Route blade sub-path imports to the native bundle.
      {
        find: '@razorpay/blade/components',
        replacement: path.resolve(bladePath, 'components.native.js'),
      },
      {
        find: '@razorpay/blade/tokens',
        replacement: path.resolve(bladePath, 'tokens.native.js'),
      },
      {
        find: '@razorpay/blade/utils',
        replacement: path.resolve(bladePath, 'utils.native.js'),
      },
      // Use styled-components native build for both styled-components/native and styled-components.
      // The native build outputs style objects via the `style` prop (not CSS classes), which
      // react-native-web components process through their style pipeline correctly.
      // The browser build outputs CSS class names which react-native-web's View drops (className
      // is not in View's forwardPropsList), so styled-components styles would be silently ignored.
      {
        find: 'styled-components/native',
        replacement: path.resolve(
          __dirname,
          'node_modules/styled-components/native/dist/styled-components.native.esm.js',
        ),
      },
      {
        find: /^styled-components$/,
        replacement: path.resolve(
          __dirname,
          'node_modules/styled-components/native/dist/styled-components.native.esm.js',
        ),
      },
      {
        // Comprehensive stub: re-exports react-native-web + stubs for missing native APIs
        find: /^react-native$/,
        replacement: path.resolve(__dirname, 'src/mocks/react-native-stub.js'),
      },
    ],
    // .native.* first, then .web.* for packages like react-native-safe-area-context
    // Blade is aliased explicitly so it always resolves to the native bundle regardless of this list
    extensions: ['.native.tsx', '.native.ts', '.native.jsx', '.native.js', '.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js'],
  },
  define: {
    global: 'globalThis',
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
    process: JSON.stringify({ env: { NODE_ENV: process.env.NODE_ENV ?? 'development' } }),
  },
  optimizeDeps: {
    include: [
      'react-native-web',
      'hoist-non-react-statics',
      'react-is',
      'supports-color',
      'invariant',
      'dayjs',
      'dayjs/plugin/customParseFormat',
      'dayjs/plugin/advancedFormat',
      'dayjs/plugin/weekday',
      'dayjs/plugin/localeData',
      'dayjs/plugin/weekOfYear',
      'dayjs/plugin/isoWeek',
      'dayjs/plugin/quarterOfYear',
      'framer-motion',
      'react-native-gesture-handler',
      'react-native-svg',
      '@gorhom/bottom-sheet',
      '@gorhom/portal',
      'react-native-pager-view',
      'react-native-safe-area-context',
    ],
    exclude: ['react-native-reanimated', '@razorpay/blade'],
    esbuildOptions: {
      // Treat react-native as external during pre-bundling; Rollup applies aliases at serve time.
      external: ['react-native'],
      plugins: [
        {
          name: 'native-safe-area-web',
          setup(build) {
            // Redirect NativeSafeAreaProvider to its web implementation during pre-bundling
            build.onResolve(
              { filter: /NativeSafeAreaProvider$/ },
              (args) => ({
                path: path.resolve(
                  path.dirname(args.importer),
                  args.path.replace(/NativeSafeAreaProvider$/, 'NativeSafeAreaProvider.web.js'),
                ),
                namespace: 'file',
              }),
            );
            // Stub out the Flow-typed assets-registry (used by react-native-svg's non-web paths)
            build.onResolve({ filter: /@react-native\/assets-registry/ }, () => ({
              path: 'empty',
              namespace: 'empty-ns',
            }));
            build.onLoad({ filter: /.*/, namespace: 'empty-ns' }, () => ({
              contents: 'export default {}; export const getAssetByID = () => null;',
            }));
          },
        },
      ],
    },
  },
});

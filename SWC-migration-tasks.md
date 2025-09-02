## SWC migration: ordered task list

- [ ] Prepare SWC dependencies and base .swcrc in `packages/blade`
  - Add dev deps: `@swc/core`, `@swc/jest`, `rollup-plugin-swc3`, `swc-loader`, `@swc/plugin-styled-components`
  - Add runtime dep: `@swc/helpers`
  - Create `packages/blade/.swcrc` with TS+JSX, react runtime automatic, external helpers, styled-components plugin

- [ ] Migrate Jest (web/native) transformers to `@swc/jest`
  - Update `packages/blade/jest.web.config.js` and `packages/blade/jest.native.config.js` `transform` to use `@swc/jest`
  - Stop using `jest-preprocess.js`

- [ ] Replace Rollup Babel with `rollup-plugin-swc3` in `packages/blade/rollup.config.mjs`
  - Swap `@rollup/plugin-babel` → `rollup-plugin-swc3`
  - Configure TS/TSX, react automatic runtime, `externalHelpers: true`, keep ESM outputs and structure

- [ ] Switch Storybook webpack to `swc-loader` for ts/tsx/js/jsx
  - In `packages/blade/.storybook/react/main.ts`, add a rule for `swc-loader`
  - Keep the special-case `babel-loader` for `@stackblitz/sdk` if needed

- [ ] Add `@swc/plugin-styled-components` and ensure parity with Babel plugin
  - Enable `displayName`, `pure`, and `ssr` options

- [ ] Clean up Babel-specific web config and unused deps
  - Remove web-only Babel presets/plugins and `@rollup/plugin-babel` where no longer used
  - Keep Babel for RN Metro until evaluated separately

- [ ] Add CI caching for SWC and record perf metrics
  - Cache `~/.cache/swc` and `node_modules/@swc/core*` layers
  - Capture timings for Jest, Rollup build, and Storybook before/after

- [ ] Evaluate RN Metro SWC transformer (optional follow-up)
  - Investigate `react-native-swc-transformer` compatibility with RN 0.72+

- [ ] Define rollback steps for Jest, Rollup, and Storybook
  - Document how to re-enable Babel quickly if regressions occur

---

Execution order is top-to-bottom. We will complete and validate each item before moving to the next.


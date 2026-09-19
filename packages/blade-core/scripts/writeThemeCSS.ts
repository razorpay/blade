/**
 * CLI entrypoint: writes `theme.css`, `theme-light.css` and `theme-dark.css` from
 * `generateThemeCSS()` / `generateThemeLightCSS()` / `generateThemeDarkCSS()`.
 *
 * Kept separate from `generateThemeCSS.ts` because that module is imported directly by the
 * drift-guard test — it must stay a pure `generate*CSS(): string` export with no side effects.
 * Run via `yarn generate:tokens-css`.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { generateThemeCSS, generateThemeDarkCSS, generateThemeLightCSS } from './generateThemeCSS';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));

const targets: Array<{ file: string; generate: () => string }> = [
  { file: path.resolve(CURRENT_DIR, '../src/tokens/theme.css'), generate: generateThemeCSS },
  {
    file: path.resolve(CURRENT_DIR, '../src/tokens/theme-light.css'),
    generate: generateThemeLightCSS,
  },
  {
    file: path.resolve(CURRENT_DIR, '../src/tokens/theme-dark.css'),
    generate: generateThemeDarkCSS,
  },
];

targets.forEach(({ file, generate }) => {
  fs.writeFileSync(file, generate());
  // eslint-disable-next-line no-console
  console.log(`Generated ${path.relative(process.cwd(), file)}`);
});

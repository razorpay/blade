/**
 * CLI entrypoint: writes `theme.css` from `generateThemeCSS()`.
 *
 * Kept separate from `generateThemeCSS.ts` because that module is imported directly by the
 * drift-guard test — it must stay a pure `generateThemeCSS(): string` export with no side effects.
 * Run via `yarn generate:tokens-css`.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { generateThemeCSS } from './generateThemeCSS';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const THEME_CSS_PATH = path.resolve(CURRENT_DIR, '../src/tokens/theme.css');

fs.writeFileSync(THEME_CSS_PATH, generateThemeCSS());
// eslint-disable-next-line no-console
console.log(`Generated ${path.relative(process.cwd(), THEME_CSS_PATH)}`);

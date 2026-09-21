/**
 * CLI entrypoint: writes `tailwind/preset.cjs` and `tailwind/safelist.cjs`.
 *
 * Kept separate from `generatePreset.ts` (which the drift-guard test imports as a pure, side-effect
 * free module). Run via `yarn generate:tailwind-preset`.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { generatePreset, generateSafelist } from './generatePreset';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const PRESET_PATH = path.resolve(CURRENT_DIR, 'preset.cjs');
const SAFELIST_PATH = path.resolve(CURRENT_DIR, 'safelist.cjs');

// Safelist first — the preset `require()`s it.
fs.writeFileSync(SAFELIST_PATH, generateSafelist());
fs.writeFileSync(PRESET_PATH, generatePreset());
// eslint-disable-next-line no-console
console.log(
  `Generated ${path.relative(process.cwd(), SAFELIST_PATH)} and ${path.relative(
    process.cwd(),
    PRESET_PATH,
  )}`,
);

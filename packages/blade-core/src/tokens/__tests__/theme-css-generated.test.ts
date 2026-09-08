import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { generateThemeCSS } from '../../../scripts/generateThemeCSS';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const themeCssPath = path.resolve(__dirname, '../theme.css');

describe('theme.css drift guard', () => {
  it('matches the generator output — run `yarn generate:tokens-css` if this fails', () => {
    const committed = fs.readFileSync(themeCssPath, 'utf8');
    expect(committed).toBe(generateThemeCSS());
  });
});

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import {
  generateThemeCSS,
  generateThemeDarkCSS,
  generateThemeLightCSS,
} from '../../../scripts/generateThemeCSS';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const files = [
  { file: 'theme.css', generate: generateThemeCSS },
  { file: 'theme-light.css', generate: generateThemeLightCSS },
  { file: 'theme-dark.css', generate: generateThemeDarkCSS },
] as const;

describe.each(files)('$file drift guard', ({ file, generate }) => {
  it('matches the generator output — run `yarn generate:tokens-css` if this fails', () => {
    const committed = fs.readFileSync(path.resolve(__dirname, `../${file}`), 'utf8');
    expect(committed).toBe(generate());
  });
});

describe('split file consistency', () => {
  it('theme-light.css + theme-dark.css cover every declaration of theme.css', () => {
    const combined = fs.readFileSync(path.resolve(__dirname, '../theme.css'), 'utf8');
    const light = fs.readFileSync(path.resolve(__dirname, '../theme-light.css'), 'utf8');
    const dark = fs.readFileSync(path.resolve(__dirname, '../theme-dark.css'), 'utf8');

    const declarations = (css: string): Set<string> =>
      new Set(
        css
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line.startsWith('--') && line.endsWith(';')),
      );

    const combinedDeclarations = declarations(combined);
    const splitDeclarations = new Set([...declarations(light), ...declarations(dark)]);

    expect(splitDeclarations).toEqual(combinedDeclarations);
  });
});

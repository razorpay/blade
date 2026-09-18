import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import { describe, expect, it } from 'vitest';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const postcssBladeLayer = require(path.resolve(__dirname, '../../../postcss-blade-layer.cjs'));

describe('postcss-blade-layer', () => {
  it('wraps blade-core *.module.css output in @layer blade', async () => {
    // Inline fixture (with a `.module.css` `from` path) so this test stays independent of any
    // specific component's CSS — component `.module.css` files are removed by the Tailwind migration.
    const inputPath = path.resolve(__dirname, '../__fixtures__/sample.module.css');
    const input = '.btn {\n  border-radius: var(--border-radius-small);\n}\n';

    const result = await postcss([postcssBladeLayer]).process(input, { from: inputPath });

    expect(result.css).toMatch(/^@layer blade\s*\{/);
    expect(result.css).toContain('border-radius: var(--border-radius-small)');
  });

  it('does not wrap non-module CSS', async () => {
    const inputPath = path.resolve(__dirname, '../layers.css');
    const input = fs.readFileSync(inputPath, 'utf8');

    const result = await postcss([postcssBladeLayer]).process(input, { from: inputPath });

    expect(result.css.trim()).toBe(input.trim());
  });
});

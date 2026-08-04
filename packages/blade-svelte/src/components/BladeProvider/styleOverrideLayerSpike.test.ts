import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import postcss from 'postcss';
import { describe, expect, it } from 'vitest';
import { getButtonClasses } from '@razorpay/blade-core/styles';

const localRequire = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const bladeCoreRoot = path.resolve(__dirname, '../../../../blade-core');
const postcssBladeLayer = localRequire(path.join(bladeCoreRoot, 'postcss-blade-layer.cjs'));

describe('styleOverride layer spike', () => {
  it('wraps button module CSS in @layer blade for cascade-safe overrides', async () => {
    const modulePath = path.join(bladeCoreRoot, 'src/styles/Button/button.module.css');
    const result = await postcss([postcssBladeLayer]).process(fs.readFileSync(modulePath, 'utf8'), {
      from: modulePath,
    });

    expect(result.css).toMatch(/^@layer blade\s*\{/);
    expect(result.css).toContain('border-radius: var(--border-radius-small)');
  });

  it('appends consumer root class via getButtonClasses without !important', () => {
    const classes = getButtonClasses({
      variant: 'primary',
      color: 'primary',
      size: 'medium',
      className: 'checkout-cta-override',
    });

    expect(classes).toContain('checkout-cta-override');
  });
});

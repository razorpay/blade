import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { generatePreset, generateSafelist, buildPresetTheme } from '../generatePreset';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const presetPath = path.resolve(__dirname, '../preset.cjs');
const safelistPath = path.resolve(__dirname, '../safelist.cjs');

describe('tailwind preset drift guard', () => {
  it('preset.cjs matches the generator — run `yarn generate:tailwind-preset` if this fails', () => {
    const committed = fs.readFileSync(presetPath, 'utf8');
    expect(committed).toBe(generatePreset());
  });

  it('safelist.cjs matches the generator — run `yarn generate:tailwind-preset` if this fails', () => {
    const committed = fs.readFileSync(safelistPath, 'utf8');
    expect(committed).toBe(generateSafelist());
  });
});

describe('preset token mapping', () => {
  const theme = buildPresetTheme();

  it('namespaces the spacing scale so Blade never clobbers a consumer default (no bare `4` key)', () => {
    expect(theme.spacing['spacing-4']).toBe('var(--spacing-4)');
    expect(theme.spacing['4']).toBeUndefined();
    // spacing.2 is 4px in Blade's non-linear scale — must not reuse Tailwind's p-2 (8px).
    expect(Object.keys(theme.spacing).every((k) => k.startsWith('spacing-'))).toBe(true);
  });

  it('maps semantic colors to their CSS variable (baked alpha, no --colors- prefix)', () => {
    expect(theme.colors['feedback-background-neutral-intense']).toBe(
      'var(--feedback-background-neutral-intense)',
    );
    expect(theme.colors['interactive-background-primary-default']).toBe(
      'var(--interactive-background-primary-default)',
    );
    expect(theme.colors['surface-text-on-sea-subtle']).toBe('var(--surface-text-on-sea-subtle)');
  });

  it('maps border radius / width to blade-named keys', () => {
    expect(theme.borderRadius.max).toBe('var(--border-radius-max)');
    expect(theme.borderRadius['2xsmall']).toBe('var(--border-radius-2xsmall)');
    expect(theme.borderWidth.thin).toBe('var(--border-width-thin)');
  });

  it('adds only the non-default literal opacity steps (56, 64), preserving Tailwind defaults', () => {
    expect(theme.opacity).toEqual({ '56': '0.56', '64': '0.64' });
  });
});

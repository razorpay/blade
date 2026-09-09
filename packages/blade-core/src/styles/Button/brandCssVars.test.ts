import { describe, expect, it } from 'vitest';
import { getAccentBrandCssVars, getPrimaryBrandCssVars } from './brandCssVars';

describe('getPrimaryBrandCssVars', () => {
  it('returns the primary interactive token cluster with default mixes', () => {
    expect(getPrimaryBrandCssVars({ bg: '#6c5ce7' })).toEqual({
      '--interactive-background-primary-default': '#6c5ce7',
      '--interactive-background-primary-highlighted': 'color-mix(in srgb, #6c5ce7 80%, black)',
      '--interactive-background-primary-disabled': 'color-mix(in srgb, #6c5ce7 18%, transparent)',
      '--interactive-border-primary-default': '#6c5ce7',
      '--interactive-border-primary-highlighted': 'color-mix(in srgb, #6c5ce7 80%, black)',
    });
  });

  it('accepts custom highlighted and disabled values', () => {
    expect(
      getPrimaryBrandCssVars({
        bg: 'var(--merchant-cta-bg)',
        highlighted: 'var(--merchant-cta-hover)',
        disabled: 'var(--merchant-cta-disabled)',
      }),
    ).toEqual({
      '--interactive-background-primary-default': 'var(--merchant-cta-bg)',
      '--interactive-background-primary-highlighted': 'var(--merchant-cta-hover)',
      '--interactive-background-primary-disabled': 'var(--merchant-cta-disabled)',
      '--interactive-border-primary-default': 'var(--merchant-cta-bg)',
      '--interactive-border-primary-highlighted': 'var(--merchant-cta-hover)',
    });
  });
});

describe('getAccentBrandCssVars', () => {
  it('delegates primary accent to getPrimaryBrandCssVars', () => {
    const opts = { bg: '#19BEA2' };
    expect(getAccentBrandCssVars('primary', opts)).toEqual(getPrimaryBrandCssVars(opts));
  });

  it('maps positive accent tokens', () => {
    expect(getAccentBrandCssVars('positive', { bg: '#00A651' })).toEqual({
      '--interactive-background-positive-default': '#00A651',
      '--interactive-background-positive-highlighted': 'color-mix(in srgb, #00A651 80%, black)',
      '--interactive-background-positive-disabled': 'color-mix(in srgb, #00A651 18%, transparent)',
      '--interactive-border-positive-default': '#00A651',
      '--interactive-border-positive-highlighted': 'color-mix(in srgb, #00A651 80%, black)',
    });
  });

  it('maps negative accent tokens', () => {
    expect(getAccentBrandCssVars('negative', { bg: '#D64045' })).toEqual({
      '--interactive-background-negative-default': '#D64045',
      '--interactive-background-negative-highlighted': 'color-mix(in srgb, #D64045 80%, black)',
      '--interactive-background-negative-disabled': 'color-mix(in srgb, #D64045 18%, transparent)',
      '--interactive-border-negative-default': '#D64045',
      '--interactive-border-negative-highlighted': 'color-mix(in srgb, #D64045 80%, black)',
    });
  });
});

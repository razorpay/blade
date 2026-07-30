import { describe, expect, it } from 'vitest';
import {
  extractCardBackgroundColorFromClassNames,
  getCardBackgroundColor,
  getCardSurfaceClassNames,
} from './card';

describe('getCardSurfaceClassNames', () => {
  it('applies theme backgroundColor through CVA', () => {
    const classes = getCardSurfaceClassNames({
      type: 'theme',
      backgroundColor: 'surface.background.cloud.subtle',
      padding: 'spacing.7',
      borderRadius: 'medium',
    });

    expect(classes).toContain('_background-surface-background-cloud-subtle');
  });

  it('uses variant-owned fill for primary and secondary', () => {
    const primary = getCardSurfaceClassNames({ type: 'primary' });
    const secondary = getCardSurfaceClassNames({ type: 'secondary' });

    expect(primary).toContain('_background-surface-gray-intense');
    expect(secondary).toContain('_background-surface-gray-moderate');
    expect(getCardBackgroundColor('primary', undefined)).toBe('surface.background.gray.intense');
    expect(getCardBackgroundColor('secondary', undefined)).toBe('surface.background.gray.moderate');
  });
});

describe('extractCardBackgroundColorFromClassNames', () => {
  it('splits token keys from remaining classes', () => {
    const { backgroundColor, remainingClassNames } = extractCardBackgroundColorFromClassNames(
      'surface.background.sea.subtle checkout-card-surface',
    );

    expect(backgroundColor).toBe('surface.background.sea.subtle');
    expect(remainingClassNames).toBe('checkout-card-surface');
  });
});

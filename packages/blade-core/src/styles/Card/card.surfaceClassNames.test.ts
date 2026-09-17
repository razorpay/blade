import { describe, expect, it } from 'vitest';
import {
  extractCardBackgroundColorFromClassNames,
  getCardBackgroundColor,
  getCardSurfaceClasses,
} from './card';

describe('getCardSurfaceClasses', () => {
  it('applies theme backgroundColor through CVA', () => {
    const classes = getCardSurfaceClasses({
      type: 'theme',
      backgroundColor: 'surface.background.cloud.subtle',
      padding: 'spacing.7',
      borderRadius: 'medium',
    });

    expect(classes).toContain('bg-surface-background-cloud-subtle');
  });

  it('uses variant-owned fill for primary and secondary', () => {
    const primary = getCardSurfaceClasses({ type: 'primary' });
    const secondary = getCardSurfaceClasses({ type: 'secondary' });

    expect(primary).toContain('bg-surface-background-gray-intense');
    expect(secondary).toContain('bg-surface-background-gray-moderate');
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

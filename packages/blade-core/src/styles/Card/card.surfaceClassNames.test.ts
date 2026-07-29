import { describe, expect, it } from 'vitest';
import {
  extractCardBackgroundColorFromClassNames,
  getCardBackgroundColor,
  getCardSurfaceClassNames,
} from './card';

describe('getCardSurfaceClassNames', () => {
  it('applies theme backgroundColor through CVA when surface override uses a token key', () => {
    const fromProp = getCardSurfaceClassNames({
      type: 'theme',
      backgroundColor: 'surface.background.cloud.subtle',
      padding: 'spacing.7',
      borderRadius: 'medium',
    });

    const fromStyleOverride = getCardSurfaceClassNames({
      type: 'theme',
      padding: 'spacing.7',
      borderRadius: 'medium',
      styleOverrideSurface: 'surface.background.cloud.subtle',
    });

    expect(fromStyleOverride).toBe(fromProp);
  });

  it('lets surface override token beat the backgroundColor prop', () => {
    const classes = getCardSurfaceClassNames({
      type: 'theme',
      backgroundColor: 'surface.background.cloud.subtle',
      styleOverrideSurface: 'surface.background.primary.intense',
    });

    const propOnly = getCardSurfaceClassNames({
      type: 'theme',
      backgroundColor: 'surface.background.primary.intense',
    });

    expect(classes).toBe(propOnly);
  });

  it('can replace primary default fill via surface token without changing variant type', () => {
    const defaultPrimary = getCardBackgroundColor('primary', undefined);
    const overridden = getCardSurfaceClassNames({
      type: 'primary',
      styleOverrideSurface: 'surface.background.primary.subtle',
    });
    const explicitToken = getCardSurfaceClassNames({
      type: 'primary',
      styleOverrideSurface: 'surface.background.primary.subtle',
    });

    expect(defaultPrimary).toBe('surface.background.gray.intense');
    expect(overridden).toBe(explicitToken);
    expect(overridden).toContain('_background-surface-background-primary-subtle');
  });

  it('keeps non-token classes on the surface after CVA', () => {
    const { backgroundColor, remainingClassNames } = extractCardBackgroundColorFromClassNames(
      'surface.background.sea.subtle checkout-card-surface',
    );

    expect(backgroundColor).toBe('surface.background.sea.subtle');
    expect(remainingClassNames).toBe('checkout-card-surface');

    const classes = getCardSurfaceClassNames({
      type: 'theme',
      styleOverrideSurface: 'surface.background.sea.subtle checkout-card-surface',
    });

    expect(classes).toContain('checkout-card-surface');
  });
});

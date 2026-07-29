import { describe, expect, it } from 'vitest';
import { getAccordionGraySurfaceClassNames, getAccordionTemplateClasses } from './accordion';
import { getCardSurfaceBackgroundUtilityClass } from '../Card/card';

const templateClasses = getAccordionTemplateClasses();

describe('getAccordionGraySurfaceClassNames', () => {
  it('uses Blade background utility when graySurface override is a token key', () => {
    const token = 'surface.background.primary.subtle';
    const classes = getAccordionGraySurfaceClassNames({
      isGrayBody: true,
      isLastItem: false,
      styleOverrideGraySurface: token,
    });

    expect(classes).toContain(getCardSurfaceBackgroundUtilityClass(token));
    expect(classes).not.toContain(templateClasses.collapsibleContentGray);
  });

  it('keeps default gray module class when override has no token', () => {
    const classes = getAccordionGraySurfaceClassNames({
      isGrayBody: true,
      isLastItem: true,
      styleOverrideGraySurface: 'checkout-gray-surface',
    });

    expect(classes).toContain(templateClasses.collapsibleContentGray);
    expect(classes).toContain(templateClasses.collapsibleContentGrayLast);
    expect(classes).toContain('checkout-gray-surface');
  });
});

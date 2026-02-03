import type { IndicatorColor, IndicatorEmphasis } from './indicatorTokens';

export type IndicatorColorTokens = {
  fillColorOuter: string;
  fillColorInner: string;
};

/**
 * Get fill color tokens for indicator dots
 */
export function getIndicatorColorTokens({
  color = 'neutral',
}: {
  color?: IndicatorColor;
  emphasis?: IndicatorEmphasis;
}): IndicatorColorTokens {
  const isPrimary = color === 'primary';

  const fillColorOuter = isPrimary
    ? 'surface.background.primary.subtle'
    : `feedback.background.${color}.subtle`;

  const fillColorInner = isPrimary
    ? 'surface.icon.primary.normal'
    : `feedback.icon.${color}.intense`;

  return {
    fillColorOuter,
    fillColorInner,
  };
}

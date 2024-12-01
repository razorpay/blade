import type { StepGroupProps } from './types';
import { size as sizeTokens } from '~tokens/global';

const markerLineDotWidth = sizeTokens['2'];
const markerLineDotSpacing = sizeTokens['4'];
const markerLineWidth = sizeTokens['2'];
const itemTopMargin = sizeTokens['6'];

/**
 * Returns the tokens that are related to marker line alignment and spacing
 */
const getMarkerLineSpacings = (
  size: NonNullable<StepGroupProps['size']>,
): {
  markerLeftAlignment: number;
  markerTopAlignment: number;
  markerBackgroundSize: number;
  markerMargin: number;
  indentationWidth: number;
} => {
  const LINE_SPACINGS = {
    large: {
      markerBackgroundSize: sizeTokens['24'],
      markerMargin: sizeTokens['2'],
      indentationWidth: sizeTokens['33'],
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    },
    medium: {
      markerBackgroundSize: sizeTokens['20'],
      markerMargin: sizeTokens['2'],
      indentationWidth: sizeTokens['31'],
    },
  } as const;

  const markerLeftAlignment =
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    (LINE_SPACINGS[size].markerBackgroundSize + LINE_SPACINGS[size].markerMargin) / 2;

  const markerTopAlignment =
    (-1 *
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      (LINE_SPACINGS[size].markerBackgroundSize +
        LINE_SPACINGS[size].markerMargin * 2 +
        markerLineWidth)) /
    2;
  return {
    ...LINE_SPACINGS[size],
    markerLeftAlignment,
    markerTopAlignment,
  };
};

const stepItemHeaderTokens = {
  medium: {
    title: 'medium',
    description: 'small',
    timestamp: 'small',
  },
  large: {
    title: 'large',
    description: 'medium',
    timestamp: 'medium',
  },
} as const;

const iconSizeTokens = {
  medium: 'small',
  large: 'medium',
} as const;

const itemLineGap = {
  medium: 'spacing.2',
  large: 'spacing.3',
} as const;

export {
  getMarkerLineSpacings,
  stepItemHeaderTokens,
  iconSizeTokens,
  itemLineGap,
  markerLineDotWidth,
  markerLineDotSpacing,
  markerLineWidth,
  itemTopMargin,
};

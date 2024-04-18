import type { StepGroupProps } from './types';
import { size as sizeTokens } from '~tokens/global';

const getLineSpacings = (
  size: NonNullable<StepGroupProps['size']>,
): {
  markerLeftAlignment: number;
  markerTopAlignment: number;
  markerLineWidth: number;
  markerBackgroundSize: number;
  markerMargin: number;
  indentationWidth: number;
  itemTopMargin: number;
} => {
  const markerLineWidth = sizeTokens['2'];
  const indentationWidth = sizeTokens['33'];
  const itemTopMargin = sizeTokens['16'];

  const LINE_SPACINGS = {
    large: {
      markerBackgroundSize: sizeTokens['24'],
      markerMargin: sizeTokens['2'],
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    },
    medium: {
      markerBackgroundSize: sizeTokens['20'],
      markerMargin: sizeTokens['2'],
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
    markerLineWidth,
    indentationWidth,
    itemTopMargin,
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

export { getLineSpacings, stepItemHeaderTokens, iconSizeTokens };

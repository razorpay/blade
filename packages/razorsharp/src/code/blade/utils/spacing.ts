import { SPACING_TO_TOKEN } from '../constants/spacing';

export const getTokenFromSpacingValue = (space: number): string => {
  // check if there is a token for the exact value
  if (space in SPACING_TO_TOKEN) {
    return `spacing.${SPACING_TO_TOKEN[space as keyof typeof SPACING_TO_TOKEN]}`;
  }

  // threshold for the nearest value search
  const THRESHOLD = 2;
  for (const spacingValue in SPACING_TO_TOKEN) {
    if (Object.prototype.hasOwnProperty.call(SPACING_TO_TOKEN, spacingValue)) {
      const token = SPACING_TO_TOKEN[+spacingValue as keyof typeof SPACING_TO_TOKEN];

      if (Math.abs(+spacingValue - space) <= THRESHOLD) {
        return `spacing.${token}`;
      }
    }
  }

  return `${space}px`;
};

const areValuesEqual = (values: number[]): boolean => {
  return values.every((value) => value === values[0]);
};

/**
  Margin shorthand rules for one, two, three and four value declarations are:
  When one value is specified, it applies the same margin to all four sides.
  When two values are specified, the first margin applies to the top and bottom, the second to the left and right.
  When three values are specified, the first margin applies to the top, the second to the left and right, the third to the bottom.
  When four values are specified, the margins apply to the top, right, bottom, and left in that order (clockwise).
 */
export const getPaddingValue = ({
  top,
  bottom,
  left,
  right,
}: {
  top: number;
  bottom: number;
  left: number;
  right: number;
}): string[] => {
  if (areValuesEqual([top, bottom, left, right])) {
    return [getTokenFromSpacingValue(top)];
  }

  if (areValuesEqual([top, bottom]) && areValuesEqual([left, right])) {
    return [getTokenFromSpacingValue(top), getTokenFromSpacingValue(left)];
  }

  if (areValuesEqual([left, right])) {
    return [
      getTokenFromSpacingValue(top),
      getTokenFromSpacingValue(left),
      getTokenFromSpacingValue(bottom),
    ];
  }

  return [
    getTokenFromSpacingValue(top),
    getTokenFromSpacingValue(right),
    getTokenFromSpacingValue(bottom),
    getTokenFromSpacingValue(left),
  ];
};

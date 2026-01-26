export type IndicatorSize = 'small' | 'medium' | 'large';
export type IndicatorColor = 'information' | 'negative' | 'neutral' | 'notice' | 'positive' | 'primary';
export type IndicatorEmphasis = 'subtle' | 'intense';

// Text size mapping
export const indicatorTextSize: Record<IndicatorSize, 'small' | 'medium'> = {
  small: 'small',
  medium: 'medium',
  large: 'medium',
};

// Dot sizes for subtle and intense emphasis
export const indicatorDotSizes = {
  subtle: {
    small: {
      outer: 0,
      inner: 6,
    },
    medium: {
      outer: 0,
      inner: 8,
    },
    large: {
      outer: 0,
      inner: 10,
    },
  },
  intense: {
    small: {
      outer: 16,
      inner: 8,
    },
    medium: {
      outer: 20,
      inner: 10,
    },
    large: {
      outer: 24,
      inner: 12,
    },
  },
} as const;

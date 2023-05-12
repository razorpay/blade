/**
 * Size tokens are currently not exposed for users (therefore not available in theme)
 */
const size = {
  /** 0 px */
  0: 0,
  /** 1 px */
  1: 1,
  /** 2 px */
  2: 2,
  /** 3 px */
  3: 3,
  /** 4 px */
  4: 4,
  /** 5 px */
  5: 5,
  /** 6 px */
  6: 6,
  /** 8 px */
  8: 8,
  /** 10 px */
  10: 10,
  /** 12 px */
  12: 12,
  /** 16 px */
  16: 16,
  /** 18 px */
  18: 18,
  /** 20 px */
  20: 20,
  /** 24 px */
  24: 24,
  /** 28 px */
  28: 28,
  /** 32 px */
  32: 32,
  /** 36 px */
  36: 36,
  /** 40 px */
  40: 40,
  /** 48 px */
  48: 48,
  /** 60 px */
  56: 56,
  /** 100 px */
  100: 100,
  /** 120 px */
  120: 120,
  /** 300 px */
  300: 300,
  /** 584 px */
  584: 584,
} as const;

export type Size = typeof size;

export default size;

import type { StyledPropsBlade } from '@razorpay/blade-core/utils';

export interface SkeletonProps extends StyledPropsBlade {
  /**
   * Width of the skeleton element.
   * Accepts any valid CSS width value (e.g. '100%', '200px', '50vw').
   *
   * @default undefined
   */
  width?: string;

  /**
   * Maximum width of the skeleton element.
   *
   * @default undefined
   */
  maxWidth?: string;

  /**
   * Minimum width of the skeleton element.
   *
   * @default undefined
   */
  minWidth?: string;

  /**
   * Height of the skeleton element.
   * Accepts any valid CSS height value (e.g. '50px', '100%').
   *
   * @default undefined
   */
  height?: string;

  /**
   * Maximum height of the skeleton element.
   *
   * @default undefined
   */
  maxHeight?: string;

  /**
   * Minimum height of the skeleton element.
   *
   * @default undefined
   */
  minHeight?: string;

  /**
   * Border radius of the skeleton element.
   * Accepts token names ('none', 'xsmall', 'small', 'medium', 'large', 'xlarge', '2xlarge', 'max', 'round')
   * or raw CSS values (e.g. '8px', '50%').
   *
   * @default undefined
   */
  borderRadius?: string;

  /**
   * Test ID for the skeleton element, used for testing.
   *
   * @default undefined
   */
  testID?: string;

  /**
   * CSS flex-wrap property.
   *
   * @default undefined
   */
  flexWrap?: string;

  /**
   * CSS flex-direction property.
   *
   * @default undefined
   */
  flexDirection?: string;

  /**
   * CSS flex-grow property.
   *
   * @default undefined
   */
  flexGrow?: number | string;

  /**
   * CSS flex-shrink property.
   *
   * @default undefined
   */
  flexShrink?: number | string;

  /**
   * CSS flex-basis property.
   *
   * @default undefined
   */
  flexBasis?: string;

  /**
   * CSS align-items property.
   *
   * @default undefined
   */
  alignItems?: string;

  /**
   * CSS align-content property.
   *
   * @default undefined
   */
  alignContent?: string;

  /**
   * CSS align-self property.
   *
   * @default undefined
   */
  alignSelf?: string;

  /**
   * CSS justify-items property.
   *
   * @default undefined
   */
  justifyItems?: string;

  /**
   * CSS justify-content property.
   *
   * @default undefined
   */
  justifyContent?: string;

  /**
   * CSS justify-self property.
   *
   * @default undefined
   */
  justifySelf?: string;

  /**
   * CSS place-self property.
   *
   * @default undefined
   */
  placeSelf?: string;

  /**
   * CSS place-items property.
   *
   * @default undefined
   */
  placeItems?: string;

  /**
   * CSS order property.
   *
   * @default undefined
   */
  order?: number | string;

  /**
   * CSS gap property. Accepts spacing tokens (e.g. 'spacing.3') or raw CSS values.
   *
   * @default undefined
   */
  gap?: string;

  /**
   * CSS row-gap property. Accepts spacing tokens or raw CSS values.
   *
   * @default undefined
   */
  rowGap?: string;

  /**
   * CSS column-gap property. Accepts spacing tokens or raw CSS values.
   *
   * @default undefined
   */
  columnGap?: string;

  /**
   * CSS flex shorthand property.
   *
   * @default undefined
   */
  flex?: string | number;
}

import type { StyledPropsBlade } from '@razorpay/blade-core/utils';
import type { SkeletonBorderRadius } from '@razorpay/blade-core/styles';

export interface SkeletonProps extends StyledPropsBlade {
  /**
   * Sets the width of the skeleton. Accepts a spacing token (e.g. `'spacing.4'`),
   * a CSS length (`'50px'`, `'100%'`, `'auto'`), or any other valid CSS width value.
   */
  width?: string;
  /**
   * Sets the maximum width of the skeleton.
   */
  maxWidth?: string;
  /**
   * Sets the minimum width of the skeleton.
   */
  minWidth?: string;
  /**
   * Sets the height of the skeleton. Accepts a spacing token (e.g. `'spacing.4'`),
   * a CSS length (`'50px'`, `'100%'`, `'auto'`), or any other valid CSS height value.
   */
  height?: string;
  /**
   * Sets the maximum height of the skeleton.
   */
  maxHeight?: string;
  /**
   * Sets the minimum height of the skeleton.
   */
  minHeight?: string;
  /**
   * Sets the border-radius of the skeleton using a design-system token.
   */
  borderRadius?: SkeletonBorderRadius;
  /**
   * Controls the direction of the flex children when the skeleton acts as a flex item's parent.
   */
  flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  /**
   * Controls flex line wrapping.
   */
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  /**
   * Controls the flex grow factor.
   */
  flexGrow?: number;
  /**
   * Controls the flex shrink factor.
   */
  flexShrink?: number;
  /**
   * Controls the initial size of the flex item.
   */
  flexBasis?: string;
  /**
   * Controls how flex/grid items are aligned along the cross axis.
   */
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  /**
   * Controls how multiple flex lines are aligned within the container.
   */
  alignContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'stretch';
  /**
   * Controls the alignment of an individual flex/grid item along the cross axis.
   */
  alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  /**
   * Controls how grid items are aligned along the inline (row) axis.
   */
  justifyItems?: 'start' | 'end' | 'center' | 'stretch';
  /**
   * Controls how flex/grid items are aligned along the main axis.
   */
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | 'stretch';
  /**
   * Controls the alignment of an individual grid item along the inline (row) axis.
   */
  justifySelf?: 'auto' | 'start' | 'end' | 'center' | 'stretch';
  /**
   * Sets both align-self and justify-self.
   */
  placeSelf?: 'auto' | 'start' | 'end' | 'center' | 'stretch';
  /**
   * Sets both align-items and justify-items.
   */
  placeItems?: 'start' | 'end' | 'center' | 'stretch';
  /**
   * Controls the order of the flex/grid item.
   */
  order?: number;
  /**
   * Test ID for the skeleton element.
   */
  testID?: string;
  /**
   * Analytics data attributes (e.g. `data-analytics-section="hero"`).
   */
  [key: `data-analytics-${string}`]: string;
}

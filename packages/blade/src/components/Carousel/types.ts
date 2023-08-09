import type { BoxProps } from '~components/Box';
import type { Platform } from '~utils';
import type { DotNotationSpacingStringToken } from '~utils/types';

type OverlayColor = BoxProps['backgroundColor'];

type CarouselProps = {
  /**
   * Accepts CarouselItem
   */
  children: React.ReactNode;
  /**
   * Total number of carousel items to show at once,
   * if set to 1,2 or 3 all the CarouselItem's width will remain the same,
   * but if set to `undefined` the carousel items will take up space responsively
   *
   * @default undefined
   */
  visibleItems?: 1 | 2 | 3 | undefined;
  /**
   * If true, adds extra margin before and after the first/last slides so that they align in center
   *
   * @default false
   */
  shouldAddStartEndSpacing?: boolean;
  /**
   * If true, the carousel will automatically slide to the next slide, default interval is 6 seconds
   *
   * @default false
   */
  autoPlay?: boolean;
  /**
   * Toggles the visibility of indicators
   *
   * @default true
   */
  showIndicators?: boolean;
  /**
   * Toggles the visibility of overlay
   *
   * @default false
   */
  showOverlay?: boolean;
  /**
   * Changes the color of the overlay, so that carousel can blend with the background color
   *
   * @default 'surface.background.level1.highContrast'
   */
  overlayColor?: OverlayColor;
  /**
   * Sets the position of navigation button
   *
   * @default 'bottom'
   */
  navigationButtonPosition?: 'bottom' | 'side';
  /**
   * Spacing between navigation button and slides when bleed is set to none
   *
   * @default 'spacing.4'
   */
  navigationButtonSpacing?: DotNotationSpacingStringToken;
  /**
   * Variant to be used depending on the emphasis you want to give to the navigation buttons
   *
   * @default 'filled'
   */
  navigationButtonVariant?: 'filled' | 'stroke';
  /**
   * Variant to be used depending on the emphasis you want to give to the indicators
   *
   * @default 'gray'
   */
  indicatorVariant?: 'gray' | 'white' | 'blue';
  /**
   * Sets the width of the carousel items, this can be used with visibleItems: auto to achive automatic bleed
   *
   * @default undefined
   */
  carouselItemWidth?: Platform.Select<{ web: BoxProps['width']; native: `${number}%` }>;
  /**
   * Sets the align-items CSS property on carousel container which specifies how the carousel items will align if their heights are different
   *
   * @default 'start'
   */
  carouselItemAlignment?: BoxProps['alignItems'];
  /**
   * Callback which gets fired everytime a slide changes, useful for analytic events (only runs on user interaction not on autoPlay)
   *
   * @default undefined
   */
  onChange?: (slideIndex: number) => void;
  /**
   * Accessibility label for the carousel, this will let screen reader users know what content the carousel holds (eg: "Product carousel")
   *
   * @default undefined
   */
  accessibilityLabel?: string;
};

export type { CarouselProps };

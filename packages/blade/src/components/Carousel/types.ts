import type { BoxProps } from '~components/Box';
import type { Platform } from '~utils';

type OverlayColor = BoxProps['backgroundColor'];

type CarouselProps = {
  /**
   * Accepts CarouselItem
   */
  children: React.ReactNode;
  /**
   * Total number of carousel items to show at once,
   * if set to 1,2 or 3 all the CarouselItem's width will remain the same,
   * but if set to `autofit` the carousel items will take up space responsively
   *
   * @default 1
   */
  visibleItems?: 1 | 2 | 3 | 'autofit';
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
   * Changes the color of the overlay, so that carousel can blend with the background color
   * If set to undefined overlay won't be shown
   *
   * @default undefined
   */
  scrollOverlayColor?: OverlayColor;
  /**
   * Sets the position of navigation button
   *
   * @default 'bottom'
   */
  navigationButtonPosition?: 'bottom' | 'side';
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

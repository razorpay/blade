import type { BoxProps } from '~components/Box';
import type { Platform } from '~utils';
import type { DotNotationSpacingStringToken } from '~utils/types';

type OverlayColor = BoxProps['backgroundColor'];

type CarouselProps = {
  children: React.ReactNode;
  visibleItems?: 1 | 2 | 3 | undefined;
  shouldAddStartEndSpacing?: boolean;
  autoPlay?: boolean;
  showIndicators?: boolean;
  showOverlay?: boolean;
  overlayColor?: OverlayColor;
  navigationButtonPosition?: 'bottom' | 'side';
  navigationButtonSpacing?: DotNotationSpacingStringToken;
  navigationButtonVariant?: 'filled' | 'stroke';
  indicatorVariant?: 'gray' | 'white' | 'blue';
  carouselItemWidth?: Platform.Select<{ web: BoxProps['width']; native: `${number}%` }>;
  onChange: (slideIndex: number) => void;
  accessibilityLabel?: string;
};

export type { CarouselProps };

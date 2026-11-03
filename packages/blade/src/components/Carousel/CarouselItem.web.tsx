/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import styled from 'styled-components';
import React from 'react';
import type { CarouselProps } from './types';
import { useCarouselContext } from './CarouselContext';
import { componentIds } from './constants';
import { useBreakpoint } from '~utils';
import { makeAccessible } from '~utils/makeAccessible';
import type { DataAnalyticsAttribute } from '~utils/types';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import BaseBox from '~components/Box/BaseBox';
import { useTheme } from '~components/BladeProvider';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getSpacingValue } from '~components/Box/BaseBox/baseBoxStyles';

type StyledCarouselItemProps = Pick<CarouselProps, 'visibleItems' | 'shouldAddStartEndSpacing'> &
  Pick<
    CarouselItemProps,
    'shouldHaveEndSpacing' | 'shouldHaveStartSpacing' | 'snapAlign' | 'gap'
  > & {
    isMobile?: boolean;
    isResponsive?: boolean;
    isStretch?: boolean;
  };

const StyledCarouselItem = styled(BaseBox)<StyledCarouselItemProps>(
  ({
    visibleItems,
    isResponsive,
    shouldAddStartEndSpacing,
    shouldHaveStartSpacing,
    theme,
    snapAlign,
    gap,
    isStretch,
  }) => {
    const { matchedDeviceType, matchedBreakpoint } = useBreakpoint({
      breakpoints: theme.breakpoints,
    });
    const isMobile = matchedDeviceType === 'mobile';

    // Resolve gap value: convert spacing token to pixels or use default spacing
    // Default: spacing.4 (12px) on mobile, spacing.5 (16px) on desktop
    const resolvedGap = gap
      ? parseInt(
          getSpacingValue(
            gap,
            theme,
            typeof gap === 'string' ? 'base' : matchedBreakpoint || 'base',
          ) || '0',
          10,
        )
      : isMobile
      ? theme.spacing[4]
      : theme.spacing[5];

    // Calculate item width: (containerWidth / numberOfItems) - (totalGapSpace / numberOfItems)
    // This ensures each item gets equal width while accounting for gaps between items
    const calculatedWidth = `calc(100% / ${visibleItems!} - ${resolvedGap}px * (${visibleItems} - 1) / ${visibleItems})`;
    const calculatedMarginLeft = shouldHaveStartSpacing
      ? `calc(${calculatedWidth} + ${resolvedGap}px)`
      : 0;

    return {
      flexGrow: 0,
      flexShrink: 0,
      width: calculatedWidth,
      height: isStretch ? 'auto' : '100%',
      minHeight: isStretch ? undefined : '100%',
      scrollSnapAlign: snapAlign ?? 'start',
      marginLeft: calculatedMarginLeft,

      // Responsive slider styles, a special case
      ...(isResponsive && {
        width: '100%',
        scrollSnapAlign: snapAlign ?? (isMobile || !shouldAddStartEndSpacing ? 'start' : 'center'),
        marginLeft: shouldHaveStartSpacing ? '40%' : 0,
      }),
    };
  },
);

type CarouselItemProps = {
  id?: string;
  index?: number;
  children: React.ReactNode;
  shouldHaveStartSpacing?: boolean;
  shouldHaveEndSpacing?: boolean;
  snapAlign?: CarouselProps['snapAlign'];
  gap?: CarouselProps['gap'];
} & DataAnalyticsAttribute;

const _CarouselItem = ({
  children,
  shouldHaveStartSpacing,
  shouldHaveEndSpacing,
  id,
  index,
  snapAlign,
  gap,
  ...rest
}: CarouselItemProps): React.ReactElement => {
  const itemRef = React.useRef<HTMLDivElement>(null);
  const {
    totalNumberOfSlides,
    visibleItems,
    isResponsive,
    carouselItemWidth,
    shouldAddStartEndSpacing,
    carouselItemAlignment,
  } = useCarouselContext();
  const { theme, platform } = useTheme();
  const isMobile = platform === 'onMobile';

  const { matchedBreakpoint } = useBreakpoint({
    breakpoints: theme.breakpoints,
  });

  // Resolve carouselItemAlignment for the current breakpoint so responsive objects
  // (e.g. { base: 'start', m: 'stretch' }) are handled correctly. For responsive objects
  // we cascade from the matched breakpoint down to base (mobile-first) to find the first
  // defined value. 'normal' is equivalent to 'stretch' in flexbox, so we treat both as stretch.
  const isStretchLike = (value: unknown): boolean => value === 'stretch' || value === 'normal';
  let isStretch = false;
  if (typeof carouselItemAlignment === 'string') {
    isStretch = isStretchLike(carouselItemAlignment);
  } else if (carouselItemAlignment) {
    const breakpointKeys = Object.keys(theme.breakpoints) as (keyof typeof theme.breakpoints)[];
    const startIdx = breakpointKeys.indexOf(matchedBreakpoint || 'base');
    for (let i = startIdx; i >= 0; i--) {
      const val = carouselItemAlignment[breakpointKeys[i]];
      if (val !== undefined) {
        isStretch = isStretchLike(val);
        break;
      }
    }
  }

  return (
    <StyledCarouselItem
      {...makeAccessible({
        role: 'tabpanel',
        roleDescription: 'slide',
        label: `${index! + 1} of ${totalNumberOfSlides}`,
      })}
      ref={itemRef}
      id={id}
      isMobile={isMobile}
      data-slide-index={index}
      isResponsive={isResponsive}
      visibleItems={visibleItems}
      maxWidth={carouselItemWidth}
      shouldAddStartEndSpacing={shouldAddStartEndSpacing}
      shouldHaveStartSpacing={shouldHaveStartSpacing}
      shouldHaveEndSpacing={shouldHaveEndSpacing}
      snapAlign={snapAlign}
      gap={gap}
      isStretch={isStretch}
      {...makeAnalyticsAttribute(rest)}
    >
      {children}
    </StyledCarouselItem>
  );
};

const CarouselItem = assignWithoutSideEffects(_CarouselItem, {
  componentId: componentIds.CarouselItem,
});

export { CarouselItem };

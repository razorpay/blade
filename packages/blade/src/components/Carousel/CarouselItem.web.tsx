/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import styled from 'styled-components';
import React from 'react';
import type { CarouselProps } from './types';
import { useCarouselContext } from './CarouselContext';
import { componentIds } from './constants';
import BaseBox from '~components/Box/BaseBox';
import { useTheme } from '~components/BladeProvider';
import { useBreakpoint } from '~utils';
import { makeAccessible } from '~utils/makeAccessible';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import type { DataAnalyticsAttribute } from '~utils/types';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { getSpacingValue } from '~components/Box/BaseBox/baseBoxStyles';

type StyledCarouselItemProps = Pick<CarouselProps, 'visibleItems' | 'shouldAddStartEndSpacing'> &
  Pick<
    CarouselItemProps,
    'shouldHaveEndSpacing' | 'shouldHaveStartSpacing' | 'snapAlign' | 'gap'
  > & {
    isMobile?: boolean;
    isResponsive?: boolean;
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
  }) => {
    const { matchedDeviceType, matchedBreakpoint } = useBreakpoint({
      breakpoints: theme.breakpoints,
    });
    const isMobile = matchedDeviceType === 'mobile';

    const resolvedGap = gap
      ? parseInt(
          getSpacingValue(
            gap,
            theme,
            typeof gap === 'string' ? 'base' : matchedBreakpoint || 'base',
          ) || '0',
        )
      : isMobile
      ? theme.spacing[4]
      : theme.spacing[5];

    const calculatedWidth = `calc(100% / ${visibleItems!} - ${resolvedGap}px * (${visibleItems} - 1) / ${visibleItems})`;
    const calculatedMarginLeft = shouldHaveStartSpacing
      ? `calc(${calculatedWidth} + ${resolvedGap}px)`
      : 0;

    return {
      flexGrow: 0,
      flexShrink: 0,
      width: calculatedWidth,
      minHeight: '100%',
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
  } = useCarouselContext();
  const { platform } = useTheme();
  const isMobile = platform === 'onMobile';

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

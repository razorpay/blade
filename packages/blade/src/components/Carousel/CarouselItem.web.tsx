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
import { makeMotionTime } from '~utils/makeMotionTime';

type StyledCarouselItemProps = Pick<CarouselProps, 'visibleItems' | 'shouldAddStartEndSpacing'> &
  Pick<
    CarouselItemProps,
    | 'shouldHaveEndSpacing'
    | 'shouldHaveStartSpacing'
    | 'showPeek'
    | 'isActive'
    | 'isFirst'
    | 'isLast'
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
    showPeek,
    isActive,
    isFirst,
    isLast,
    theme,
  }) => {
    const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
    const isMobile = matchedDeviceType === 'mobile';

    const gap = isMobile ? theme.spacing[4] : theme.spacing[5];
    const calculatedWidth = `calc(100% / ${visibleItems!} - ${gap}px * (${visibleItems} - 1) / ${visibleItems})`;

    if (showPeek) {
      const activeCardWidth = '70%';
      const centeringMargin = '15%';

      return {
        flexGrow: 0,
        flexShrink: 0,
        width: activeCardWidth,
        minHeight: '100%',
        scrollSnapAlign: 'center',
        opacity: isActive ? 1 : 0.6,
        transform: `scale(${isActive ? 1 : 0.9})`,
        transition: `opacity ${makeMotionTime(theme.motion.duration.gentle)} ${
          theme.motion.easing.standard
        }, transform ${makeMotionTime(theme.motion.duration.gentle)} ${
          theme.motion.easing.standard
        }`,

        // Add spacing to center the first item when it's active
        ...(isFirst && {
          marginLeft: centeringMargin,
        }),

        // Add spacing to center the last item when it's active
        ...(isLast && {
          marginRight: centeringMargin,
        }),
      };
    }

    return {
      flexGrow: 0,
      flexShrink: 0,
      width: calculatedWidth,
      minHeight: '100%',
      scrollSnapAlign: 'start',

      // Responsive slider styles, a special case
      ...(isResponsive && {
        width: '100%',
        scrollSnapAlign: isMobile || !shouldAddStartEndSpacing ? 'start' : 'center',
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
  showPeek?: boolean;
  isActive?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
} & DataAnalyticsAttribute;

const _CarouselItem = ({
  children,
  shouldHaveStartSpacing,
  shouldHaveEndSpacing,
  id,
  index,
  showPeek,
  isActive,
  isFirst,
  isLast,
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
      showPeek={showPeek}
      isActive={isActive}
      isFirst={isFirst}
      isLast={isLast}
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

/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import styled from 'styled-components';
import React from 'react';
import type { CarouselProps } from './types';
import { useCarouselContext } from './CarouselContext';
import BaseBox from '~components/Box/BaseBox';
import { useBreakpoint, useTheme } from '~utils';
import { makeAccessible } from '~utils/makeAccessible';

type StyledCarouselItemProps = Pick<CarouselProps, 'visibleItems' | 'shouldAddStartEndSpacing'> &
  Pick<CarouselItemProps, 'shouldHaveEndSpacing' | 'shouldHaveStartSpacing'> & {
    isMobile?: boolean;
  };

const StyledCarouselItem = styled(BaseBox)<StyledCarouselItemProps>(
  ({
    visibleItems,
    shouldAddStartEndSpacing,
    shouldHaveStartSpacing,
    shouldHaveEndSpacing,
    theme,
  }) => {
    const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
    const isMobile = matchedDeviceType === 'mobile';
    const isResponsive = visibleItems === undefined;

    const gap = isMobile ? theme.spacing[4] : theme.spacing[5];
    const calculatedWidth = `calc(100% / ${visibleItems!} - ${gap}px * (${visibleItems} - 1) / ${visibleItems})`;

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
        marginLeft: shouldHaveStartSpacing ? '100%' : 0,
        marginRight: shouldHaveEndSpacing ? '100%' : 0,
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
};

const CarouselItem = ({
  children,
  shouldHaveStartSpacing,
  shouldHaveEndSpacing,
  id,
  index,
}: CarouselItemProps): React.ReactElement => {
  const itemRef = React.useRef<HTMLDivElement>(null);
  const {
    totalNumberOfSlides,
    visibleItems,
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
        label: `${index} of ${totalNumberOfSlides}`,
      })}
      ref={itemRef}
      id={id}
      isMobile={isMobile}
      data-slide-index={index}
      visibleItems={visibleItems}
      maxWidth={carouselItemWidth}
      shouldAddStartEndSpacing={shouldAddStartEndSpacing}
      shouldHaveStartSpacing={shouldHaveStartSpacing}
      shouldHaveEndSpacing={shouldHaveEndSpacing}
    >
      {children}
    </StyledCarouselItem>
  );
};

export { CarouselItem };

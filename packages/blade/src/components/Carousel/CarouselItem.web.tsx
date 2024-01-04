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

type StyledCarouselItemProps = Pick<CarouselProps, 'visibleItems' | 'shouldAddStartEndSpacing'> &
  Pick<CarouselItemProps, 'shouldHaveEndSpacing' | 'shouldHaveStartSpacing'> & {
    isMobile?: boolean;
    isResponsive?: boolean;
    startSpacing: number;
  };

const StyledCarouselItem = styled(BaseBox)<StyledCarouselItemProps>(
  ({
    visibleItems,
    isResponsive,
    shouldAddStartEndSpacing,
    shouldHaveStartSpacing,
    startSpacing,
    theme,
  }) => {
    const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
    const isMobile = matchedDeviceType === 'mobile';

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
        marginLeft: shouldHaveStartSpacing ? `${startSpacing}px` : '0px',
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

const _CarouselItem = ({
  children,
  shouldHaveStartSpacing,
  shouldHaveEndSpacing,
  id,
  index,
}: CarouselItemProps): React.ReactElement => {
  const itemRef = React.useRef<HTMLDivElement>(null);
  const [startSpacing, setStartSpacing] = React.useState(0);
  const {
    totalNumberOfSlides,
    visibleItems,
    isResponsive,
    carouselItemWidth,
    shouldAddStartEndSpacing,
    carouselContainerWidth,
  } = useCarouselContext();
  const { platform } = useTheme();
  const isMobile = platform === 'onMobile';

  React.useLayoutEffect(() => {
    if (!shouldHaveStartSpacing) return;
    if (!itemRef.current) {
      return;
    }
    const itemWidth = itemRef.current.getBoundingClientRect().width;
    setStartSpacing((carouselContainerWidth - itemWidth) / 2);
  }, [carouselContainerWidth, shouldHaveStartSpacing]);

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
      startSpacing={startSpacing}
      shouldAddStartEndSpacing={shouldAddStartEndSpacing}
      shouldHaveStartSpacing={shouldHaveStartSpacing}
      shouldHaveEndSpacing={shouldHaveEndSpacing}
    >
      {children}
    </StyledCarouselItem>
  );
};

const CarouselItem = assignWithoutSideEffects(React.memo(_CarouselItem), {
  componentId: componentIds.CarouselItem,
});

export { CarouselItem };

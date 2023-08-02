/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import styled from 'styled-components';
import type { CarouselProps } from './types';
import { useCarouselContext } from './CarouselContext';
import type { SpacingValueType } from '~components/Box/BaseBox';
import BaseBox from '~components/Box/BaseBox';
import { useBreakpoint, useTheme } from '~utils';

// 1 slide
// start - scrollSnapAlign:start & double padding
// end - scrollSnapAlign:end & double padding
// center - scrollSnapAlign:center & double padding

// 2 slides
// start - scrollMarginRight & scrollSnapAlign:start
// end - scrollMarginLeft & scrollSnapAlign:end
// center - scrollMargin & scrollSnapAlign:start

// 3 slides
// start - no scrollMargin & scrollSnapAlign:start & half padding
// end - no scrollMargin & scrollSnapAlign:start & half padding
// center - no scrollMargin & scrollSnapAlign:start & half padding

type StyledCarouselItemProps = Pick<CarouselProps, 'visibleItems'> &
  Pick<CarouselItemProps, 'shouldHaveEndSpacing' | 'shouldHaveStartSpacing'> & {
    isMobile?: boolean;
    width: SpacingValueType;
  };

const StyledCarouselItem = styled(BaseBox)<StyledCarouselItemProps>(
  ({ visibleItems, shouldHaveStartSpacing, shouldHaveEndSpacing, theme }) => {
    const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
    const isMobile = matchedDeviceType === 'mobile';
    const isResponsive = visibleItems === undefined;

    const gap = isMobile ? theme.spacing[4] : theme.spacing[5];
    const calculatedWidth = `calc(100% / ${visibleItems} - ${gap}px * (${visibleItems} - 1) / ${visibleItems})`;

    return {
      flexGrow: 0,
      flexShrink: 0,
      width: calculatedWidth,
      minHeight: '100%',
      scrollSnapAlign: 'start',

      // Responsive slider styles, a special case
      ...(isResponsive && {
        width: '100%',
        scrollSnapAlign: 'center',
        // maxWidth: '500px', // user needs to set this
        marginLeft: shouldHaveStartSpacing ? '100%' : 0,
        marginRight: shouldHaveEndSpacing ? '100%' : 0,
      }),
    };
  },
);

type CarouselItemProps = {
  id?: string;
  children: React.ReactNode;
  shouldHaveStartSpacing?: boolean;
  shouldHaveEndSpacing?: boolean;
};

const CarouselItem = ({
  children,
  shouldHaveStartSpacing,
  shouldHaveEndSpacing,
  id,
}: CarouselItemProps): React.ReactElement => {
  const { visibleItems, carouselItemWidth } = useCarouselContext();
  const { platform } = useTheme();
  const isMobile = platform === 'onMobile';

  return (
    <StyledCarouselItem
      id={id}
      isMobile={isMobile}
      visibleItems={visibleItems}
      maxWidth={carouselItemWidth}
      shouldHaveStartSpacing={shouldHaveStartSpacing}
      shouldHaveEndSpacing={shouldHaveEndSpacing}
    >
      {children}
    </StyledCarouselItem>
  );
};

export { CarouselItem };

/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import styled from 'styled-components';
import type { CarouselProps } from './types';
import { useCarouselContext } from './CarouselContext';
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
const StyledCarouselItem = styled(BaseBox)<
  CarouselProps &
    Pick<CarouselItemProps, 'shouldHaveEndSpacing' | 'shouldHaveStartSpacing'> & {
      isMobile?: boolean;
    }
>(({ visibleItems, shouldHaveStartSpacing, shouldHaveEndSpacing, theme }) => {
  const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
  const isMobile = matchedDeviceType === 'mobile';
  const isResponsive = visibleItems === undefined;

  const gap = isMobile ? theme.spacing[4] : theme.spacing[5];
  const width = `calc(100% / ${visibleItems} - ${gap}px * (${visibleItems} - 1) / ${visibleItems})`;

  return {
    flexGrow: 0,
    flexShrink: 0,
    width,
    minHeight: '100%',
    scrollSnapAlign: 'start',

    // Responsive slider styles, a special case
    ...(isResponsive && {
      width: '100%',
      scrollSnapAlign: 'center',
      maxWidth: '500px', // user needs to set this
      marginLeft: shouldHaveStartSpacing ? '100%' : 0,
      marginRight: shouldHaveEndSpacing ? '100%' : 0,
    }),
  };
});

type CarouselItemProps = {
  children: React.ReactNode;
  shouldHaveStartSpacing?: boolean;
  shouldHaveEndSpacing?: boolean;
  id?: string;
};

const CarouselItem = ({
  children,
  shouldHaveStartSpacing,
  shouldHaveEndSpacing,
  id,
}: CarouselItemProps): React.ReactElement => {
  const { visibleItems, bleed } = useCarouselContext();
  const { platform } = useTheme();
  const isMobile = platform === 'onMobile';

  return (
    <StyledCarouselItem
      id={id}
      isMobile={isMobile}
      visibleItems={visibleItems}
      bleed={bleed}
      shouldHaveStartSpacing={shouldHaveStartSpacing}
      shouldHaveEndSpacing={shouldHaveEndSpacing}
    >
      {children}
    </StyledCarouselItem>
  );
};

export { CarouselItem };

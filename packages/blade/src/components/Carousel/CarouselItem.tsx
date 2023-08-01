/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import styled from 'styled-components';
import type { CarouselProps } from './types';
import { useCarouselContext } from './CarouselContext';
import BaseBox from '~components/Box/BaseBox';
import { makeSpace, useTheme } from '~utils';

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
>(({ visibleItems, bleed, shouldHaveStartSpacing, shouldHaveEndSpacing, isMobile }) => {
  // TODO: replace with tokens
  const padding = isMobile ? 6 : 12;
  let margin: number = (isMobile ? 70 : 96) - padding * 2;
  // magic numbers to maintain 96px gap between different slide numbers
  let twoOffset = 36;
  let threeOffset = 48;

  if (bleed === 'none') {
    margin = 0;
    twoOffset = 0;
    threeOffset = 0;
  }

  const oneSlide = `calc(100% / 1 - ${makeSpace(margin)})`;
  const twoSlide = `calc(100% / 2 - ${makeSpace(margin - twoOffset)})`;
  const threeSlide = `calc(100% / 3 - ${makeSpace(margin - threeOffset)})`;

  const widthMap = {
    1: oneSlide,
    2: twoSlide,
    3: threeSlide,
  } as const;

  const bleedMap = {
    left: 'end',
    right: 'start',
    both: 'center',
    none: 'start',
  } as const;

  // Special case when visibleItems is 2 and bleed is both
  // this case is needed because when visible items are 2
  // the CSS scroll snap will scroll to the middle of an element
  // and that would cause the element to be in the center of the carousel container
  // We want this:       |  [ 2 ] [ 3 ]  |
  // But we we get this: | 1 ] [ 2 ] [ 3 |
  const isBleedAndTwoSlides = visibleItems === 2 && bleed === 'both';

  if (visibleItems === undefined) {
    console.log(shouldHaveStartSpacing, shouldHaveEndSpacing);
    return {
      flexGrow: 0,
      flexShrink: 0,
      flexBasis: '100%',
      scrollSnapAlign: 'center',
      minHeight: '100%',
      maxWidth: '500px', // user needs to set this
      marginLeft: shouldHaveStartSpacing ? '100%' : 0,
      marginRight: shouldHaveEndSpacing ? '100%' : 0,
      paddingLeft: padding,
      paddingRight: padding,
      // scrollMargin: isBleedAndTwoSlides ? margin / 2 : undefined,
    };
  }

  return {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: widthMap[visibleItems!],
    scrollMargin: isBleedAndTwoSlides ? margin / 2 : undefined,
    scrollSnapAlign: isBleedAndTwoSlides ? 'start' : bleedMap[bleed!],
    minHeight: '100%',
    // width: `calc((100% - ${100 + 16}px) / ${visibleItems})`,
    // we need to use padding here instead of gap
    // because if we use gap it won't add space on the first/last element causing the
    // carousel item to stick too close to the screen's left side
    paddingLeft: padding,
    paddingRight: padding,
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

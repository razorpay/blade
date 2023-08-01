/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable consistent-return */
import styled from 'styled-components';
import React from 'react';
import { Indicators } from './Indicators/Indicators';
import { NavigationButton } from './NavigationButton';
import type { CarouselProps } from './types';
import { CarouselContext } from './CarouselContext';
import { Box } from '~components/Box';
import BaseBox from '~components/Box/BaseBox';
import { useTheme } from '~utils';

type ControlsProp = {
  showIndicators?: boolean;
  navigationButtonPosition?: 'bottom' | 'side';
  activeSlide: number;
  totalSlides: number;
  onIndicatorButtonClick: (index: number) => void;
  onNextButtonClick: () => void;
  onPreviousButtonClick: () => void;
};

const Controls = ({
  showIndicators,
  navigationButtonPosition,
  activeSlide,
  totalSlides,
  onIndicatorButtonClick,
  onNextButtonClick,
  onPreviousButtonClick,
}: ControlsProp): React.ReactElement => {
  // 1. buttons or indicators side by side on bottom
  // 3. only indicators on bottom and buttons will be on side
  const isNavButtonsOnBottom = navigationButtonPosition === 'bottom';
  const case3 = showIndicators && navigationButtonPosition === 'side';

  if (isNavButtonsOnBottom) {
    return (
      <Box marginTop="spacing.7" display="flex" alignItems="center" gap="spacing.4">
        <NavigationButton type="previous" variant="filled" onClick={onPreviousButtonClick} />
        {showIndicators ? (
          <Indicators
            onIndicatorButtonClick={onIndicatorButtonClick}
            activeIndex={activeSlide}
            totalItems={totalSlides}
            variant="blue"
          />
        ) : null}
        <NavigationButton onClick={onNextButtonClick} type="next" variant="filled" />
      </Box>
    );
  }

  if (case3) {
    return (
      <Box marginTop="spacing.7">
        <Indicators
          onIndicatorButtonClick={onIndicatorButtonClick}
          activeIndex={activeSlide}
          totalItems={totalSlides}
          variant="blue"
        />
      </Box>
    );
  }

  return <></>;
};

const CarouselContainer = styled(BaseBox)(() => {
  return {
    width: '100%',
    overflowX: 'scroll',
    display: 'flex',
    scrollSnapType: 'x mandatory',
    scrollSnapPointsY: `repeat(100%)`,
    scrollBehavior: 'smooth',
    msOverflowStyle: 'none' /* IE and Edge */,
    scrollbarWidth: 'none' /* Firefox */,
    /* Needed to work on iOS Safari */
    webkitOverflowScrolling: 'touch',
    msScrollSnapType: 'mandatory',
    scrollSnapPointsX: 'repeat(100%)',
    msScrollSnapPointsX: 'repeat(100%)',
    // gap: makeSpace(theme.spacing[5]),
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  };
});

type CarouselBodyProps = {
  children: React.ReactNode;
  totalSlides: number;
  shouldAddStartEndSpacing?: boolean;
};
const CarouselBody = React.forwardRef<HTMLDivElement, CarouselBodyProps>(
  ({ children, totalSlides, shouldAddStartEndSpacing }, ref) => {
    return (
      <CarouselContainer ref={ref}>
        {React.Children.map(children, (child, index) => {
          return React.cloneElement(child as React.ReactElement, {
            id: `carousel-item-${index}`,
            shouldHaveStartSpacing: shouldAddStartEndSpacing && index === 0,
            shouldHaveEndSpacing: shouldAddStartEndSpacing && index === totalSlides - 1,
          });
        })}
      </CarouselContainer>
    );
  },
);

const Carousel = ({
  visibleItems,
  bleed = 'none',
  showIndicators = true,
  navigationButtonPosition = 'bottom',
  children,
  shouldAddStartEndSpacing,
}: CarouselProps): React.ReactElement => {
  const { platform } = useTheme();
  const [activeSlide, setActiveSlide] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const isMobile = platform === 'onMobile';
  let _visibleItems = visibleItems;

  if (isMobile) {
    _visibleItems = visibleItems === undefined ? undefined : 1;
    navigationButtonPosition = 'bottom';
  }

  const isNavButtonsOnSide = bleed === 'none' && navigationButtonPosition === 'side';
  const shouldNavButtonsFloat = bleed !== 'none' && navigationButtonPosition === 'side';
  const totalNumberOfSlides = React.Children.count(children);
  const numberOfIndicators = Math.ceil(totalNumberOfSlides / (visibleItems ?? 1));

  const goToSlideIndex = (slideIndex: number) => {
    if (!containerRef.current) return;

    const carouselItemId = `#carousel-item-${slideIndex}`;
    const carouselItem = containerRef.current.querySelector(carouselItemId);
    carouselItem?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'center',
    });
    setActiveSlide(slideIndex);
  };

  const goToNextSlide = () => {
    let slideIndex = activeSlide + 1;
    if (slideIndex >= totalNumberOfSlides) {
      slideIndex = 0;
    }
    goToSlideIndex(slideIndex);
  };

  const goToPreviousSlide = () => {
    let slideIndex = activeSlide - 1;
    if (activeSlide <= 0) {
      slideIndex = totalNumberOfSlides - 1;
    }
    goToSlideIndex(slideIndex);
  };

  return (
    <CarouselContext.Provider value={{ visibleItems: _visibleItems, bleed }}>
      <BaseBox display="flex" alignItems="center" flexDirection="column">
        <BaseBox
          width="100%"
          position="relative"
          display="flex"
          alignItems="center"
          gap="spacing.4"
          flexDirection="row"
        >
          {shouldNavButtonsFloat ? (
            <BaseBox position="absolute" left="spacing.11">
              <NavigationButton type="previous" variant="filled" onClick={goToPreviousSlide} />
            </BaseBox>
          ) : null}
          {isNavButtonsOnSide ? (
            <NavigationButton type="previous" variant="filled" onClick={goToPreviousSlide} />
          ) : null}
          <CarouselBody
            totalSlides={totalNumberOfSlides}
            shouldAddStartEndSpacing={shouldAddStartEndSpacing}
            ref={containerRef}
          >
            {children}
          </CarouselBody>
          {shouldNavButtonsFloat ? (
            <BaseBox position="absolute" right="spacing.11">
              <NavigationButton onClick={goToNextSlide} type="next" variant="filled" />
            </BaseBox>
          ) : null}
          {isNavButtonsOnSide ? (
            <NavigationButton onClick={goToNextSlide} type="next" variant="filled" />
          ) : null}
        </BaseBox>
        <Controls
          totalSlides={numberOfIndicators}
          activeSlide={activeSlide}
          showIndicators={showIndicators}
          navigationButtonPosition={navigationButtonPosition}
          onIndicatorButtonClick={goToSlideIndex}
          onNextButtonClick={goToNextSlide}
          onPreviousButtonClick={goToPreviousSlide}
        />
      </BaseBox>
    </CarouselContext.Provider>
  );
};

export { Carousel };

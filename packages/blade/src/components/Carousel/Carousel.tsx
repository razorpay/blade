/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/jsx-no-useless-fragment */
import type { CSSObject } from 'styled-components';
import styled from 'styled-components';
import React from 'react';
import getIn from 'lodash/get';
import throttle from 'lodash/throttle';
import debounce from 'lodash/debounce';
import { Indicators } from './Indicators/Indicators';
import { NavigationButton } from './NavigationButton';
import type { CarouselProps } from './types';
import type { CarouselContextProps } from './CarouselContext';
import { CarouselContext } from './CarouselContext';
import { getCarouselItemId } from './utils';
import { Box } from '~components/Box';
import BaseBox from '~components/Box/BaseBox';
import { useInterval, useTheme } from '~utils';
import { useId } from '~utils/useId';
import { makeAccessible } from '~utils/makeAccessible';

type ControlsProp = Required<
  Pick<
    CarouselProps,
    'indicatorVariant' | 'showIndicators' | 'navigationButtonVariant' | 'navigationButtonPosition'
  >
> & {
  activeIndicator: number;
  totalSlides: number;
  onIndicatorButtonClick: (index: number) => void;
  onNextButtonClick: () => void;
  onPreviousButtonClick: () => void;
};

const Controls = ({
  showIndicators,
  navigationButtonPosition,
  activeIndicator,
  totalSlides,
  onIndicatorButtonClick,
  onNextButtonClick,
  onPreviousButtonClick,
  indicatorVariant,
  navigationButtonVariant,
}: ControlsProp): React.ReactElement => {
  // 1. buttons or indicators side by side on bottom
  // 3. only indicators on bottom and buttons will be on side
  const isNavButtonsOnBottom = navigationButtonPosition === 'bottom';
  const case3 = showIndicators && navigationButtonPosition === 'side';

  if (isNavButtonsOnBottom) {
    return (
      <Box marginTop="spacing.7" display="flex" alignItems="center" gap="spacing.4">
        <NavigationButton
          type="previous"
          variant={navigationButtonVariant}
          onClick={onPreviousButtonClick}
        />
        {showIndicators ? (
          <Indicators
            onIndicatorButtonClick={onIndicatorButtonClick}
            activeIndex={activeIndicator}
            totalItems={totalSlides}
            variant={indicatorVariant}
          />
        ) : null}
        <NavigationButton
          onClick={onNextButtonClick}
          type="next"
          variant={navigationButtonVariant}
        />
      </Box>
    );
  }

  if (case3) {
    return (
      <Box marginTop="spacing.7">
        <Indicators
          onIndicatorButtonClick={onIndicatorButtonClick}
          activeIndex={activeIndicator}
          totalItems={totalSlides}
          variant={indicatorVariant}
        />
      </Box>
    );
  }

  return <></>;
};

const CarouselContainer = styled(BaseBox)<{
  showOverlay?: boolean;
  scrollOverlayColor: CarouselProps['scrollOverlayColor'];
  isScrollAtStart: boolean;
  isScrollAtEnd: boolean;
}>(({ theme, showOverlay, scrollOverlayColor, isScrollAtStart, isScrollAtEnd }) => {
  const gradientStop1: string = getIn(theme.colors, scrollOverlayColor as string);
  const gradientStop2 = 'hsla(0, 0%, 100%, 0)';

  const overlayCommonStyle: CSSObject = {
    content: "''",
    position: 'absolute',
    top: 0,
    width: '100px',
    height: '100%',
    transition: '400ms ease',
    transitionProperty: 'opacity',
  };

  return {
    width: '100%',
    overflowX: 'scroll',
    display: 'flex',
    flexWrap: 'nowrap',
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
    ...(showOverlay && {
      '&::before': {
        ...overlayCommonStyle,
        background: `linear-gradient(to right, ${gradientStop1}, ${gradientStop2})`,
        left: -1,
        opacity: isScrollAtStart ? 0 : 1,
        pointerEvents: 'none',
      },
      '&::after': {
        ...overlayCommonStyle,
        background: `linear-gradient(to left, ${gradientStop1}, ${gradientStop2})`,
        right: -1,
        opacity: isScrollAtEnd ? 0 : 1,
        pointerEvents: 'none',
      },
    }),
  };
});

type CarouselBodyProps = {
  children: React.ReactNode;
  totalSlides: number;
  shouldAddStartEndSpacing?: boolean;
  idPrefix: string;
  scrollOverlayColor: CarouselProps['scrollOverlayColor'];
  isScrollAtStart: boolean;
  isScrollAtEnd: boolean;
  carouselItemAlignment: CarouselProps['carouselItemAlignment'];
};

const CarouselBody = React.forwardRef<HTMLDivElement, CarouselBodyProps>(
  (
    {
      children,
      totalSlides,
      shouldAddStartEndSpacing,
      idPrefix,
      scrollOverlayColor,
      isScrollAtStart,
      isScrollAtEnd,
      carouselItemAlignment,
    },
    ref,
  ) => {
    return (
      <CarouselContainer
        ref={ref}
        showOverlay={Boolean(scrollOverlayColor)}
        scrollOverlayColor={scrollOverlayColor}
        gap={{ base: 'spacing.4', m: 'spacing.5' }}
        isScrollAtStart={isScrollAtStart}
        isScrollAtEnd={isScrollAtEnd}
        alignItems={carouselItemAlignment}
        {...makeAccessible({ liveRegion: 'polite' })}
      >
        {React.Children.map(children, (child, index) => {
          return React.cloneElement(child as React.ReactElement, {
            index,
            id: `${idPrefix}-carousel-item-${index}`,
            shouldHaveStartSpacing: shouldAddStartEndSpacing && index === 0,
            shouldHaveEndSpacing: shouldAddStartEndSpacing && index === totalSlides - 1,
          });
        })}
      </CarouselContainer>
    );
  },
);

const Carousel = ({
  autoPlay,
  visibleItems = 1,
  showIndicators = true,
  navigationButtonPosition = 'bottom',
  children,
  shouldAddStartEndSpacing = false,
  carouselItemWidth,
  scrollOverlayColor,
  accessibilityLabel,
  onChange,
  indicatorVariant = 'gray',
  navigationButtonVariant = 'filled',
  carouselItemAlignment = 'start',
}: CarouselProps): React.ReactElement => {
  const { platform } = useTheme();
  const [activeSlide, setActiveSlide] = React.useState(0);
  const [activeIndicator, setActiveIndicator] = React.useState(0);
  const [shouldPauseAutoplay, setShouldPauseAutoplay] = React.useState(false);
  const [startEndMargin, setStartEndMargin] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isMobile = platform === 'onMobile';
  const id = useId('carousel');

  const [isScrollAtStart, setScrollStart] = React.useState(
    // on mobile we do not want to render the overlay
    isMobile ? true : !shouldAddStartEndSpacing,
  );
  const [isScrollAtEnd, setScrollEnd] = React.useState(isMobile);

  const isResponsive = visibleItems === 'autofit';
  let _visibleItems = visibleItems as 1 | 2 | 3;
  if (isMobile) {
    _visibleItems = 1;
    navigationButtonPosition = 'bottom';
  }
  if (isResponsive) {
    _visibleItems = 1;
  }

  // A special case where we hide the indicators when the carousel is responsive
  // Because indicators become useless since it's not aparent which carousel item is active
  // and how many carousel items are visible at a time
  if (isResponsive && !shouldAddStartEndSpacing && !isMobile) {
    showIndicators = false;
  }

  const isNavButtonsOnSide = !isResponsive && navigationButtonPosition === 'side';
  const shouldNavButtonsFloat = isResponsive && navigationButtonPosition === 'side';
  const totalNumberOfSlides = React.Children.count(children);
  const numberOfIndicators = Math.ceil(totalNumberOfSlides / _visibleItems);

  // hide next/prev button on reaching start/end when carousel is responsive
  // in non-responsive carousel we always show the next/prev buttons to allow looping
  const shouldShowPrevButton = isResponsive ? activeSlide !== 0 : true;
  const shouldShowNextButton = isResponsive ? activeSlide !== totalNumberOfSlides - 1 : true;

  // calculate the start/end margin so that we can
  // deduct that margin when scrolling to a carousel item with goToSlideIndex
  React.useLayoutEffect(() => {
    // Do not calculate if not needed
    if (!isResponsive && !shouldAddStartEndSpacing) return;
    if (!containerRef.current) return;

    const carouselItemId = getCarouselItemId(id, 0);
    const carouselItem = containerRef.current.querySelector(carouselItemId);
    if (!carouselItem) return;

    const carouselItemLeft = carouselItem.getBoundingClientRect().left ?? 0;
    const carouselContainerLeft = containerRef.current.getBoundingClientRect().left ?? 0;

    setStartEndMargin(carouselItemLeft - carouselContainerLeft);
  }, [id, isResponsive, shouldAddStartEndSpacing]);

  const goToSlideIndex = (slideIndex: number) => {
    if (!containerRef.current) return;

    const carouselItemId = getCarouselItemId(id, slideIndex * _visibleItems);
    const carouselItem = containerRef.current.querySelector(carouselItemId);
    if (!carouselItem) return;

    const carouselItemLeft =
      carouselItem.getBoundingClientRect().left -
        containerRef.current.getBoundingClientRect().left ?? 0;
    const left = containerRef.current.scrollLeft + carouselItemLeft;

    containerRef.current.scroll({
      left: left - startEndMargin,
      behavior: 'smooth',
    });
    setActiveSlide(slideIndex);
    setActiveIndicator(slideIndex);
  };

  const goToNextSlide = () => {
    let slideIndex = activeSlide + 1;
    if (slideIndex >= numberOfIndicators) {
      slideIndex = 0;
    }

    // an edge case where if carousel is responsive
    // and shouldHaveStartEndSpacing is set to false
    // there can be a case where numberOfIndicators is set to 10 but
    // visually there is 3 or 4 items, in those cases we want to check if we reached the
    // end of the scroll container if so we wrap around
    // TODO: we should probably hide the indicators in this case
    if (containerRef.current) {
      const container = containerRef.current;
      const scrollLeft = container.scrollLeft;
      const scrollWidth = container.scrollWidth - container.offsetWidth;
      if (scrollLeft === scrollWidth) {
        slideIndex = 0;
      }
    }

    goToSlideIndex(slideIndex);
  };

  const goToPreviousSlide = () => {
    let slideIndex = activeSlide - 1;
    if (activeSlide <= 0) {
      slideIndex = numberOfIndicators - 1;
    }
    goToSlideIndex(slideIndex);
  };

  // Scroll overlay gradient show/hide based on if scrolled to start or end
  React.useEffect(() => {
    // if shouldAddStartEndSpacing is true, we don't need to hide/show the overlay based on the scroll position
    // because the gap is there so it won't overlap with the card anyway
    if (shouldAddStartEndSpacing) return;
    if (isMobile) return;

    const carouselContainer = containerRef.current;
    if (!carouselContainer) return;

    const handleScroll = throttle(() => {
      const scrollWidth = carouselContainer?.scrollWidth - carouselContainer.offsetWidth;
      setScrollStart(carouselContainer?.scrollLeft === 0);
      setScrollEnd(carouselContainer?.scrollLeft === scrollWidth);
    }, 500);

    carouselContainer.addEventListener('scroll', handleScroll);

    return () => {
      carouselContainer?.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile, shouldAddStartEndSpacing]);

  // Sync the indicators with scroll
  React.useEffect(() => {
    const carouselContainer = containerRef.current;
    if (!carouselContainer) return;

    const handleScroll = debounce(() => {
      const carouselBB = carouselContainer.getBoundingClientRect();
      // By default we check the far left side of the screen
      let xOffset = 0.1;
      // when the carousel is responsive & has spacing
      // we want to check the center of the screen
      if (isResponsive && shouldAddStartEndSpacing) {
        xOffset = 0.5;
      }

      const pointX = carouselBB.left + carouselBB.width * xOffset;
      const pointY = carouselBB.top + carouselBB.height * 0.5;
      const element = document.elementFromPoint(pointX, pointY);
      const carouselItem = element?.closest('[data-slide-index]');
      if (!carouselItem) {
        return;
      }

      const slideIndex = Number(carouselItem?.getAttribute('data-slide-index'));
      const goTo = Math.ceil(slideIndex / _visibleItems);
      setActiveIndicator(goTo);
      setActiveSlide(goTo);
    }, 50);

    carouselContainer.addEventListener('scroll', handleScroll);

    return () => {
      carouselContainer?.removeEventListener('scroll', handleScroll);
    };
  }, [_visibleItems, isResponsive, shouldAddStartEndSpacing]);

  // auto play
  useInterval(
    () => {
      goToNextSlide();
    },
    {
      delay: 6000,
      // only enable if autoplay is true & user's intent isn't to interact with carousel
      enable: autoPlay && !shouldPauseAutoplay,
    },
  );

  const carouselContext = React.useMemo<CarouselContextProps>(() => {
    return {
      visibleItems,
      carouselItemWidth,
      carouselContainerRef: containerRef,
      setActiveIndicator,
      carouselId: id,
      totalNumberOfSlides,
      activeSlide,
      startEndMargin,
      shouldAddStartEndSpacing,
    };
  }, [
    id,
    startEndMargin,
    visibleItems,
    carouselItemWidth,
    totalNumberOfSlides,
    activeSlide,
    shouldAddStartEndSpacing,
  ]);

  React.useEffect(() => {
    onChange?.(activeSlide);
  }, [activeSlide, onChange]);

  return (
    <CarouselContext.Provider value={carouselContext}>
      <BaseBox
        {...makeAccessible({ roleDescription: 'carousel', label: accessibilityLabel })}
        // stop autoplaying when any elements in carousel is in focus
        onFocus={(e: React.FocusEvent) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setShouldPauseAutoplay(true);
          }
        }}
        onBlur={(e: React.FocusEvent) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setShouldPauseAutoplay(false);
          }
        }}
        // stop autplay when user hover overs the carousel
        onMouseEnter={() => {
          setShouldPauseAutoplay(true);
        }}
        onMouseLeave={() => {
          setShouldPauseAutoplay(false);
        }}
        onTouchStart={() => {
          setShouldPauseAutoplay(true);
        }}
        onTouchEnd={() => {
          setShouldPauseAutoplay(false);
        }}
        display="flex"
        alignItems="center"
        flexDirection="column"
      >
        <BaseBox
          width="100%"
          position="relative"
          display="flex"
          alignItems="center"
          gap="spacing.4"
          flexDirection="row"
        >
          {shouldShowPrevButton && shouldNavButtonsFloat ? (
            <BaseBox zIndex={2} position="absolute" left="spacing.11">
              <NavigationButton
                type="previous"
                variant={navigationButtonVariant}
                onClick={goToPreviousSlide}
              />
            </BaseBox>
          ) : null}
          {isNavButtonsOnSide ? (
            <NavigationButton
              type="previous"
              variant={navigationButtonVariant}
              onClick={goToPreviousSlide}
            />
          ) : null}
          <CarouselBody
            idPrefix={id}
            totalSlides={totalNumberOfSlides}
            shouldAddStartEndSpacing={shouldAddStartEndSpacing}
            scrollOverlayColor={scrollOverlayColor}
            isScrollAtStart={isScrollAtStart}
            isScrollAtEnd={isScrollAtEnd}
            ref={containerRef}
            carouselItemAlignment={carouselItemAlignment}
          >
            {children}
          </CarouselBody>
          {shouldShowNextButton && shouldNavButtonsFloat ? (
            <BaseBox zIndex={2} position="absolute" right="spacing.11">
              <NavigationButton
                onClick={goToNextSlide}
                type="next"
                variant={navigationButtonVariant}
              />
            </BaseBox>
          ) : null}
          {isNavButtonsOnSide ? (
            <NavigationButton
              onClick={goToNextSlide}
              type="next"
              variant={navigationButtonVariant}
            />
          ) : null}
        </BaseBox>
        <Controls
          totalSlides={numberOfIndicators}
          activeIndicator={activeIndicator}
          showIndicators={showIndicators}
          navigationButtonPosition={navigationButtonPosition}
          onIndicatorButtonClick={goToSlideIndex}
          onNextButtonClick={goToNextSlide}
          onPreviousButtonClick={goToPreviousSlide}
          indicatorVariant={indicatorVariant}
          navigationButtonVariant={navigationButtonVariant}
        />
      </BaseBox>
    </CarouselContext.Provider>
  );
};

export { Carousel };

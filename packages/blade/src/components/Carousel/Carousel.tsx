/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/jsx-no-useless-fragment */
import type { CSSObject } from 'styled-components';
import styled from 'styled-components';
import React from 'react';
import getIn from 'lodash/get';
import throttle from 'lodash/throttle';
import { Indicators } from './Indicators/Indicators';
import { NavigationButton } from './NavigationButton';
import type { CarouselProps } from './types';
import type { CarouselContextProps } from './CarouselContext';
import { CarouselContext } from './CarouselContext';
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
  overlayColor: CarouselProps['overlayColor'];
  isScrollAtStart: boolean;
  isScrollAtEnd: boolean;
}>(({ theme, showOverlay, overlayColor, isScrollAtStart, isScrollAtEnd }) => {
  const gradientStop1: string = getIn(theme.colors, overlayColor as string);
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
  overlayColor: CarouselProps['overlayColor'];
  showOverlay?: boolean;
  isScrollAtStart: boolean;
  isScrollAtEnd: boolean;
};
const CarouselBody = React.forwardRef<HTMLDivElement, CarouselBodyProps>(
  (
    {
      children,
      totalSlides,
      shouldAddStartEndSpacing,
      idPrefix,
      overlayColor,
      showOverlay,
      isScrollAtStart,
      isScrollAtEnd,
    },
    ref,
  ) => {
    return (
      <CarouselContainer
        ref={ref}
        showOverlay={showOverlay}
        overlayColor={overlayColor}
        gap={{ base: 'spacing.4', m: 'spacing.5' }}
        isScrollAtStart={isScrollAtStart}
        isScrollAtEnd={isScrollAtEnd}
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
  visibleItems,
  showIndicators = true,
  navigationButtonPosition = 'bottom',
  children,
  shouldAddStartEndSpacing = false,
  carouselItemWidth,
  overlayColor,
  accessibilityLabel,
  navigationButtonSpacing = 'spacing.4',
  onChange,
  indicatorVariant = 'gray',
  navigationButtonVariant = 'filled',
  showOverlay,
}: CarouselProps): React.ReactElement => {
  const { platform } = useTheme();
  const [activeSlide, setActiveSlide] = React.useState(0);
  const [activeIndicator, setActiveIndicator] = React.useState(0);
  const [shouldPauseAutoplay, setShouldPauseAutoplay] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isMobile = platform === 'onMobile';
  const id = useId('carousel');

  const [isScrollAtStart, setScrollStart] = React.useState(
    // on mobile we do not want to render the overlay
    isMobile ? true : !shouldAddStartEndSpacing,
  );
  const [isScrollAtEnd, setScrollEnd] = React.useState(isMobile);

  let _visibleItems = visibleItems;
  if (isMobile) {
    _visibleItems = visibleItems === undefined ? undefined : 1;
    navigationButtonPosition = 'bottom';
  }

  const isResponsive = visibleItems === undefined;
  const isNavButtonsOnSide = !isResponsive && navigationButtonPosition === 'side';
  const shouldNavButtonsFloat = isResponsive && navigationButtonPosition === 'side';
  const totalNumberOfSlides = React.Children.count(children);
  const numberOfIndicators = Math.ceil(totalNumberOfSlides / (_visibleItems ?? 1));

  // hide next/prev button on reaching start/end when carousel is responsive
  // in non-responsive carousel we always show the next/prev buttons to allow looping
  const shouldShowPrevButton = isResponsive ? activeSlide !== 0 : true;
  const shouldShowNextButton = isResponsive ? activeSlide !== totalNumberOfSlides - 1 : true;

  // Sync the active slide state with indicator state
  // Because when user scrolls the carousel via touch-and-drag
  // We need to keep the activeSlide state updated
  React.useEffect(() => {
    setActiveSlide(activeIndicator);
  }, [activeIndicator]);

  const goToSlideIndex = (slideIndex: number) => {
    if (!containerRef.current) return;

    const carouselItemId = `#${id}-carousel-item-${slideIndex * (_visibleItems ?? 1)}`;
    const carouselItem = containerRef.current.querySelector(carouselItemId);
    if (!carouselItem) return;

    const carouselItemLeft = carouselItem.getBoundingClientRect().left ?? 0;
    const left = containerRef.current.scrollLeft + carouselItemLeft;
    containerRef.current.scroll({
      left,
      behavior: 'smooth',
    });
    setActiveSlide(slideIndex);
  };

  const goToNextSlide = () => {
    let slideIndex = activeSlide + 1;
    if (slideIndex >= numberOfIndicators) {
      slideIndex = 0;
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
      visibleItems: _visibleItems,
      carouselItemWidth,
      carouselContainerRef: containerRef,
      setActiveIndicator,
      carouselId: id,
      totalNumberOfSlides,
    };
  }, [_visibleItems, carouselItemWidth, id, totalNumberOfSlides]);

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
          gap={navigationButtonSpacing}
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
            showOverlay={showOverlay}
            overlayColor={overlayColor}
            isScrollAtStart={isScrollAtStart}
            isScrollAtEnd={isScrollAtEnd}
            ref={containerRef}
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

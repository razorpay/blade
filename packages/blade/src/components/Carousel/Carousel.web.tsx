/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/jsx-no-useless-fragment */
import type { CSSObject } from 'styled-components';
import styled from 'styled-components';
import React from 'react';
import { Indicators } from './Indicators/Indicators';
import { NavigationButton } from './NavigationButton';
import type { CarouselProps } from './types';
import type { CarouselContextProps } from './CarouselContext';
import { CarouselContext } from './CarouselContext';
import { getCarouselItemId } from './utils';
import { CAROUSEL_AUTOPLAY_INTERVAL, componentIds } from './constants';
import getIn from '~utils/lodashButBetter/get';
import throttle from '~utils/lodashButBetter/throttle';
import debounce from '~utils/lodashButBetter/debounce';
import { Box } from '~components/Box';
import BaseBox from '~components/Box/BaseBox';
import { castWebType, makeMotionTime, useInterval } from '~utils';
import { useId } from '~utils/useId';
import { makeAccessible } from '~utils/makeAccessible';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { useVerifyAllowedChildren } from '~utils/useVerifyAllowedChildren/useVerifyAllowedChildren';
import { useTheme } from '~components/BladeProvider';
import { getStyledProps } from '~components/Box/styledProps';
import { useControllableState } from '~utils/useControllable';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
import { useDidUpdate } from '~utils/useDidUpdate';
import type { BladeElementRef } from '~utils/types';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

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
  if (navigationButtonPosition === 'bottom') {
    return (
      <Box marginTop="spacing.7" display="flex" alignItems="center" gap="spacing.4">
        <NavigationButton
          type="previous"
          variant={navigationButtonVariant}
          onClick={onPreviousButtonClick}
        />
        {showIndicators ? (
          <Indicators
            onClick={onIndicatorButtonClick}
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

  if (showIndicators && navigationButtonPosition === 'side') {
    return (
      <Box marginTop="spacing.7">
        <Indicators
          onClick={onIndicatorButtonClick}
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
  const gradientStop1: string = getIn(theme.colors, scrollOverlayColor!);
  const gradientStop2 = 'hsla(0, 0%, 100%, 0)';

  const overlayCommonStyle: CSSObject = {
    content: "''",
    position: 'absolute',
    top: 0,
    width: '100px',
    height: '100%',
    transitionDuration: castWebType(makeMotionTime(theme.motion.duration.gentle)),
    transitionTimingFunction: castWebType(theme.motion.easing.standard),
    transitionProperty: 'opacity',
  };

  return {
    width: '100%',
    height: '100%',
    overflowX: 'scroll',
    display: 'flex',
    flexWrap: 'nowrap',
    scrollSnapType: 'x mandatory',
    scrollSnapPointsY: `repeat(100%)`,
    msOverflowStyle: 'none' /* IE and Edge */,
    scrollbarWidth: 'none' /* Firefox */,
    /* Needed to work on iOS Safari */
    webkitOverflowScrolling: 'touch',
    msScrollSnapType: 'mandatory',
    scrollSnapPointsX: 'repeat(100%)',
    msScrollSnapPointsX: 'repeat(100%)',
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
  accessibilityLabel?: string;
  startEndMargin: number;
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
      accessibilityLabel,
      startEndMargin,
    },
    ref,
  ) => {
    return (
      <CarouselContainer
        tabIndex={0}
        ref={ref}
        showOverlay={Boolean(scrollOverlayColor)}
        scrollOverlayColor={scrollOverlayColor}
        gap={{ base: 'spacing.4', m: 'spacing.5' }}
        isScrollAtStart={isScrollAtStart}
        isScrollAtEnd={isScrollAtEnd}
        alignItems={carouselItemAlignment}
        {...makeAccessible({
          role: 'group',
          roleDescription: 'carousel',
          label: accessibilityLabel,
        })}
      >
        {React.Children.map(children, (child, index) => {
          const shouldHaveStartSpacing = shouldAddStartEndSpacing && index === 0;
          const shouldHaveEndSpacing = shouldAddStartEndSpacing && index === totalSlides - 1;
          const carouselItemNode: React.ReactElement = React.cloneElement(
            child as React.ReactElement,
            {
              index,
              id: `${idPrefix}-carousel-item-${index}`,
              shouldHaveStartSpacing,
              shouldHaveEndSpacing,
            },
          );

          // Safari doesn't include the margin in the bounding box calculation
          // Thus have to add an additional box to the end of the carousel to ensure we can scroll past the last item
          // https://stackoverflow.com/questions/75509058/safari-does-not-include-margins-to-the-scroll-width
          if (shouldHaveEndSpacing) {
            return (
              <>
                {carouselItemNode}
                {<BaseBox minWidth={`${startEndMargin}px`} />}
              </>
            );
          }
          return carouselItemNode;
        })}
      </CarouselContainer>
    );
  },
);

const _Carousel = (
  {
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
    height,
    defaultActiveSlide,
    activeSlide: activeSlideProp,
    ...rest
  }: CarouselProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
  const { platform } = useTheme();
  const [activeIndicator, setActiveIndicator] = React.useState(0);
  const [activeSlide, setActiveSlide] = useControllableState({
    defaultValue: defaultActiveSlide ?? 0,
    value: activeSlideProp,
    onChange: (value) => {
      onChange?.(value);
    },
  });
  const [shouldPauseAutoplay, setShouldPauseAutoplay] = React.useState(false);
  const [startEndMargin, setStartEndMargin] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isMobile = platform === 'onMobile';
  const id = useId();
  const carouselId = `carousel-${id}`;

  useVerifyAllowedChildren({
    componentName: 'Carousel',
    allowedComponents: [componentIds.CarouselItem],
    children,
  });

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
  useIsomorphicLayoutEffect(() => {
    // Do not calculate if not needed
    if (!isResponsive && !shouldAddStartEndSpacing) return;
    if (!containerRef.current) return;

    const carouselItemId = getCarouselItemId(carouselId, 0);
    const carouselItem = containerRef.current.querySelector(carouselItemId);
    if (!carouselItem) return;

    const carouselItemLeft = carouselItem.getBoundingClientRect().left ?? 0;
    const carouselContainerLeft = containerRef.current.getBoundingClientRect().left ?? 0;

    setStartEndMargin(carouselItemLeft - carouselContainerLeft);
  }, [carouselId, isResponsive, shouldAddStartEndSpacing]);

  const scrollToSlide = (slideIndex: number, shouldAnimate = true) => {
    if (!containerRef.current) return;

    const carouselItemId = getCarouselItemId(carouselId, slideIndex * _visibleItems);
    const carouselItem = containerRef.current.querySelector(carouselItemId);
    if (!carouselItem) return;

    const carouselItemLeft =
      carouselItem.getBoundingClientRect().left -
        containerRef.current.getBoundingClientRect().left ?? 0;
    const left = containerRef.current.scrollLeft + carouselItemLeft;

    containerRef.current.scroll({
      left: left - startEndMargin,
      behavior: shouldAnimate ? 'smooth' : 'auto',
    });
  };

  const goToSlideIndex = (slideIndex: number) => {
    setActiveSlide(() => slideIndex);
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
      // carousel bounding box
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
      setActiveSlide(() => goTo);
      setActiveIndicator(goTo);
    }, 50);

    carouselContainer.addEventListener('scroll', handleScroll);

    return () => {
      carouselContainer?.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_visibleItems, isMobile, isResponsive, shouldAddStartEndSpacing]);

  // auto play
  useInterval(
    () => {
      goToNextSlide();
    },
    {
      delay: CAROUSEL_AUTOPLAY_INTERVAL,
      // only enable if autoplay is true & user's intent isn't to interact with carousel
      enable: autoPlay && !shouldPauseAutoplay,
    },
  );

  // set initial active slide on mount
  useIsomorphicLayoutEffect(() => {
    if (!id) return;
    goToSlideIndex(activeSlide);
    scrollToSlide(activeSlide, false);
  }, [id]);

  // Scroll the carousel to the active slide
  useDidUpdate(() => {
    scrollToSlide(activeSlide);
  }, [activeSlide]);

  const carouselContext = React.useMemo<CarouselContextProps>(() => {
    return {
      isResponsive,
      visibleItems: _visibleItems,
      carouselItemWidth,
      carouselContainerRef: containerRef,
      setActiveIndicator,
      carouselId,
      totalNumberOfSlides,
      activeSlide,
      startEndMargin,
      shouldAddStartEndSpacing,
    };
  }, [
    carouselId,
    startEndMargin,
    isResponsive,
    _visibleItems,
    carouselItemWidth,
    totalNumberOfSlides,
    activeSlide,
    shouldAddStartEndSpacing,
  ]);

  return (
    <CarouselContext.Provider value={carouselContext}>
      <BaseBox
        ref={ref as never}
        {...metaAttribute({ name: MetaConstants.Carousel })}
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
        height={height}
        {...getStyledProps(rest)}
        {...makeAnalyticsAttribute(rest)}
      >
        <BaseBox
          width="100%"
          position="relative"
          display="flex"
          alignItems="center"
          gap="spacing.4"
          flexDirection="row"
          height="100%"
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
            idPrefix={carouselId}
            startEndMargin={startEndMargin}
            totalSlides={totalNumberOfSlides}
            shouldAddStartEndSpacing={shouldAddStartEndSpacing}
            scrollOverlayColor={scrollOverlayColor}
            isScrollAtStart={isScrollAtStart}
            isScrollAtEnd={isScrollAtEnd}
            ref={containerRef}
            carouselItemAlignment={carouselItemAlignment}
            accessibilityLabel={accessibilityLabel}
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

const Carousel = React.forwardRef(_Carousel);

export { Carousel };

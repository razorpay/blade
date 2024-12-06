import React from 'react';
import { ScrollView } from 'react-native';
import { Indicators } from './Indicators/Indicators';
import { NavigationButton } from './NavigationButton';
import type { CarouselProps } from './types';
import type { CarouselContextProps } from './CarouselContext';
import { CarouselContext } from './CarouselContext';
import { CAROUSEL_AUTOPLAY_INTERVAL } from './constants';
import BaseBox from '~components/Box/BaseBox';
import { useInterval } from '~utils/useInterval';
import { makeAccessible } from '~utils/makeAccessible/makeAccessible.native';
import { announce } from '~components/LiveAnnouncer/LiveAnnouncer.native';
import { castNativeType } from '~utils';
import { useId } from '~utils/useId';
import { logger } from '~utils/logger';
import { size } from '~tokens/global';
import { useDidUpdate } from '~utils/useDidUpdate';
import { getResponsiveValue } from '~components/Box/BaseBox/getResponsiveValue';
import type { BladeElementRef } from '~utils/types';

const percentageStringToNumber = (percentage: string): number => {
  if (!percentage.endsWith('%')) {
    logger({
      message: 'Only percentage values are allowed',
      type: 'error',
      moduleName: 'Carousel',
    });
  }

  return Number(percentage.substring(0, percentage.length - 1)) / 100;
};

type ControlsProps = Required<
  Pick<CarouselProps, 'indicatorVariant' | 'showIndicators' | 'navigationButtonVariant'>
> & {
  activeIndicator: number;
  totalSlides: number;
  onIndicatorButtonClick: (index: number) => void;
  onNextButtonClick: () => void;
  onPreviousButtonClick: () => void;
};

const Controls = ({
  showIndicators,
  activeIndicator,
  totalSlides,
  onIndicatorButtonClick,
  onNextButtonClick,
  onPreviousButtonClick,
  indicatorVariant,
  navigationButtonVariant,
}: ControlsProps): React.ReactElement => {
  return (
    <BaseBox
      marginTop="spacing.7"
      display="flex"
      flexDirection="row"
      alignItems="center"
      gap="spacing.4"
    >
      <BaseBox>
        <NavigationButton
          type="previous"
          variant={navigationButtonVariant}
          onClick={onPreviousButtonClick}
        />
      </BaseBox>
      {showIndicators ? (
        <Indicators
          onClick={onIndicatorButtonClick}
          activeIndex={activeIndicator}
          totalItems={totalSlides}
          variant={indicatorVariant}
        />
      ) : null}
      <BaseBox>
        <NavigationButton
          onClick={onNextButtonClick}
          type="next"
          variant={navigationButtonVariant}
        />
      </BaseBox>
    </BaseBox>
  );
};

const _Carousel = (
  {
    autoPlay,
    showIndicators = true,
    children,
    carouselItemWidth = '100%',
    accessibilityLabel,
    onChange,
    indicatorVariant = 'gray',
    navigationButtonVariant = 'filled',
  }: CarouselProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
  const containerRef = React.useRef<ScrollView>(null);
  const [activeSlide, setActiveSlide] = React.useState(0);
  const [scrollViewWidth, setScrollViewWidth] = React.useState(0);
  const [shouldPauseAutoplay, setShouldPauseAutoplay] = React.useState(false);
  const id = useId();

  const _visibleItems = 1;
  const slideWidth =
    scrollViewWidth *
    percentageStringToNumber(castNativeType(getResponsiveValue(carouselItemWidth)));
  const totalNumberOfSlides = React.Children.count(children);

  const goToSlideIndex = (slideIndex: number): void => {
    if (!containerRef.current) return;
    containerRef.current.scrollTo({
      x: slideIndex * slideWidth,
      y: 0,
      animated: true,
    });
    setActiveSlide(slideIndex);
  };

  const goToNextSlide = (): void => {
    let slideIndex = activeSlide + 1;
    if (slideIndex >= totalNumberOfSlides) {
      slideIndex = 0;
    }
    goToSlideIndex(slideIndex);
  };

  const goToPreviousSlide = (): void => {
    let slideIndex = activeSlide - 1;
    if (activeSlide <= 0) {
      slideIndex = totalNumberOfSlides - 1;
    }
    goToSlideIndex(slideIndex);
  };

  const carouselContext = React.useMemo<CarouselContextProps>(() => {
    return {
      isResponsive: false,
      visibleItems: _visibleItems,
      carouselItemWidth,
      carouselId: id,
      totalNumberOfSlides,
      slideWidth,
      activeSlide,
      carouselContainerRef: containerRef as never,
      setActiveIndicator: setActiveSlide,
      carouselItemAlignment: undefined,
      shouldAddStartEndSpacing: false,
    };
  }, [carouselItemWidth, id, totalNumberOfSlides, slideWidth, activeSlide]);

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

  useDidUpdate(() => {
    onChange?.(activeSlide);
  }, [activeSlide, onChange]);

  React.useEffect(() => {
    announce(`Slide ${activeSlide + 1} of ${totalNumberOfSlides}`);
  }, [activeSlide, totalNumberOfSlides]);

  return (
    <CarouselContext.Provider value={carouselContext}>
      <BaseBox ref={ref as never} display="flex" alignItems="center" flexDirection="column">
        <BaseBox
          width="100%"
          position="relative"
          display="flex"
          alignItems="center"
          gap="spacing.4"
          flexDirection="row"
        >
          <ScrollView
            onScrollBeginDrag={() => {
              setShouldPauseAutoplay(true);
            }}
            onScrollEndDrag={() => {
              setShouldPauseAutoplay(false);
            }}
            {...makeAccessible({ label: accessibilityLabel })}
            ref={containerRef}
            onLayout={(e) => {
              setScrollViewWidth(e.nativeEvent.layout.width);
            }}
            // Sync active indicator with scroll
            onMomentumScrollEnd={(e) => {
              const slideIndex = Math.round(e.nativeEvent.contentOffset.x / slideWidth);
              setActiveSlide(slideIndex);
            }}
            // https://dev.to/reime005/horizontal-card-carousel-in-react-native-303n
            horizontal
            snapToAlignment="start"
            decelerationRate="fast"
            overScrollMode="never"
            contentInsetAdjustmentBehavior="never"
            automaticallyAdjustContentInsets={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            snapToInterval={slideWidth}
            contentInset={{
              left: 0,
              right: 0,
            }}
            contentOffset={{ x: 0, y: 0 }}
            // adding some padding so that if a card is placed the shadows don't cut off
            contentContainerStyle={{ paddingVertical: size[10] }}
          >
            {React.Children.map(children, (child, index) => {
              return React.cloneElement(child as React.ReactElement, {
                index,
                shouldHaveStartSpacing: index === 0,
                shouldHaveEndSpacing: index === totalNumberOfSlides - 1,
              });
            })}
          </ScrollView>
        </BaseBox>
        <Controls
          totalSlides={totalNumberOfSlides}
          activeIndicator={activeSlide}
          showIndicators={showIndicators}
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

/* eslint-disable consistent-return */
import styled from 'styled-components';
import React from 'react';
import debounce from 'lodash/debounce';
import { Indicators } from './Indicators/Indicators';
import { NavigationButton } from './NavigationButton';
import { Box } from '~components/Box';
import BaseBox from '~components/Box/BaseBox';

type CarouselProps = {
  children: React.ReactNode;
};

const Controls = ({ activeSlide, totalSlides, setActiveSlide }) => {
  return (
    <Box display="flex" alignItems="center" gap="spacing.2">
      <NavigationButton
        type="previous"
        variant="filled"
        onClick={() => {
          setActiveSlide(0);
          document
            .querySelector(`#slide${1}`)
            ?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
        }}
      />
      <Indicators
        onIndicatorButtonClick={(index) => {
          setActiveSlide(index);
          document
            .querySelector(`#slide${index + 1}`)
            ?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
        }}
        activeIndex={activeSlide}
        totalItems={totalSlides}
        variant="blue"
      />
      <NavigationButton
        onClick={() => {
          setActiveSlide(1);
          document
            .querySelector(`#slide${2}`)
            ?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
        }}
        type="next"
        variant="filled"
      />
    </Box>
  );
};

const CarouselContainer = styled.div(() => {
  return {
    width: '100%',
    position: 'relative',
    overflowX: 'scroll',
    whiteSpace: 'nowrap',
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
    height: 300,
    gap: 20,
  };
});

const CarouselItem = styled.div(() => {
  return {
    scrollMargin: 50,
    scrollSnapAlign: 'center',
    //
    minWidth: 'calc(100% - 90px)',
    minHeight: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: '20px',
    backgroundColor: 'royalblue',
  };
});

const getActiveSlide = (item: HTMLDivElement | null): number => {
  if (item) {
    return Math.ceil(item.scrollLeft / item.offsetWidth);
  }
  return 0;
};

const Carousel = ({ children }): React.ReactElement => {
  const [activeSlide, setActiveSlide] = React.useState(1);
  const carouselContentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const refCurrent = carouselContentRef?.current;
    if (!refCurrent) return;

    const checkScroll = debounce(() => {
      setActiveSlide(getActiveSlide(refCurrent));
    }, 100);

    refCurrent?.addEventListener('scroll', checkScroll);
    return (): void => {
      refCurrent?.removeEventListener('scroll', checkScroll);
    };
  }, []);

  return (
    <BaseBox
      display="flex"
      alignItems="center"
      flexDirection="column"
      backgroundColor="surface.background.level2.lowContrast"
    >
      <CarouselContainer ref={carouselContentRef}>
        <CarouselItem id="slide1">slide 1</CarouselItem>
        <CarouselItem id="slide2">slide 2</CarouselItem>
        <CarouselItem id="slide3">slide 3</CarouselItem>
      </CarouselContainer>
      <Controls activeSlide={activeSlide} totalSlides={3} setActiveSlide={setActiveSlide} />
    </BaseBox>
  );
};

export { Carousel, CarouselProps };

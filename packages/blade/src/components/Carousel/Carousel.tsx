/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable consistent-return */
import styled from 'styled-components';
import React from 'react';
import { Indicators } from './Indicators/Indicators';
import { NavigationButton } from './NavigationButton';
import { CarouselItem } from './CarouselItem';
import type { CarouselProps } from './types';
import { Box } from '~components/Box';
import BaseBox from '~components/Box/BaseBox';
import { makeSpace, useTheme } from '~utils';
import { Card, CardBody } from '~components/Card';
import { Heading, Text } from '~components/Typography';

const Controls = ({
  showIndicators,
  navigationButtonPosition,
  activeSlide,
  totalSlides,
  setActiveSlide,
}) => {
  // 1. buttons or indicators side by side on bottom
  // 3. only indicators on bottom and buttons will be on side
  const isNavButtonsOnBottom = navigationButtonPosition === 'bottom';
  const case3 = showIndicators && navigationButtonPosition === 'side';

  if (isNavButtonsOnBottom) {
    return (
      <Box marginTop="spacing.7" display="flex" alignItems="center" gap="spacing.4">
        <NavigationButton
          type="previous"
          variant="filled"
          onClick={() => {
            console.log('prev');
          }}
        />
        {showIndicators ? (
          <Indicators
            onIndicatorButtonClick={(index) => {
              console.log(index);
            }}
            activeIndex={activeSlide}
            totalItems={7}
            variant="blue"
          />
        ) : null}
        <NavigationButton
          onClick={() => {
            console.log('next');
          }}
          type="next"
          variant="filled"
        />
      </Box>
    );
  }

  if (case3) {
    return (
      <Box marginTop="spacing.7">
        <Indicators
          onIndicatorButtonClick={(index) => {
            console.log(index);
          }}
          activeIndex={activeSlide}
          totalItems={7}
          variant="blue"
        />
      </Box>
    );
  }

  return null;
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

const TestimonialCard = (): React.ReactElement => {
  return (
    <Card>
      <CardBody>
        <Box display="flex" gap="spacing.4" flexDirection="column">
          <Box>
            <Heading>I can now collect payments from my clients instantly</Heading>
            <Text>
              The thing that I love about Razorpay is how it helps me accept payments directly via
              WhatsApp, Instagram & Facebook. Before Razorpay, I would primarily accept payments via
              bank transfer and cheques which would cost me payment delays all the time. Not to
              mention the long and tedious process that it involves. But Razorpay has been a
              saviour!
            </Text>
          </Box>
          <Box>
            <Text weight="bold">Nidhi Mulay</Text>
            <Text>
              Founder,{' '}
              <Text as="span" weight="bold">
                Hair By Nidhi
              </Text>
            </Text>
          </Box>
        </Box>
      </CardBody>
    </Card>
  );
};

const CarouselBody = ({ isMobile, bleed, visibleItems }) => {
  return (
    <CarouselContainer>
      <CarouselItem isMobile={isMobile} bleed={bleed} visibleItems={visibleItems} id="slide1">
        <TestimonialCard />
      </CarouselItem>
      <CarouselItem isMobile={isMobile} bleed={bleed} visibleItems={visibleItems} id="slide2">
        <TestimonialCard />
      </CarouselItem>
      <CarouselItem isMobile={isMobile} bleed={bleed} visibleItems={visibleItems} id="slide3">
        <TestimonialCard />
      </CarouselItem>
      <CarouselItem isMobile={isMobile} bleed={bleed} visibleItems={visibleItems} id="slide4">
        <TestimonialCard />
      </CarouselItem>
      <CarouselItem isMobile={isMobile} bleed={bleed} visibleItems={visibleItems} id="slide5">
        <TestimonialCard />
      </CarouselItem>
      <CarouselItem isMobile={isMobile} bleed={bleed} visibleItems={visibleItems} id="slide6">
        <TestimonialCard />
      </CarouselItem>
      <CarouselItem isMobile={isMobile} bleed={bleed} visibleItems={visibleItems} id="slide7">
        <TestimonialCard />
      </CarouselItem>

      <CarouselItem isMobile={isMobile} bleed={bleed} visibleItems={visibleItems} id="slide7">
        <TestimonialCard />
      </CarouselItem>

      <CarouselItem isMobile={isMobile} bleed={bleed} visibleItems={visibleItems} id="slide7">
        <TestimonialCard />
      </CarouselItem>

      <CarouselItem isMobile={isMobile} bleed={bleed} visibleItems={visibleItems} id="slide7">
        <TestimonialCard />
      </CarouselItem>
    </CarouselContainer>
  );
};

const Carousel = ({
  visibleItems = 1,
  bleed = 'none',
  showIndicators = true,
  navigationButtonPosition = 'bottom',
  children,
}: CarouselProps): React.ReactElement => {
  const { platform } = useTheme();
  const [activeSlide, setActiveSlide] = React.useState(0);

  const isMobile = platform === 'onMobile';
  let _visibleItems = visibleItems;

  if (isMobile) {
    _visibleItems = 1;
    navigationButtonPosition = 'bottom';
  }

  const isNavButtonsOnSide = bleed === 'none' && navigationButtonPosition === 'side';
  const shouldNavButtonsFloat = bleed !== 'none' && navigationButtonPosition === 'side';
  const numberOfIndicators = Math.ceil(_visibleItems / React.Children.count(children));

  return (
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
            <NavigationButton
              type="previous"
              variant="filled"
              onClick={() => {
                console.log('prev');
              }}
            />
          </BaseBox>
        ) : null}
        {isNavButtonsOnSide ? (
          <NavigationButton
            type="previous"
            variant="filled"
            onClick={() => {
              console.log('prev');
            }}
          />
        ) : null}
        <CarouselBody isMobile={isMobile} visibleItems={_visibleItems} bleed={bleed} />
        {shouldNavButtonsFloat ? (
          <BaseBox position="absolute" right="spacing.11">
            <NavigationButton
              onClick={() => {
                console.log('next');
              }}
              type="next"
              variant="filled"
            />
          </BaseBox>
        ) : null}
        {isNavButtonsOnSide ? (
          <NavigationButton
            onClick={() => {
              console.log('next');
            }}
            type="next"
            variant="filled"
          />
        ) : null}
      </BaseBox>
      <Controls
        totalSlides={numberOfIndicators}
        activeSlide={activeSlide}
        showIndicators={showIndicators}
        navigationButtonPosition={navigationButtonPosition}
      />
    </BaseBox>
  );
};

export { Carousel };

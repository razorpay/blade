/* eslint-disable import/no-extraneous-dependencies */
import type { StoryFn } from '@storybook/react';
import { within, userEvent } from '@storybook/testing-library';
import { expect, jest } from '@storybook/jest';
import type { Mock } from 'jest-mock';
import React from 'react';
import type { CarouselProps } from '../';
import { Carousel as CarouselComponent } from '../';
import { CarouselExample } from '../Carousel.stories';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import { Button } from '~components/Button';

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

let onChange: Mock<unknown, unknown[]> | null = null;

const BasicCarousel = (props: CarouselProps): React.ReactElement => (
  <Box margin="auto" width={{ base: '100%', m: '100%' }} padding="spacing.4">
    <CarouselExample {...props} />
  </Box>
);

export const TestCarouselOnChange: StoryFn<typeof CarouselComponent> = (
  props,
): React.ReactElement => {
  onChange = jest.fn();
  return <BasicCarousel {...props} onChange={onChange} />;
};

TestCarouselOnChange.play = async ({ canvasElement }) => {
  const { getByRole, getByText } = within(canvasElement);
  const nextButton = getByRole('button', { name: 'Next Slide' });
  const previousButton = getByRole('button', { name: 'Previous Slide' });
  await userEvent.click(nextButton);
  await sleep(1000);
  await expect(onChange).toBeCalledWith(1);
  await userEvent.click(previousButton);
  await sleep(1000);
  await expect(onChange).toBeCalledWith(0);
  getByText(/Single Flow To Collect And Disburse Payments/)?.scrollIntoView({ behavior: 'smooth' });
  await sleep(1000);
  await expect(onChange).toBeCalledWith(3);
  await expect(onChange).toBeCalledTimes(3);
};

export const TestIndicatorButton: StoryFn<typeof CarouselComponent> = (
  props,
): React.ReactElement => {
  onChange = jest.fn();
  return <BasicCarousel {...props} visibleItems={1} onChange={onChange} />;
};

TestIndicatorButton.play = async ({ canvasElement }) => {
  const { getByLabelText } = within(canvasElement);
  const indicatorButton = getByLabelText('Slide 7');
  await userEvent.click(indicatorButton);
  await sleep(1000);
  await expect(onChange).toBeCalledWith(6);
  await expect(onChange).toBeCalledTimes(1);
};

export const TestStartOverAfterStartEnd: StoryFn<typeof CarouselComponent> = (
  props,
): React.ReactElement => {
  onChange = jest.fn();
  return <BasicCarousel {...props} visibleItems={1} onChange={onChange} />;
};

TestStartOverAfterStartEnd.play = async ({ canvasElement }) => {
  const { getByRole } = within(canvasElement);
  const nextButton = getByRole('button', { name: 'Next Slide' });
  const previousButton = getByRole('button', { name: 'Previous Slide' });
  await userEvent.click(previousButton);
  await sleep(1000);
  await expect(onChange).toBeCalledWith(6);
  await userEvent.click(nextButton);
  await sleep(1000);
  await expect(onChange).toBeCalledWith(0);
  await expect(onChange).toBeCalledTimes(2);
};

export const TestAutoPlay: StoryFn<typeof CarouselComponent> = (props): React.ReactElement => {
  onChange = jest.fn();
  return <BasicCarousel {...props} autoPlay visibleItems={2} onChange={onChange} />;
};

TestAutoPlay.play = async ({ canvasElement }) => {
  const { getByRole } = within(canvasElement);
  await sleep(8000);
  await expect(onChange).toBeCalledWith(1);
  await expect(getByRole('tab', { selected: true })).toHaveAccessibleName('Slide 3');
  await expect(onChange).toBeCalledTimes(1);
};

export const TestAutofit: StoryFn<typeof CarouselComponent> = (props): React.ReactElement => {
  onChange = jest.fn();
  return (
    <BasicCarousel
      {...props}
      visibleItems="autofit"
      navigationButtonPosition="side"
      showIndicators={true}
      onChange={onChange}
      shouldAddStartEndSpacing
      carouselItemWidth="300px"
    />
  );
};

TestAutofit.play = async ({ canvasElement }) => {
  await sleep(1000);
  const { getByLabelText, queryByRole } = within(canvasElement);
  const lastIndicatorButton = getByLabelText('Slide 7');
  await expect(onChange).not.toBeCalled();
  await userEvent.click(lastIndicatorButton);
  await sleep(1000);
  const nextButton = queryByRole('button', { name: 'Next Slide' });
  await expect(nextButton).toBeNull();
  const firstIndicatorButton = getByLabelText('Slide 1');
  await userEvent.click(firstIndicatorButton);
  await sleep(1000);
  const previousButton = queryByRole('button', { name: 'Previous Slide' });
  await expect(previousButton).toBeNull();
  await expect(onChange).toBeCalledTimes(2);
};

export const TestAutoPlayPause: StoryFn<typeof CarouselComponent> = (props): React.ReactElement => {
  onChange = jest.fn();
  return <BasicCarousel {...props} autoPlay visibleItems={2} onChange={onChange} />;
};

TestAutoPlayPause.play = async ({ canvasElement }) => {
  const { getByText } = within(canvasElement);
  const slide = getByText(/Acquire Customers From New Customer Segments/);
  await userEvent.hover(slide);
  await sleep(7000);
  await expect(onChange).not.toHaveBeenCalled();
};

export const TestVisibleItemsOnMobile: StoryFn<typeof CarouselComponent> = (
  props,
): React.ReactElement => {
  onChange = jest.fn();
  return <BasicCarousel {...props} visibleItems={3} onChange={onChange} />;
};

TestVisibleItemsOnMobile.parameters = {
  viewport: {
    defaultViewport: 'iPhone6',
  },
};

TestVisibleItemsOnMobile.play = async ({ canvasElement }) => {
  // on mobile regardless of the visible items prop we always show 1 item
  const { getByRole } = within(canvasElement);
  const nextButton = getByRole('button', { name: 'Next Slide' });
  await userEvent.click(nextButton);
  await sleep(1000);
  await expect(onChange).toBeCalledWith(1);
};

// Test for onChange fires multiple times on parent component update
// https://github.com/razorpay/blade/issues/1863
const multipleOnChange = jest.fn();
export const TestOnChangeParentUpdate: StoryFn<typeof CarouselComponent> = (
  props,
): React.ReactElement => {
  const [, setCount] = React.useState(0);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setCount((prev) => prev++);
    }, 100);

    return () => clearInterval(intervalId);
  }, []);

  return <BasicCarousel {...props} onChange={multipleOnChange} />;
};

TestOnChangeParentUpdate.play = async ({ canvasElement }) => {
  const { getByRole } = within(canvasElement);
  await expect(multipleOnChange).not.toBeCalled();
  const nextButton = getByRole('button', { name: 'Next Slide' });
  const previousButton = getByRole('button', { name: 'Previous Slide' });
  await userEvent.click(nextButton);
  await sleep(1000);
  await expect(multipleOnChange).toBeCalledWith(1);
  await userEvent.click(previousButton);
  await sleep(1000);
  await expect(multipleOnChange).toBeCalledWith(0);
  await expect(multipleOnChange).toBeCalledTimes(2);
};

const controlledOnChange = jest.fn();
export const TestControlledCarousel: StoryFn<typeof CarouselComponent> = (
  props,
): React.ReactElement => {
  const [activeIndex, setActiveIndex] = React.useState(3);

  return (
    <Box>
      <Text>Current slide: {activeIndex}</Text>
      <Button
        onClick={() => {
          setActiveIndex(5);
        }}
      >
        Change slide
      </Button>
      <BasicCarousel
        {...props}
        visibleItems={1}
        activeSlide={activeIndex}
        onChange={(index) => {
          console.log('index', index);
          setActiveIndex(index);
          controlledOnChange(index);
        }}
      />
    </Box>
  );
};

TestControlledCarousel.play = async ({ canvasElement }) => {
  const { getByText, getByRole } = within(canvasElement);
  await sleep(1000);
  await expect(controlledOnChange).not.toBeCalled();
  await expect(getByText('Current slide: 3')).toBeInTheDocument();
  const goToBtn = getByRole('button', { name: 'Change slide' });
  await userEvent.click(goToBtn);
  await expect(getByText('Current slide: 5')).toBeInTheDocument();
  await sleep(1000);
  await expect(controlledOnChange).not.toBeCalled();
  const nextButton = getByRole('button', { name: 'Next Slide' });
  await userEvent.click(nextButton);
  await sleep(1000);
  await expect(controlledOnChange).toBeCalledWith(6);
  await expect(controlledOnChange).toBeCalledTimes(1);
};

export default {
  title: 'Components/Interaction Tests/Carousel',
  component: CarouselComponent,
  parameters: {
    controls: {
      disable: true,
    },
    a11y: { disable: true },
    essentials: { disable: true },
    actions: { disable: true },
  },
};

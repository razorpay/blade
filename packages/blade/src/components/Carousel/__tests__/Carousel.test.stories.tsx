/* eslint-disable import/no-extraneous-dependencies */
import type { StoryFn } from '@storybook/react';
import { within, userEvent } from '@storybook/testing-library';
import { expect, jest } from '@storybook/jest';
import type { Mock } from 'jest-mock';
import type { CarouselProps } from '../';
import { Carousel as CarouselComponent } from '../';
import { CarouselExample } from '../Carousel.stories';
import { Box } from '~components/Box';

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
      onChange={() => {
        console.log(1);
        onChange?.();
      }}
      shouldAddStartEndSpacing
      carouselItemWidth="300px"
    />
  );
};

TestAutofit.play = async ({ canvasElement }) => {
  await sleep(1000);
  const { getByLabelText, queryByRole } = within(canvasElement);
  await expect(onChange).not.toBeCalled();
  // const lastIndicatorButton = getByLabelText('Slide 7');
  // await userEvent.click(lastIndicatorButton);
  // await sleep(1000);
  // const nextButton = queryByRole('button', { name: 'Next Slide' });
  // await expect(nextButton).toBeNull();
  // const firstIndicatorButton = getByLabelText('Slide 1');
  // await userEvent.click(firstIndicatorButton);
  // await sleep(1000);
  // const previousButton = queryByRole('button', { name: 'Previous Slide' });
  // await expect(previousButton).toBeNull();
  // await expect(onChange).toBeCalledTimes(2);
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

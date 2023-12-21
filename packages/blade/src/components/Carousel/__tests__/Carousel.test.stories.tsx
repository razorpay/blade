/* eslint-disable import/no-extraneous-dependencies */
import type { ComponentStory } from '@storybook/react';
import { within, userEvent } from '@storybook/testing-library';
import { expect, jest } from '@storybook/jest';
import type { Mock } from 'jest-mock';
import { INITIAL_VIEWPORTS, MINIMAL_VIEWPORTS } from '@storybook/addon-viewport';
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

export const TestCarouselOnChange: ComponentStory<typeof CarouselComponent> = (
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
};

export const TestIndicatorButton: ComponentStory<typeof CarouselComponent> = (
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
};

export const TestStartOverAfterStartEnd: ComponentStory<typeof CarouselComponent> = (
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
};

export const TestAutoPlay: ComponentStory<typeof CarouselComponent> = (
  props,
): React.ReactElement => {
  onChange = jest.fn();
  return <BasicCarousel {...props} autoPlay visibleItems={2} onChange={onChange} />;
};

// this has issues on cli, debug this
TestAutoPlay.play = async ({ canvasElement }) => {
  const { getByRole } = within(canvasElement);
  await sleep(7000);
  await expect(onChange).toBeCalledWith(1);
  await expect(getByRole('tab', { selected: true })).toHaveAccessibleName('Slide 3');
};

export const TestAutofit: ComponentStory<typeof CarouselComponent> = (
  props,
): React.ReactElement => {
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
  const { getByLabelText, queryByRole } = within(canvasElement);
  const lastIndicatorButton = getByLabelText('Slide 7');
  await userEvent.click(lastIndicatorButton);
  await sleep(1000);
  const nextButton = queryByRole('button', { name: 'Next Slide' });
  await expect(nextButton).toBeNull();
  const firstIndicatorButton = getByLabelText('Slide 1');
  await userEvent.click(firstIndicatorButton);
  await sleep(1000);
  const previousButton = queryByRole('button', { name: 'Previous Slide' });
  await expect(previousButton).toBeNull();
};

export const TestAutoPlayPause: ComponentStory<typeof CarouselComponent> = (
  props,
): React.ReactElement => {
  console.log({ INITIAL_VIEWPORTS, MINIMAL_VIEWPORTS });
  onChange = jest.fn();
  return <BasicCarousel {...props} autoPlay visibleItems={2} onChange={onChange} />;
};

TestAutoPlayPause.play = async ({ canvasElement }) => {
  const { getByText } = within(canvasElement);
  const slide = getByText(/Acquire Customers From New Customer Segments/);
  await userEvent.hover(slide);
  await sleep(7000);
  await expect(onChange).toBeCalledTimes(0);
};

// TestOverlayOnMobile.parameters = {
//   viewport: {
//     defaultViewport: 'iPhone6',
//   },
// };

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

/* eslint-disable import/no-extraneous-dependencies */
import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { CarouselTestimonialTemplate } from '../Carousel.stories';

export const BasicCarousel = CarouselTestimonialTemplate.bind({});
BasicCarousel.play = async ({ canvasElement }) => {
  const { getByRole } = within(canvasElement);

  const nextButton = getByRole('button', { name: 'Next Slide' });
  const previousButton = getByRole('button', { name: 'Previous Slide' });
  await userEvent.click(nextButton);
  await userEvent.click(previousButton);

  // const getTask = (name) => canvas.findByRole('listitem', { name });

  // // Find the task to pin
  // const itemToPin = await getTask('Export logo');

  // // Find the pin button
  // const pinButton = await findByRole(itemToPin, 'button', { name: 'pin' });

  // // Click the pin button
  // await userEvent.click(pinButton);

  // // Check that the pin button is now a unpin button
  // const unpinButton = within(itemToPin).getByRole('button', { name: 'unpin' });
  await expect(nextButton).toBeInTheDocument();
};

export default {
  title: 'Components/Interaction Tests/Carousel',
  component: BasicCarousel,
  parameters: {
    controls: {
      disable: true,
    },
    a11y: { disable: true },
    essentials: { disable: true },
    actions: { disable: true },
  },
};

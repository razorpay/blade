import type { ComponentStory, Meta } from '@storybook/react';

import type { CarouselProps } from './Carousel';
import { Carousel as CarouselComponent } from './Carousel';
import { Box } from '~components/Box';

const meta: Meta<CarouselProps> = {
  title: 'Components/Carousel',
  component: CarouselComponent,
};

const CarouselTemplate: ComponentStory<typeof CarouselComponent> = () => {
  return (
    <Box padding="spacing.11" backgroundColor="surface.background.level1.lowContrast">
      <CarouselComponent variant="stroked" />
    </Box>
  );
};

export const Carousel = CarouselTemplate.bind({});
Carousel.storyName = 'Carousel';

export default meta;

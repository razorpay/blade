import type { ComponentStory, Meta } from '@storybook/react';

import type { CarouselProps } from './Carousel';
import { Carousel as CarouselComponent } from './Carousel';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';

const meta: Meta<CarouselProps> = {
  title: 'Components/Carousel',
  component: CarouselComponent,
};

const CarouselTemplate: ComponentStory<typeof CarouselComponent> = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      marginTop="spacing.8"
      padding="spacing.5"
      gap="spacing.8"
      backgroundColor="surface.background.level1.lowContrast"
    >
      <CarouselComponent visibleItems={2} navigationButtonPosition="side" bleed="right" />

      <Text>Bleed: none</Text>
      <CarouselComponent visibleItems={1} navigationButtonPosition="bottom" bleed="none" />
      <CarouselComponent visibleItems={2} navigationButtonPosition="side" bleed="none" />
      <CarouselComponent
        visibleItems={2}
        showIndicators={false}
        navigationButtonPosition="bottom"
        bleed="none"
      />
      <CarouselComponent
        visibleItems={2}
        showIndicators={false}
        navigationButtonPosition="side"
        bleed="none"
      />
      <Text>bleed nav: side</Text>
      <CarouselComponent visibleItems={2} navigationButtonPosition="side" bleed="none" />
      <CarouselComponent visibleItems={2} bleed="none" variant="stroked" />
      <CarouselComponent visibleItems={3} bleed="none" variant="stroked" />
      <Text>Bleed: right</Text>
      <CarouselComponent visibleItems={1} bleed="right" variant="stroked" />
      <CarouselComponent visibleItems={2} bleed="right" variant="stroked" />
      <CarouselComponent visibleItems={3} bleed="right" variant="stroked" />
      <Text>Bleed: left</Text>
      <CarouselComponent visibleItems={1} bleed="left" variant="stroked" />
      <CarouselComponent visibleItems={2} bleed="left" variant="stroked" />
      <CarouselComponent visibleItems={3} bleed="left" variant="stroked" />
      <Text>Bleed: both</Text>
      <CarouselComponent visibleItems={1} bleed="both" variant="stroked" />
      <CarouselComponent visibleItems={2} bleed="both" variant="stroked" />
      <CarouselComponent visibleItems={3} bleed="both" variant="stroked" />
    </Box>
  );
};

export const Carousel = CarouselTemplate.bind({});
Carousel.storyName = 'Carousel';

export default meta;

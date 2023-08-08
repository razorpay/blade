import type { ComponentStory, Meta } from '@storybook/react';
import type { CarouselProps } from './types';
import { Carousel as CarouselComponent } from './Carousel';
import { CarouselItem } from './CarouselItem';
import { Box } from '~components/Box';
import { Heading, Text } from '~components/Typography';
import { Card, CardBody } from '~components/Card';
import { Button } from '~components/Button';

const meta: Meta<CarouselProps> = {
  title: 'Components/Carousel',
  component: CarouselComponent,
};

const TestimonialCard = ({ index }): React.ReactElement => {
  return (
    <Card>
      <CardBody>
        <Box display="flex" gap="spacing.4" flexDirection="column">
          <Box>
            <Heading>{index} - I can now collect payments from my clients instantly</Heading>
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
          <Button>Hello world</Button>
        </Box>
      </CardBody>
    </Card>
  );
};

const CarouselExample = (props: CarouselProps): React.ReactElement => {
  return (
    <CarouselComponent {...props}>
      <CarouselItem>
        <TestimonialCard index={0} />
      </CarouselItem>
      <CarouselItem>
        <TestimonialCard index={1} />
      </CarouselItem>
      <CarouselItem>
        <TestimonialCard index={2} />
      </CarouselItem>
      <CarouselItem>
        <TestimonialCard index={3} />
      </CarouselItem>
      <CarouselItem>
        <TestimonialCard index={4} />
      </CarouselItem>
      <CarouselItem>
        <TestimonialCard index={5} />
      </CarouselItem>
      <CarouselItem>
        <TestimonialCard index={6} />
      </CarouselItem>
      <CarouselItem>
        <TestimonialCard index={7} />
      </CarouselItem>
      <CarouselItem>
        <TestimonialCard index={8} />
      </CarouselItem>
      <CarouselItem>
        <TestimonialCard index={9} />
      </CarouselItem>
    </CarouselComponent>
  );
};

const CarouselTemplate: ComponentStory<typeof CarouselComponent> = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      marginTop="spacing.0"
      padding="spacing.0"
      gap="spacing.0"
      overflow="visible"
      // backgroundColor="surface.background.level1.lowContrast"
    >
      {/* <Text>v1: Responsive: N/A + auto bleed + shouldAddStartEndPadding</Text> */}
      <CarouselExample carouselItemWidth="90%" />
    </Box>
  );
};

export const Carousel = CarouselTemplate.bind({});
Carousel.storyName = 'Carousel';

export default meta;

/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { Meta } from '@storybook/react';
import React from 'react';
import type { Step, TourProps } from './types';
import type { Rect } from './TourMask';
import { TourMask } from './TourMask';
import { TourStep } from './TourStep.web';
import { Tour } from '.';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';

export default {
  title: 'Components/Tour',
  component: Tour,
} as Meta<TourProps>;

const steps: Step[] = [
  {
    name: 'step-1',
    content: () => {
      return <Text>Step 1</Text>;
    },
    placement: 'bottom',
  },
  {
    name: 'step-2',
    content: () => {
      return <Text>Step 2</Text>;
    },
    placement: 'bottom',
  },
  {
    name: 'step-3',
    content: () => {
      return <Text>Step 3</Text>;
    },
    placement: 'bottom',
  },
];

const TourTemplate = () => {
  const [activeStep, setActiveStep] = React.useState(0);

  return (
    <Box>
      <Button>Open</Button>
      <Tour
        steps={steps}
        activeStep={0}
        onStepChange={(step) => {
          setActiveStep(step);
        }}
      >
        <Box display="flex" gap="spacing.4">
          <TourStep name="step-1">
            <Box padding="spacing.2" backgroundColor="brand.gray.500.highContrast">
              Hello
            </Box>
          </TourStep>

          <TourStep name="step-2">
            <Box padding="spacing.2" backgroundColor="brand.gray.500.highContrast">
              World
            </Box>
          </TourStep>

          <TourStep name="step-3">
            <Button>Highlight me</Button>
          </TourStep>
        </Box>
      </Tour>
    </Box>
  );
};

export const Default = TourTemplate.bind({});
Default.storyName = 'Default';

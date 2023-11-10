/* eslint-disable blade/no-cross-platform-imports */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { SpotlightPopoverTour } from '../Tour';
import { SpotlightPopoverTourStep } from '../TourStep.web';
import type { SpotlightPopoverStepRenderProps, SpotlightPopoverTourSteps } from '../types';
import { SpotlightPopoverTourFooter } from '../TourFooter.web';
import { Button } from '~components/Button';
import renderWithSSR from '~utils/testing/renderWithSSR.web';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';

const nextButtonText = 'Next';
const prevButtonText = 'Prev';
const doneButtonText = 'Done';

const CustomFooter = ({
  activeStep,
  totalSteps,
  goToNext,
  goToPrevious,
  stopTour,
}: SpotlightPopoverStepRenderProps) => {
  const isLast = activeStep === totalSteps - 1;
  const isFirst = activeStep === 0;
  return (
    <SpotlightPopoverTourFooter
      activeStep={activeStep}
      totalSteps={totalSteps}
      actions={{
        primary: isLast
          ? {
              text: doneButtonText,
              onClick: stopTour,
            }
          : {
              text: nextButtonText,
              onClick: goToNext,
            },
        secondary: isFirst
          ? undefined
          : {
              text: prevButtonText,
              onClick: goToPrevious,
            },
      }}
    />
  );
};

const openTourButtonText = 'Open Tour';
const steps: SpotlightPopoverTourSteps = [
  {
    name: 'step-1',
    content: () => <Text>Step 1</Text>,
    placement: 'bottom',
    footer: CustomFooter,
  },
  {
    name: 'step-2',
    content: () => <Text>Step 2</Text>,
    placement: 'bottom',
    footer: CustomFooter,
  },
];
const BasicTourExample = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Box>
      <Button
        marginBottom="spacing.9"
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
      >
        {openTourButtonText}
      </Button>
      <SpotlightPopoverTour
        steps={steps}
        isOpen={isOpen}
        activeStep={activeStep}
        onFinish={() => {
          setActiveStep(0);
          setIsOpen(false);
        }}
        onOpenChange={({ isOpen }) => {
          setIsOpen(isOpen);
        }}
        onStepChange={(step) => {
          setActiveStep(step);
        }}
      >
        <Box>Some other content inside</Box>
        <SpotlightPopoverTourStep name="step-1">
          <Box>
            <Text>Trigger 1</Text>
          </Box>
        </SpotlightPopoverTourStep>
        <SpotlightPopoverTourStep name="step-2">
          <Box>
            <Text>Trigger 2</Text>
          </Box>
        </SpotlightPopoverTourStep>
      </SpotlightPopoverTour>
    </Box>
  );
};

describe('<Tour />', () => {
  it('should render Tour ssr', () => {
    const { baseElement } = renderWithSSR(<BasicTourExample />);
    expect(baseElement).toMatchSnapshot();
  });
});

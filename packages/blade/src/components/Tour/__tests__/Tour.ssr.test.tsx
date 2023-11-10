/* eslint-disable blade/no-cross-platform-imports */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { Tour } from '../Tour';
import { TourStep } from '../TourStep.web';
import type { StepRenderProps, TourSteps } from '../types';
import { TourFooter } from '../TourFooter.web';
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
}: StepRenderProps) => {
  const isLast = activeStep === totalSteps - 1;
  const isFirst = activeStep === 0;
  return (
    <TourFooter
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
const steps: TourSteps = [
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
      <Tour
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
        <TourStep name="step-1">
          <Box>
            <Text>Trigger 1</Text>
          </Box>
        </TourStep>
        <TourStep name="step-2">
          <Box>
            <Text>Trigger 2</Text>
          </Box>
        </TourStep>
      </Tour>
    </Box>
  );
};

describe('<Tour />', () => {
  it('should render Tour ssr', () => {
    const { baseElement } = renderWithSSR(<BasicTourExample />);
    expect(baseElement).toMatchSnapshot();
  });
});

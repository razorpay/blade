export const BasicExample = `
  import React from 'react';
  import { 
    SpotlightPopoverTour,
    SpotlightPopoverTourStep,
    SpotlightPopoverTourFooter,
    Box,
    Text,
    Button
  } from '@razorpay/blade/components';
  import type {
    SpotlightPopoverStepRenderProps,
    SpotlightPopoverTourSteps,
  } from '@razorpay/blade/components';

  const CustomTourFooter = ({
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
                text: 'Done',
                onClick: stopTour,
              }
            : {
                text: 'Next',
                onClick: goToNext,
              },
          secondary: isFirst
            ? undefined
            : {
                text: 'Prev',
                onClick: goToPrevious,
              },
        }}
      />
    );
  };

  const steps: SpotlightPopoverTourSteps = [
    {
      name: 'step-1',
      title: 'Step 1',
      content: () => {
        return (
          <Box>
            <Text>This is step 1</Text>
          </Box>
        );
      },
      placement: 'top',
      footer: CustomTourFooter,
    },
    {
      name: 'step-2',
      title: 'Step 2',
      content: () => {
        return (
          <Box>
            <Text>This is step 2</Text>
          </Box>
        );
      },
      placement: 'bottom',
      footer: CustomTourFooter,
    },
  ];

  function App() {
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
          {isOpen ? 'Tour In Progress' : 'Start Tour'}
        </Button>
        <SpotlightPopoverTour
          steps={steps}
          isOpen={isOpen}
          activeStep={activeStep}
          onFinish={() => {
            console.log('finished');
            setActiveStep(0);
            setIsOpen(false);
          }}
          onOpenChange={({ isOpen }) => {
            console.log('open change', isOpen);
            setIsOpen(isOpen);
          }}
          onStepChange={(step) => {
            console.log('step change', step);
            setActiveStep(step);
          }}
        >
          <Box width="100%" display="flex" gap="spacing.4">
            <SpotlightPopoverTourStep name="step-1">
              <Box padding="spacing.4" backgroundColor="interactive.border.gray.faded">
                <Text>Step 1 </Text>
              </Box>
            </SpotlightPopoverTourStep>
            <SpotlightPopoverTourStep name="step-2">
              <Box padding="spacing.4" backgroundColor="interactive.border.gray.faded">
                <Text>Step 2 </Text>
              </Box>
            </SpotlightPopoverTourStep>
          </Box>
        </SpotlightPopoverTour>
      </Box>
    );
  }

  export default App;
`;

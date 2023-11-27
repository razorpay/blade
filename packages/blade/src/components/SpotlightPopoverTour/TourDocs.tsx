import React from 'react';
import { TourTemplate } from './Tour.stories';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Text, Title } from '~components/Typography';
import { Sandbox, SandboxHighlighter } from '~utils/storybook/Sandbox/SandpackEditor';
import { Box } from '~components/Box';
import { ArgsTable } from '~utils/storybook/ArgsTable';

const TourDocs = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      showDefaultExample={false}
      argTableComponent={TourTemplate}
      componentName="SpotlightPopoverTour"
      componentDescription="The SpotlightPopoverTour component is used to provide context as well as enable users to take certain actions on it. These are used to highlight a new feature or provide a guided tour to a new user."
      figmaURL={{
        paymentTheme:
          'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=63871%3A13263&mode=dev',
        bankingTheme:
          'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=63871%3A13263&mode=dev',
      }}
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
        import React from 'react';
        import { 
          SpotlightPopoverTour,
          SpotlightPopoverTourStep,
          SpotlightPopoverTourFooter,
          Box,
          Text,
          Button
        } from '@razorpay/blade/components';
        
        function App(): React.ReactElement {
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
                    <Box padding="spacing.4" backgroundColor="brand.gray.400.lowContrast">
                      <Text>Step 1 </Text>
                    </Box>
                  </SpotlightPopoverTourStep>
                  <SpotlightPopoverTourStep name="step-2">
                    <Box padding="spacing.4" backgroundColor="brand.gray.400.lowContrast">
                      <Text>Step 2 </Text>
                    </Box>
                  </SpotlightPopoverTourStep>
                </Box>
              </SpotlightPopoverTour>
            </Box>
          );
        }

        export default App;
      `}
      </Sandbox>
      <Title>iOS Safari Specific Setup</Title>
      <Text marginTop="spacing.5">
        When using BottomSheet or SpotlightPopoverTour, Make sure to set a width/height to the
        `body` otherwise when they open, the page will get clipped. This happens due to a bug in iOS
        safari where it won't compute the height of the body correctly.
      </Text>
      <SandboxHighlighter showLineNumbers={false} theme="light">
        {`
          body {
            width: 100%;
            height: 100%;
          }
        `}
      </SandboxHighlighter>
      <Title>Examples</Title>
      <Text marginY="spacing.5">
        To see examples properly, switch to the{' '}
        <Text as="span" weight="bold">
          story view
        </Text>
      </Text>

      <Text>API</Text>
      <Box id="actionlistitemtext">
        <Title size="small">SpotlightPopoverTour</Title>
      </Box>
    </StoryPageWrapper>
  );
};

export { TourDocs };

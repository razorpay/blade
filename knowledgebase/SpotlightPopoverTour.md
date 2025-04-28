## Component Name

SpotlightPopoverTour

## Description

The SpotlightPopoverTour component is used to provide context as well as enable users to take certain actions on it. These are used to highlight a new feature or provide a guided tour to a new user. The component can spotlight specific UI elements on the page and present a series of steps with descriptions.

## TypeScript Types

Below are the TypeScript types that define the props that the SpotlightPopoverTour and its subcomponents accept:

```typescript
// Main component props
type SpotlightPopoverTourProps = {
  /**
   * Array of steps to be rendered
   *
   * The order of the steps will be the order in which they are rendered depending on the `activeStep` prop
   */
  steps: SpotlightPopoverTourSteps;
  /**
   * Whether the tour is visible or not
   */
  isOpen: boolean;
  /**
   * Callback when the tour is opened or closed
   */
  onOpenChange?: ({ isOpen }: { isOpen: boolean }) => void;
  /**
   * Callback which fires when the `stopTour` method is called from the `steps` array
   */
  onFinish?: () => void;
  /**
   * Callback when the active step changes
   */
  onStepChange?: (step: number) => void;
  /**
   * Active step to be rendered
   */
  activeStep: number;
  children: React.ReactNode;
};

// Tour step props
type SpotlightPopoverTourStepProps = {
  name: string;
  children: React.ReactNode;
};

// Tour step definition
type Step = {
  /**
   * Unique identifier for the tour step
   */
  name: string;
  /**
   * Content of the Popover
   */
  content: (props: SpotlightPopoverStepRenderProps) => React.ReactElement;
  /**
   * Footer content
   */
  footer?: (props: SpotlightPopoverStepRenderProps) => React.ReactNode;
  /**
   * Popover title
   */
  title?: string;
  /**
   * Leading content placed before the title
   *
   * Can be any blade icon or asset.
   */
  titleLeading?: React.ReactNode;
  /**
   * Placement of Popover
   * @default "top"
   */
  placement?: UseFloatingOptions['placement'];
};

// Array of Step objects
type SpotlightPopoverTourSteps = Step[];

// Props passed to render functions
type SpotlightPopoverStepRenderProps = {
  /**
   * Go to a specific step
   */
  goToStep: (step: number) => void;
  /**
   * Go to the next step
   */
  goToNext: () => void;
  /**
   * Go to the previous step
   */
  goToPrevious: () => void;
  /**
   * Stop the tour
   *
   * This will call the `onFinish` callback
   */
  stopTour: () => void;
  /**
   * Current active step (zero based index)
   */
  activeStep: number;
  /**
   * Total number of steps
   */
  totalSteps: number;
};
```

## Example

### Basic Tour Example

```jsx
import { useState } from 'react';
import {
  SpotlightPopoverTour,
  SpotlightPopoverTourStep,
  SpotlightPopoverTourFooter,
  Box,
  Button,
  Text,
  Card,
  CardBody,
  InfoIcon,
  Amount,
} from '@razorpay/blade/components';

function BasicTourExample() {
  const [activeStep, setActiveStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Custom footer component that can control the tour
  const CustomTourFooter = ({ activeStep, totalSteps, goToNext, goToPrevious, stopTour }) => {
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

  // Define the tour steps
  const steps = [
    {
      name: 'refunds-step',
      title: 'Overview of Refunds',
      content: () => (
        <Box>
          <Text color="surface.text.gray.subtle">
            You can issue refunds for various reasons, like when a customer returns a product or
            cancels a service.
          </Text>
          <Text color="surface.text.gray.subtle" marginTop="spacing.2">
            You can also issue partial refunds - for example, if a customer purchased multiple
            items.
          </Text>
        </Box>
      ),
      placement: 'bottom',
      footer: CustomTourFooter,
    },
    {
      name: 'disputes-step',
      title: 'Overview of Disputes',
      content: () => (
        <Box>
          <Text color="surface.text.gray.subtle">
            Disputes are raised by customers when they have a problem with a transaction.
          </Text>
        </Box>
      ),
      placement: 'bottom',
      footer: CustomTourFooter,
    },
    {
      name: 'status-step',
      title: 'Dispute Statuses',
      content: () => (
        <Text color="surface.text.gray.subtle">
          Disputes which are open or under review will be shown here. You can also review them by
          clicking on the button.
        </Text>
      ),
      placement: 'bottom',
      footer: CustomTourFooter,
    },
  ];

  return (
    <Box>
      <Button
        marginBottom="spacing.9"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {isOpen ? 'Tour In Progress' : 'Start Tour'}
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
        <Box
          display="flex"
          flexDirection={{ base: 'column', m: 'row' }}
          gap="spacing.4"
          alignItems="stretch"
        >
          <SpotlightPopoverTourStep name="refunds-step">
            <Box width="100%">
              <Card width="100%" height="100%">
                <CardBody>
                  <Box display="flex" flexDirection="column" gap="spacing.3">
                    <Box display="flex" alignItems="center" gap="spacing.3">
                      <Text>Refunds</Text>
                      <InfoIcon color="surface.icon.gray.muted" />
                    </Box>
                    <Amount value={40000} type="heading" size="large" />
                    <Text color="surface.text.gray.muted">3 Processed</Text>
                  </Box>
                </CardBody>
              </Card>
            </Box>
          </SpotlightPopoverTourStep>

          <SpotlightPopoverTourStep name="disputes-step">
            <Box width="100%">
              <Card width="100%" height="100%">
                <CardBody>
                  <Box display="flex" flexDirection="column" gap="spacing.3">
                    <Box display="flex" alignItems="center" gap="spacing.3">
                      <Text>Disputes</Text>
                      <InfoIcon color="interactive.icon.gray.muted" />
                    </Box>
                    <Amount value={0} type="heading" size="large" />

                    <SpotlightPopoverTourStep name="status-step">
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        gap="spacing.3"
                      >
                        <Text color="surface.text.gray.muted">0 Open | 0 Under review</Text>
                        <Button size="small" variant="tertiary">
                          Review
                        </Button>
                      </Box>
                    </SpotlightPopoverTourStep>
                  </Box>
                </CardBody>
              </Card>
            </Box>
          </SpotlightPopoverTourStep>
        </Box>
      </SpotlightPopoverTour>
    </Box>
  );
}
```

### Interruptible Tour Example

```jsx
import { useState } from 'react';
import {
  SpotlightPopoverTour,
  SpotlightPopoverTourStep,
  SpotlightPopoverTourFooter,
  Box,
  Button,
  Text,
  Code,
} from '@razorpay/blade/components';

function InterruptibleTourExample() {
  const [activeStep, setActiveStep] = useState(0);
  const [isTourSkipped, setIsTourSkipped] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Custom footer with skip functionality
  const InterruptibleTourFooter = ({
    activeStep,
    goToNext,
    goToStep,
    stopTour,
    goToPrevious,
    totalSteps,
  }) => {
    const isLast = activeStep === totalSteps - 1;
    const isFirst = activeStep === 0;

    return (
      <Box display="flex" justifyContent="space-between" alignItems="center" gap="spacing.7">
        <Text size="small" weight="semibold">
          {activeStep + 1} / {totalSteps}
        </Text>
        <Box display="flex" gap="spacing.4">
          <Button
            size="small"
            variant="tertiary"
            onClick={() => {
              setIsTourSkipped(true);
              goToStep(totalSteps - 1);
            }}
          >
            Skip Tour
          </Button>
          {!isFirst && (
            <Button
              size="small"
              variant="secondary"
              onClick={() => {
                goToPrevious();
              }}
            >
              Prev
            </Button>
          )}
          {isLast ? (
            <Button
              size="small"
              onClick={() => {
                stopTour();
              }}
            >
              Done
            </Button>
          ) : (
            <Button
              size="small"
              onClick={() => {
                goToNext();
              }}
            >
              Next
            </Button>
          )}
        </Box>
      </Box>
    );
  };

  // Define steps dynamically based on state
  const steps = [
    {
      name: 'step-1',
      title: 'Step 1',
      content: () => (
        <Box>
          <Text color="surface.text.gray.subtle">This is step 1, press skip</Text>
        </Box>
      ),
      placement: 'top',
      footer: (props) => <InterruptibleTourFooter {...props} />,
    },
    {
      name: 'step-2',
      title: 'Step 2',
      content: () => (
        <Box>
          <Text color="surface.text.gray.subtle">This is step 2</Text>
        </Box>
      ),
      placement: 'bottom',
      footer: (props) => <InterruptibleTourFooter {...props} />,
    },
    // The final step changes based on whether user skipped or completed
    isTourSkipped
      ? {
          name: 'final-step',
          title: 'Tour Incomplete!',
          content: () => (
            <Text color="surface.text.gray.subtle">
              We recommend that you complete the tour to make the most of the new features. You can
              find it here when you want to take it.
            </Text>
          ),
          footer: ({ stopTour }) => (
            <Button
              size="small"
              onClick={() => {
                stopTour();
              }}
            >
              Got it
            </Button>
          ),
        }
      : {
          name: 'final-step',
          title: 'Tour Complete!',
          content: () => (
            <Text color="surface.text.gray.subtle">
              You have completed the tour. You can find it here when you want to take it.
            </Text>
          ),
          footer: ({ stopTour }) => (
            <Button
              size="small"
              onClick={() => {
                stopTour();
              }}
            >
              Thanks.
            </Button>
          ),
        },
  ];

  return (
    <Box>
      <SpotlightPopoverTour
        steps={steps}
        isOpen={isOpen}
        activeStep={activeStep}
        onFinish={() => {
          setIsOpen(false);
          setIsTourSkipped(false);
          setActiveStep(0);
        }}
        onOpenChange={({ isOpen }) => {
          setIsOpen(isOpen);
        }}
        onStepChange={(step) => {
          setActiveStep(step);
        }}
      >
        <SpotlightPopoverTourStep name="final-step">
          <Button
            marginBottom="spacing.5"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            {isOpen ? 'Tour In Progress' : 'Start Tour'}
          </Button>
        </SpotlightPopoverTourStep>

        <Text>
          You can create complex flows like interruptible tours by dynamically modifying the steps
          array, and changing its contents.
        </Text>

        <Text>
          Compose and make use of methods provided by the tour component like{' '}
          <Code size="medium">stopTour</Code>, <Code size="medium">goToStep</Code>,{' '}
          <Code size="medium">goToNext</Code> etc to control the behavior of the current tour step
        </Text>

        <Box display="flex" gap="spacing.4" alignItems="stretch" marginTop="spacing.6">
          <SpotlightPopoverTourStep name="step-1">
            <Box padding="spacing.4" backgroundColor="surface.background.gray.intense">
              Step 1
            </Box>
          </SpotlightPopoverTourStep>

          <SpotlightPopoverTourStep name="step-2">
            <Box padding="spacing.4" backgroundColor="surface.background.gray.intense">
              Step 2
            </Box>
          </SpotlightPopoverTourStep>
        </Box>
      </SpotlightPopoverTour>
    </Box>
  );
}
```

/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { Meta, ComponentStory } from '@storybook/react';
import React from 'react';
import { Title } from '@storybook/addon-docs';
import type { StepRenderProps, TourProps, TourSteps } from './types';
import { TourStep } from './TourStep';
import { Tour } from '.';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import { Code, Text } from '~components/Typography';
import { InfoIcon } from '~components/Icons';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Sandbox } from '~utils/storybook/Sandbox';
import iconMap from '~components/Icons/iconMap';
import { Card, CardBody } from '~components/Card';
import { Amount } from '~components/Amount';
import { Link } from '~components/Link';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Tour"
      componentDescription="The Tour component is used to provide context as well as enable users to take certain actions on it. These are used to highlight a new feature or provide a guided tour to a new user."
      figmaURL={{
        paymentTheme:
          'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=63871%3A13263&mode=dev',
        bankingTheme:
          'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=63871%3A13263&mode=dev',
      }}
    >
      <Title>Usage</Title>
      <Sandbox showConsole>
        {`
        import { Tour, Button } from '@razorpay/blade/components'
        
        function App(): React.ReactElement {
          return (
            <Popover content="Hello world" placement="bottom">
              <Button>Hover over me</Button>
            </Popover>
          )
        }

        export default App;
      `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

const propsCategory = {
  TOUR: 'Tour Props',
  TOUR_STEPS: 'Single Tour Step Props',
};

type StoryControlProps = TourProps & {
  tourStepsTitle: TourSteps[number]['title'];
  tourStepsContent: TourSteps[number]['content'];
  tourStepsPlacement: TourSteps[number]['placement'];
  tourStepsFooter: TourSteps[number]['footer'];
  tourStepsTitleLeading: TourSteps[number]['titleLeading'];
  tourStepsName: TourSteps[number]['name'];
};

export default {
  title: 'Components/Tour',
  component: Tour,
  argTypes: {
    tourStepsTitle: {
      name: 'steps[0].title',
      type: 'string',
      defaultValue: 'Overview of Refunds',
      table: { category: propsCategory.TOUR_STEPS },
    },
    tourStepsContent: {
      name: 'steps[0].content',
      type: 'string',
      defaultValue:
        'You can  issue refunds for various reasons, like when a customer returns a product or cancels a service.',
      table: { category: propsCategory.TOUR_STEPS },
    },
    tourStepsPlacement: {
      name: 'steps[0].placement',
      defaultValue: 'bottom',
      control: {
        type: 'select',
        options: [
          'bottom',
          'top',
          'left',
          'right',
          'bottom-start',
          'bottom-end',
          'top-start',
          'top-end',
          'left-start',
          'left-end',
          'right-start',
          'right-end',
        ],
      },
      table: { category: propsCategory.TOUR_STEPS },
    },
    tourStepsName: {
      name: 'steps[0].name',
      type: 'string',
      defaultValue: 'step-1',
      control: {
        disable: true,
      },
      table: { category: propsCategory.TOUR_STEPS },
    },
    tourStepsTitleLeading: {
      name: 'steps[0].titleLeading',
      control: {
        disable: true,
      },
      table: { category: propsCategory.TOUR_STEPS },
    },
    tourStepsFooter: {
      name: 'steps[0].footer',
      control: {
        disable: true,
      },
      table: { category: propsCategory.TOUR_STEPS },
    },
    children: {
      control: {
        disable: true,
      },
      table: { category: propsCategory.TOUR },
    },
    onFinish: {
      control: {
        disable: true,
      },
      table: { category: propsCategory.TOUR },
    },
    onOpenChange: {
      control: {
        disable: true,
      },
      table: { category: propsCategory.TOUR },
    },
    onStepChange: {
      control: {
        disable: true,
      },
      table: { category: propsCategory.TOUR },
    },
    steps: {
      control: {
        disable: true,
      },
      table: { category: propsCategory.TOUR },
    },
    isOpen: {
      control: {
        disable: true,
      },
      table: { category: propsCategory.TOUR },
    },
    activeStep: {
      control: {
        disable: true,
      },
      table: { category: propsCategory.TOUR },
    },
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<StoryControlProps>;

const Center = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <Box width="100%" height="70vh" display="flex" alignItems="center" justifyContent="center">
      {children}
    </Box>
  );
};

const TourFooter = ({
  activeStep,
  goToNext,
  stopTour,
  goToPrevious,
  totalSteps,
}: StepRenderProps): React.ReactElement => {
  const isLast = activeStep === totalSteps - 1;
  const isFirst = activeStep === 0;
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" gap="spacing.7">
      <Text size="small" weight="bold">
        {activeStep + 1} / {totalSteps}
      </Text>
      <Box display="flex" gap="spacing.4">
        {!isFirst ? (
          <Button
            size="small"
            variant="secondary"
            onClick={() => {
              goToPrevious();
            }}
          >
            Prev
          </Button>
        ) : null}
        {isLast ? (
          <Button
            size="small"
            onClick={() => {
              // done
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

const TourTemplate: ComponentStory<(props: StoryControlProps) => React.ReactElement> = (args) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(false);
  const steps = React.useMemo<TourSteps>(
    () => [
      {
        name: 'step-1',
        title: args.tourStepsTitle,
        content: () => {
          return (
            <Box>
              <Text>{args.tourStepsContent}</Text>
              <Text marginTop="spacing.2">
                You can also issue partial refunds - for example, if a customer purchased multiple
                items.
              </Text>
            </Box>
          );
        },
        placement: args.tourStepsPlacement,
        footer: TourFooter,
      },
      {
        name: 'step-2',
        title: 'Overview of Disputes',
        content: () => {
          return (
            <Box>
              <Text>
                Disputes are raised by customers when they have a problem with a transaction.
              </Text>
            </Box>
          );
        },
        placement: 'bottom',
        footer: TourFooter,
      },
      {
        name: 'step-3',
        title: 'Dispute Statuses',
        content: () => {
          return (
            <Text>
              Disputes which are open or under review will be shown here. You can also review them
              by clicking on the button.
            </Text>
          );
        },
        placement: 'bottom',
        footer: TourFooter,
      },
    ],
    [args.tourStepsContent, args.tourStepsPlacement, args.tourStepsTitle],
  );

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
      <Tour
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
        <Box display="flex" gap="spacing.4" alignItems="stretch">
          <TourStep name="step-1">
            <Box width="100%">
              <Card width="100%" height="100%">
                <CardBody>
                  <Box display="flex" flexDirection="column" gap="spacing.3">
                    <Box display="flex" alignItems="center" gap="spacing.3">
                      <Text>Refunds</Text>
                      <InfoIcon color="surface.text.subdued.lowContrast" />
                    </Box>
                    <Amount value={40000} size="title-small" />
                    <Text type="subdued">3 Processed</Text>
                  </Box>
                </CardBody>
              </Card>
            </Box>
          </TourStep>
          <TourStep name="step-2">
            <Box width="100%">
              <Card width="100%" height="100%">
                <CardBody>
                  <Box display="flex" flexDirection="column" gap="spacing.3">
                    <Box display="flex" alignItems="center" gap="spacing.3">
                      <Text>Disputes</Text>
                      <InfoIcon color="surface.text.subdued.lowContrast" />
                    </Box>
                    <Amount value={0} size="title-small" />
                    <TourStep name="step-3">
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        gap="spacing.3"
                      >
                        <Text type="subdued">0 Open | 0 Under review</Text>
                        <Button size="small" variant="tertiary">
                          Review
                        </Button>
                      </Box>
                    </TourStep>
                  </Box>
                </CardBody>
              </Card>
            </Box>
          </TourStep>
        </Box>
      </Tour>
    </Box>
  );
};

export const Default = TourTemplate.bind({});
Default.storyName = 'Default';

export const CustomPlacement = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(false);
  const steps = React.useMemo<TourSteps>(
    () => [
      {
        name: 'top',
        title: 'Top',
        content: () => {
          return (
            <Box>
              <Text>Top</Text>
            </Box>
          );
        },
        placement: 'top',
        footer: TourFooter,
      },
      {
        name: 'bottom',
        content: () => {
          return (
            <Box>
              <Text>Bottom</Text>
            </Box>
          );
        },
        placement: 'bottom',
        footer: TourFooter,
      },
      {
        name: 'left',
        content: () => {
          return (
            <Box>
              <Text>Left</Text>
            </Box>
          );
        },
        placement: 'left',
        footer: TourFooter,
      },
      {
        name: 'right',
        content: () => {
          return (
            <Box>
              <Text>Right</Text>
            </Box>
          );
        },
        placement: 'right',
        footer: TourFooter,
      },
    ],
    [],
  );

  return (
    <Box>
      <Button
        marginBottom="spacing.5"
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
      >
        {isOpen ? 'Tour In Progress' : 'Start Tour'}
      </Button>
      <Tour
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
        <Text>
          You can pass individual placement values to each step in the popover. It supports same
          placement values as Popover (top, bottom, left, right, top-start, top-end, bottom-start,
          bottom-end, left-start, left-end, right-start, right-end)
        </Text>
        <Center>
          <Box display="flex" gap="spacing.4" alignItems="stretch">
            <TourStep name="top">
              <Box padding="spacing.4" backgroundColor="surface.background.level2.lowContrast">
                top
              </Box>
            </TourStep>
            <TourStep name="bottom">
              <Box padding="spacing.4" backgroundColor="surface.background.level2.lowContrast">
                bottom
              </Box>
            </TourStep>
            <TourStep name="left">
              <Box padding="spacing.4" backgroundColor="surface.background.level2.lowContrast">
                left
              </Box>
            </TourStep>
            <TourStep name="right">
              <Box padding="spacing.4" backgroundColor="surface.background.level2.lowContrast">
                right
              </Box>
            </TourStep>
          </Box>
        </Center>
      </Tour>
    </Box>
  );
};
CustomPlacement.storyName = 'Custom Placement';

const InterruptibleTourFooter = ({
  activeStep,
  goToNext,
  goToStep,
  stopTour,
  goToPrevious,
  totalSteps,
  setIsTourSkipped,
}: StepRenderProps & {
  setIsTourSkipped: React.Dispatch<React.SetStateAction<boolean>>;
}): React.ReactElement => {
  const isLast = activeStep === totalSteps - 1;
  const isFirst = activeStep === 0;
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" gap="spacing.7">
      <Text size="small" weight="bold">
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
        {!isFirst ? (
          <Button
            size="small"
            variant="secondary"
            onClick={() => {
              goToPrevious();
            }}
          >
            Prev
          </Button>
        ) : null}
        {isLast ? (
          <Button
            size="small"
            onClick={() => {
              // done
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

export const MultipleTourFlows = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(false);
  const tourFlow1Steps = React.useMemo<TourSteps>(
    () => [
      {
        name: 'flow-1-step-1',
        title: 'Step 1',
        content: () => {
          return <Text>Flow 1, Step 1</Text>;
        },
        footer: TourFooter,
      },
      {
        name: 'flow-1-step-2',
        title: 'Step 2',
        content: () => {
          return <Text>Flow 1, Step 2</Text>;
        },
        footer: TourFooter,
      },
    ],
    [],
  );
  const tourFlow2Steps = React.useMemo<TourSteps>(
    () => [
      {
        name: 'flow-2-step-1',
        title: 'Step 1',
        content: () => {
          return <Text>Flow 2, Step 1</Text>;
        },
        footer: TourFooter,
      },
      {
        name: 'flow-2-step-2',
        title: 'Step 2',
        content: () => {
          return <Text>Flow 2, Step 2</Text>;
        },
        footer: TourFooter,
      },
    ],
    [],
  );

  const [activeFlow, setActiveFlow] = React.useState('flow-1');

  return (
    <Box>
      <Tour
        steps={activeFlow === 'flow-1' ? tourFlow1Steps : tourFlow2Steps}
        isOpen={isOpen}
        activeStep={activeStep}
        onFinish={() => {
          console.log('finished');
          setIsOpen(false);
          setActiveStep(0);
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
        <Box display="flex" flexDirection="row" gap="spacing.4">
          <Button
            marginBottom="spacing.5"
            onClick={() => {
              setActiveFlow('flow-1');
              setIsOpen((prev) => !prev);
            }}
          >
            Start Flow 1
          </Button>
          <Button
            marginBottom="spacing.5"
            onClick={() => {
              setActiveFlow('flow-2');
              setIsOpen((prev) => !prev);
            }}
          >
            Start Flow 2
          </Button>
        </Box>
        <Text>
          You can have multiple tour flows in the same page by switching the{' '}
          <Code size="medium">steps</Code> array based on the currently active flow.
        </Text>
        <Text type="muted" marginTop="spacing.4">
          Another option: You can also use multiple "Tour" components, but it has a downside that
          you can't have multiple tour flows wrapping the same React Tree, because the Tour
          component uses React Context to communicate with the TourStep component and if you wrap 1
          Tour component inside another the TourStep will take the nearest context value only. Learn
          more about this in the{' '}
          <Link
            size="small"
            href="https://github.com/razorpay/blade/blob/anu/tour-api/packages/blade/src/components/Tour/_decisions/decisions.md#technical-challenge-in-react-native"
          >
            API Decisions.
          </Link>
        </Text>
        <Center>
          <Box display="flex" flexDirection="column" gap="spacing.4">
            <Box display="flex" gap="spacing.4" alignItems="stretch">
              <TourStep name="flow-1-step-1">
                <Box padding="spacing.4" backgroundColor="surface.background.level2.lowContrast">
                  Flow 1 - Step 1
                </Box>
              </TourStep>
              <TourStep name="flow-1-step-2">
                <Box padding="spacing.4" backgroundColor="surface.background.level2.lowContrast">
                  Flow 1 - Step 2
                </Box>
              </TourStep>
            </Box>

            <Box display="flex" gap="spacing.4" alignItems="stretch">
              <TourStep name="flow-2-step-1">
                <Box padding="spacing.4" backgroundColor="surface.background.level2.lowContrast">
                  Flow 2 - Step 1
                </Box>
              </TourStep>
              <TourStep name="flow-2-step-2">
                <Box padding="spacing.4" backgroundColor="surface.background.level2.lowContrast">
                  Flow 2 - Step 2
                </Box>
              </TourStep>
            </Box>
          </Box>
        </Center>
      </Tour>
    </Box>
  );
};

export const InterruptibleTour = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [isTourSkipped, setIsTourSkipped] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const steps = React.useMemo<TourSteps>(
    () => [
      {
        name: 'step-1',
        title: 'Step 1',
        content: () => {
          return (
            <Box>
              <Text>This is step 1, press skip</Text>
            </Box>
          );
        },
        placement: 'top',
        footer: (props) => (
          <InterruptibleTourFooter {...props} setIsTourSkipped={setIsTourSkipped} />
        ),
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
        footer: (props) => (
          <InterruptibleTourFooter {...props} setIsTourSkipped={setIsTourSkipped} />
        ),
      },
      isTourSkipped
        ? {
            name: 'start-tour',
            title: 'Tour Incomplete!',
            content: () => {
              return (
                <Text>
                  We reccommend that you complete the tour to make the most of the new features. You
                  can find it here when you want to take it.
                </Text>
              );
            },
            footer: ({ stopTour }) => {
              return (
                <Button
                  size="small"
                  onClick={() => {
                    stopTour();
                  }}
                >
                  Got it
                </Button>
              );
            },
          }
        : {
            name: 'start-tour',
            title: 'Tour Complete!',
            content: () => {
              return (
                <Text>
                  You have completed the tour. You can find it here when you want to take it.
                </Text>
              );
            },
            footer: ({ stopTour }) => {
              return (
                <Button
                  size="small"
                  onClick={() => {
                    stopTour();
                  }}
                >
                  Thanks.
                </Button>
              );
            },
          },
    ],
    [isTourSkipped],
  );

  return (
    <Box>
      <Tour
        steps={steps}
        isOpen={isOpen}
        activeStep={activeStep}
        onFinish={() => {
          console.log('finished');
          setIsOpen(false);
          setIsTourSkipped(false);
          setActiveStep(0);
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
        <TourStep name="start-tour">
          <Button
            marginBottom="spacing.5"
            onClick={() => {
              setIsOpen((prev) => !prev);
            }}
          >
            {isOpen ? 'Tour In Progress' : 'Start Tour'}
          </Button>
        </TourStep>
        <Text>
          You can create complex flows like interruptible tours by dynamically modifying the steps
          array, and changing it's contents.
        </Text>
        <Text>
          Compose and make use of methods provided by the tour component like{' '}
          <Code size="medium">stopTour</Code>, <Code size="medium">goToStep</Code>,{' '}
          <Code size="medium">goToNext</Code> etc to control the behaviour of the current tour step
        </Text>
        <Center>
          <Box display="flex" gap="spacing.4" alignItems="stretch">
            <TourStep name="step-1">
              <Box padding="spacing.4" backgroundColor="surface.background.level2.lowContrast">
                Step 1
              </Box>
            </TourStep>
            <TourStep name="step-2">
              <Box padding="spacing.4" backgroundColor="surface.background.level2.lowContrast">
                Step 2
              </Box>
            </TourStep>
          </Box>
        </Center>
      </Tour>
    </Box>
  );
};
InterruptibleTour.storyName = 'Product Usecase: Interruptible Tour';

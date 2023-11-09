/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { Meta, ComponentStory } from '@storybook/react';
import React from 'react';
import { Title } from '@storybook/addon-docs';
import type { StepRenderProps, TourProps, TourSteps } from './types';
import { TourStep } from './TourStep';
import { TourFooter } from './TourFooter';
import { Tour } from '.';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import { Code, Text } from '~components/Typography';
import { InfoIcon } from '~components/Icons';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Sandbox } from '~utils/storybook/Sandbox';
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
      <Sandbox>
        {`
        import React from 'react';
        import { Tour, TourStep, TourFooter, Box, Text, Button } from '@razorpay/blade/components';
        
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
                <Box width="100%" display="flex" gap="spacing.4">
                  <TourStep name="step-1">
                    <Box padding="spacing.4" backgroundColor="brand.gray.400.lowContrast">
                      <Text>Step 1 </Text>
                    </Box>
                  </TourStep>
                  <TourStep name="step-2">
                    <Box padding="spacing.4" backgroundColor="brand.gray.400.lowContrast">
                      <Text>Step 2 </Text>
                    </Box>
                  </TourStep>
                </Box>
              </Tour>
            </Box>
          );
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

const CustomTourFooter = ({
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
        footer: CustomTourFooter,
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
        footer: CustomTourFooter,
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
        footer: CustomTourFooter,
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
        <Box
          display="flex"
          flexDirection={{ base: 'column', m: 'row' }}
          gap="spacing.4"
          alignItems="stretch"
        >
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
        footer: CustomTourFooter,
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
        footer: CustomTourFooter,
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
        footer: CustomTourFooter,
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
        footer: CustomTourFooter,
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

export const WithScrollablePage = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(false);
  const steps = React.useMemo<TourSteps>(
    () => [
      {
        name: 'razorpay-dashboard',
        title: 'Powerful Dashboard',
        content: () => {
          return (
            <Box>
              <Text>
                Razorpay provides a Powerful Dashboard for you to get reports and detailed
                statistics on payments, settlements, refunds and much more for you to take better
                business decisions.
              </Text>
            </Box>
          );
        },
        placement: 'bottom',
        footer: CustomTourFooter,
      },
      {
        name: 'amazon-aws',
        title: 'Infrastructure At Scale',
        content: () => {
          return (
            <Box>
              <Text>
                With Amazon AWS, we are built for scale. To ensure that products built with Razorpay
                are always available, we have a highly scalable and reliable infrastructure.
              </Text>
            </Box>
          );
        },
        placement: 'bottom',
        footer: CustomTourFooter,
      },
      {
        name: 'razorpay-docs',
        title: 'Developer Friendly APIs',
        content: () => {
          return (
            <Box>
              <Text>
                With SDKs and documentation for all major languages and platforms, Razorpay is built
                for developers.
              </Text>
            </Box>
          );
        },
        placement: 'left',
        footer: CustomTourFooter,
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
        <Box>
          <Text marginY="spacing.9">
            A{' '}
            <TourStep name="razorpay-dashboard">
              <Link href="https://dashboard.razorpay.com">Powerful Dashboard</Link>
            </TourStep>{' '}
            for you to get reports and detailed statistics on payments, settlements, refunds and
            much more for you to take better business decisions.
          </Text>
          <Box>
            <Text>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
              has been the industry's standard dummy text ever since the 1500s, when an unknown
              printer took a galley of type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into electronic typesetting,
              remaining essentially unchanged. It was popularised in the 1960s with the release of
              Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </Text>
            <Text>
              The standard Lorem Ipsum passage, used since the 1500s "Lorem ipsum dolor sit amet,
              consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
              magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
              ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
              voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
              laborum." Section 1.10.32 of "de Finibus Bonorum et Malorum", written by Cicero in 45
              BC "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
              doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis
              et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia
              voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos
              qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum
              quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi
              tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad
              minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut
              aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea
              voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum
              fugiat quo voluptas nulla pariatur?" 1914 translation by H. Rackham "But I must
              explain to you how all this mistaken idea of denouncing pleasure and praising pain was
              born and I will give you a complete account of the system, and expound the actual
              teachings of the great explorer of the truth, the master-builder of human happiness.
              No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but
              because those who do not know how to pursue pleasure rationally encounter consequences
              that are extremely painful. Nor again is there anyone who loves or pursues or desires
              to obtain pain of itself, because it is pain, but because occasionally circumstances
              occur in which toil and pain can procure him some great pleasure. To take a trivial
              example, which of us ever undertakes laborious physical exercise, except to obtain
              some advantage from it? But who has any right to find fault with a man who chooses to
              enjoy a pleasure that has no annoying consequences, or one who avoids a pain that
              produces no resultant pleasure?" Section 1.10.33 of "de Finibus Bonorum et Malorum",
              written by Cicero in 45 BC "At vero eos et accusamus et iusto odio dignissimos ducimus
              qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas
              molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa
              qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem
              rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est
              eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus,
              omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et
              aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates
              repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a
              sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut
              perferendis doloribus asperiores repellat."
            </Text>
            <Text>
              1914 translation by H. Rackham "On the other hand, we denounce with righteous
              indignation and dislike men who are so beguiled and demoralized by the charms of
              pleasure of the moment, so blinded by desire, that they cannot foresee the pain and
              trouble that are bound to ensue; and equal blame belongs to those who fail in their
              duty through weakness of will, which is the same as saying through shrinking from toil
              and pain. These cases are perfectly simple and easy to distinguish. In a free hour,
              when our power of choice is untrammelled and when nothing prevents our being able to
              do what we like best, every pleasure is to be welcomed and every pain avoided. But in
              certain circumstances and owing to the claims of duty or the obligations of business
              it will frequently occur that pleasures have to be repudiated and annoyances accepted.
              The wise man therefore always holds in these matters to this principle of selection:
              he rejects pleasures to secure other greater pleasures, or else he endures pains to
              avoid worse pains."
            </Text>
          </Box>
          <Text marginY="spacing.9">
            Over the last couple of years, we have worked hard with our banking partners so you
            don’t have to. Razorpay's servers are completely hosted on
            <TourStep name="amazon-aws">
              <Link href="https://aws.amazon.com/">&nbsp;Amazon AWS</Link>
            </TourStep>{' '}
            with auto-scaling systems that scale up to handle any traffic that you throw at it today
            or in the future.
          </Text>
          <Text marginY="spacing.9">
            Built for Developers: Robust, clean,{' '}
            <TourStep name="razorpay-docs">
              <Link href="https://razorpay.com/docs/api/">developer friendly APIs</Link>
            </TourStep>{' '}
            , plugins and libraries for all major languages and platforms that let you focus on
            building great products.
          </Text>
          <Text>
            Section 1.10.33 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC "At vero
            eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum
            deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati
            cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi,
            id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita
            distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit
            quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis
            dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum
            necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non
            recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis
            voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat."
          </Text>
        </Box>
      </Tour>
    </Box>
  );
};
WithScrollablePage.storyName = 'With Scrollable Page';

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
        footer: CustomTourFooter,
      },
      {
        name: 'flow-1-step-2',
        title: 'Step 2',
        content: () => {
          return <Text>Flow 1, Step 2</Text>;
        },
        footer: CustomTourFooter,
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
        footer: CustomTourFooter,
      },
      {
        name: 'flow-2-step-2',
        title: 'Step 2',
        content: () => {
          return <Text>Flow 2, Step 2</Text>;
        },
        footer: CustomTourFooter,
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

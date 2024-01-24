/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { Title } from '@storybook/addon-docs';
import isChromatic from 'chromatic';
import { SpotlightPopoverTourStep } from '../TourStep';
import { SpotlightPopoverTourFooter } from '../TourFooter';
import { SpotlightPopoverTour } from '../..';
import type {
  SpotlightPopoverStepRenderProps,
  SpotlightPopoverTourProps,
  SpotlightPopoverTourSteps,
} from '../types';
import { BasicExample } from './examples';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import { Code, Text } from '~components/Typography';
import { InfoIcon } from '~components/Icons';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Sandbox } from '~utils/storybook/Sandbox';
import { Card, CardBody } from '~components/Card';
import { Amount } from '~components/Amount';
import { Link } from '~components/Link';
import { SandboxHighlighter } from '~utils/storybook/Sandbox/SandpackEditor';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      showDefaultExample={false}
      componentName="SpotlightPopoverTour"
      componentDescription="The SpotlightPopoverTour component is used to provide context as well as enable users to take certain actions on it. These are used to highlight a new feature or provide a guided tour to a new user."
      figmaURL="https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=63871%3A13263&mode=dev"
    >
      <Title>Usage</Title>
      <Sandbox>{BasicExample}</Sandbox>
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
        <Text as="span" weight="semibold">
          story view
        </Text>
      </Text>
    </StoryPageWrapper>
  );
};

const propsCategory = {
  TOUR: 'Tour Props',
  TOUR_STEPS: 'Single Tour Step Props',
};

type StoryControlProps = SpotlightPopoverTourProps & {
  tourStepsTitle: SpotlightPopoverTourSteps[number]['title'];
  tourStepsContent: SpotlightPopoverTourSteps[number]['content'];
  tourStepsPlacement: SpotlightPopoverTourSteps[number]['placement'];
  tourStepsFooter: SpotlightPopoverTourSteps[number]['footer'];
  tourStepsTitleLeading: SpotlightPopoverTourSteps[number]['titleLeading'];
  tourStepsName: SpotlightPopoverTourSteps[number]['name'];
};

export default {
  title: 'Components/SpotlightPopoverTour',
  component: SpotlightPopoverTour,
  tags: ['autodocs'],
  argTypes: {
    tourStepsTitle: {
      name: 'steps[0].title',
      type: 'string',
      table: { category: propsCategory.TOUR_STEPS },
    },
    tourStepsContent: {
      name: 'steps[0].content',
      type: 'string',
      table: { category: propsCategory.TOUR_STEPS },
    },
    tourStepsPlacement: {
      name: 'steps[0].placement',
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
  args: {
    tourStepsTitle: 'Overview of Refunds',
    tourStepsContent: ('You can  issue refunds for various reasons, like when a customer returns a product or cancels a service.' as unknown) as SpotlightPopoverTourSteps[number]['content'],
    tourStepsPlacement: 'bottom',
    tourStepsName: 'step-1',
  },
  parameters: {
    options: {
      storySort: {
        order: ['Docs', '*'],
      },
    },
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

const TourTemplate: StoryFn<(props: StoryControlProps) => React.ReactElement> = (args) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(!!isChromatic());

  const steps = React.useMemo<SpotlightPopoverTourSteps>(
    () => [
      {
        name: 'step-1',
        title: args.tourStepsTitle,
        content: () => {
          return (
            <Box>
              <Text color="surface.text.gray.subtle">{args.tourStepsContent}</Text>
              <Text color="surface.text.gray.subtle" marginTop="spacing.2">
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
              <Text color="surface.text.gray.subtle">
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
            <Text color="surface.text.gray.subtle">
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
        <Box
          display="flex"
          flexDirection={{ base: 'column', m: 'row' }}
          gap="spacing.4"
          alignItems="stretch"
        >
          <SpotlightPopoverTourStep name="step-1">
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
          <SpotlightPopoverTourStep name="step-2">
            <Box width="100%">
              <Card width="100%" height="100%">
                <CardBody>
                  <Box display="flex" flexDirection="column" gap="spacing.3">
                    <Box display="flex" alignItems="center" gap="spacing.3">
                      <Text>Disputes</Text>
                      <InfoIcon color="interactive.icon.gray.muted" />
                    </Box>
                    <Amount value={0} type="heading" size="large" />
                    <SpotlightPopoverTourStep name="step-3">
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
};

export const Basic = TourTemplate.bind({});
Basic.storyName = 'Basic';
Basic.parameters = {
  docs: { disable: false },
  viewMode: 'story',
};

export const CustomPlacement = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(false);
  const steps = React.useMemo<SpotlightPopoverTourSteps>(
    () => [
      {
        name: 'top',
        title: 'Top',
        content: () => {
          return (
            <Box>
              <Text color="surface.text.gray.subtle">Top</Text>
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
              <Text color="surface.text.gray.subtle">Bottom</Text>
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
              <Text color="surface.text.gray.subtle">Left</Text>
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
              <Text color="surface.text.gray.subtle">Right</Text>
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
        <Text>
          You can pass individual placement values to each step in the popover. It supports same
          placement values as Popover (top, bottom, left, right, top-start, top-end, bottom-start,
          bottom-end, left-start, left-end, right-start, right-end)
        </Text>
        <Center>
          <Box display="flex" gap="spacing.4" alignItems="stretch">
            <SpotlightPopoverTourStep name="top">
              <Box padding="spacing.4" backgroundColor="surface.background.gray.intense">
                top
              </Box>
            </SpotlightPopoverTourStep>
            <SpotlightPopoverTourStep name="bottom">
              <Box padding="spacing.4" backgroundColor="surface.background.gray.intense">
                bottom
              </Box>
            </SpotlightPopoverTourStep>
            <SpotlightPopoverTourStep name="left">
              <Box padding="spacing.4" backgroundColor="surface.background.gray.intense">
                left
              </Box>
            </SpotlightPopoverTourStep>
            <SpotlightPopoverTourStep name="right">
              <Box padding="spacing.4" backgroundColor="surface.background.gray.intense">
                right
              </Box>
            </SpotlightPopoverTourStep>
          </Box>
        </Center>
      </SpotlightPopoverTour>
    </Box>
  );
};
CustomPlacement.storyName = 'Custom Placement';
CustomPlacement.parameters = {
  docs: { disable: true },
  viewMode: 'story',
};

export const WithScrollablePage = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(false);
  const steps = React.useMemo<SpotlightPopoverTourSteps>(
    () => [
      {
        name: 'razorpay-dashboard',
        title: 'Powerful Dashboard',
        content: () => {
          return (
            <Box>
              <Text color="surface.text.gray.subtle">
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
              <Text color="surface.text.gray.subtle">
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
              <Text color="surface.text.gray.subtle">
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
        <Text>
          You can pass individual placement values to each step in the popover. It supports same
          placement values as Popover (top, bottom, left, right, top-start, top-end, bottom-start,
          bottom-end, left-start, left-end, right-start, right-end)
        </Text>
        <Box>
          <Text marginY="spacing.9">
            A{' '}
            <SpotlightPopoverTourStep name="razorpay-dashboard">
              <Link href="https://dashboard.razorpay.com">Powerful Dashboard</Link>
            </SpotlightPopoverTourStep>{' '}
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
            <SpotlightPopoverTourStep name="amazon-aws">
              <Link href="https://aws.amazon.com/">&nbsp;Amazon AWS</Link>
            </SpotlightPopoverTourStep>{' '}
            with auto-scaling systems that scale up to handle any traffic that you throw at it today
            or in the future.
          </Text>
          <Text marginY="spacing.9">
            Built for Developers: Robust, clean,{' '}
            <SpotlightPopoverTourStep name="razorpay-docs">
              <Link href="https://razorpay.com/docs/api/">developer friendly APIs</Link>
            </SpotlightPopoverTourStep>{' '}
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
      </SpotlightPopoverTour>
    </Box>
  );
};
WithScrollablePage.storyName = 'With Scrollable Page';
WithScrollablePage.parameters = {
  docs: { disable: true },
  viewMode: 'story',
};

const InterruptibleTourFooter = ({
  activeStep,
  goToNext,
  goToStep,
  stopTour,
  goToPrevious,
  totalSteps,
  setIsTourSkipped,
}: SpotlightPopoverStepRenderProps & {
  setIsTourSkipped: React.Dispatch<React.SetStateAction<boolean>>;
}): React.ReactElement => {
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
  const steps = React.useMemo<SpotlightPopoverTourSteps>(
    () => [
      {
        name: 'step-1',
        title: 'Step 1',
        content: () => {
          return (
            <Box>
              <Text color="surface.text.gray.subtle">This is step 1, press skip</Text>
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
              <Text color="surface.text.gray.subtle">This is step 2</Text>
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
                <Text color="surface.text.gray.subtle">
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
                <Text color="surface.text.gray.subtle">
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
      <SpotlightPopoverTour
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
        <SpotlightPopoverTourStep name="start-tour">
          <Button
            marginBottom="spacing.5"
            onClick={() => {
              setIsOpen((prev) => !prev);
            }}
          >
            {isOpen ? 'Tour In Progress' : 'Start Tour'}
          </Button>
        </SpotlightPopoverTourStep>
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
        </Center>
      </SpotlightPopoverTour>
    </Box>
  );
};
InterruptibleTour.storyName = 'Product Usecase: Interruptible Tour';
InterruptibleTour.parameters = {
  docs: { disable: true },
  viewMode: 'story',
};

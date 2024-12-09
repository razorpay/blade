import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import StoryRouter from 'storybook-react-router';
import { InternalCardExample } from '../Card/Card.stories';
import { Fade } from './';
import type { FadeProps } from './';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import { TextInput } from '~components/Input/TextInput';
import { Code, Heading, Text } from '~components/Typography';
import { Chip, ChipGroup } from '~components/Chip';
import { StepperRouterExample } from '~components/BaseMotion/docs/StepperRouterExample';
import { Card, CardBody, CardHeader, CardHeaderLeading } from '~components/Card';
import type { StepItemProps } from '~components/StepGroup';
import { Alert } from '~components/Alert';
import { Link } from '~components/Link';
import { FadeSandbox } from '~components/BaseMotion/docs/codeExamples';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Fade"
      componentDescription="The Fade component is a motion preset that animates the opacity of its children, allowing them to smoothly appear or disappear. It ensures seamless transitions while keeping the UI visually engaging."
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=74864-85897&t=CvaYT53LNc4OYVKa-1&scaling=min-zoom&page-id=21689%3A381614&mode=design"
      apiDecisionLink="https://github.com/razorpay/blade/blob/master/rfcs/2024-08-21-motion-presets.md"
    >
      <Alert
        marginY="spacing.5"
        title="Followed the Motion React Installation?"
        description={
          <Text>
            Make sure you've followed the installation and setup of Motion React from our{' '}
            <Link href="/?path=/docs/guides-installation--docs">Installation Doc</Link> (Step 3)
          </Text>
        }
        isDismissible={false}
        isFullWidth
      />

      <Title>Usage</Title>
      <FadeSandbox />
    </StoryPageWrapper>
  );
};

export default {
  title: 'Motion/Fade',
  component: Fade,
  tags: ['autodocs'],
  // eslint-disable-next-line babel/new-cap
  decorators: [StoryRouter(undefined, { initialEntries: ['/onboarding/introduction'] })] as unknown,
  args: {
    motionTriggers: ['mount'],
    type: 'inout',
    shouldUnmountWhenHidden: false,
  },
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<FadeProps>;

const FadeTemplate: StoryFn<typeof Fade> = (args) => {
  const [isVisible, setIsVisible] = React.useState(true);

  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.8"
      borderRadius="medium"
      borderWidth="thin"
      borderColor="surface.border.gray.muted"
    >
      <Button marginBottom="spacing.4" onClick={() => setIsVisible(!isVisible)}>
        Toggle Fade
      </Button>
      <Fade {...args} isVisible={args.isVisible ?? isVisible} />
    </Box>
  );
};

export const Default = FadeTemplate.bind({});
Default.args = {
  children: <InternalCardExample />,
};

export const WithDifferentComponents = (args: typeof Fade): React.ReactElement => {
  const [isVisible, setIsVisible] = React.useState(true);

  return (
    <Box minHeight="350px">
      <Button marginBottom="spacing.11" onClick={() => setIsVisible(!isVisible)}>
        Toggle Fade
      </Button>

      <Box
        display="flex"
        alignItems="flex-start"
        gap="spacing.8"
        flexWrap="wrap"
        backgroundColor="surface.background.gray.intense"
        padding="spacing.8"
        borderRadius="medium"
      >
        <Fade {...args} isVisible={isVisible}>
          <TextInput label="Input that fades" />
        </Fade>

        <Fade {...args} isVisible={isVisible}>
          <Button>Button that fades</Button>
        </Fade>

        <Fade {...args} isVisible={isVisible}>
          <Box backgroundColor="surface.background.cloud.intense" padding="spacing.4">
            <Text color="surface.text.onCloud.onIntense">Box that fades</Text>
          </Box>
        </Fade>

        <Fade {...args} isVisible={isVisible}>
          <Heading>Heading that fades</Heading>
        </Fade>

        <Fade {...args} isVisible={isVisible}>
          <ChipGroup selectionType="multiple" label="ChipGroup that fades">
            {['Public', 'Small Business', 'Large Organization'].map((chipValue: string) => (
              <Chip key={chipValue} value={chipValue}>
                {chipValue}
              </Chip>
            ))}
          </ChipGroup>
        </Fade>

        <Fade {...args} isVisible={isVisible}>
          <p>Fade with custom components. Ensure you forward refs to your custom components</p>
        </Fade>
      </Box>
    </Box>
  );
};

export const FadeWhenInView = (args: typeof Fade): React.ReactElement => {
  return (
    <Box
      maxHeight="400px"
      overflowX="hidden"
      overflow="auto"
      backgroundColor="surface.background.gray.intense"
      padding="spacing.8"
      borderRadius="medium"
      borderWidth="thin"
      borderColor="surface.border.gray.muted"
    >
      <Box height="500px" width="100%">
        <Text>Scroll down</Text>
      </Box>
      <Fade {...args}>
        <InternalCardExample />
      </Fade>
    </Box>
  );
};

FadeWhenInView.args = {
  motionTriggers: ['in-view'],
};

const stepsSampleData: StepItemProps[] = [
  {
    title: 'Introduction',
    timestamp: 'Mon, 15th Oct’23 | 12:00pm',
    description: 'Introduction to Razorpay Payment Gateway',
    href: '/onboarding/introduction',
  },
  {
    title: 'Personal Details',
    timestamp: 'Mon, 16th Oct’23 | 12:00pm',
    description: 'Fill your Personal Details for onboarding',
    href: '/onboarding/personal-details',
  },
  {
    title: 'Business Details',
    timestamp: 'Mon, 17th Oct’23 | 12:00pm',
    description: 'Fill your Business Details for onboarding',
    href: '/onboarding/business-details',
  },
  {
    title: 'Complete Onboarding',
    timestamp: 'Mon, 20th Oct’23 | 12:00pm',
    description: 'Complete your onboarding to start',
    href: '/onboarding/complete-onboarding',
  },
];

const OnboardingRoute = ({
  match,
}: {
  match: {
    params: {
      id: string;
    };
  };
}): React.ReactElement => {
  const stepDataIndex = stepsSampleData.findIndex((stepInfo) =>
    stepInfo.href?.includes(match.params.id),
  );
  const stepData = stepsSampleData[stepDataIndex];

  if (!stepData) {
    return (
      <Fade>
        <Text>Unknown Route</Text>
      </Fade>
    );
  }

  return (
    <Fade>
      <Card width="100%">
        <CardHeader>
          <CardHeaderLeading
            title={`${stepDataIndex + 1}. ${stepData.title}`}
            subtitle={stepData.description}
          />
        </CardHeader>
        <CardBody>
          <Code size="medium" isHighlighted={false}>
            {stepData.href ?? ''}
          </Code>

          <Text marginTop="spacing.4">
            This is an example of <Code size="medium">Fade</Code> component used for Page
            Transition.
          </Text>
        </CardBody>
      </Card>
    </Fade>
  );
};

export const OnRouteChange: StoryFn<(props: typeof Fade) => React.ReactElement> = () => {
  return (
    <StepperRouterExample stepsSampleData={stepsSampleData} routeComponent={OnboardingRoute} />
  );
};

export const WithRef = (args: typeof Fade): React.ReactElement => {
  const [isVisible, setIsVisible] = React.useState(false);

  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (isVisible) {
      inputRef.current?.focus();
    }
  }, [isVisible]);

  return (
    <Box minHeight="350px">
      <Button marginBottom="spacing.4" onClick={() => setIsVisible(!isVisible)}>
        Toggle Fade
      </Button>
      <Fade {...args} isVisible={isVisible}>
        <TextInput
          ref={inputRef}
          label="My Text Input"
          helpText="This is an example to showcase how you can continue to use ref like you normally do
            inside Fade as well"
        />
      </Fade>
    </Box>
  );
};

import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import StoryRouter from 'storybook-react-router';
import { InternalCardExample } from '../Card/Card.stories';
import { Move } from './';
import type { MoveProps } from './';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import { TextInput } from '~components/Input/TextInput';
import { Code, Heading, Text } from '~components/Typography';
import { Chip, ChipGroup } from '~components/Chip';
import { StepperRouterExample } from '~components/BaseMotion/docs/StepperRouterExample';
import { Card, CardBody, CardHeader, CardHeaderLeading } from '~components/Card';
import type { StepItemProps } from '~components/StepGroup';
import { MoveSandbox } from '~components/BaseMotion/docs/codeExamples';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Move"
      componentDescription=" The Move component is a motion preset that animates the opacity and position of its children, allowing them to smoothly appear or disappear. It ensures seamless transitions while keeping the UI visually engaging."
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=74864-85897&t=CvaYT53LNc4OYVKa-1&scaling=min-zoom&page-id=21689%3A381614&mode=design"
      apiDecisionLink="https://github.com/razorpay/blade/blob/master/rfcs/2024-08-21-motion-presets.md"
    >
      <Title>Usage</Title>
      <MoveSandbox />
    </StoryPageWrapper>
  );
};

export default {
  title: 'Motion/Move',
  component: Move,
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
} as Meta<MoveProps>;

const MoveTemplate: StoryFn<typeof Move> = (args) => {
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
        Toggle Move
      </Button>
      <Move {...args} isVisible={isVisible} />
    </Box>
  );
};

export const Default = MoveTemplate.bind({});
Default.args = {
  children: <InternalCardExample />,
};

export const WithDifferentComponents = (args: typeof Move): React.ReactElement => {
  const [isVisible, setIsVisible] = React.useState(true);

  return (
    <Box minHeight="350px">
      <Button marginBottom="spacing.11" onClick={() => setIsVisible(!isVisible)}>
        Toggle Move
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
        <Move {...args} isVisible={isVisible}>
          <TextInput label="Input that moves" />
        </Move>

        <Move {...args} isVisible={isVisible}>
          <Button>Button that moves</Button>
        </Move>

        <Move {...args} isVisible={isVisible}>
          <Box backgroundColor="surface.background.cloud.intense" padding="spacing.4">
            <Text color="surface.text.onCloud.onIntense">Box that moves</Text>
          </Box>
        </Move>

        <Move {...args} isVisible={isVisible}>
          <Heading>Heading that moves</Heading>
        </Move>

        <Move {...args} isVisible={isVisible}>
          <ChipGroup selectionType="multiple" label="ChipGroup that moves">
            {['Public', 'Small Business', 'Large Organization'].map((chipValue: string) => (
              <Chip key={chipValue} value={chipValue}>
                {chipValue}
              </Chip>
            ))}
          </ChipGroup>
        </Move>

        <Move {...args} isVisible={isVisible}>
          <p>Move with custom components. Ensure you forward refs to your custom components</p>
        </Move>
      </Box>
    </Box>
  );
};

export const MoveWhenInView = (args: typeof Move): React.ReactElement => {
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
      <Move {...args}>
        <InternalCardExample />
      </Move>
    </Box>
  );
};

MoveWhenInView.args = {
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
      <Move>
        <Text>Unknown Route</Text>
      </Move>
    );
  }

  return (
    <Move>
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
            This is an example of <Code size="medium">Move</Code> component used for Page
            Transition.
          </Text>
        </CardBody>
      </Card>
    </Move>
  );
};

export const OnRouteChange: StoryFn<(props: typeof Move) => React.ReactElement> = () => {
  return (
    <StepperRouterExample stepsSampleData={stepsSampleData} routeComponent={OnboardingRoute} />
  );
};

export const WithRef = (args: typeof Move): React.ReactElement => {
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
        Toggle Move
      </Button>
      <Move {...args} isVisible={isVisible}>
        <TextInput
          ref={inputRef}
          label="My Text Input"
          helpText="This is an example to showcase how you can continue to use ref like you normally do
            inside Move as well"
        />
      </Move>
    </Box>
  );
};

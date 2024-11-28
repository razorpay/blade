import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import StoryRouter from 'storybook-react-router';
import { Stagger } from './';
import type { StaggerProps } from './';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import { InternalCardExample } from '../Card/Card.stories';
import { Fade } from '~components/Fade';
import { Move } from '~components/Move';
import { Slide } from '~components/Slide';
import { Card, CardBody, CardHeader, CardHeaderLeading } from '~components/Card';
import { Text } from '~components/Typography';
import { StepperRouterExample } from '~components/BaseMotion/docs/StepperRouterExample';
import type { StepItemProps } from '~components/StepGroup';
import { ChipGroup } from '~components/Chip';
import { Chip } from '~components/Chip';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Stagger"
      componentDescription="Stagger Motion Component (TODO)"
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=74864-85897&t=CvaYT53LNc4OYVKa-1&scaling=min-zoom&page-id=21689%3A381614&mode=design"
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
        const todo = 'todo';
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Motion/Stagger',
  component: Stagger,
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
} as Meta<StaggerProps>;

const StaggerTemplate: StoryFn<typeof Stagger> = (args) => {
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
        Toggle Stagger
      </Button>
      <Stagger {...args} isVisible={isVisible}>
        {args.children}
      </Stagger>
    </Box>
  );
};

export const Default = StaggerTemplate.bind({});
Default.args = {
  children: (
    <Box display="flex" flexDirection="row" gap="spacing.4">
      <Fade>
        <InternalCardExample />
      </Fade>
      <Fade>
        <InternalCardExample />
      </Fade>
      <Fade>
        <InternalCardExample />
      </Fade>
    </Box>
  ),
};

export const MoveStagger = StaggerTemplate.bind({});
MoveStagger.args = {
  children: (
    <Box display="flex" flexDirection="row" gap="spacing.4">
      <Move>
        <InternalCardExample />
      </Move>
      <Move>
        <InternalCardExample />
      </Move>
      <Move>
        <InternalCardExample />
      </Move>
    </Box>
  ),
};

export const SlideStagger = StaggerTemplate.bind({});
SlideStagger.args = {
  children: (
    <Box display="flex" flexDirection="row" gap="spacing.4">
      <Slide>
        <InternalCardExample />
      </Slide>
      <Slide>
        <InternalCardExample />
      </Slide>
      <Slide>
        <InternalCardExample />
      </Slide>
    </Box>
  ),
};

export const OnMount = () => {
  return (
    <Stagger>
      <Box display="flex" flexDirection="row" gap="spacing.4">
        <Move>
          <InternalCardExample />
        </Move>
        <Move>
          <InternalCardExample />
        </Move>
        <Move>
          <InternalCardExample />
        </Move>
      </Box>
    </Stagger>
  );
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
}) => {
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
    <Card width="100%">
      <CardHeader>
        <CardHeaderLeading
          title={`${stepDataIndex + 1}. ${stepData.title}`}
          subtitle={stepData.description}
        />
      </CardHeader>
      <CardBody>
        <Stagger>
          <ChipGroup label="Account Information" selectionType="single">
            {[
              'Business Type: Freelance',
              'Account Status: Activated',
              'Test Mode: Disabled',
              'Primary Product: Banking',
            ].map((chipLabel) => {
              return (
                <Move>
                  <Chip value={chipLabel.toLowerCase().replace(/ /g, '-')}>{chipLabel}</Chip>
                </Move>
              );
            })}
          </ChipGroup>
        </Stagger>
      </CardBody>
    </Card>
  );
};

export const OnRouteChange: StoryFn<(props: typeof Move) => React.ReactElement> = (props) => {
  return (
    <StepperRouterExample stepsSampleData={stepsSampleData} routeComponent={OnboardingRoute} />
  );
};

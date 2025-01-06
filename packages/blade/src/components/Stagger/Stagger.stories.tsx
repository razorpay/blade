import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import StoryRouter from 'storybook-react-router';
import { InternalCardExample } from '../Card/Card.stories';
import { Stagger } from './';
import type { StaggerProps } from './';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import { Fade } from '~components/Fade';
import { Move } from '~components/Move';
import { Slide } from '~components/Slide';
import { Card, CardBody, CardHeader, CardHeaderLeading } from '~components/Card';
import { Text } from '~components/Typography';
import { StepperRouterExample } from '~components/BaseMotion/docs/StepperRouterExample';
import type { StepItemProps } from '~components/StepGroup';
import { ChipGroup, Chip } from '~components/Chip';
import { StaggerSandbox } from '~components/BaseMotion/docs/codeExamples';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Stagger"
      componentDescription="Stagger component allows you to stagger children (make them appear one after the other). Its a utility preset. You can use any of the base presets like Move, Fade, Slide inside of it"
    >
      <Title>Usage</Title>
      <StaggerSandbox />
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
      <Stagger
        {...args}
        display="flex"
        flexDirection="row"
        gap="spacing.4"
        isVisible={args.isVisible ?? isVisible}
      >
        {args.children}
      </Stagger>
    </Box>
  );
};

export const Default = StaggerTemplate.bind({});
Default.args = {
  children: (
    <>
      <Fade>
        <InternalCardExample />
      </Fade>
      <Fade>
        <InternalCardExample />
      </Fade>
      <Fade>
        <InternalCardExample />
      </Fade>
    </>
  ),
};

export const MoveStagger = StaggerTemplate.bind({});
MoveStagger.args = {
  children: (
    <>
      <Move>
        <InternalCardExample />
      </Move>
      <Move>
        <InternalCardExample />
      </Move>
      <Move>
        <InternalCardExample />
      </Move>
    </>
  ),
};

export const SlideStagger = StaggerTemplate.bind({});
SlideStagger.args = {
  children: (
    <>
      <Slide>
        <InternalCardExample />
      </Slide>
      <Slide>
        <InternalCardExample />
      </Slide>
      <Slide>
        <InternalCardExample />
      </Slide>
    </>
  ),
};

export const OnMount = (): React.ReactElement => {
  return (
    <Stagger display="flex" flexDirection="row" gap="spacing.4">
      <Move>
        <InternalCardExample />
      </Move>
      <Move>
        <InternalCardExample />
      </Move>
      <Move>
        <InternalCardExample />
      </Move>
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
    <Card width="100%">
      <CardHeader>
        <CardHeaderLeading
          title={`${stepDataIndex + 1}. ${stepData.title}`}
          subtitle={stepData.description}
        />
      </CardHeader>
      <CardBody>
        <Stagger type="in">
          <ChipGroup label="Account Information" selectionType="multiple">
            {[
              'Business Type: Freelance',
              'Account Status: Activated',
              'Test Mode: Disabled',
              'Primary Product: Banking',
            ].map((chipLabel, index) => {
              return (
                <Move key={index}>
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

export const OnRouteChange: StoryFn<(props: typeof Move) => React.ReactElement> = () => {
  return (
    <StepperRouterExample stepsSampleData={stepsSampleData} routeComponent={OnboardingRoute} />
  );
};

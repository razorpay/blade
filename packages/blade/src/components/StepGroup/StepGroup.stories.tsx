/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Title } from '@storybook/addon-docs';
import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import { StepItem, StepGroup, StepItemIndicator } from './';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Sandbox } from '~utils/storybook/Sandbox';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { Badge } from '~components/Badge';
import { StepItemIcon } from './StepItemLeading';
import { BankIcon, CheckIcon } from '~components/Icons';
import { StepGroupProps, StepItemProps } from './types';
import { Text } from '~components/Typography';
import { Alert } from '~components/Alert';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Switch"
      componentDescription="A switch component is used to quickly switch between two possible states. These are only used for binary actions that occur immediately after the user turn the switch on/off."
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=74864-85736&t=k8yrOO74u7fLzkIE-1&scaling=min-zoom&page-id=30100%3A565839&mode=design"
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
        import { StepGroup, StepItem } from '@razorpay/blade/components';

        function App(): React.ReactElement {
          return (
            // Check console
            <Switch
              onChange={(e) => console.log(e.isChecked)}
              accessibilityLabel="Toggle DarkMode"
            />
          );
        }

        export default App;
      `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/StepGroup',
  component: StepGroup,
  // args: {
  //   defaultChecked: undefined,
  //   isChecked: undefined,
  //   isDisabled: undefined,
  //   name: undefined,
  //   onChange: undefined,
  //   value: undefined,
  //   size: 'medium',
  //   accessibilityLabel: 'Toggle DarkMode',
  // },
  // tags: ['autodocs'],
  argTypes: getStyledPropsArgTypes(),
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<StepGroupProps>;

const stepsSampleData: StepItemProps[] = [
  {
    title: 'Introduction',
    timestamp: 'Mon, 15th Oct’23 | 12:00pm',
    description: 'Introduction to Payment Gateway',
  },
  {
    title: 'Personal Details',
    timestamp: 'Mon, 16th Oct’23 | 12:00pm',
    description: 'Fill your Personal Details for onboarding',
  },
  {
    title: 'Business Details',
    timestamp: 'Mon, 17th Oct’23 | 12:00pm',
    description: 'Fill your Business Details for onboarding',
  },
  {
    title: 'Compliance Details',
    timestamp: 'Mon, 19th Oct’23 | 12:00pm',
    description: 'Provide documentation or reports',
  },
  {
    title: 'Complete Onboarding',
  },
];

const StepGroupInteractiveTemplate: StoryFn<typeof StepGroup> = (args) => {
  const [selectedIndex, setSelectedIndex] = React.useState(-1);

  return (
    <Box>
      <Alert
        color="information"
        isDismissible={false}
        isFullWidth={true}
        description="Click Items to interact with the StepGroup"
        marginBottom="spacing.8"
      />
      <StepGroup {...args}>
        {stepsSampleData.map((stepInfo, index) => (
          <StepItem
            key={`${stepInfo.title}-${index}`}
            isSelected={selectedIndex === index}
            leading={<StepItemIndicator color={selectedIndex === index ? 'primary' : 'neutral'} />}
            onClick={() => setSelectedIndex(index)}
            stepProgress={
              index === selectedIndex ? 'start' : index < selectedIndex ? 'full' : 'none'
            }
            {...stepInfo}
          />
        ))}
      </StepGroup>
    </Box>
  );
};

const StepGroupStaticTemplate: StoryFn<typeof StepGroup> = (args) => {
  return (
    <StepGroup {...args}>
      <StepItem
        title="Disputes Raised"
        timestamp="Thu, 11th Oct'23 | 12:00pm"
        stepProgress="full"
        leading={<StepItemIndicator color="positive" />}
      />
      <StepItem
        title="Disputes Contested"
        timestamp="Mon, 15th Oct'23 | 12:00pm"
        description="Disputes contested for Rs 5000"
        stepProgress="full"
        leading={<StepItemIndicator color="positive" />}
      />
      <StepItem
        title="Disputes Under Review"
        trailing={
          <Badge color="positive" size={args.size}>
            Received by our team
          </Badge>
        }
        stepProgress="full"
        leading={<StepItemIndicator color="positive" />}
      />
      <StepItem
        title="Needs Response"
        timestamp="Respond latest by Tue, 23rd Oct'24 | 12:00pm"
        stepProgress="start"
        leading={<StepItemIndicator color="notice" />}
      >
        <Button size="medium" variant="secondary">
          Submit Documents
        </Button>
      </StepItem>
      <StepItem
        title="Documents Sent to the Bank"
        description="Bank might take up to 3 months to review"
        trailing={
          <Badge color="neutral" size={args.size}>
            Pending
          </Badge>
        }
      />
      <StepItem
        title="Decision from the Bank"
        trailing={
          <Badge color="neutral" size={args.size}>
            Pending
          </Badge>
        }
      />
    </StepGroup>
  );
};
const StepGroupNestedTemplate: StoryFn<typeof StepGroup> = (args) => {
  return (
    <StepGroup {...args}>
      <StepItem
        title="Disputes Raised"
        timestamp="Thu, 11th Oct'23 | 12:00pm"
        stepProgress="full"
        leading={<StepItemIndicator color="positive" />}
      />
      <StepGroup>
        <StepItem title="Header Title" stepProgress="full" description="Header Description" />
        <StepItem
          title="Header Title"
          timestamp="Mon, 15th Oct’23 | 12:00pm"
          description="Header Description"
          stepProgress="start"
          leading={<StepItemIndicator color="positive" />}
        />
        <StepItem title="Header Title" description="Header Description" />
      </StepGroup>
      <StepItem title="Header Title">
        <Button>Click Clack</Button>
      </StepItem>
      <StepGroup>
        <StepItem title="Header Title" />
      </StepGroup>
      <StepItem title="Header Title" />
    </StepGroup>
  );
};

export const StepGroupDefault = StepGroupStaticTemplate.bind({});
StepGroupDefault.args = {
  orientation: 'vertical',
  size: 'medium',
};

export const StepGroupInteractive = StepGroupInteractiveTemplate.bind({});
StepGroupInteractive.args = {
  orientation: 'vertical',
  size: 'medium',
};

export const StepGroupInteractiveHorizontal = StepGroupInteractiveTemplate.bind({});
StepGroupInteractiveHorizontal.args = {
  orientation: 'horizontal',
  size: 'medium',
};

export const StepGroupLarge = StepGroupStaticTemplate.bind({});
StepGroupLarge.args = {
  orientation: 'vertical',
  size: 'large',
};

export const StepGroupWithIcons = (args: StepGroupProps) => {};

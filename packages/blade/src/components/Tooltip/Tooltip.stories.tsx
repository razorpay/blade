/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import { Title } from '@storybook/addon-docs';
import type { TooltipProps } from './';
import { TooltipInteractiveWrapper, Tooltip as TooltipComponent } from './';
import { Button } from '~components/Button';
import { BankIcon, InfoIcon } from '~components/Icons';
import { Link } from '~components/Link';
import { Box } from '~components/Box';
import { Code, Text } from '~components/Typography';
import { isReactNative } from '~utils';
import { List, ListItem, ListItemLink, ListItemText } from '~components/List';
import { IconButton } from '~components/Button/IconButton';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Sandbox } from '~utils/storybook/Sandbox';
import BaseBox from '~components/Box/BaseBox';
import type { BladeCommonEvents } from '~components/types';
import { PopoverVsTooltip } from '~utils/storybook/PopoverVsTooltip';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Tooltip"
      componentDescription="The tooltip typically provides additional context about the element or its function. A tooltip is always triggered by a mouse hover on desktop and on tap on mobile."
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=74864-86058&t=yvLu210sawTgjmt0-1&scaling=min-zoom&page-id=37400%3A560753&mode=design"
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
        import { Tooltip, Button } from '@razorpay/blade/components'
        
        function App() {
          return (
            <Tooltip content="Hello world" placement="bottom">
              <Button>Hover over me</Button>
            </Tooltip>
          )
        }

        export default App;
      `}
      </Sandbox>
      <Title>Tooltip Vs Popover Vs Guided Tour</Title>
      <PopoverVsTooltip />
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/Tooltip',
  component: TooltipComponent,
  tags: ['autodocs'],
  args: {
    placement: 'bottom',
    content: 'Amount reversed to customer bank account',
    onOpenChange: ({ isOpen }) => {
      console.log(isOpen);
    },
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<TooltipProps>;

const Center = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <Box width="100%" height="100%" display="flex" alignItems="center" justifyContent="center">
      {children}
    </Box>
  );
};

const TooltipTemplate: StoryFn<typeof TooltipComponent> = (args) => {
  return (
    <Center>
      <TooltipComponent {...args}>
        <Button>Hover over me</Button>
      </TooltipComponent>
    </Center>
  );
};

export const Default = TooltipTemplate.bind({});
Default.storyName = 'Default';

export const WithTitle = TooltipTemplate.bind({});
WithTitle.args = {
  title: 'Refund successful',
};

const PlacementBox = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode } & BladeCommonEvents
>(({ children, ...props }, ref) => {
  return (
    <Box
      ref={ref}
      tabIndex={0}
      display="flex"
      justifyContent="center"
      alignItems="center"
      flex={isReactNative() ? undefined : 1}
      width={isReactNative() ? '40%' : '100%'}
      flexShrink={0}
      padding="spacing.5"
      backgroundColor="surface.background.gray.moderate"
      {...props}
    >
      <Text>{children}</Text>
    </Box>
  );
});

const PlacementTemplate: StoryFn<typeof TooltipComponent> = () => {
  const tooltipContent = 'Hello world';

  if (isReactNative()) {
    return (
      <Center>
        <Box alignItems="center" justifyContent="center" flexDirection="row" flexWrap="wrap">
          <TooltipComponent placement="top-start" content={tooltipContent}>
            <PlacementBox>top-start</PlacementBox>
          </TooltipComponent>
          <TooltipComponent placement="left" content={tooltipContent}>
            <PlacementBox>left</PlacementBox>
          </TooltipComponent>
          <TooltipComponent placement="bottom-start" content={tooltipContent}>
            <PlacementBox>bottom-start</PlacementBox>
          </TooltipComponent>
          <TooltipComponent placement="top" content={tooltipContent}>
            <PlacementBox>top</PlacementBox>
          </TooltipComponent>
          <TooltipComponent placement="bottom" content={tooltipContent}>
            <PlacementBox>bottom</PlacementBox>
          </TooltipComponent>
          <TooltipComponent placement="top-end" content={tooltipContent}>
            <PlacementBox>top-end</PlacementBox>
          </TooltipComponent>
          <TooltipComponent placement="right" content={tooltipContent}>
            <PlacementBox>right</PlacementBox>
          </TooltipComponent>
          <TooltipComponent placement="bottom-end" content={tooltipContent}>
            <PlacementBox>bottom-end</PlacementBox>
          </TooltipComponent>
        </Box>
      </Center>
    );
  }

  return (
    <Center>
      <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap="spacing.4">
        <Box display="flex" alignItems="center" flexDirection="column" gap="spacing.4">
          <TooltipComponent placement="top-start" content={tooltipContent}>
            <PlacementBox>top-start</PlacementBox>
          </TooltipComponent>
          <TooltipComponent placement="left" content={tooltipContent}>
            <PlacementBox>left</PlacementBox>
          </TooltipComponent>
          <TooltipComponent placement="bottom-start" content={tooltipContent}>
            <PlacementBox>bottom-start</PlacementBox>
          </TooltipComponent>
        </Box>
        <Box display="flex" alignItems="center" flexDirection="column" gap="spacing.4">
          <TooltipComponent placement="top" content={tooltipContent}>
            <PlacementBox>top</PlacementBox>
          </TooltipComponent>
          <TooltipComponent placement="bottom" content={tooltipContent}>
            <PlacementBox>bottom</PlacementBox>
          </TooltipComponent>
        </Box>
        <Box display="flex" alignItems="center" flexDirection="column" gap="spacing.4">
          <TooltipComponent placement="top-end" content={tooltipContent}>
            <PlacementBox>top-end</PlacementBox>
          </TooltipComponent>
          <TooltipComponent placement="right" content={tooltipContent}>
            <PlacementBox>right</PlacementBox>
          </TooltipComponent>
          <TooltipComponent placement="bottom-end" content={tooltipContent}>
            <PlacementBox>bottom-end</PlacementBox>
          </TooltipComponent>
        </Box>
      </Box>
    </Center>
  );
};

export const Placement = PlacementTemplate.bind({});
Placement.storyName = 'Placement';

const NonInteractiveTriggerTemplate: StoryFn<typeof TooltipComponent> = (args) => {
  return (
    <Box>
      <Text>
        When using non-interactive elements as Tooltip triggers, like Icons, Badges, Counters
      </Text>
      <Text>You can wrap the element in TooltipInteractiveWrapper component provided by blade</Text>
      <Box marginTop="spacing.5" display="flex" alignItems="center" gap="spacing.2">
        <Text>Refunds</Text>
        <TooltipComponent {...args} placement="bottom-start">
          <TooltipInteractiveWrapper>
            <InfoIcon marginTop="spacing.2" size="medium" />
          </TooltipInteractiveWrapper>
        </TooltipComponent>
      </Box>
    </Box>
  );
};

export const NonInteractiveTrigger = NonInteractiveTriggerTemplate.bind({});

const TooltipTriggersTemplate: StoryFn<typeof TooltipComponent> = (args) => {
  return (
    <Center>
      <Box display="flex" gap="spacing.11" alignItems="center" flexWrap="wrap">
        <TooltipComponent {...args} placement="top">
          <Button>button</Button>
        </TooltipComponent>
        <Box marginTop="spacing.8" />
        <TooltipComponent {...args} placement="top">
          <Link onClick={() => console.log(1)} href="#">
            Link
          </Link>
        </TooltipComponent>
        <Box marginTop="spacing.8" />

        <TooltipComponent {...args} content="With IconButton" placement="top-end">
          <IconButton
            size="large"
            onClick={() => console.log(1)}
            icon={BankIcon}
            accessibilityLabel="IconButton"
          />
        </TooltipComponent>
        <Box marginTop="spacing.8" />
        <TooltipComponent {...args} content="With non-interactive icon" placement="bottom">
          <TooltipInteractiveWrapper>
            <InfoIcon size="large" />
          </TooltipInteractiveWrapper>
        </TooltipComponent>
      </Box>
    </Center>
  );
};

export const TooltipTriggers = TooltipTriggersTemplate.bind({});

const CustomTrigger = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode } & BladeCommonEvents
>(({ children, ...props }, ref) => {
  console.log(props);
  return (
    <BaseBox
      ref={ref}
      tabIndex={-1}
      display={isReactNative() ? 'flex' : 'inline-block'}
      alignSelf="flex-start"
      padding="spacing.4"
      borderRadius="medium"
      backgroundColor={
        isReactNative() ? 'surface.background.gray.subtle' : 'surface.background.gray.intense'
      }
      {...props}
    >
      <Text>{children}</Text>
    </BaseBox>
  );
});

const CustomTriggerDocs = () => {
  if (isReactNative()) return null;
  return (
    <List>
      <ListItem>
        Make sure to expose ref from the custom component via{' '}
        <ListItemLink href="https://react.dev/reference/react/forwardRef">
          React.forwardRef
        </ListItemLink>
      </ListItem>
      <ListItem>
        Make sure that your component can receive focus{' '}
        <ListItemText as="span" color="surface.text.gray.muted">
          (eg: have tabIndex:0)
        </ListItemText>
      </ListItem>
      <ListItem>
        Forward event handlers to the custom trigger{' '}
        <ListItemText as="span" color="surface.text.gray.muted">
          (you can import the TooltipTriggerProps type from blade when using TypeScript)
        </ListItemText>
        <List>
          <ListItem>onBlur</ListItem>
          <ListItem>onFocus</ListItem>
          <ListItem>onMouseLeave</ListItem>
          <ListItem>onMouseMove</ListItem>
          <ListItem>onPointerDown</ListItem>
          <ListItem>onPointerEnter</ListItem>
        </List>
      </ListItem>
    </List>
  );
};

const CustomTriggerTemplate = () => {
  return (
    <Box>
      <Text>
        To create a custom trigger, the tooltip component expects the trigger component to expose:
      </Text>

      <CustomTriggerDocs />
      <Text marginBottom="spacing.4">
        Alternatively you can just spread the props to the trigger, instead of adding them 1 by 1
      </Text>
      <Text marginBottom="spacing.4">
        If you are using TypeScript you can import the types for these events from blade as{' '}
        <Code size="medium">BladeCommonEvents</Code>
      </Text>
      <TooltipComponent placement="bottom" content="A custom trigger">
        <CustomTrigger>Hover over me</CustomTrigger>
      </TooltipComponent>
    </Box>
  );
};

export const WithCustomTrigger = CustomTriggerTemplate.bind({});

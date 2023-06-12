/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { Title } from '@storybook/addon-docs';
import type { TooltipTriggerProps } from './types';
import type { TooltipProps } from './';
import { TooltipInteractiveWrapper, Tooltip as TooltipComponent } from './';
import { Button } from '~components/Button';
import { BankIcon, InfoIcon } from '~components/Icons';
import { Link } from '~components/Link';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import { isReactNative } from '~utils';
import { List, ListItem } from '~components/List';
import { IconButton } from '~components/Button/IconButton';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';
import { Sandbox } from '~src/_helpers/storybook/Sandbox';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Switch"
      componentDescription="A switch component is used to quickly switch between two possible states. These are only used for binary actions that occur immediately after the user turn the switch on/off."
      figmaURL={{
        paymentTheme:
          'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=13227%3A163026',
        bankingTheme:
          'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=11169%3A230354',
      }}
    >
      <Title>Usage</Title>
      <Sandbox showConsole>
        {`
        import { Switch } from '@razorpay/blade/components'
        
        function App(): JSX.Element {
          return (
            // Check console
            <Switch onChange={(e) => console.log(e.isChecked)} accessibilityLabel="Toggle DarkMode" />
          )
        }

        export default App;
      `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/Tooltip',
  component: TooltipComponent,
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

const TooltipTemplate: ComponentStory<typeof TooltipComponent> = (args) => {
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

const PlacementBox = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode } & TooltipTriggerProps
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
      backgroundColor="surface.background.level3.lowContrast"
      {...props}
    >
      <Text contrast="low">{children}</Text>
    </Box>
  );
});

const PlacementTemplate: ComponentStory<typeof TooltipComponent> = () => {
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

const NonInteractiveTriggerTemplate: ComponentStory<typeof TooltipComponent> = (args) => {
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
            <InfoIcon marginTop="spacing.2" size="medium" color="surface.text.muted.lowContrast" />
          </TooltipInteractiveWrapper>
        </TooltipComponent>
      </Box>
    </Box>
  );
};

export const NonInteractiveTrigger = NonInteractiveTriggerTemplate.bind({});

const TooltipTriggersTemplate: ComponentStory<typeof TooltipComponent> = (args) => {
  return (
    <Center>
      <Box display="flex" gap="spacing.11" alignItems="center" flexWrap="wrap">
        <TooltipComponent {...args} placement="top">
          <Button>Button</Button>
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
            <InfoIcon size="large" color="surface.text.muted.lowContrast" />
          </TooltipInteractiveWrapper>
        </TooltipComponent>
      </Box>
    </Center>
  );
};

export const TooltipTriggers = TooltipTriggersTemplate.bind({});

const CustomTrigger = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode } & TooltipTriggerProps
>(({ children, ...props }, ref) => {
  return (
    <Box
      ref={ref}
      tabIndex={-1}
      display={isReactNative() ? 'flex' : 'inline-block'}
      alignSelf="flex-start"
      padding="spacing.4"
      borderRadius="medium"
      backgroundColor={
        isReactNative()
          ? 'surface.background.level1.lowContrast'
          : 'surface.background.level2.lowContrast'
      }
      {...props}
    >
      <Text contrast="low">{children}</Text>
    </Box>
  );
});

const CustomTriggerTemplate = () => {
  return (
    <Box>
      <Text>
        To create a custom trigger, the tooltip component expects the trigger component to expose:
      </Text>
      <List>
        <ListItem>To expose ref</ListItem>
        <ListItem>To accept TooltipTriggerProps (You can import this type from blade)</ListItem>
        <ListItem>
          tabIndex={'{'}-1{'}'} to be set on the trigger
        </ListItem>
      </List>
      <TooltipComponent placement="bottom" content="A custom trigger">
        <CustomTrigger>Hover over me</CustomTrigger>
      </TooltipComponent>
    </Box>
  );
};

export const WithCustomTrigger = CustomTriggerTemplate.bind({});

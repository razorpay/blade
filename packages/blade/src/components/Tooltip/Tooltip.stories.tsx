/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import type { TooltipTriggerProps } from './types';
import type { TooltipProps } from './';
import { Tooltip as TooltipComponent } from './';
import { Button } from '~components/Button';
import { InfoIcon } from '~components/Icons';
import { Link } from '~components/Link';
import { IconButton } from '~components/Button/IconButton';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import { List, ListItem } from '~components/List';
import { isReactNative } from '~utils';

export default {
  title: 'Components/Tooltip',
  component: TooltipComponent,
} as Meta<TooltipProps>;

const Center = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <Box width="100%" height="100%" display="flex" alignItems="center" justifyContent="center">
      {children}
    </Box>
  );
};

const TooltipTemplate: ComponentStory<typeof TooltipComponent> = () => {
  return (
    <Center>
      <TooltipComponent content="Hello World">
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

const TooltipTriggersTemplate = () => {
  return (
    <Center>
      <Box display="flex" gap="spacing.11" alignItems="center">
        <TooltipComponent placement="top" content="Hello world">
          <Button>Hover</Button>
        </TooltipComponent>
        <TooltipComponent placement="top" content="Hello world">
          <Link onClick={() => console.log(1)} href="#">
            Hover
          </Link>
        </TooltipComponent>
        <TooltipComponent placement="top-end" content="Hello world">
          <IconButton onClick={() => console.log(1)} icon={InfoIcon} accessibilityLabel="Info" />
        </TooltipComponent>
        <TooltipComponent
          placement="top"
          content="Hello world"
          shouldWrapChildren
          onOpenChange={({ isOpen }) => {
            console.log(isOpen ? 'open' : 'closed');
          }}
        >
          <InfoIcon size="2xlarge" color="action.icon.link.visited" />
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
      tabIndex={0}
      display={isReactNative() ? 'flex' : 'inline-block'}
      alignSelf="flex-start"
      padding="spacing.4"
      borderRadius="medium"
      backgroundColor="surface.background.level2.lowContrast"
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
          tabIndex={'{'}0{'}'} to be set on the trigger
        </ListItem>
      </List>
      <TooltipComponent placement="bottom" content="A custom trigger">
        <CustomTrigger>Hover over me</CustomTrigger>
      </TooltipComponent>
    </Box>
  );
};

export const WithCustomTrigger = CustomTriggerTemplate.bind({});

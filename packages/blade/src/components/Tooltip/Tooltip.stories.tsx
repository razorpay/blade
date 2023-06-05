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

export default {
  title: 'Components/Tooltip',
  component: TooltipComponent,
} as Meta<TooltipProps>;

const Center = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <Box height="100%" display="flex" alignItems="center" justifyContent="center">
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
      flex={1}
      flexShrink={0}
      flexBasis="25%"
      padding="spacing.5"
      backgroundColor="surface.background.level2.lowContrast"
      {...props}
    >
      <Text contrast="low">{children}</Text>
    </Box>
  );
});

const PlacementTemplate: ComponentStory<typeof TooltipComponent> = () => {
  return (
    <Center>
      <Box
        width="60%"
        display="flex"
        justifyContent="spacing-between"
        flexWrap="wrap"
        gap="spacing.4"
      >
        <TooltipComponent placement="top-start" content="Hello world">
          <PlacementBox>top-start</PlacementBox>
        </TooltipComponent>
        <TooltipComponent placement="top" content="Hello world">
          <PlacementBox>top</PlacementBox>
        </TooltipComponent>
        <TooltipComponent placement="top-end" content="Hello world">
          <PlacementBox>top-end</PlacementBox>
        </TooltipComponent>
        <TooltipComponent
          placement="left-start"
          content="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"
        >
          <PlacementBox>left-start</PlacementBox>
        </TooltipComponent>
        <TooltipComponent placement="right" content="Hello world">
          <PlacementBox>right</PlacementBox>
        </TooltipComponent>
        <TooltipComponent
          placement="right-start"
          content="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"
        >
          <PlacementBox>right-start</PlacementBox>
        </TooltipComponent>
        <TooltipComponent
          placement="left-end"
          content="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"
        >
          <PlacementBox>left-end</PlacementBox>
        </TooltipComponent>
        <TooltipComponent placement="left" content="Hello world">
          <PlacementBox>left</PlacementBox>
        </TooltipComponent>
        <TooltipComponent
          placement="right-end"
          content="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"
        >
          <PlacementBox>right-end</PlacementBox>
        </TooltipComponent>
        <TooltipComponent placement="bottom-start" content="Hello world">
          <PlacementBox>bottom-start</PlacementBox>
        </TooltipComponent>
        <TooltipComponent placement="bottom" content="Hello world">
          <PlacementBox>bottom</PlacementBox>
        </TooltipComponent>
        <TooltipComponent placement="bottom-end" content="Hello world">
          <PlacementBox>bottom-end</PlacementBox>
        </TooltipComponent>
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
        <TooltipComponent placement="top" content="Hello world">
          <IconButton onClick={() => console.log(1)} icon={InfoIcon} accessibilityLabel="Info" />
        </TooltipComponent>
        <TooltipComponent
          placement="top"
          onOpen={() => console.log('open')}
          onClose={() => console.log('close')}
          content="Hello world"
          shouldWrapChildren
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
      display="inline-block"
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

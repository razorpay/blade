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

export default {
  title: 'Components/Tooltip',
  component: TooltipComponent,
} as Meta<TooltipProps>;

const CustomTrigger = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode } & TooltipTriggerProps
>(({ children, ...props }, ref) => {
  return (
    <Box
      tabIndex={0}
      ref={ref}
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

const TooltipTemplate: ComponentStory<typeof TooltipComponent> = () => {
  return (
    <Box height="100%" display="flex" alignItems="center" justifyContent="center">
      <Box
        width="600px"
        display="flex"
        justifyContent="spacing-between"
        flexWrap="wrap"
        gap="spacing.4"
      >
        <TooltipComponent placement="top-start" content="Hello world">
          <CustomTrigger>top-start</CustomTrigger>
        </TooltipComponent>
        <TooltipComponent placement="top" content="Hello world">
          <CustomTrigger>top</CustomTrigger>
        </TooltipComponent>
        <TooltipComponent placement="top-end" content="Hello world">
          <CustomTrigger>top-end</CustomTrigger>
        </TooltipComponent>
        <TooltipComponent
          placement="left-start"
          content="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"
        >
          <CustomTrigger>left-start</CustomTrigger>
        </TooltipComponent>
        <TooltipComponent placement="right" content="Hello world">
          <CustomTrigger>right</CustomTrigger>
        </TooltipComponent>
        <TooltipComponent
          placement="right-start"
          content="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"
        >
          <CustomTrigger>right-start</CustomTrigger>
        </TooltipComponent>
        <TooltipComponent
          placement="left-end"
          content="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"
        >
          <CustomTrigger>left-end</CustomTrigger>
        </TooltipComponent>
        <TooltipComponent placement="left" content="Hello world">
          <CustomTrigger>left</CustomTrigger>
        </TooltipComponent>
        <TooltipComponent
          placement="right-end"
          content="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"
        >
          <CustomTrigger>right-end</CustomTrigger>
        </TooltipComponent>
        <TooltipComponent placement="bottom-start" content="Hello world">
          <CustomTrigger>bottom-start</CustomTrigger>
        </TooltipComponent>
        <TooltipComponent placement="bottom" content="Hello world">
          <CustomTrigger>bottom</CustomTrigger>
        </TooltipComponent>
        <TooltipComponent placement="bottom-end" content="Hello world">
          <CustomTrigger>bottom-end</CustomTrigger>
        </TooltipComponent>
      </Box>
    </Box>
  );
};

export const Default = TooltipTemplate.bind({});
Default.storyName = 'Default';

const TooltipTriggersTemplate = () => {
  return (
    <Box display="flex" gap="spacing.11">
      <TooltipComponent placement="right-end" content="Hello world">
        <Button>Hover</Button>
      </TooltipComponent>
      <TooltipComponent placement="left" content="Hello world 1">
        <Link onClick={() => console.log(1)} href="#">
          Hover
        </Link>
      </TooltipComponent>
      <TooltipComponent placement="top" content="Hello world 2">
        <IconButton onClick={() => console.log(1)} icon={InfoIcon} accessibilityLabel="Info" />
      </TooltipComponent>
      <TooltipComponent
        placement="bottom"
        onOpen={() => console.log('open')}
        onClose={() => console.log('close')}
        content="Hello world 2"
        shouldWrapChildren
      >
        <InfoIcon size="2xlarge" color="action.icon.link.visited" />
      </TooltipComponent>
    </Box>
  );
};

export const TooltipTriggers = TooltipTriggersTemplate.bind({});

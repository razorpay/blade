/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import type { TooltipProps } from './';
import { Tooltip as TooltipComponent } from './';
import { Button } from '~components/Button';
import { InfoIcon } from '~components/Icons';
import { Link } from '~components/Link';
import { IconButton } from '~components/Button/IconButton';
import { Box } from '~components/Box';

export default {
  title: 'Components/Tooltip',
  component: TooltipComponent,
} as Meta<TooltipProps>;

const TooltipTemplate: ComponentStory<typeof TooltipComponent> = () => {
  return (
    <Box display="flex" gap="spacing.11">
      <TooltipComponent content="Hello world">
        <Button>Hover</Button>
      </TooltipComponent>
      <TooltipComponent content="Hello world 1">
        <Link href="#">Hover</Link>
      </TooltipComponent>
      <TooltipComponent content="Hello world 2">
        <IconButton onClick={() => 1} icon={InfoIcon} accessibilityLabel="Info" />
      </TooltipComponent>
      <TooltipComponent content="Hello world 2" shouldWrapChildren>
        <InfoIcon size="2xlarge" color="action.icon.link.visited" />
      </TooltipComponent>
    </Box>
  );
};

export const Default = TooltipTemplate.bind({});
Default.storyName = 'Default';

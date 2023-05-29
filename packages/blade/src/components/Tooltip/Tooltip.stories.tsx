/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import type { TooltipProps } from './';
import { Tooltip as TooltipComponent } from './';
import { Button } from '~components/Button';

export default {
  title: 'Components/Tooltip',
  component: TooltipComponent,
} as Meta<TooltipProps>;

const TooltipTemplate: ComponentStory<typeof TooltipComponent> = () => {
  return (
    <TooltipComponent content="Hello world">
      <Button>Hover</Button>
    </TooltipComponent>
  );
};

export const Default = TooltipTemplate.bind({});
Default.storyName = 'Default';

/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import type { StepItemProps } from './types';
import { StepItem, StepGroup, StepItemIndicator, StepItemIcon } from './';
import { Box } from '~components/Box';
import { CheckIcon } from '~components/Icons';

const stepItemColors = [
  'positive',
  'neutral',
  'notice',
  'information',
  'primary',
  'negative',
] as const;

const indicatorMappings = stepItemColors.reduce<Record<string, React.ReactElement>>(
  (prevObj, itemColor) => {
    prevObj[`<StepItemIndicator color="${itemColor}" />`] = <StepItemIndicator color={itemColor} />;

    return prevObj;
  },
  {},
);

const iconMappings = stepItemColors.reduce<Record<string, React.ReactElement>>(
  (prevObj, itemColor) => {
    prevObj[`<StepItemIcon color="${itemColor}" icon={CheckIcon} />`] = (
      <StepItemIcon icon={CheckIcon} color={itemColor} />
    );
    return prevObj;
  },
  {},
);

const markerMapping = { ...indicatorMappings, ...iconMappings };

export default {
  title: 'Components/StepGroup/Step Item Playground',
  component: StepItem,
  argTypes: {
    marker: {
      // weird TS error
      type: 'select' as 'string',
      options: Object.keys(markerMapping),
      mapping: markerMapping,
    },
    _nestingLevel: {
      table: {
        disable: true,
      },
    },
    _index: {
      table: {
        disable: true,
      },
    },
    _totalIndex: {
      table: {
        disable: true,
      },
    },
  },
  parameters: {},
} as Meta<StepItemProps>;

const StepItemTemplate: StoryFn<typeof StepItem> = (args) => {
  return (
    <Box>
      <StepGroup>
        <StepItem title="First Item" description="A test item to show how first item looks like" />
        <StepItem {...args} />
        <StepItem title="Last Item" description="A test item to show how last item looks like" />
      </StepGroup>
    </Box>
  );
};

export const StepItemPlayground = StepItemTemplate.bind({});
StepItemPlayground.args = {
  title: 'Item Title',
  timestamp: 'Thu 15th Oct, 2024',
  description: 'Item Description',
  onClick: undefined,
};
StepItemPlayground.storyName = 'Step Item Playground';

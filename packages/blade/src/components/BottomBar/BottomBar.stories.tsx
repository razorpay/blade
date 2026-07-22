import React from 'react';
import type { StoryFn, Meta } from '@storybook/react-vite';
import { BottomBar } from './BottomBar';
import type { BottomBarProps } from './types';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import { Heading, Text } from '~components/Typography';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

export default {
  title: 'Components/BottomBar',
  component: BottomBar,
  tags: ['autodocs'],
  argTypes: getStyledPropsArgTypes(),
  globals: {
    viewport: {
      value: 'iPhone6',
      isRotated: false,
    },
  },
} as Meta<typeof BottomBar>;

const Template: StoryFn<BottomBarProps> = ({ children, ...args }) => {
  return (
    <Box minHeight="400px" padding="spacing.4">
      <Heading size="medium">BottomBar Example</Heading>
      <Text marginTop="spacing.2" color="surface.text.gray.muted">
        BottomBar stays fixed to the bottom and can contain primary mobile actions.
      </Text>
      <BottomBar {...args}>
        {children ?? (
          <>
            <Button variant="secondary" isFullWidth>
              Cancel
            </Button>
            <Button isFullWidth>Continue</Button>
          </>
        )}
      </BottomBar>
    </Box>
  );
};

export const Default = Template.bind({});
Default.args = {};

export const SingleAction = Template.bind({});
SingleAction.args = {
  children: (
    <Button isFullWidth size="large">
      Continue
    </Button>
  ),
};

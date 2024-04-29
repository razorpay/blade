import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { SideNav } from './SideNav';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Box } from '~components/Box';

export default {
  title: 'Components/SideNav',
  component: SideNav,
  tags: ['autodocs'],
  argTypes: {
    ...getStyledPropsArgTypes(),
  },
} as Meta<typeof SideNav>;

const SideNavTemplate: StoryFn<typeof SideNav> = ({ children }) => {
  return (
    <Box>
      <SideNav>{children}</SideNav>
    </Box>
  );
};

export const Default = SideNavTemplate.bind({});

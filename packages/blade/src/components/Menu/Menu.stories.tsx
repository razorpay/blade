import React from 'react';
import type { Meta } from '@storybook/react';
import { Menu, MenuItem } from './Menu';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { Text } from '~components/Typography';
import { Avatar } from '~components/Avatar';

export default {
  title: 'Components/Menu',
  component: Menu,
  tags: ['autodocs'],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as Meta<any>;

export const Default = (): React.ReactElement => {
  return (
    <Box>
      <Menu label="Edit">
        <Box display="flex" paddingY="spacing.4" gap="spacing.2">
          <Avatar name="Saurabh Daware" />
          <Text>Saurabh Daware</Text>
        </Box>
        <MenuItem label="Undo" onClick={() => console.log('Undo')} />
        <MenuItem label="Redo" disabled />
        <MenuItem label="Cut" />
        <Menu label="Copy as">
          <MenuItem label="Text" />
          <MenuItem label="Video" />
          <Menu label="Image">
            <MenuItem label=".png" />
            <MenuItem label=".jpg" />
            <MenuItem label=".svg" />
            <MenuItem label=".gif" />
          </Menu>
          <MenuItem label="Audio" />
        </Menu>
        <Menu label="Share">
          <MenuItem label="Mail" />
          <MenuItem label="Instagram" />
        </Menu>
        <Button>Apply</Button>
      </Menu>
      <Button>Hello</Button>
    </Box>
  );
};

import React from 'react';
import type { Meta } from '@storybook/react';
import { Menu, MenuItem } from './Menu';
import { Box } from '~components/Box';
import { Button } from '~components/Button';

export default {
  title: 'Components/Menu',
  component: Menu,
  tags: ['autodocs'],
} as Meta<any>;

export const Default = () => {
  return (
    <Box>
      <Menu label="Edit">
        <b>hi</b>
        <button>test</button>
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
      </Menu>
      <Button>Hello</Button>
    </Box>
  );
};

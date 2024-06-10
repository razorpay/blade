import React from 'react';
import type { Meta } from '@storybook/react';
import { Menu, MenuDivider, MenuItem, MenuOverlay } from './Menu';
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
      <Menu>
        <Button>Edit wow</Button>
        <MenuOverlay>
          <Box display="flex" paddingY="spacing.4" gap="spacing.2">
            <Avatar name="Saurabh Daware" />
            <Text>Saurabh Daware</Text>
          </Box>
          <MenuItem label="Undo" onClick={() => console.log('Undo')} />
          <MenuItem label="Redo" disabled />
          <MenuItem label="Cut" />
          <Menu>
            <MenuItem label="Copy as" />
            <MenuOverlay>
              <MenuItem label="Text" />
              <MenuItem label="Video" />
              <Menu>
                <MenuItem label="Image" />
                <MenuOverlay>
                  <MenuItem label=".png" />
                  <MenuItem label=".jpg" />
                  <MenuItem label=".svg" />
                  <MenuItem label=".gif" />
                </MenuOverlay>
              </Menu>
              <MenuItem label="Audio" />
            </MenuOverlay>
          </Menu>
          <Menu>
            <MenuItem label="Share" />
            <MenuOverlay>
              <MenuItem label="Mail" />
              <MenuItem label="Instagram" />
            </MenuOverlay>
          </Menu>
          <MenuDivider />
          <MenuItem label="Log Out" />
          <Button>Apply</Button>
        </MenuOverlay>
      </Menu>
      <Button>Hello</Button>
    </Box>
  );
};

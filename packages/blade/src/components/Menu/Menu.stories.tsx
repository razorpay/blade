import React from 'react';
import type { Meta } from '@storybook/react';
import { Menu, MenuDivider, MenuItem, MenuOverlay } from './';
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
          <MenuItem title="Undo" onClick={() => console.log('Undo')} />
          <MenuItem title="Redo" isDisabled />
          <MenuItem title="Cut" />
          <Menu>
            <MenuItem title="Copy as" />
            <MenuOverlay>
              <MenuItem title="Text" />
              <MenuItem title="Video" />
              <Menu>
                <MenuItem title="Image" />
                <MenuOverlay>
                  <MenuItem title=".png" />
                  <MenuItem title=".jpg" />
                  <MenuItem title=".svg" />
                  <MenuItem title=".gif" />
                </MenuOverlay>
              </Menu>
              <MenuItem title="Audio" />
            </MenuOverlay>
          </Menu>
          <Menu>
            <MenuItem title="Share" />
            <MenuOverlay>
              <MenuItem title="Mail" />
              <MenuItem title="Instagram" />
            </MenuOverlay>
          </Menu>
          <MenuDivider />
          <MenuItem title="Log Out" />
          <Button>Apply</Button>
        </MenuOverlay>
      </Menu>
      <Button>Hello</Button>
    </Box>
  );
};

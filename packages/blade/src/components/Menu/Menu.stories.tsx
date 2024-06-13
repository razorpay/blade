import React from 'react';
import type { Meta } from '@storybook/react';
import { Menu, MenuDivider, MenuItem, MenuOverlay, MenuHeader, MenuFooter } from './';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { TestIcon, UserIcon } from '~components/Icons';

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
          <MenuHeader title="Saurabh Daware" subtitle="Admin" leading={<UserIcon />} />
          <MenuItem
            title="Enable Test Mode"
            leading={<TestIcon size="small" />}
            description="Enable test mode"
            onClick={() => console.log('Undo')}
          />
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
              <MenuItem title="Audio" href="/audio" />
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
          <MenuItem title="Log Out" color="negative" />
          <MenuFooter>
            <Button>Apply</Button>
          </MenuFooter>
        </MenuOverlay>
      </Menu>
      <Button>Hello</Button>
    </Box>
  );
};

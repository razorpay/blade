import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { Drawer, DrawerBody, DrawerHeader, DrawerHeaderBadge, DrawerHeaderIcon } from './';
import type { DrawerProps } from './';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Box } from '~components/Box';
import iconMap from '~components/Icons/iconMap';
import { Button } from '~components/Button';
import { AnnouncementIcon, DownloadIcon } from '~components/Icons';
import { Card, CardBody } from '~components/Card';

export default {
  title: 'Components/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  argTypes: {
    ...getStyledPropsArgTypes(),
    icon: {
      name: 'icon',
      type: 'select' as 'string',
      options: Object.keys(iconMap),
      mapping: iconMap,
    },
    _isVirtuallyFocussed: {
      table: {
        disable: true,
      },
    },
  },
} as Meta<DrawerProps>;

const DrawerTemplate: StoryFn<typeof Drawer> = ({ children, ...args }) => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isSecondDrawerOpen, setIsSecondDrawerOpen] = React.useState(false);
  return (
    <Box>
      <Button onClick={() => setIsDrawerOpen(!isDrawerOpen)}>Toggle Drawer</Button>
      <Drawer isOpen={isDrawerOpen} onDismiss={() => setIsDrawerOpen(false)}>
        <DrawerHeader
          leading={<DrawerHeaderIcon icon={AnnouncementIcon} />}
          title="Announcements"
          titleSuffix={<DrawerHeaderBadge color="positive">New</DrawerHeaderBadge>}
          subtitle="This is an announcement"
          trailing={<Button icon={DownloadIcon} />}
        />
        <DrawerBody>
          <Card padding="spacing.0">
            <CardBody>
              <img
                width="100%"
                style={{
                  aspectRatio: '2 / 1',
                }}
                src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMTdtZzAzNTQ5dHQ3d2hnampjdzZ2MmduOGJ5djRlMndmdWx3eHFsZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xJjs8eGVbjNYY/giphy.gif"
              />
            </CardBody>
          </Card>
          <Button marginTop="spacing.4" onClick={() => setIsSecondDrawerOpen(!isSecondDrawerOpen)}>
            Open Next Drawer
          </Button>
        </DrawerBody>
      </Drawer>

      <Drawer isOpen={isSecondDrawerOpen} onDismiss={() => setIsSecondDrawerOpen(false)}>
        <DrawerHeader title="Announcements Two" subtitle="This is second drawer" />
        <DrawerBody>
          <Card>
            <CardBody>
              <Box>Second Drawer</Box>
            </CardBody>
          </Card>
        </DrawerBody>
      </Drawer>
    </Box>
  );
};

export const Default = DrawerTemplate.bind({});

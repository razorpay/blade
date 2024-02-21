import React from 'react';
import type { Meta } from '@storybook/react';
import { Drawer } from '../Drawer';
import {
  BasicDrawerStory,
  DrawerStackingStory,
  DrawerWithTableStory,
  ScrollableContentStory,
} from './stories';
import { Sandbox } from '~utils/storybook/Sandbox';

const DrawerMeta: Meta = {
  title: 'Components/Drawer/Examples',
  component: Drawer,
  parameters: {
    viewMode: 'story',
    options: {
      showPanel: false,
    },
    previewTabs: {
      'storybook/docs/panel': {
        hidden: true,
      },
    },
    chromatic: { disableSnapshot: true },
  },
};

export const BasicDrawer = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="90vh">
      {BasicDrawerStory}
    </Sandbox>
  );
};

export const DrawerStacking = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="90vh">
      {DrawerStackingStory}
    </Sandbox>
  );
};

export const DrawerWithTable = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="90vh">
      {DrawerWithTableStory}
    </Sandbox>
  );
};

export const ScrollableContent = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="90vh">
      {ScrollableContentStory}
    </Sandbox>
  );
};

export default DrawerMeta;

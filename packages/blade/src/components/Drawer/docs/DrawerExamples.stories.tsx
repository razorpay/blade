import React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import { Drawer } from '../Drawer';
import { BasicDrawerStory } from './stories';
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

const DrawerTemplate: StoryFn<typeof Drawer> = () => {
  return (
    <Sandbox padding="spacing.0" editorHeight="90vh">
      {BasicDrawerStory}
    </Sandbox>
  );
};

export const BasicDrawer = DrawerTemplate.bind({});

// export const DrawerWithHeaderFooter = (): React.ReactElement => {
//   return (
//     <Sandbox padding="spacing.0" editorHeight="90vh">
//       {DrawerWithHeaderFooterStory}
//     </Sandbox>
//   );
// };

// export const DrawerWithScrollableBackground = (): React.ReactElement => {
//   return (
//     <Sandbox padding="spacing.0" editorHeight="90vh">
//       {DrawerWithScrollableBackgroundStory}
//     </Sandbox>
//   );
// };

// export const DrawerWithScrollableContent = (): React.ReactElement => {
//   return (
//     <Sandbox padding="spacing.0" editorHeight="90vh">
//       {DrawerWithScrollableContentStory}
//     </Sandbox>
//   );
// };

// export const DrawerStacking = (): React.ReactElement => {
//   return (
//     <Sandbox padding="spacing.0" editorHeight="90vh">
//       {DrawerStackingStory}
//     </Sandbox>
//   );
// };

// export const DrawerWithNoBodyPadding = (): React.ReactElement => {
//   return (
//     <Sandbox padding="spacing.0" editorHeight="90vh">
//       {DrawerWithNoBodyPaddingStory}
//     </Sandbox>
//   );
// };

export default DrawerMeta;

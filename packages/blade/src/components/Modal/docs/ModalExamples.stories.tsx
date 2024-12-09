import React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import { Modal } from '../Modal';
import {
  BasicModalStory,
  ModalWithNoBodyPaddingStory,
  ModalWithScrollableBackgroundStory,
  ModalWithScrollableContentStory,
  ModalWithHeaderFooterStory,
  ModalStackingStory,
} from './stories';
import { Sandbox } from '~utils/storybook/Sandbox';

const ModalMeta: Meta = {
  title: 'Components/Modal/Examples',
  component: Modal,
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

const ModalTemplate: StoryFn<typeof Modal> = () => {
  return (
    <Sandbox padding="spacing.0" editorHeight="100vh">
      {BasicModalStory}
    </Sandbox>
  );
};

export const BasicModal = ModalTemplate.bind({});

export const ModalWithHeaderFooter = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="100vh">
      {ModalWithHeaderFooterStory}
    </Sandbox>
  );
};

export const ModalWithScrollableBackground = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="100vh">
      {ModalWithScrollableBackgroundStory}
    </Sandbox>
  );
};

export const ModalWithScrollableContent = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="100vh">
      {ModalWithScrollableContentStory}
    </Sandbox>
  );
};

export const ModalStacking = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="100vh">
      {ModalStackingStory}
    </Sandbox>
  );
};

export const ModalWithNoBodyPadding = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="100vh">
      {ModalWithNoBodyPaddingStory}
    </Sandbox>
  );
};

export default ModalMeta;

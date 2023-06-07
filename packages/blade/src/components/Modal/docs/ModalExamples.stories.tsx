import React from 'react';
import type { ComponentStory, Meta } from '@storybook/react';
import { Modal } from '../Modal';
import {
  BasicModalStory,
  ModalStackingStory,
  ModalWithHeaderFooterStory,
  ModalWithNoBodyPaddingStory,
  ModalWithScrollableBackgroundStory,
  ModalWithScrollableContentStory,
} from './stories';
import { Sandbox } from '~src/_helpers/storybook/Sandbox';

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

const ModalTemplate: ComponentStory<typeof Modal> = () => {
  return (
    <Sandbox showConsole padding="spacing.0" editorHeight="90vh">
      {BasicModalStory}
    </Sandbox>
  );
};

export const BasicModal = ModalTemplate.bind({});

export const ModalWithHeaderFooter = (): JSX.Element => {
  return (
    <Sandbox padding="spacing.0" editorHeight="90vh">
      {ModalWithHeaderFooterStory}
    </Sandbox>
  );
};

export const ModalWithScrollableBackground = (): JSX.Element => {
  return (
    <Sandbox padding="spacing.0" editorHeight="90vh">
      {ModalWithScrollableBackgroundStory}
    </Sandbox>
  );
};

export const ModalWithScrollableContent = (): JSX.Element => {
  return (
    <Sandbox padding="spacing.0" editorHeight="90vh">
      {ModalWithScrollableContentStory}
    </Sandbox>
  );
};

export const ModalStacking = (): JSX.Element => {
  return (
    <Sandbox padding="spacing.0" editorHeight="90vh">
      {ModalStackingStory}
    </Sandbox>
  );
};

export const ModalWithNoBodyPadding = (): JSX.Element => {
  return (
    <Sandbox padding="spacing.0" editorHeight="90vh">
      {ModalWithNoBodyPaddingStory}
    </Sandbox>
  );
};

export default ModalMeta;

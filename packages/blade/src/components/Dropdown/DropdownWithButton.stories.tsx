import React from 'react';
import { DropdownButton } from './DropdownButton';
import {
  WithControlledMenuStory,
  WithControlledMultiSelectMenuStory,
  WithSimpleMenuStory,
} from './docs/stories';
import { Dropdown } from '.';
import { Sandbox } from '~src/_helpers/storybook/Sandbox';

const DropdownStoryMeta = {
  title: 'Components/Dropdown/Stories/With Button',
  component: Dropdown,
  subcomponents: { DropdownButton },
  args: {},
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
  },
};

export const Default = (): JSX.Element => {
  return (
    <Sandbox padding="spacing.0" editorHeight="100vh">
      {WithSimpleMenuStory}
    </Sandbox>
  );
};

export const WithControlledMenu = (): JSX.Element => {
  return (
    <Sandbox padding="spacing.0" editorHeight="100vh">
      {WithControlledMenuStory}
    </Sandbox>
  );
};

export const WithControlledMultiSelect = (): JSX.Element => {
  return (
    <Sandbox padding="spacing.0" editorHeight="100vh">
      {WithControlledMultiSelectMenuStory}
    </Sandbox>
  );
};

export default DropdownStoryMeta;

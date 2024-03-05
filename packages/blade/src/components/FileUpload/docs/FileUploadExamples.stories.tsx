import React from 'react';
import type { Meta } from '@storybook/react';
import { FileUpload } from '../FileUpload';
import {
  CustomPreviewStory,
  AutoFileUploadWithProgressStory,
  SingleFileUploadStory,
  MultiFileUploadStory,
  DirectFileUploadStory,
} from './stories';
import { Sandbox } from '~utils/storybook/Sandbox';

const FileUploadMeta: Meta = {
  title: 'Components/FileUpload/Sandbox Examples',
  component: FileUpload,
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

export const SingleFileUpload = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="90vh">
      {SingleFileUploadStory}
    </Sandbox>
  );
};

export const MultiFileUpload = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="90vh">
      {MultiFileUploadStory}
    </Sandbox>
  );
};

export const DirectFileUploadOnSelection = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="90vh">
      {DirectFileUploadStory}
    </Sandbox>
  );
};

export const ShowUploadProgress = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="90vh">
      {AutoFileUploadWithProgressStory}
    </Sandbox>
  );
};

export const CustomPreview = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="90vh">
      {CustomPreviewStory}
    </Sandbox>
  );
};

export default FileUploadMeta;

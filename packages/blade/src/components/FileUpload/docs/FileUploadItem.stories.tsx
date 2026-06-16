import React, { useState } from 'react';
import type { StoryFn, Meta } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import type { FileUploadItemProps } from '../FileUploadItem';
import { FileUploadItem } from '../FileUploadItem';
import type { BladeFile } from '../types';
import { Box } from '~components/Box';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Heading } from '~components/Typography/Heading';
import { Text } from '~components/Typography/Text';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="FileUploadItem"
      componentDescription="FileUploadItem is a sub-component of FileUpload that displays individual file items with their upload status, actions, and progress."
      apiDecisionLink={null}
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=78670-22400&t=iCPjenOx6kthCZaE-1&scaling=min-zoom&page-id=74796%3A315549&mode=design"
    />
  );
};

// Helper to create a mock BladeFile
const createMockFile = (name: string, size: number, overrides?: Partial<BladeFile>): BladeFile => {
  const file = new File([''], name, { type: 'application/octet-stream' }) as BladeFile;
  Object.defineProperty(file, 'size', { value: size });
  return {
    ...file,
    id: `file-${Date.now()}`,
    name,
    size,
    ...overrides,
  } as BladeFile;
};

export default {
  title: 'Components/FileUpload/FileUploadItem',
  component: FileUploadItem,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    onPreview: { action: 'preview clicked' },
    onRemove: { action: 'remove clicked' },
    onReupload: { action: 'reupload clicked' },
    onDismiss: { action: 'dismiss clicked' },
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<FileUploadItemProps>;

const FileUploadItemTemplate: StoryFn<typeof FileUploadItem> = (args) => {
  return (
    <Box maxWidth="400px">
      <FileUploadItem {...args} />
    </Box>
  );
};

// Success State
export const SuccessState = FileUploadItemTemplate.bind({});
SuccessState.storyName = 'Success State';
SuccessState.args = {
  file: createMockFile('document.pdf', 1024 * 500, { status: 'success' }),
  size: 'medium',
  onRemove: ({ file }) => action('onRemove')(file.name),
  onPreview: ({ file }) => action('onPreview')(file.name),
};

// Success State with Preview
export const SuccessWithPreview = FileUploadItemTemplate.bind({});
SuccessWithPreview.storyName = 'Success State with Preview';
SuccessWithPreview.args = {
  file: createMockFile('image.png', 1024 * 1024 * 1.5, { status: 'success' }),
  size: 'medium',
  onPreview: ({ file }) => action('onPreview')(file.name),
  onRemove: ({ file }) => action('onRemove')(file.name),
};

// Uploading State
export const UploadingState = FileUploadItemTemplate.bind({});
UploadingState.storyName = 'Uploading State';
UploadingState.args = {
  file: createMockFile('large-file.zip', 1024 * 1024 * 10, {
    status: 'uploading',
    uploadPercent: 45,
  }),
  size: 'medium',
  onDismiss: ({ file }) => action('onDismiss')(file.name),
};

// Uploading State (Indeterminate)
export const UploadingIndeterminate = FileUploadItemTemplate.bind({});
UploadingIndeterminate.storyName = 'Uploading State (Indeterminate)';
UploadingIndeterminate.args = {
  file: createMockFile('uploading-file.docx', 1024 * 1024 * 2, {
    status: 'uploading',
    // No uploadPercent - will show indeterminate progress
  }),
  size: 'medium',
  onDismiss: ({ file }) => action('onDismiss')(file.name),
};

// Error State
export const ErrorState = FileUploadItemTemplate.bind({});
ErrorState.storyName = 'Error State';
ErrorState.args = {
  file: createMockFile('failed-upload.xlsx', 1024 * 1024 * 5, {
    status: 'error',
    errorText: 'Upload failed. Please try again.',
  }),
  size: 'medium',
  onReupload: ({ file }) => action('onReupload')(file.name),
  onRemove: ({ file }) => action('onRemove')(file.name),
};

// Error State without remove (re-upload only)
export const ErrorStateReuploadOnly = FileUploadItemTemplate.bind({});
ErrorStateReuploadOnly.storyName = 'Error State (Re-upload only)';
ErrorStateReuploadOnly.args = {
  file: createMockFile('failed-upload.xlsx', 1024 * 1024 * 5, {
    status: 'error',
    errorText: 'Upload failed. Please try again.',
  }),
  size: 'medium',
  onReupload: ({ file }) => action('onReupload')(file.name),
  onRemove: undefined,
};

// Large Size
export const LargeSize = FileUploadItemTemplate.bind({});
LargeSize.storyName = 'Large Size';
LargeSize.args = {
  file: createMockFile('report.pdf', 1024 * 1024 * 3.5, { status: 'success' }),
  size: 'large',
  onPreview: ({ file }) => action('onPreview')(file.name),
  onRemove: ({ file }) => action('onRemove')(file.name),
};

// Small Size
export const SmallSize = FileUploadItemTemplate.bind({});
SmallSize.storyName = 'Small Size';
SmallSize.args = {
  file: createMockFile('invoice.pdf', 1024 * 256, { status: 'success' }),
  size: 'small',
  onPreview: ({ file }) => action('onPreview')(file.name),
  onRemove: ({ file }) => action('onRemove')(file.name),
};

// Small Size - All States
const SmallAllStatesTemplate: StoryFn<typeof FileUploadItem> = () => {
  return (
    <Box maxWidth="400px" display="flex" flexDirection="column" gap="spacing.4">
      <Heading size="small">Small - Success</Heading>
      <FileUploadItem
        file={createMockFile('logo.png', 1024 * 120, { status: 'success' })}
        size="small"
        onPreview={({ file }) => action('onPreview')(file.name)}
        onRemove={({ file }) => action('onRemove')(file.name)}
      />

      <Heading size="small">Small - Uploading</Heading>
      <FileUploadItem
        file={createMockFile('photo.jpg', 1024 * 1024 * 2, { status: 'uploading', uploadPercent: 42 })}
        size="small"
        onDismiss={({ file }) => action('onDismiss')(file.name)}
      />

      <Heading size="small">Small - Error</Heading>
      <FileUploadItem
        file={createMockFile('corrupted.zip', 1024 * 1024, { status: 'error', errorText: 'Upload failed' })}
        size="small"
        onReupload={({ file }) => action('onReupload')(file.name)}
        onRemove={({ file }) => action('onRemove')(file.name)}
      />
    </Box>
  );
};

export const SmallAllStates = SmallAllStatesTemplate.bind({});
SmallAllStates.storyName = 'Small Size - All States';

// Thumbnail Preview
const ThumbnailTemplate: StoryFn<typeof FileUploadItem> = () => {
  const sampleImageUrl =
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzFhMWEyZSIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjgwIiByPSI0MCIgZmlsbD0iIzRhOTBkOSIvPjxwYXRoIGQ9Ik0wIDE0MCBMNjAgMTAwIEwxMjAgMTMwIEwxNjAgOTAgTDIwMCAxMjAgTDIwMCAyMDAgTDAgMjAwIFoiIGZpbGw9IiMyZDZiNGUiLz48L3N2Zz4=';

  return (
    <Box maxWidth="400px" display="flex" flexDirection="column" gap="spacing.4">
      <Heading size="small">Small with Thumbnail</Heading>
      <FileUploadItem
        file={createMockFile('photo.jpg', 1024 * 500, { status: 'success' })}
        size="small"
        thumbnail={sampleImageUrl}
        onPreview={({ file }) => action('onPreview')(file.name)}
        onRemove={({ file }) => action('onRemove')(file.name)}
      />

      <Heading size="small">Medium with Thumbnail</Heading>
      <FileUploadItem
        file={createMockFile('banner.png', 1024 * 1024 * 1.2, { status: 'success' })}
        size="medium"
        thumbnail={sampleImageUrl}
        onPreview={({ file }) => action('onPreview')(file.name)}
        onRemove={({ file }) => action('onRemove')(file.name)}
      />

      <Heading size="small">Large with Thumbnail</Heading>
      <FileUploadItem
        file={createMockFile('hero-image.jpg', 1024 * 1024 * 3, { status: 'success' })}
        size="large"
        thumbnail={sampleImageUrl}
        onPreview={({ file }) => action('onPreview')(file.name)}
        onRemove={({ file }) => action('onRemove')(file.name)}
      />

      <Heading size="small">Thumbnail with broken URL (fallback to icon)</Heading>
      <FileUploadItem
        file={createMockFile('missing.png', 1024 * 200, { status: 'success' })}
        size="medium"
        thumbnail="https://invalid-url-that-will-fail.example/image.png"
        onRemove={({ file }) => action('onRemove')(file.name)}
      />
    </Box>
  );
};

export const ThumbnailPreview = ThumbnailTemplate.bind({});
ThumbnailPreview.storyName = 'Thumbnail Preview';

// All States
const AllStatesTemplate: StoryFn<typeof FileUploadItem> = () => {
  const [lastAction, setLastAction] = useState<string>('');

  const successFile = createMockFile('document.pdf', 1024 * 500, { status: 'success' });
  const uploadingFile = createMockFile('uploading.zip', 1024 * 1024 * 10, {
    status: 'uploading',
    uploadPercent: 65,
  });
  const errorFile = createMockFile('failed.xlsx', 1024 * 1024 * 5, {
    status: 'error',
    errorText: 'File size exceeded. Maximum allowed is 2MB.',
  });

  return (
    <Box maxWidth="400px" display="flex" flexDirection="column" gap="spacing.4">
      <Box
        padding="spacing.3"
        backgroundColor="surface.background.gray.moderate"
        borderRadius="medium"
      >
        <Text weight="semibold">Last Action: {lastAction}</Text>
      </Box>

      <Heading size="small">Success State</Heading>
      <FileUploadItem
        file={successFile}
        size="medium"
        onPreview={({ file }) => setLastAction(`onPreview: ${file.name}`)}
        onRemove={({ file }) => setLastAction(`onRemove: ${file.name}`)}
      />

      <Heading size="small">Uploading State</Heading>
      <FileUploadItem
        file={uploadingFile}
        size="medium"
        onDismiss={({ file }) => setLastAction(`onDismiss: ${file.name}`)}
      />

      <Heading size="small">Error State</Heading>
      <FileUploadItem
        file={errorFile}
        size="medium"
        onReupload={({ file }) => setLastAction(`onReupload: ${file.name}`)}
        onRemove={({ file }) => setLastAction(`onRemove: ${file.name}`)}
      />
    </Box>
  );
};

export const AllStates = AllStatesTemplate.bind({});
AllStates.storyName = 'All States';

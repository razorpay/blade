import type { StoryFn, Meta } from '@storybook/react';
import type { FileUploadItemProps } from '../FileUploadItem';
import { FileUploadItem } from '../FileUploadItem';
import type { BladeFile } from '../types';
import { Box } from '~components/Box';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Heading } from '~components/Typography/Heading';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="FileUploadItem"
      componentDescription="FileUploadItem is a sub-component of FileUpload that displays individual file items with their upload status, actions, and progress."
      apiDecisionLink={null}
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=78670-22400&t=iCPjenOx6kthCZaE-1&scaling=min-zoom&page-id=74796%3A315549&mode=design"
    >
    </StoryPageWrapper>
  );
};

// Helper to create a mock BladeFile
const createMockFile = (
  name: string,
  size: number,
  overrides?: Partial<BladeFile>,
): BladeFile => {
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
      options: ['medium', 'large'],
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
  onRemove: ({ file }) => alert(`Remove: ${file.name}`),
  onPreview: ({ file }) => alert(`Preview: ${file.name}`),
};

// Success State with Preview
export const SuccessWithPreview = FileUploadItemTemplate.bind({});
SuccessWithPreview.storyName = 'Success State with Preview';
SuccessWithPreview.args = {
  file: createMockFile('image.png', 1024 * 1024 * 1.5, { status: 'success' }),
  size: 'medium',
  onPreview: ({ file }) => alert(`Preview: ${file.name}`),
  onRemove: ({ file }) => alert(`Remove: ${file.name}`),
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
  onDismiss: ({ file }) => alert(`Dismiss: ${file.name}`),
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
  onDismiss: ({ file }) => alert(`Dismiss: ${file.name}`),
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
  onReupload: ({ file }) => alert(`Reupload: ${file.name}`),
};

// Large Size
export const LargeSize = FileUploadItemTemplate.bind({});
LargeSize.storyName = 'Large Size';
LargeSize.args = {
  file: createMockFile('report.pdf', 1024 * 1024 * 3.5, { status: 'success' }),
  size: 'large',
  onPreview: ({ file }) => alert(`Preview: ${file.name}`),
  onRemove: ({ file }) => alert(`Remove: ${file.name}`),
};

// All States
const AllStatesTemplate: StoryFn<typeof FileUploadItem> = () => {
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
      <Heading size="small">Success State</Heading>
      <FileUploadItem
        file={successFile}
        size="medium"
        onPreview={({ file }) => alert(`Preview: ${file.name}`)}
        onRemove={({ file }) => alert(`Remove: ${file.name}`)}
      />

      <Heading size="small">Uploading State</Heading>
      <FileUploadItem
        file={uploadingFile}
        size="medium"
        onDismiss={({ file }) => alert(`Dismiss: ${file.name}`)}
      />

      <Heading size="small">Error State</Heading>
      <FileUploadItem
        file={errorFile}
        size="medium"
        onReupload={({ file }) => alert(`Reupload: ${file.name}`)}
      />
    </Box>
  );
};

export const AllStates = AllStatesTemplate.bind({});
AllStates.storyName = 'All States';


import { useState } from 'react';
import type { StoryFn, Meta } from '@storybook/react-vite';
import type { BladeFile, BladeFileList, FileUploadProps } from '../FileUpload';
import { FileUpload as FileUploadComponent } from '../FileUpload';
import { SingleFileUploadStory } from './stories';
import { Heading } from '~components/Typography/Heading';
import { Text } from '~components/Typography';
import { Box } from '~components/Box';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Button } from '~components/Button';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { TextInput } from '~components/Input/TextInput';
import { Divider } from '~components/Divider';
import { Modal, ModalHeader, ModalBody } from '~components/Modal';
import { BottomSheet, BottomSheetHeader, BottomSheetBody } from '~components/BottomSheet';
import { getPlatformType } from '~utils';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="FileUpload"
      componentDescription="The FileUpload component is used to handle file attachments, including the drag-and-drop interaction. It can be used in both controlled and uncontrolled forms. Primarily, it is used to upload files to a server or to display a list of uploaded files."
      apiDecisionLink={null}
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=78670-22400&t=iCPjenOx6kthCZaE-1&scaling=min-zoom&page-id=74796%3A315549&mode=design"
    >
      <Heading size="large">Usage</Heading>
      <Sandbox>{SingleFileUploadStory}</Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/FileUpload',
  component: FileUploadComponent,
  tags: ['autodocs'],
  argTypes: getStyledPropsArgTypes(),
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<FileUploadProps>;

const CustomPreviewTemplate: StoryFn<typeof FileUploadComponent> = (args) => {
  const [productName, setProductName] = useState();
  const [uploadedFiles, setUploadedFiles] = useState<BladeFileList>([]);
  const [responseData, setResponseData] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [imageFileSource, setImageFileSource] = useState<string | undefined>();
  const isReactNative = getPlatformType() === 'react-native';

  const uploadFile = (file: BladeFile, fileList: BladeFileList): Promise<Response> => {
    setUploadedFiles(
      fileList.map((f) => {
        if (f.id === file.id) {
          f.status = 'uploading';
        }
        return f;
      }),
    );
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'blade-file-upload-demo');
    data.append('cloud_name', 'snitin315');

    return fetch('https://api.cloudinary.com/v1_1/snitin315/image/upload', {
      method: 'POST',
      body: data,
    })
      .then((res) => {
        setUploadedFiles(
          fileList.map((f) => {
            if (f.id === file.id) {
              f.status = 'success';
            }
            return f;
          }),
        );

        return res.json();
      })
      .then((data) => {
        if (data.error) {
          setUploadedFiles(
            fileList.map((f) => {
              if (f.id === file.id) {
                f.status = 'error';
                f.errorText = `Oops! Something went wrong. ${data.error.message}`;
              }
              return f;
            }),
          );
        }
        return data;
      })
      .catch((error) => {
        setUploadedFiles(
          fileList.map((f) => {
            if (f.id === file.id) {
              f.status = 'error';
              f.errorText = `Oops! Something went wrong. ${error.message}`;
            }
            return f;
          }),
        );
      });
  };

  const handleFileChange: FileUploadProps['onChange'] = ({ fileList }) => {
    const unUploadedFiles = fileList.filter((file) => !file.status);
    Promise.all(unUploadedFiles.map((file) => uploadFile(file, fileList)))
      .then((resData) => {
        setResponseData((prevResponseData) => [...prevResponseData, ...resData]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      padding="spacing.10"
      backgroundColor="surface.background.gray.intense"
    >
      <Box>
        {!isSubmitted ? (
          <Box
            maxWidth={args.labelPosition === 'left' ? '500px' : '400px'}
            display="flex"
            flexDirection="column"
            gap="spacing.5"
          >
            <Heading marginBottom="spacing.4">Add New Product</Heading>
            <TextInput
              label="Product Name"
              placeholder="Add product name"
              isRequired
              necessityIndicator="required"
              onChange={({ value }) => setProductName(value)}
              size={args.size === 'variable' ? 'large' : args.size}
              labelPosition={args.labelPosition}
            />
            <FileUploadComponent
              {...args}
              fileList={uploadedFiles}
              onChange={({ fileList }) => handleFileChange({ fileList })}
              onDrop={({ fileList }) => handleFileChange({ fileList })}
              onPreview={({ file }) => {
                setIsOpen(true);
                // URL.createObjectURL is web-only; on native use the file name as a placeholder source.
                if (getPlatformType() === 'react-native') {
                  setImageFileSource(file.name);
                } else {
                  setImageFileSource(URL.createObjectURL(file as File));
                }
              }}
            />
            <Button
              type="submit"
              variant="primary"
              onClick={() => {
                setIsSubmitted(true);
              }}
            >
              Submit
            </Button>
          </Box>
        ) : (
          <Box>
            <Heading marginBottom="spacing.4">Product: {productName}</Heading>

            <Heading>Images:</Heading>
            {responseData.map((res, index) => {
              return (
                <Box key={index} display="flex" flexDirection="column" gap="spacing.5">
                  {isReactNative ? (
                    <Text>
                      Image {index + 1}: {res?.url ?? 'uploaded'}
                    </Text>
                  ) : (
                    <img src={res.url} height="30%" width="30%" alt={`Your product ${index}`} />
                  )}
                  <Divider thickness="thicker" variant="normal" />
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
      {isReactNative ? (
        <BottomSheet isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
          <BottomSheetHeader title="Image Preview" />
          <BottomSheetBody>
            <Box width="100%">
              <Text>Preview: {imageFileSource}</Text>
            </Box>
          </BottomSheetBody>
        </BottomSheet>
      ) : (
        <Modal isOpen={isOpen} onDismiss={() => setIsOpen(false)} size="medium">
          <ModalHeader title="Image Preview" />
          <ModalBody>
            <Box width="100%">
              <img src={imageFileSource} alt="Preview" width="50%" height="50%" />
            </Box>
          </ModalBody>
        </Modal>
      )}
    </Box>
  );
};

export const CustomPreview = CustomPreviewTemplate.bind({});
CustomPreview.storyName = 'Basic File Upload with Preview';
CustomPreview.args = {
  label: 'Upload Product Images',
  helpText:
    'Upload .jpg, .jpeg, or .png file only. You can upload upto 5 files with a maximum size of 2MB each.',
  accept: '.jpg, .jpeg, .png',
  uploadType: 'multiple',
  maxCount: 5,
  maxSize: 2 * 1024 * 1024,
  isRequired: true,
  necessityIndicator: 'required',
};

// Mock files for the showcase. Plain objects work on both web and native.
const createShowcaseFile = (
  id: string,
  name: string,
  size: number,
  overrides?: Partial<BladeFile>,
): BladeFile => ({ id, name, size, type: 'application/octet-stream', ...overrides } as BladeFile);

// Keeps its own fileList so remove, dismiss and new selections work in the showcase
const ShowcaseFileUpload = ({
  initialFiles = [],
  ...props
}: FileUploadProps & { initialFiles?: BladeFileList }): React.ReactElement => {
  const [files, setFiles] = useState<BladeFileList>(initialFiles);
  const removeFile = ({ file }: { file: BladeFile }): void =>
    setFiles((prev) => prev.filter(({ id }) => id !== file.id));

  return (
    <FileUploadComponent
      {...props}
      fileList={files}
      onChange={({ fileList }) =>
        setFiles(
          fileList.map((file) => ({ ...file, status: file.status ?? 'success' } as BladeFile)),
        )
      }
      onRemove={removeFile}
      onDismiss={removeFile}
      onReupload={removeFile}
    />
  );
};

const ShowcaseSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}): React.ReactElement => (
  <Box>
    <Text
      size="large"
      weight="semibold"
      marginBottom="spacing.4"
      color="feedback.text.information.intense"
    >
      {title}
    </Text>
    <Box display="flex" flexDirection="column" gap="spacing.7" maxWidth="480px">
      {children}
    </Box>
  </Box>
);

export const FileUploadShowcase: StoryFn<typeof FileUploadComponent> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.10">
      <ShowcaseSection title="Sizes">
        <ShowcaseFileUpload label='size="small"' size="small" uploadType="single" />
        <ShowcaseFileUpload label='size="medium" (default)' size="medium" uploadType="single" />
        <ShowcaseFileUpload label='size="large"' size="large" uploadType="single" />
        <ShowcaseFileUpload
          label='size="variable"'
          size="variable"
          height="160px"
          uploadType="single"
        />
        <ShowcaseFileUpload
          label='size="variable" with custom text'
          size="variable"
          height="160px"
          actionButtonText="Choose a file"
          dropAreaText="Drop your invoice here"
          accept=".pdf"
          uploadType="single"
        />
      </ShowcaseSection>

      <ShowcaseSection title="Drop Area Text">
        <ShowcaseFileUpload label="Text shown (default)" uploadType="single" />
        {(['small', 'medium', 'large'] as const).map((size) => (
          <ShowcaseFileUpload
            key={size}
            label={`showDropAreaText={false}, size="${size}"`}
            size={size}
            showDropAreaText={false}
            uploadType="single"
          />
        ))}
      </ShowcaseSection>

      <ShowcaseSection title="Label Position">
        <ShowcaseFileUpload label="Label on top (default)" uploadType="single" />
        <ShowcaseFileUpload label="Label on left" labelPosition="left" uploadType="single" />
        <ShowcaseFileUpload
          label="Label on left, small"
          labelPosition="left"
          size="small"
          showDropAreaText={false}
          helpText="SVG, PNG or JPEG up to 1MB"
          uploadType="single"
        />
        <ShowcaseFileUpload
          accessibilityLabel="Upload document (no visible label)"
          uploadType="single"
        />
      </ShowcaseSection>

      <ShowcaseSection title="States">
        <ShowcaseFileUpload
          label="With help text"
          helpText="Upload .jpg, .jpeg, or .png file only"
          uploadType="single"
        />
        <ShowcaseFileUpload
          label="Required"
          isRequired
          necessityIndicator="required"
          uploadType="single"
        />
        <ShowcaseFileUpload label="Optional" necessityIndicator="optional" uploadType="single" />
        <ShowcaseFileUpload
          label="Error"
          validationState="error"
          errorText="Please upload a file to continue"
          uploadType="single"
        />
        <ShowcaseFileUpload
          label="Disabled"
          isDisabled
          helpText="Uploads are turned off for this field"
          uploadType="single"
        />
      </ShowcaseSection>

      <ShowcaseSection title="With Files">
        <ShowcaseFileUpload
          label='Single upload with a file (uploadType="single")'
          uploadType="single"
          initialFiles={[
            createShowcaseFile('single-1', 'gst-certificate.pdf', 512 * 1024, {
              status: 'success',
            }),
          ]}
        />
        <ShowcaseFileUpload
          label='Multiple upload in every file state (uploadType="multiple")'
          uploadType="multiple"
          helpText="You can upload up to 5 files"
          initialFiles={[
            createShowcaseFile('multi-1', 'invoice-march.pdf', 1.2 * 1024 * 1024, {
              status: 'success',
            }),
            createShowcaseFile('multi-2', 'invoice-april.pdf', 800 * 1024, {
              status: 'uploading',
              uploadPercent: 60,
            }),
            createShowcaseFile('multi-3', 'invoice-may.pdf', 3 * 1024 * 1024, {
              status: 'error',
              errorText: 'File is larger than 2MB',
            }),
          ]}
        />
        <ShowcaseFileUpload
          label='Multiple upload with files, size="small"'
          size="small"
          showDropAreaText={false}
          uploadType="multiple"
          initialFiles={[
            createShowcaseFile('small-1', 'logo.svg', 24 * 1024, { status: 'success' }),
            createShowcaseFile('small-2', 'logo-dark.svg', 26 * 1024, { status: 'success' }),
          ]}
        />
      </ShowcaseSection>
    </Box>
  );
};

FileUploadShowcase.storyName = 'Showcase - All Variants';
FileUploadShowcase.parameters = {
  docs: {
    description: {
      story:
        'Every FileUpload variant in one place: sizes, drop area text, label positions, states, and single or multiple uploads with files in each upload state.',
    },
  },
};

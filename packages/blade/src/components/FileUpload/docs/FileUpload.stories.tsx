import { useState } from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import type { BladeFile, BladeFileList, FileUploadProps } from '../FileUpload';
import { FileUpload as FileUploadComponent } from '../FileUpload';
import { SingleFileUploadStory } from './stories';
import { Heading } from '~components/Typography/Heading';
import { Box } from '~components/Box';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Button } from '~components/Button';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { TextInput } from '~components/Input/TextInput';
import { Divider } from '~components/Divider';
import { Modal, ModalHeader, ModalBody } from '~components/Modal';

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
              size={args.size}
              labelPosition={args.labelPosition}
            />
            <FileUploadComponent
              {...args}
              fileList={uploadedFiles}
              onChange={({ fileList }) => handleFileChange({ fileList })}
              onDrop={({ fileList }) => handleFileChange({ fileList })}
              onPreview={({ file }) => {
                setIsOpen(true);
                setImageFileSource(URL.createObjectURL(file));
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
                  <img src={res.url} height="30%" width="30%" alt={`Your product ${index}`} />
                  <Divider thickness="thicker" variant="normal" />
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
      <Modal isOpen={isOpen} onDismiss={() => setIsOpen(false)} size="medium">
        <ModalHeader title="Image Preview" />
        <ModalBody>
          <Box width="100%">
            <img src={imageFileSource} alt="Preview" width="50%" height="50%" />
          </Box>
        </ModalBody>
      </Modal>
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

import { useState } from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import type { BladeFile, BladeFileList, FileUploadProps } from './FileUpload';
import { FileUpload as FileUploadComponent } from './FileUpload';
import { Heading } from '~components/Typography/Heading';
import { Box } from '~components/Box';

import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Text } from '~components/Typography/Text';
import { Button } from '~components/Button';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { TextInput } from '~components/Input/TextInput';
import { ProgressBar } from '~components/ProgressBar';
import { Divider } from '~components/Divider';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="FileUpload"
      componentDescription="The FileUpload component is used to handle file attachments, including the drag-and-drop interaction. It can be used in both controlled and uncontrolled forms. Primarily, it is used to upload files to a server or to display a list of uploaded files."
      apiDecisionLink={null}
      figmaURL="https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=71106-265680&mode=design&t=jyVG8aXFc1Dlw2Se-4"
    >
      <Heading size="large">Usage</Heading>
      <Sandbox>
        {`
          import {
            FileUpload,
            Box,
            Heading,
            Text,
            Card,
            CardBody
          } from "@razorpay/blade/components";
          import type { BladeFile } from "@razorpay/blade/components";
          
          function App(): React.ReactElement {
            const [selectedFile, setSelectedFile] = useState<BladeFile>();
            const [isLoading, setIsLoading] = useState(false);
            const [responseData, setResponseData] = useState<{
              url?: string;
              error?: Record<string, unknown>;
            }>();

            const handleSubmit = (e) => {
              e.preventDefault();
              setIsLoading(true);

              const data = new FormData();

              if (selectedFile) {
                data.append('file', selectedFile);
                data.append('upload_preset', 'blade-file-upload-demo');
                data.append('cloud_name', 'snitin315');

                fetch('https://api.cloudinary.com/v1_1/snitin315/image/upload', {
                  method: 'POST',
                  body: data,
                })
                  .then((res) => res.json())
                  .then((data) => setResponseData(data))
                  .catch((err) => {
                    console.error(err);
                    setResponseData(err);
                    setIsLoading(false);
                  });
              }
            };

            return (
              <Box display="flex" flexDirection="column" margin="spacing.4">
                {responseData ? (
                  <Box display="flex" flexDirection="column" gap="spacing.5">
                    {responseData.url && (
                      <Box>
                        <Heading marginBottom="spacing.4">
                          Your GST Certificate has been uploaded successfully
                        </Heading>
                        <img src={responseData.url} height="50%" width="50%" alt="Your GST certificate" />
                      </Box>
                    )}
                    {responseData.error && (
                      <Box>
                        <Heading color="feedback.text.negative.intense" marginBottom="spacing.4">
                          Failed to upload your GST Certificate
                        </Heading>
                        <Text color="feedback.text.negative.intense">{responseData.error.message}</Text>
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Box>
                    <Heading marginBottom="spacing.4">Add GST Details</Heading>
                    <form encType="multipart/form-data" onSubmit={handleSubmit}>
                      <Box maxWidth="400px" display="flex" flexDirection="column" gap="spacing.5">
                        <TextInput
                          label="GSTIN"
                          placeholder="12DWWPB9503H1Z3"
                          isRequired
                          necessityIndicator="required"
                        />
                        <FileUploadComponent
                          selectionType="single"
                          label="Upload GST"
                          helpText="Upload .jpg, .jpeg, or .png file only"
                          accept=".jpg, .jpeg, .png"
                          onChange={({ fileList }) => {
                            setSelectedFile(fileList[0]);
                          }}
                          isRequired
                          necessityIndicator="required"
                        />
                        <Button type="submit" variant="primary">
                          Submit
                        </Button>
                        {isLoading && (
                          <ProgressBar isIndeterminate label="Uploading your GST Certificate..." />
                        )}
                      </Box>
                    </form>
                  </Box>
                )}
              </Box>
            );
          }
          export default App;          
        `}
      </Sandbox>
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

const SingleFileUploadTemplate: StoryFn<typeof FileUploadComponent> = (args) => {
  const [selectedFile, setSelectedFile] = useState<BladeFile>();
  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState<{
    url?: string;
    error?: Record<string, unknown>;
  }>();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();

    if (selectedFile) {
      data.append('file', selectedFile);
      data.append('upload_preset', 'blade-file-upload-demo');
      data.append('cloud_name', 'snitin315');

      fetch('https://api.cloudinary.com/v1_1/snitin315/image/upload', {
        method: 'POST',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => setResponseData(data))
        .catch((err) => {
          console.error(err);
          setResponseData(err);
          setIsLoading(false);
        });
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      margin="spacing.4"
      padding="spacing.10"
      backgroundColor="surface.background.gray.intense"
    >
      {responseData ? (
        <Box display="flex" flexDirection="column" gap="spacing.5">
          {responseData.url && (
            <Box>
              <Heading marginBottom="spacing.4">
                Your GST Certificate has been uploaded successfully
              </Heading>
              <img src={responseData.url} height="50%" width="50%" alt="Your GST certificate" />
            </Box>
          )}
          {responseData.error && (
            <Box>
              <Heading color="feedback.text.negative.intense" marginBottom="spacing.4">
                Failed to upload your GST Certificate
              </Heading>
              <Text color="feedback.text.negative.intense">{responseData.error.message}</Text>
            </Box>
          )}
        </Box>
      ) : (
        <Box>
          <Heading marginBottom="spacing.4">Add GST Details</Heading>
          <form encType="multipart/form-data" onSubmit={handleSubmit}>
            <Box maxWidth="400px" display="flex" flexDirection="column" gap="spacing.5">
              <TextInput
                label="GSTIN"
                placeholder="12DWWPB9503H1Z3"
                isRequired
                necessityIndicator="required"
              />
              <FileUploadComponent
                selectionType="single"
                label="Upload GST"
                helpText="Upload .jpg, .jpeg, or .png file only"
                accept=".jpg, .jpeg, .png"
                //maxSize={100}
                onChange={({ fileList }) => {
                  setSelectedFile(fileList[0]);
                }}
                isRequired
                necessityIndicator="required"
              />
              {/* ///<FileUploadItem file={upload} /> */}
              <Button type="submit" variant="primary">
                Submit
              </Button>
              {isLoading && (
                <ProgressBar isIndeterminate label="Uploading your GST Certificate..." />
              )}
            </Box>
          </form>
        </Box>
      )}
    </Box>
  );
};

export const SingleFileUpload = SingleFileUploadTemplate.bind({});
SingleFileUpload.storyName = 'Single File Upload';

const MultipleFilesUploadTemplate: StoryFn<typeof FileUploadComponent> = (args) => {
  const [selectedFiles, setSelectedFiles] = useState<BladeFileList>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState<
    {
      url?: string;
      error?: Record<string, unknown>;
    }[]
  >();

  const uploadFile = (file) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'blade-file-upload-demo');
    data.append('cloud_name', 'snitin315');

    return fetch('https://api.cloudinary.com/v1_1/snitin315/image/upload', {
      method: 'POST',
      body: data,
    })
      .then((res) => res.json())
      .then((data) => data)
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (selectedFiles.length > 0) {
      Promise.all(selectedFiles.map((file) => uploadFile(file)))
        .then((res) => {
          setResponseData(res);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setIsLoading(false);
          setResponseData([{ error }]);
        });
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      margin="spacing.4"
      padding="spacing.10"
      backgroundColor="surface.background.gray.intense"
    >
      {responseData ? (
        <Box display="flex" flexDirection="column" gap="spacing.5">
          {responseData.map((res, index) => {
            if (res.url) {
              return (
                <Box key={index} display="flex" flexDirection="column" gap="spacing.5">
                  {index === 0 && <Heading>Your product has been added successfully</Heading>}
                  <img src={res.url} height="30%" width="30%" alt={`Your product ${index}`} />
                  <Divider thickness="thicker" variant="normal" />
                </Box>
              );
            }
            if (res.error) {
              return (
                <Box key={index}>
                  <Heading color="feedback.text.negative.intense" marginBottom="spacing.4">
                    Failed to upload your product images
                  </Heading>
                  <Text color="feedback.text.negative.intense">{res.error.message}</Text>
                </Box>
              );
            }
          })}
        </Box>
      ) : (
        <Box>
          <Heading marginBottom="spacing.4">Add New Product</Heading>
          <form encType="multipart/form-data" onSubmit={handleSubmit}>
            <Box maxWidth="400px" display="flex" flexDirection="column" gap="spacing.5">
              <TextInput
                label="Product Name"
                placeholder="Add product name"
                isRequired
                necessityIndicator="required"
              />
              <FileUploadComponent
                selectionType="multiple"
                label="Upload Product Images"
                helpText="Upload .jpg, .jpeg, or .png file only. You can upload upto 5 files with a maximum size of 2MB each."
                maxCount={5}
                maxSize={2 * 1024 * 1024}
                accept=".jpg, .jpeg, .png"
                onChange={({ fileList }) => {
                  setSelectedFiles(fileList);
                }}
                isRequired
                necessityIndicator="required"
              />
              <Button type="submit" variant="primary">
                Submit
              </Button>
              {isLoading && (
                <ProgressBar isIndeterminate label="Uploading your product images..." />
              )}
            </Box>
          </form>
        </Box>
      )}
    </Box>
  );
};

export const MultipleFilesUpload = MultipleFilesUploadTemplate.bind({});
MultipleFilesUpload.storyName = 'Multiple Files Upload';

const ShowFileUploadProgressTemplate: StoryFn<typeof FileUploadComponent> = (args) => {
  const [uploadedFiles, setUploadedFiles] = useState<BladeFileLists>();
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleFileChange = ({ fileList }) => {
    setUploadedFiles(fileList);
    // Create a FormData object to append files
    const formData = new FormData();

    formData.append('file', fileList[0]);
    formData.append('upload_preset', 'blade-file-upload-demo');
    formData.append('cloud_name', 'snitin315');

    const xhr = new XMLHttpRequest();

    xhr.addEventListener(
      'load',
      () => {
        setUploadedFiles(
          fileList.map((file: BladeFile) => {
            if (file) {
              file.status = 'success';
            }

            return file;
          }),
        );
      },
      false,
    );
    xhr.addEventListener(
      'error',
      () => {
        setUploadedFiles(
          fileList.map((file: BladeFile) => {
            if (file) {
              file.errorText = 'Oops! Something went wrong. Please try again later.';
              file.status = 'error';
            }

            return file;
          }),
        );
      },
      false,
    );

    xhr.upload.onprogress = (event) => {
      const percent = Math.round((event.loaded / event.total) * 100);

      setUploadedFiles(
        fileList.map((file: BladeFile) => {
          if (file) {
            file.percent = percent;
            file.status = 'uploading';
          }

          return file;
        }),
      );
    };

    xhr.open('POST', 'https://api.cloudinary.com/v1_1/snitin315/image/upload', true);
    xhr.send(formData);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      padding="spacing.10"
      backgroundColor="surface.background.gray.intense"
    >
      <Box>
        <Heading marginBottom="spacing.4">Add GST Details</Heading>

        <Box maxWidth="400px" display="flex" flexDirection="column" gap="spacing.5">
          <TextInput
            label="GSTIN"
            placeholder="12DWWPB9503H1Z3"
            isRequired
            necessityIndicator="required"
          />
          <FileUploadComponent
            selectionType="multiple"
            label="Upload GST"
            helpText="Upload .jpg, .jpeg, or .png file only"
            accept=".jpg, .jpeg, .png"
            fileList={uploadedFiles}
            onChange={handleFileChange}
            isRequired
            necessityIndicator="required"
          />
          <Button type="submit" variant="primary">
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export const ShowFileUploadProgress = ShowFileUploadProgressTemplate.bind({});
ShowFileUploadProgress.storyName = 'Display File Upload Progress';

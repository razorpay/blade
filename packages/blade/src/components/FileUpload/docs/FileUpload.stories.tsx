import { useState } from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import type { BladeFile, BladeFileList, FileUploadProps } from '../FileUpload';
import { FileUpload as FileUploadComponent } from '../FileUpload';
import { SingleFileUploadStory } from './stories';
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
import { Modal, ModalHeader, ModalBody } from '~components/Modal';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="FileUpload"
      componentDescription="The FileUpload component is used to handle file attachments, including the drag-and-drop interaction. It can be used in both controlled and uncontrolled forms. Primarily, it is used to upload files to a server or to display a list of uploaded files."
      apiDecisionLink={null}
      figmaURL="https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=71106-265680&mode=design&t=jyVG8aXFc1Dlw2Se-4"
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

const SingleFileUploadTemplate: StoryFn<typeof FileUploadComponent> = (args) => {
  const [selectedFile, setSelectedFile] = useState<BladeFile>();
  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState<{
    url?: string;
    error?: Record<string, unknown>;
  }>();

  const handleSubmit = (e): void => {
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
      margin="spacing.2"
      padding="spacing.8"
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
                labelPosition={args.labelPosition}
              />
              <FileUploadComponent
                {...args}
                onChange={({ fileList }) => {
                  setSelectedFile(fileList[0]);
                }}
                onDrop={({ fileList }) => {
                  setSelectedFile(fileList[0]);
                }}
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
};

export const SingleFileUpload = SingleFileUploadTemplate.bind({});
SingleFileUpload.storyName = 'Single File Upload';
SingleFileUpload.args = {
  label: 'Upload GST Certificate',
  helpText: 'Upload .jpg, .jpeg, or .png file only',
  accept: '.jpg, .jpeg, .png',
  uploadType: 'single',
  isRequired: true,
  necessityIndicator: 'required',
  onPreview: undefined,
};

const MultipleFilesUploadTemplate: StoryFn<typeof FileUploadComponent> = (args) => {
  const [selectedFiles, setSelectedFiles] = useState<BladeFileList>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState<
    {
      url?: string;
      error?: Record<string, unknown>;
    }[]
  >();

  const uploadFile = (file: BladeFile): Promise<Response> => {
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

  const handleSubmit = (e): void => {
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
      margin="spacing.2"
      padding="spacing.8"
      backgroundColor="surface.background.gray.intense"
    >
      {responseData ? (
        <Box display="flex" flexDirection="column" gap="spacing.5">
          {responseData.map((res, index) => {
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

            return (
              <Box key={index} display="flex" flexDirection="column" gap="spacing.5">
                {index === 0 && <Heading>Your product has been added successfully</Heading>}
                <img src={res.url} height="30%" width="30%" alt={`Your product ${index}`} />
                <Divider thickness="thicker" variant="normal" />
              </Box>
            );
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
                labelPosition={args.labelPosition}
              />
              <FileUploadComponent
                {...args}
                onChange={({ fileList }) => {
                  setSelectedFiles(fileList);
                }}
                onDrop={({ fileList }) => {
                  setSelectedFiles(fileList);
                }}
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
MultipleFilesUpload.args = {
  label: 'Upload Product Images',
  helpText:
    'Upload .jpg, .jpeg, or .png file only. You can upload upto 5 files with a maximum size of 2MB each.',
  accept: '.jpg, .jpeg, .png',
  uploadType: 'multiple',
  maxCount: 5,
  maxSize: 2 * 1024 * 1024,
  isRequired: true,
  necessityIndicator: 'required',
  onPreview: undefined,
};

const AutoFileUploadTemplate: StoryFn<typeof FileUploadComponent> = (args) => {
  const [productName, setProductName] = useState();
  const [uploadedFiles, setUploadedFiles] = useState<BladeFileList>([]);
  const [responseData, setResponseData] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const uploadFile = (file: BladeFile, fileList: BladeFileList): Promise<Response> => {
    setUploadedFiles(
      fileList.map((f) => {
        if (f.id === file.id) {
          f.status = 'uploading';
        }
        return file;
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
            return file;
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
              return file;
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
            return file;
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
          <Box maxWidth="400px" display="flex" flexDirection="column" gap="spacing.5">
            <Heading marginBottom="spacing.4">Add New Product</Heading>
            <TextInput
              label="Product Name"
              placeholder="Add product name"
              isRequired
              necessityIndicator="required"
              onChange={({ value }) => setProductName(value)}
              labelPosition={args.labelPosition}
            />
            <FileUploadComponent
              {...args}
              fileList={uploadedFiles}
              onChange={({ fileList }) => handleFileChange({ fileList })}
              onDrop={({ fileList }) => handleFileChange({ fileList })}
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
    </Box>
  );
};

export const AutoFileUpload = AutoFileUploadTemplate.bind({});
AutoFileUpload.storyName = 'Auto File Upload on Selection';
AutoFileUpload.args = {
  label: 'Upload Product Images',
  helpText:
    'Upload .jpg, .jpeg, or .png file only. You can upload upto 5 files with a maximum size of 2MB each.',
  accept: '.jpg, .jpeg, .png',
  uploadType: 'multiple',
  maxCount: 5,
  maxSize: 2 * 1024 * 1024,
  isRequired: true,
  necessityIndicator: 'required',
  onPreview: undefined,
};

const AutoFileUploadWithProgressTemplate: StoryFn<typeof FileUploadComponent> = (args) => {
  const [uploadedFiles, setUploadedFiles] = useState<BladeFileList>();
  const [productName, setProductName] = useState<string | undefined>();
  const [responseData, setResponseData] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const uploadFile = (file: BladeFile, fileList: BladeFileList): void => {
    setUploadedFiles(
      fileList.map((f) => {
        if (f.id === file.id) {
          f.status = 'uploading';
        }
        return file;
      }),
    );
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'blade-file-upload-demo');
    data.append('cloud_name', 'snitin315');

    const xhr = new XMLHttpRequest();

    xhr.addEventListener(
      'load',
      () => {
        setUploadedFiles(
          fileList.map((f) => {
            if (f.id === file.id) {
              f.status = 'success';
            }
            return file;
          }),
        );
        setResponseData((prevData) => [...prevData, JSON.parse(xhr.responseText)]);
      },
      false,
    );

    xhr.addEventListener(
      'error',
      () => {
        setUploadedFiles(
          fileList.map((f) => {
            if (f.id === file.id) {
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
        fileList.map((f) => {
          if (f.id === file.id) {
            file.percent = percent;
            file.status = 'uploading';
          }
          return file;
        }),
      );
    };

    xhr.open('POST', 'https://api.cloudinary.com/v1_1/snitin315/image/upload', true);
    xhr.send(data);
  };

  const handleFileChange: FileUploadProps['onChange'] | FileUploadProps['onDrop'] = ({
    fileList,
  }) => {
    const unUploadedFiles = fileList.filter((file) => !file.status);
    void Promise.all(unUploadedFiles.map((file) => uploadFile(file, fileList)));
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      padding="spacing.10"
      backgroundColor="surface.background.gray.intense"
    >
      {!isSubmitted ? (
        <Box>
          <Heading marginBottom="spacing.4">Add New Product</Heading>

          <Box maxWidth="400px" display="flex" flexDirection="column" gap="spacing.5">
            <TextInput
              label="Product Name"
              placeholder="Add product name"
              isRequired
              necessityIndicator="required"
              onChange={({ value }) => setProductName(value)}
              labelPosition={args.labelPosition}
            />
            <FileUploadComponent
              {...args}
              fileList={uploadedFiles}
              onChange={handleFileChange}
              onDrop={handleFileChange}
            />
            <Button
              type="submit"
              variant="primary"
              isDisabled={
                uploadedFiles?.length === 0 ||
                uploadedFiles?.some((file) => file.status === 'uploading')
              }
              onClick={() => setIsSubmitted(true)}
            >
              Submit
            </Button>
          </Box>
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
  );
};

export const AutoFileUploadWithProgress = AutoFileUploadWithProgressTemplate.bind({});
AutoFileUploadWithProgress.storyName = 'Display File Upload Progress';
AutoFileUploadWithProgress.args = {
  label: 'Upload Product Images',
  helpText:
    'Upload .jpg, .jpeg, or .png file only. You can upload upto 5 files with a maximum size of 2MB each.',
  accept: '.jpg, .jpeg, .png',
  uploadType: 'multiple',
  maxCount: 5,
  maxSize: 2 * 1024 * 1024,
  isRequired: true,
  necessityIndicator: 'required',
  onPreview: undefined,
};

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
        return file;
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
            return file;
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
              return file;
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
            return file;
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
          <Box maxWidth="400px" display="flex" flexDirection="column" gap="spacing.5">
            <Heading marginBottom="spacing.4">Add New Product</Heading>
            <TextInput
              label="Product Name"
              placeholder="Add product name"
              isRequired
              necessityIndicator="required"
              onChange={({ value }) => setProductName(value)}
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
CustomPreview.storyName = 'Customize File Preview';
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

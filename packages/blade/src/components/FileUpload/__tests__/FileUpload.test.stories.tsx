import type { StoryFn } from '@storybook/react';
import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import React, { useState } from 'react';
import type { BladeFileList, BladeFile, FileUploadProps } from '~components/FileUpload';
import { FileUpload } from '~components/FileUpload';
import { Button } from '~components/Button';
import { Box } from '~components/Box';

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
const imageBlob =
  'data:image/png;base64,R0lGODlhDwAPAKECAAAAzMzM/////wAAACwAAAAADwAPAAACIISPeQHsrZ5ModrLlN48CXF8m2iQ3YmmKqVlRtW4MLwWACH+H09wdGltaXplZCBieSBVbGVhZCBTbWFydFNhdmVyIQAAOw==';
const pdfBlob =
  'data:application/pdf;base64,R0lGODlhDwAPAKECAAAAzMzM/////wAAACwAAAAADwAPAAACIISPeQHsrZ5ModrLlN48CXF8m2iQ3YmmKqVlRtW4MLwWACH+H09wdGltaXplZCBieSBVbGVhZCBTbWFydFNhdmVyIQAAOw==';

export const TestSingleFileUpload: StoryFn<typeof FileUpload> = (): React.ReactElement => {
  return (
    <Box maxWidth="400px">
      <FileUpload
        uploadType="single"
        label="Upload GST certificate"
        helpText=" .jpg, .jpeg, or .png file only"
        accept="image/*"
        isRequired
        necessityIndicator="required"
        name="single-file-upload-input"
      />
    </Box>
  );
};

TestSingleFileUpload.play = async ({ canvasElement }) => {
  const { getByText } = within(canvasElement);

  // Create a file
  const blob = new Blob(['']);
  const filename = 'my-image.png';
  const file = new File([blob], filename, {
    type: 'image/png',
  });

  const input = getByText('Drag files here or').closest('div')?.querySelector('input');

  await expect(input).not.toHaveAttribute('multiple');
  await expect(input).toHaveAttribute('name', 'single-file-upload-input');

  await userEvent.upload(input as HTMLElement, file);
  await expect(getByText(filename)).toBeVisible();
};

export const TestMultipleFileUpload: StoryFn<typeof FileUpload> = (): React.ReactElement => {
  return (
    <Box maxWidth="400px">
      <FileUpload
        uploadType="multiple"
        label="Upload GST certificate"
        helpText=" .jpg, .jpeg, or .png file only"
        accept="image/*"
        isRequired
        necessityIndicator="required"
        name="multiple-file-upload-input"
      />
    </Box>
  );
};

TestMultipleFileUpload.play = async ({ canvasElement }) => {
  const { getByText } = within(canvasElement);

  // Create files
  const blob = new Blob([imageBlob]);
  const file1 = new File([blob], 'my-image.png', {
    type: 'image/png',
  });
  const file2 = new File([blob], 'my-image2.png', {
    type: 'image/png',
  });

  const input = getByText('Drag files here or').closest('div')?.querySelector('input');

  await expect(input).toHaveAttribute('multiple');
  await userEvent.upload(input as HTMLElement, [file1, file2]);
  await expect(getByText('my-image.png')).toBeInTheDocument();
  await expect(getByText('my-image2.png')).toBeInTheDocument();
};

export const TestOnRemove: StoryFn<typeof FileUpload> = (): React.ReactElement => {
  return (
    <Box maxWidth="400px">
      <FileUpload
        uploadType="single"
        label="Upload GST certificate"
        helpText=" .jpg, .jpeg, or .png file only"
        accept="image/*"
        isRequired
        necessityIndicator="required"
        name="single-file-upload-input"
      />
    </Box>
  );
};

TestOnRemove.play = async ({ canvasElement }) => {
  const { getByText, getByRole, queryByText } = within(canvasElement);

  // Create a file
  const blob = new Blob([imageBlob]);
  const filename = 'my-image.png';
  const file = new File([blob], filename, {
    type: 'image/png',
  });

  const input = getByText('Drag files here or').closest('div')?.querySelector('input');

  await expect(input).not.toHaveAttribute('multiple');
  await expect(input).toHaveAttribute('name', 'single-file-upload-input');

  await userEvent.upload(input as HTMLElement, file);
  await expect(getByText(filename)).toBeVisible();

  const removeButton = getByRole('button', { name: 'Remove File' });
  await userEvent.click(removeButton);
  await expect(queryByText(filename)).not.toBeInTheDocument();
};

export const TestOnRemoveWithMultipleFiles: StoryFn<typeof FileUpload> = (): React.ReactElement => {
  return (
    <Box maxWidth="400px">
      <FileUpload
        uploadType="multiple"
        label="Upload GST certificate"
        helpText=" .jpg, .jpeg, or .png file only"
        accept="image/*"
        isRequired
        necessityIndicator="required"
        name="multiple-file-upload-input"
      />
    </Box>
  );
};

TestOnRemoveWithMultipleFiles.play = async ({ canvasElement }) => {
  const { getByText, getAllByRole, queryByText } = within(canvasElement);

  // Create files
  const blob = new Blob([imageBlob]);
  const file1 = new File([blob], 'my-image.png', {
    type: 'image/png',
  });
  const file2 = new File([blob], 'my-image2.png', {
    type: 'image/png',
  });

  const input = getByText('Drag files here or').closest('div')?.querySelector('input');

  await expect(input).toHaveAttribute('multiple');
  await expect(input).toHaveAttribute('type', 'file');

  await userEvent.upload(input as HTMLElement, [file1, file2]);
  await expect(getByText('my-image.png')).toBeInTheDocument();
  await expect(getByText('my-image2.png')).toBeInTheDocument();

  const [removeButton1, removeButton2] = getAllByRole('button', { name: 'Remove File' });

  await userEvent.click(removeButton2);
  await expect(queryByText('my-image.png')).toBeInTheDocument();
  await expect(queryByText('my-image2.png')).not.toBeInTheDocument();

  await userEvent.click(removeButton1);
  await expect(queryByText('my-image.png')).not.toBeInTheDocument();
};

export const TestMaxCountFileUpload: StoryFn<typeof FileUpload> = (): React.ReactElement => {
  return (
    <Box maxWidth="400px">
      <FileUpload
        uploadType="multiple"
        label="Upload GST certificate"
        helpText=" .jpg, .jpeg, or .png file only"
        accept="image/*"
        isRequired
        maxCount={2}
        necessityIndicator="required"
      />
    </Box>
  );
};

TestMaxCountFileUpload.play = async ({ canvasElement }) => {
  const { getByText, queryByText } = within(canvasElement);

  // Create files
  const blob = new Blob([imageBlob]);
  const file1 = new File([blob], 'my-image.png', {
    type: 'image/png',
  });
  const file2 = new File([blob], 'my-image2.png', {
    type: 'image/png',
  });
  const file3 = new File([blob], 'my-image3.png', {
    type: 'image/png',
  });

  const input = getByText('Drag files here or').closest('div')?.querySelector('input');

  await expect(input).toHaveAttribute('multiple');

  await userEvent.upload(input as HTMLElement, [file1, file2, file3]);
  await expect(getByText("You can't upload more than 2 files.")).toBeInTheDocument();
  await expect(queryByText('my-image.png')).not.toBeInTheDocument();
  await expect(queryByText('my-image2.png')).not.toBeInTheDocument();
};

export const TestMaxSizeFileUpload: StoryFn<typeof FileUpload> = (): React.ReactElement => {
  return (
    <Box maxWidth="400px">
      <FileUpload
        uploadType="single"
        label="Upload GST certificate"
        helpText=" .jpg, .jpeg, or .png file only"
        accept="image/*"
        isRequired
        // 10 bytes for testing purpose
        maxSize={10}
        necessityIndicator="required"
      />
    </Box>
  );
};

TestMaxSizeFileUpload.play = async ({ canvasElement }) => {
  const { getByText } = within(canvasElement);

  // Create a file
  const blob = new Blob([imageBlob]);
  const filename = 'my-image.png';
  const file = new File([blob], filename, {
    type: 'image/png',
  });

  const input = getByText('Drag files here or').closest('div')?.querySelector('input');

  await expect(input).not.toHaveAttribute('multiple');

  await userEvent.upload(input as HTMLElement, file);
  await expect(getByText('File size exceeded.')).toBeInTheDocument();
};

export const TestAcceptProp: StoryFn<typeof FileUpload> = (): React.ReactElement => {
  return (
    <Box maxWidth="400px">
      <FileUpload
        uploadType="single"
        label="Upload GST certificate"
        helpText=" .jpg, .jpeg, or .png file only"
        accept="image/*"
        isRequired
        necessityIndicator="required"
      />
    </Box>
  );
};

TestAcceptProp.play = async ({ canvasElement }) => {
  const { getByText, queryByText } = within(canvasElement);

  // Create a file
  const blob = new Blob([pdfBlob]);
  const filename = 'my-pdf.pdf';
  const file = new File([blob], filename, {
    type: 'application/pdf',
  });

  const input = getByText('Drag files here or').closest('div')?.querySelector('input');

  await expect(input).not.toHaveAttribute('multiple');

  await userEvent.upload(input as HTMLElement, file);
  await expect(queryByText(filename)).not.toBeInTheDocument();
};

export const TestFileUploadError: StoryFn<typeof FileUpload> = (): React.ReactElement => {
  const [uploadedFiles, setUploadedFiles] = useState<BladeFileList>([]);

  const uploadFile = async (file: BladeFile, fileList: BladeFileList): Promise<Response> => {
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

    // Wait for 2 seconds to simulate the file upload progress
    await sleep(2000);

    return fetch('https://api.cloudinary.com/v1_1/snitin315invalid/image/upload', {
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

  const handleFileChange: FileUploadProps['onChange'] = async ({ fileList }) => {
    await uploadFile(fileList[0], fileList);
  };

  return (
    <Box maxWidth="400px">
      <FileUpload
        uploadType="single"
        label="Upload GST certificate"
        helpText=" .jpg, .jpeg, or .png file only"
        accept="image/*"
        isRequired
        necessityIndicator="required"
        onChange={handleFileChange}
        fileList={uploadedFiles}
      />
    </Box>
  );
};

TestFileUploadError.play = async ({ canvasElement }) => {
  const { getByText, getByRole } = within(canvasElement);

  // Create a file
  const blob = new Blob([imageBlob]);
  const filename = 'my-image.png';
  const file = new File([blob], filename, {
    type: 'image/png',
  });

  const input = getByText('Drag files here or').closest('div')?.querySelector('input');

  await expect(input).not.toHaveAttribute('multiple');

  await userEvent.upload(input as HTMLElement, file);

  await expect(getByRole('progressbar')).toBeInTheDocument();

  await sleep(5000);
  await expect(getByText(filename)).toBeVisible();
  await expect(getByText('Oops! Something went wrong. Unknown API key')).toBeInTheDocument();
};

export const TestRefProp: StoryFn<typeof FileUpload> = (): React.ReactElement => {
  const ref = React.useRef<HTMLInputElement>(null);

  return (
    <Box maxWidth="400px">
      <FileUpload
        uploadType="single"
        label="Upload GST certificate"
        helpText=" .jpg, .jpeg, or .png file only"
        accept="image/*"
        isRequired
        necessityIndicator="required"
        ref={ref}
      />
      <Button
        onClick={() => {
          ref.current?.focus();
        }}
      >
        Focus
      </Button>
    </Box>
  );
};

TestRefProp.play = async ({ canvasElement }) => {
  const { getByText, getByRole } = within(canvasElement);

  const input = getByText('Drag files here or').closest('div')?.querySelector('input');
  const button = getByRole('button', { name: 'Focus' });

  await expect(input).not.toHaveFocus();
  await expect(input).toHaveAttribute('type', 'file');

  await userEvent.click(button);
  await expect(input).toHaveFocus();
};

export default {
  title: 'Components/Interaction Tests/FileUpload',
  parameters: {
    controls: {
      disable: true,
    },
    a11y: { disable: true },
    essentials: { disable: true },
    actions: { disable: false },
  },
};

/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable import/no-extraneous-dependencies */
import type { StoryFn } from '@storybook/react';
import { within, userEvent } from '@storybook/testing-library';
import { expect, jest } from '@storybook/jest';
import React from 'react';
import type { ToastProps } from '~components/Toast/types';
import { useToast } from '~components/Toast/useToast';
import { ToastContainer } from '~components/Toast/ToastContainer';
import type { Toast } from '~components/Toast/Toast';
import { FileUpload } from '~components/FileUpload';
import { Button } from '~components/Button';
import { Box } from '~components/Box';

const ToastExample = (props: ToastProps): React.ReactElement => {
  const toast = useToast();

  React.useEffect(() => {
    toast.dismiss();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      <Button
        onClick={() => {
          toast.show({ ...props });
        }}
      >
        Show Toast
      </Button>
      <ToastContainer />
    </Box>
  );
};

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export const TestSingleFileUpload: StoryFn<typeof Toast> = (): React.ReactElement => {
  return (
    <FileUpload
      selectionType="single"
      label="Upload GST"
      helpText="Upload .jpg, .jpeg, or .png file only"
      ///accept=".jpg, .jpeg, .png"
      isRequired
      necessityIndicator="required"
      name="single-file-upload-input"
      testID="file-upload"
    />
  );
};

TestSingleFileUpload.play = async () => {
  const { getByRole, queryByText, getByTestId, getByLabelText, getByText, querySelector } = within(
    document.body,
  );
  await sleep(1000);

  const str = JSON.stringify({ name: 'test.json' });
  const blob = new Blob([str]);
  const file = new File([blob], 'values.json', {
    type: 'application/JSON',
  });

  const input = getByTestId('file-upload-input');
  await userEvent.upload(input, file);
  await sleep(4000);
};

export default {
  title: 'Components/Interaction Tests/FileUpload',
  parameters: {
    controls: {
      disable: true,
    },
    a11y: { disable: true },
    essentials: { disable: true },
    actions: { disable: true },
  },
};

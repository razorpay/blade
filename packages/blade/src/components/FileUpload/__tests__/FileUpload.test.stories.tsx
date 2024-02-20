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

export const TestToastShow: StoryFn<typeof Toast> = (): React.ReactElement => {
  return <ToastExample content="Payment successful" />;
};

TestToastShow.play = async () => {
  const { getByRole, queryByText } = within(document.body);
  await sleep(1000);

  const toastContent = 'Payment successful';
  await expect(queryByText(toastContent)).not.toBeInTheDocument();
  const button = getByRole('button', { name: 'Show Toast' });
  await userEvent.click(button);
  await sleep(400);
  await expect(queryByText(toastContent)).toBeVisible();
  await sleep(4000);
  await expect(queryByText(toastContent)).not.toBeVisible();
};

export default {
  title: 'Components/Interaction Tests/Toast',
  parameters: {
    controls: {
      disable: true,
    },
    a11y: { disable: true },
    essentials: { disable: true },
    actions: { disable: true },
  },
};

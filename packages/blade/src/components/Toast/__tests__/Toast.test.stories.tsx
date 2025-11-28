/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable import/no-extraneous-dependencies */
import type { StoryFn } from '@storybook/react';
import { within, userEvent } from '@storybook/testing-library';
import { expect, jest } from '@storybook/jest';
import React from 'react';
import type { ToastProps } from '../types';
import { useToast } from '../useToast';
import { ToastContainer } from '../ToastContainer';
import type { Toast } from '../Toast';
import { Button } from '~components/Button';
import { Box } from '~components/Box';

const onDismissButtonClick = jest.fn();
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

export const TestToastDismiss: StoryFn<typeof Toast> = (): React.ReactElement => {
  onDismissButtonClick.mockReset();
  return <ToastExample content="Payment successful" onDismissButtonClick={onDismissButtonClick} />;
};

TestToastDismiss.play = async () => {
  const { getByRole, queryByText } = within(document.body);
  await sleep(1000);

  const toastContent = 'Payment successful';
  await expect(queryByText(toastContent)).not.toBeInTheDocument();
  const button = getByRole('button', { name: 'Show Toast' });
  await userEvent.click(button);
  await sleep(400);
  await expect(queryByText(toastContent)).toBeVisible();
  const dismissButton = getByRole('button', { name: 'Dismiss toast' });
  await userEvent.click(dismissButton);
  await expect(onDismissButtonClick).toBeCalledTimes(1);
  await sleep(400);
  await expect(queryByText(toastContent)).not.toBeVisible();
};

export const ToastHover: StoryFn<typeof Toast> = (): React.ReactElement => {
  onDismissButtonClick.mockReset();
  return <ToastExample content="Payment successful" duration={1000} />;
};

ToastHover.play = async () => {
  const { getByRole, queryByText, getByTestId } = within(document.body);
  await sleep(1000);

  const toastContent = 'Payment successful';
  await expect(queryByText(toastContent)).not.toBeInTheDocument();
  const button = getByRole('button', { name: 'Show Toast' });
  await userEvent.click(button);
  await sleep(400);
  await expect(queryByText(toastContent)).toBeVisible();
  // hover into toast container
  const toastContainer = getByTestId('toast-mouseover-container')!;
  await userEvent.hover(toastContainer);
  // wait for 2s, while hovering over the toast container the toasts should not dismiss
  await sleep(2000);
  await expect(queryByText(toastContent)).toBeVisible();
  // hover out of toast container
  await userEvent.unhover(toastContainer);
  await sleep(1000);
  await expect(queryByText(toastContent)).not.toBeVisible();
};

export const ToastStacking: StoryFn<typeof Toast> = (): React.ReactElement => {
  const toast = useToast();

  React.useEffect(() => {
    toast.dismiss();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      <Button
        onClick={() => {
          toast.show({ content: 'Toast 1', autoDismiss: false });
        }}
      >
        Show 1
      </Button>
      <Button
        onClick={() => {
          toast.show({ content: 'Toast 2', autoDismiss: false });
        }}
      >
        Show 2
      </Button>
      <Button
        onClick={() => {
          toast.show({ content: 'Toast 3', autoDismiss: false });
        }}
      >
        Show 3
      </Button>

      <Button
        onClick={() => {
          toast.show({ content: 'Toast 4', autoDismiss: false });
        }}
      >
        Show 4
      </Button>

      <Button
        onClick={() => {
          toast.show({ type: 'promotional', content: 'Promo Toast', action: { text: 'Okay' } });
        }}
      >
        Show Promo
      </Button>
      <ToastContainer />
    </Box>
  );
};

ToastStacking.play = async () => {
  const { getByRole, getAllByRole, queryByText, getByTestId } = within(document.body);
  await sleep(1000);

  const button1 = getByRole('button', { name: 'Show 1' });
  const button2 = getByRole('button', { name: 'Show 2' });
  const button3 = getByRole('button', { name: 'Show 3' });
  const button4 = getByRole('button', { name: 'Show 4' });
  const promoButton = getByRole('button', { name: 'Show Promo' });

  // fire 3 toasts
  await userEvent.click(button1);
  await userEvent.click(button2);
  await userEvent.click(button3);

  // wait for 400ms
  await sleep(400);

  // expect 3 toasts to be visible
  await expect(queryByText('Toast 1')).toBeVisible();
  await expect(queryByText('Toast 2')).toBeVisible();
  await expect(queryByText('Toast 3')).toBeVisible();

  // expect 3 toasts to be stacked on top of each other
  const toastContainer = getByTestId('toast-mouseover-container')!;
  await expect(toastContainer.getBoundingClientRect().height).toBeGreaterThan(120);

  // fire 4th toast
  await userEvent.click(button4);
  await sleep(400);
  await expect(queryByText('Toast 4')).toBeVisible();

  await expect(toastContainer.getBoundingClientRect().height).toBeLessThan(40);

  const toast4 = queryByText('Toast 4')! as Element;

  // hover into toast container
  await userEvent.hover(toast4);
  await expect(toastContainer.getBoundingClientRect().height).toBeGreaterThan(160);
  await sleep(400);
  await userEvent.unhover(toast4);
  await expect(toastContainer.getBoundingClientRect().height).toBeLessThan(40);

  // fire promo toast
  await userEvent.click(promoButton);
  await sleep(400);
  await expect(queryByText('Promo Toast')).toBeVisible();
  await expect(toastContainer.getBoundingClientRect().height).toBeGreaterThan(30);

  // hover over promo toast, should not increase height
  const promoToast = queryByText('Promo Toast')! as Element;
  await userEvent.hover(promoToast);
  await expect(toastContainer.getBoundingClientRect().height).toBeGreaterThan(30);
  // unhover
  await userEvent.unhover(promoToast);
  await sleep(400);
  await expect(toastContainer.getBoundingClientRect().height).toBeGreaterThan(30);

  // dissmiss two info toasts
  await userEvent.click(getAllByRole('button', { name: 'Dismiss toast' })[0]);
  await userEvent.click(getAllByRole('button', { name: 'Dismiss toast' })[1]);

  await sleep(400);
  await expect(queryByText('Toast 3')).not.toBeVisible();
  await expect(queryByText('Toast 4')).not.toBeVisible();

  await expect(toastContainer.getBoundingClientRect().height).toBeGreaterThan(130);
};

export const ToastZIndex: StoryFn<typeof Toast> = (): React.ReactElement => {
  const toast = useToast();

  React.useEffect(() => {
    toast.dismiss();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      <Button
        onClick={() => {
          toast.show({ content: 'Toast with zIndex 3000', zIndex: 3000, autoDismiss: false });
        }}
      >
        Show zIndex 3000
      </Button>
      <Button
        onClick={() => {
          toast.show({ content: 'Toast with zIndex 5000', zIndex: 5000, autoDismiss: false });
        }}
      >
        Show zIndex 5000
      </Button>
      <Button
        onClick={() => {
          toast.show({ content: 'Toast with zIndex 4000', zIndex: 4000, autoDismiss: false });
        }}
      >
        Show zIndex 4000
      </Button>
      <Button
        onClick={() => {
          toast.show({ content: 'Toast without zIndex', autoDismiss: false });
        }}
      >
        Show No zIndex
      </Button>
      <Button
        onClick={() => {
          toast.dismiss();
        }}
      >
        Dismiss All
      </Button>
      <ToastContainer />
    </Box>
  );
};

ToastZIndex.play = async () => {
  const { getByRole, queryByText } = within(document.body);
  await sleep(1000);

  const button3000 = getByRole('button', { name: 'Show zIndex 3000' });
  const button5000 = getByRole('button', { name: 'Show zIndex 5000' });
  const button4000 = getByRole('button', { name: 'Show zIndex 4000' });
  const buttonNoZIndex = getByRole('button', { name: 'Show No zIndex' });
  const dismissAllButton = getByRole('button', { name: 'Dismiss All' });

  // Get the toast container element
  const toastContainerElement = document.querySelector('[data-blade-component="toast-container"]')!;

  // Initially, no toasts, should use default TOAST_Z_INDEX (2000)
  await expect(toastContainerElement).toBeInTheDocument();
  let computedStyle = window.getComputedStyle(toastContainerElement);
  void expect(parseInt(computedStyle.zIndex, 10)).toBe(2000);

  // Show toast with zIndex 3000
  await userEvent.click(button3000);
  await sleep(400);
  await expect(queryByText('Toast with zIndex 3000')).toBeVisible();
  computedStyle = window.getComputedStyle(toastContainerElement);
  void expect(parseInt(computedStyle.zIndex, 10)).toBe(3000);

  // Show toast with zIndex 5000 (higher)
  await userEvent.click(button5000);
  await sleep(400);
  await expect(queryByText('Toast with zIndex 5000')).toBeVisible();
  computedStyle = window.getComputedStyle(toastContainerElement);
  // Should use maximum zIndex (5000)
  void expect(parseInt(computedStyle.zIndex, 10)).toBe(5000);

  // Show toast with zIndex 4000 (lower than max)
  await userEvent.click(button4000);
  await sleep(400);
  await expect(queryByText('Toast with zIndex 4000')).toBeVisible();
  computedStyle = window.getComputedStyle(toastContainerElement);
  // Should still use maximum zIndex (5000)
  void expect(parseInt(computedStyle.zIndex, 10)).toBe(5000);

  // Show toast without zIndex (undefined)
  await userEvent.click(buttonNoZIndex);
  await sleep(400);
  await expect(queryByText('Toast without zIndex')).toBeVisible();
  computedStyle = window.getComputedStyle(toastContainerElement);
  // Should filter out undefined and still use maximum of defined values (5000)
  void expect(parseInt(computedStyle.zIndex, 10)).toBe(5000);

  // Dismiss all toasts
  await userEvent.click(dismissAllButton);
  await sleep(400);
  await expect(queryByText('Toast with zIndex 3000')).not.toBeVisible();
  await expect(queryByText('Toast with zIndex 5000')).not.toBeVisible();
  await expect(queryByText('Toast with zIndex 4000')).not.toBeVisible();
  await expect(queryByText('Toast without zIndex')).not.toBeVisible();

  // After dismissing all, should fall back to default TOAST_Z_INDEX (2000)
  computedStyle = window.getComputedStyle(toastContainerElement);
  void expect(parseInt(computedStyle.zIndex, 10)).toBe(2000);
};

export default {
  title: 'Components/Interaction Tests/Toast',
  parameters: {
    controls: {
      disable: true,
    },
    a11y: { disable: true },
    essentials: { disable: true },
  },
};

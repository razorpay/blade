/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { act, fireEvent } from '@testing-library/react';
import React from 'react';
import toast from 'react-hot-toast';
import type { ToastProps } from '../types';
import { ToastContainer } from '../ToastContainer';
import { useToast } from '../useToast';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';
import { Button } from '~components/Button';
import { ArrowRightIcon } from '~components/Icons';
import { Text } from '~components/Typography';

const ToastExample = (props: ToastProps) => {
  const { show } = useToast();

  return (
    <>
      {/* `show` sets default values on the props object, so pass a copy */}
      <Button onClick={() => show({ ...props })}>Show Toast</Button>
      <ToastContainer />
    </>
  );
};

const promotionalProps: ToastProps = {
  type: 'promotional',
  content: <Text>Reports are now faster</Text>,
  autoDismiss: true,
  duration: 2000,
};

const advanceTime = (ms: number) => {
  act(() => {
    jest.advanceTimersByTime(ms);
  });
};

describe('<Toast /> promotional timer', () => {
  let dismissSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    dismissSpy = jest.spyOn(toast, 'dismiss');
  });

  afterEach(() => {
    act(() => {
      toast.remove();
    });
    dismissSpy.mockRestore();
    jest.useRealTimers();
  });

  it('should start the timer after introDuration', () => {
    const { getByRole } = renderWithTheme(
      <ToastExample {...promotionalProps} introDuration={1000} />,
    );
    fireEvent.click(getByRole('button', { name: 'Show Toast' }));

    // intro ends, the 2000ms timer starts now
    advanceTime(1000);
    advanceTime(1999);
    expect(dismissSpy).not.toHaveBeenCalled();
    advanceTime(1);
    expect(dismissSpy).toHaveBeenCalledTimes(1);
  });

  it('should hold the action until the intro ends', () => {
    const { getByRole, queryByRole } = renderWithTheme(
      <ToastExample {...promotionalProps} introDuration={1000} action={{ text: 'Try now' }} />,
    );
    fireEvent.click(getByRole('button', { name: 'Show Toast' }));

    expect(queryByRole('button', { name: 'Try now' })).not.toBeInTheDocument();
    expect(getByRole('button', { name: 'Dismiss toast' })).toBeInTheDocument();
    advanceTime(1000);
    expect(getByRole('button', { name: 'Try now' })).toBeInTheDocument();
  });

  it('should dismiss the toast at the end of duration', () => {
    const { getByRole, queryByText } = renderWithTheme(<ToastExample {...promotionalProps} />);
    fireEvent.click(getByRole('button', { name: 'Show Toast' }));
    expect(queryByText('Reports are now faster')).toBeInTheDocument();

    advanceTime(0);
    advanceTime(2000);
    expect(dismissSpy).toHaveBeenCalledTimes(1);
    // react-hot-toast removes a dismissed toast after 1000ms
    advanceTime(1000);
    expect(queryByText('Reports are now faster')).not.toBeInTheDocument();
  });

  it('should pause on hover and resume from where it stopped on leave', () => {
    const { getByRole } = renderWithTheme(<ToastExample {...promotionalProps} />);
    fireEvent.click(getByRole('button', { name: 'Show Toast' }));
    advanceTime(0);
    advanceTime(1000);

    fireEvent.mouseEnter(getByRole('status'));
    advanceTime(5000);
    expect(dismissSpy).not.toHaveBeenCalled();

    fireEvent.mouseLeave(getByRole('status'));
    advanceTime(999);
    expect(dismissSpy).not.toHaveBeenCalled();
    advanceTime(1);
    expect(dismissSpy).toHaveBeenCalledTimes(1);
  });

  it('should pause while focus is inside the toast', () => {
    const { getByRole } = renderWithTheme(<ToastExample {...promotionalProps} />);
    fireEvent.click(getByRole('button', { name: 'Show Toast' }));
    advanceTime(0);
    advanceTime(500);

    const dismissButton = getByRole('button', { name: 'Dismiss toast' });
    act(() => {
      dismissButton.focus();
    });
    advanceTime(5000);
    expect(dismissSpy).not.toHaveBeenCalled();

    act(() => {
      dismissButton.blur();
    });
    advanceTime(1499);
    expect(dismissSpy).not.toHaveBeenCalled();
    advanceTime(1);
    expect(dismissSpy).toHaveBeenCalledTimes(1);
  });

  it('should render the progress bar and pause it with the timer', () => {
    const { getByRole, getByTestId } = renderWithTheme(
      <ToastExample {...promotionalProps} showProgressBar />,
    );
    fireEvent.click(getByRole('button', { name: 'Show Toast' }));
    advanceTime(0);

    const progressBar = getByTestId('toast-progress-bar');
    expect(progressBar).toHaveAttribute('aria-hidden', 'true');
    expect(progressBar).toHaveStyle({ animationPlayState: 'running' });

    fireEvent.mouseEnter(getByRole('status'));
    expect(progressBar).toHaveStyle({ animationPlayState: 'paused' });
  });

  it('should not render the progress bar without autoDismiss', () => {
    const { getByRole, queryByTestId } = renderWithTheme(
      <ToastExample {...promotionalProps} autoDismiss={false} showProgressBar />,
    );
    fireEvent.click(getByRole('button', { name: 'Show Toast' }));
    advanceTime(0);

    expect(queryByTestId('toast-progress-bar')).not.toBeInTheDocument();
  });

  it('should not render the progress bar on informational toast', () => {
    const { getByRole, queryByTestId } = renderWithTheme(
      <ToastExample content="Payment successful" autoDismiss showProgressBar />,
    );
    fireEvent.click(getByRole('button', { name: 'Show Toast' }));
    advanceTime(0);

    expect(queryByTestId('toast-progress-bar')).not.toBeInTheDocument();
  });

  it('should render a link action with href', () => {
    const { getByRole } = renderWithTheme(
      <ToastExample
        {...promotionalProps}
        action={{
          text: 'Learn more',
          variant: 'link',
          href: 'https://example.com',
          target: '_blank',
          icon: ArrowRightIcon,
          iconPosition: 'right',
        }}
      />,
    );
    fireEvent.click(getByRole('button', { name: 'Show Toast' }));

    const link = getByRole('link', { name: 'Learn more' });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noreferrer noopener');
  });

  it('should not have accessibility violations', async () => {
    const { container, getByRole } = renderWithTheme(
      <ToastExample
        {...promotionalProps}
        showProgressBar
        action={{ text: 'Learn more', variant: 'link', href: 'https://example.com' }}
      />,
    );
    fireEvent.click(getByRole('button', { name: 'Show Toast' }));
    advanceTime(0);

    // axe needs real timers
    jest.useRealTimers();
    await assertAccessible(container);
  });
});

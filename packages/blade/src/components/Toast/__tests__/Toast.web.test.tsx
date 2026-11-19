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

const RemountExample = (props: ToastProps) => {
  const { show } = useToast();
  const [containerKey, setContainerKey] = React.useState(0);

  return (
    <>
      <Button onClick={() => show({ ...props })}>Show Toast</Button>
      <Button onClick={() => setContainerKey((key) => key + 1)}>Remount</Button>
      <ToastContainer key={containerKey} />
    </>
  );
};

const UpdateExample = () => {
  const { show } = useToast();

  return (
    <>
      <Button onClick={() => show({ id: 'update', content: 'Saving report' })}>Show Info</Button>
      <Button
        onClick={() =>
          show({
            id: 'update',
            type: 'promotional',
            content: <Text>Report is ready</Text>,
            autoDismiss: true,
            duration: 2000,
            introDuration: 1000,
            action: { text: 'Try now' },
          })
        }
      >
        Show Promo
      </Button>
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

// jsdom has no PointerEvent, so set `pointerType` on a mouse event
const firePointer = (
  element: Element,
  eventType: 'pointerover' | 'pointerout',
  pointerType = 'mouse',
) => {
  const event = new MouseEvent(eventType, { bubbles: true });
  Object.defineProperty(event, 'pointerType', { value: pointerType });
  act(() => {
    element.dispatchEvent(event);
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

  it('should hold the action and the progress bar until the intro ends', () => {
    const { getByRole, getByTestId, queryByRole } = renderWithTheme(
      <ToastExample
        {...promotionalProps}
        introDuration={1000}
        showProgressBar
        action={{ text: 'Try now' }}
      />,
    );
    fireEvent.click(getByRole('button', { name: 'Show Toast' }));

    expect(queryByRole('button', { name: 'Try now' })).not.toBeInTheDocument();
    expect(getByTestId('toast-progress-bar')).toHaveStyle({ visibility: 'hidden' });
    expect(getByRole('button', { name: 'Dismiss toast' })).toBeInTheDocument();
    advanceTime(1000);
    expect(getByRole('button', { name: 'Try now' })).toBeInTheDocument();
    expect(getByTestId('toast-progress-bar')).not.toHaveStyle({ visibility: 'hidden' });
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

    firePointer(getByRole('status'), 'pointerover');
    advanceTime(5000);
    expect(dismissSpy).not.toHaveBeenCalled();

    firePointer(getByRole('status'), 'pointerout');
    advanceTime(999);
    expect(dismissSpy).not.toHaveBeenCalled();
    advanceTime(1);
    expect(dismissSpy).toHaveBeenCalledTimes(1);
  });

  it('should not pause for a touch pointer', () => {
    const { getByRole } = renderWithTheme(<ToastExample {...promotionalProps} />);
    fireEvent.click(getByRole('button', { name: 'Show Toast' }));
    advanceTime(1000);

    firePointer(getByRole('status'), 'pointerover', 'touch');
    advanceTime(1000);
    expect(dismissSpy).toHaveBeenCalledTimes(1);
  });

  it('should not stay paused after a click on the action', () => {
    const { getByRole } = renderWithTheme(
      <ToastExample {...promotionalProps} action={{ text: 'Try now' }} />,
    );
    fireEvent.click(getByRole('button', { name: 'Show Toast' }));
    advanceTime(1000);

    const actionButton = getByRole('button', { name: 'Try now' });
    // A mouse click focuses the action, but the focus does not match `:focus-visible`
    const matchesSpy = jest.spyOn(actionButton, 'matches').mockReturnValue(false);
    firePointer(actionButton, 'pointerover');
    act(() => {
      actionButton.focus();
    });
    fireEvent.click(actionButton);
    matchesSpy.mockRestore();
    firePointer(actionButton, 'pointerout');

    advanceTime(999);
    expect(dismissSpy).not.toHaveBeenCalled();
    advanceTime(1);
    expect(dismissSpy).toHaveBeenCalledTimes(1);
  });

  it('should stay paused while focus moves inside the toast', () => {
    const { getByRole } = renderWithTheme(
      <ToastExample {...promotionalProps} action={{ text: 'Try now' }} />,
    );
    fireEvent.click(getByRole('button', { name: 'Show Toast' }));
    advanceTime(500);

    const dismissButton = getByRole('button', { name: 'Dismiss toast' });
    act(() => {
      getByRole('button', { name: 'Try now' }).focus();
    });
    act(() => {
      dismissButton.focus();
    });
    advanceTime(5000);
    expect(dismissSpy).not.toHaveBeenCalled();

    act(() => {
      dismissButton.blur();
    });
    advanceTime(1500);
    expect(dismissSpy).toHaveBeenCalledTimes(1);
  });

  it('should keep the time left when the toast remounts', () => {
    const { getByRole } = renderWithTheme(<RemountExample {...promotionalProps} />);
    fireEvent.click(getByRole('button', { name: 'Show Toast' }));
    advanceTime(1500);

    fireEvent.click(getByRole('button', { name: 'Remount' }));
    advanceTime(499);
    expect(dismissSpy).not.toHaveBeenCalled();
    advanceTime(1);
    expect(dismissSpy).toHaveBeenCalledTimes(1);
  });

  it('should play the intro and run the new duration after an update by id', () => {
    const { getByRole, queryByRole } = renderWithTheme(<UpdateExample />);
    fireEvent.click(getByRole('button', { name: 'Show Info' }));
    advanceTime(500);
    fireEvent.click(getByRole('button', { name: 'Show Promo' }));

    expect(queryByRole('button', { name: 'Try now' })).not.toBeInTheDocument();
    advanceTime(1000);
    expect(getByRole('button', { name: 'Try now' })).toBeInTheDocument();
    advanceTime(1999);
    expect(dismissSpy).not.toHaveBeenCalled();
    advanceTime(1);
    expect(dismissSpy).toHaveBeenCalledWith('update');
  });

  it('should pause while keyboard focus is inside the toast', () => {
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

    firePointer(getByRole('status'), 'pointerover');
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

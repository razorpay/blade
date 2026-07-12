import * as React from 'react';
import { act, fireEvent, waitFor } from '@testing-library/react';
import { RazorSenseAuthored } from '../RazorSenseAuthored';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

type VideoController = {
  cancelVideoFrameCallback: jest.Mock;
  getIsPaused: () => boolean;
  pause: jest.Mock;
  play: jest.Mock;
};

const configureVideo = (
  video: HTMLVideoElement,
  { withVideoFrameCallback = false }: { withVideoFrameCallback?: boolean } = {},
): VideoController => {
  let currentTime = 0;
  let isPaused = true;
  let nextFrameCallbackId = 1;
  const frameCallbacks = new Map<number, (now: number, metadata: { mediaTime: number }) => void>();
  const play = jest.fn(() => {
    isPaused = false;
    return Promise.resolve();
  });
  const pause = jest.fn(() => {
    isPaused = true;
  });
  const cancelVideoFrameCallback = jest.fn((callbackId: number) => {
    frameCallbacks.delete(callbackId);
  });

  Object.defineProperties(video, {
    currentTime: {
      configurable: true,
      get: () => currentTime,
      set: (nextTime: number) => {
        currentTime = nextTime;
      },
    },
    pause: { configurable: true, value: pause },
    paused: { configurable: true, get: () => isPaused },
    play: { configurable: true, value: play },
    readyState: { configurable: true, get: () => 4 },
    seeking: { configurable: true, get: () => false },
  });

  if (withVideoFrameCallback) {
    Object.defineProperties(video, {
      cancelVideoFrameCallback: { configurable: true, value: cancelVideoFrameCallback },
      requestVideoFrameCallback: {
        configurable: true,
        value: (callback: (now: number, metadata: { mediaTime: number }) => void) => {
          const callbackId = nextFrameCallbackId++;
          frameCallbacks.set(callbackId, callback);
          return callbackId;
        },
      },
    });
  }

  return {
    cancelVideoFrameCallback,
    getIsPaused: () => isPaused,
    pause,
    play,
  };
};

describe('<RazorSenseAuthored />', () => {
  let rafCallbacks: Map<number, FrameRequestCallback>;
  let nextRafId: number;

  beforeEach(() => {
    rafCallbacks = new Map();
    nextRafId = 1;
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      const frameId = nextRafId++;
      rafCallbacks.set(frameId, callback);
      return frameId;
    });
    jest.spyOn(window, 'cancelAnimationFrame').mockImplementation((frameId) => {
      rafCallbacks.delete(frameId);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const flushAnimationFrame = async (): Promise<void> => {
    await act(async () => {
      const callbacks = Array.from(rafCallbacks.values());
      rafCallbacks.clear();
      callbacks.forEach((callback) => callback(0));
      await Promise.resolve();
    });
  };

  const getThinkingVideos = async (container: HTMLElement): Promise<HTMLVideoElement[]> => {
    await waitFor(() => expect(container.querySelectorAll('video')).toHaveLength(2));
    return Array.from(container.querySelectorAll('video'));
  };

  it('falls back to a looping primary and reports one early Thinking seam error', async () => {
    const onError = jest.fn();
    const { container } = renderWithTheme(
      <RazorSenseAuthored mode="thinking" assetsPath="/assets/spark" onError={onError} />,
    );
    const [primary, secondary] = await getThinkingVideos(container);
    const primaryController = configureVideo(primary);
    const secondaryController = configureVideo(secondary, { withVideoFrameCallback: true });

    fireEvent.loadedData(primary);
    fireEvent.error(secondary);
    fireEvent.loadedData(secondary);
    fireEvent.error(secondary);
    await flushAnimationFrame();
    await flushAnimationFrame();

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('thinking') }),
    );
    expect(primary.loop).toBe(true);
    expect(primary.style.opacity).toBe('1');
    expect(secondary.style.opacity).toBe('0');
    expect(secondaryController.play).not.toHaveBeenCalled();
    expect(secondaryController.getIsPaused()).toBe(true);
    expect(primaryController.getIsPaused()).toBe(false);
    expect(primaryController.play.mock.invocationCallOrder.at(-1)).toBeGreaterThan(
      primaryController.pause.mock.invocationCallOrder.at(-1) ?? 0,
    );
  });

  it('pauses both rVFC preparation nudges when runtime admission is suspended', async () => {
    const Example = (): React.ReactElement => {
      const [isSuspended, setIsSuspended] = React.useState(false);
      return (
        <>
          <button type="button" onClick={() => setIsSuspended(true)}>
            Suspend
          </button>
          <RazorSenseAuthored
            mode="thinking"
            assetsPath="/assets/spark"
            runtimeState={isSuspended ? 'suspended' : 'active'}
            isRuntimeAdmitted={!isSuspended}
          />
        </>
      );
    };

    const { container, getByRole } = renderWithTheme(<Example />);
    const [primary, secondary] = await getThinkingVideos(container);
    const primaryController = configureVideo(primary, { withVideoFrameCallback: true });
    const secondaryController = configureVideo(secondary, { withVideoFrameCallback: true });

    fireEvent.loadedData(primary);
    fireEvent.loadedData(secondary);
    expect(primaryController.play).toHaveBeenCalledTimes(1);
    expect(secondaryController.play).toHaveBeenCalledTimes(1);
    primaryController.pause.mockClear();
    secondaryController.pause.mockClear();

    fireEvent.click(getByRole('button', { name: 'Suspend' }));

    expect(primaryController.cancelVideoFrameCallback).toHaveBeenCalled();
    expect(secondaryController.cancelVideoFrameCallback).toHaveBeenCalled();
    expect(primaryController.pause).toHaveBeenCalledTimes(1);
    expect(secondaryController.pause).toHaveBeenCalledTimes(1);
    expect(primaryController.getIsPaused()).toBe(true);
    expect(secondaryController.getIsPaused()).toBe(true);
  });
});

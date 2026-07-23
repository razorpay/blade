import * as React from 'react';
import { act, fireEvent, waitFor } from '@testing-library/react';
import { MobileRazorSenseMood } from '../RazorSenseMood';
import { MODE_REPRESENTATIVE_PHASE_SECONDS } from '../razorSensePrograms';
import renderWithTheme from '~utils/testing/renderWithTheme';

jest.mock('../razorSenseAssets', () => {
  const actual = jest.requireActual('../razorSenseAssets');
  return {
    ...actual,
    selectRazorSenseVideoSource: jest.fn(() =>
      Promise.resolve({ src: '/assets/spark/razorsense-modes/razorsense-joyful-mobile.mp4' }),
    ),
  };
});

const configureVideo = (video: HTMLVideoElement): void => {
  let currentTime = 0;
  let isPaused = true;
  Object.defineProperties(video, {
    currentTime: {
      configurable: true,
      get: () => currentTime,
      set: (nextTime: number) => {
        currentTime = nextTime;
      },
    },
    duration: { configurable: true, get: () => 4 },
    pause: {
      configurable: true,
      value: jest.fn(() => {
        isPaused = true;
      }),
    },
    paused: { configurable: true, get: () => isPaused },
    play: {
      configurable: true,
      value: jest.fn(() => {
        isPaused = false;
        return Promise.resolve();
      }),
    },
    readyState: { configurable: true, get: () => 4 },
    seeking: { configurable: true, get: () => false },
  });
};

describe('<MobileRazorSenseMood /> playback', () => {
  let rafCallbacks: Map<number, FrameRequestCallback>, nextRafId: number;

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
    jest.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined);
    jest.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(() => Promise.resolve());
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

  const prepareVideo = async (container: HTMLElement): Promise<HTMLVideoElement> => {
    await waitFor(() => expect(container.querySelector('video')).not.toBeNull());
    const video = container.querySelector('video')!;
    configureVideo(video);
    fireEvent.loadedData(video);
    await flushAnimationFrame();
    await flushAnimationFrame();
    return video;
  };

  it('uses additional-repeat semantics and reports the exact terminal frame once', async () => {
    const onIteration = jest.fn();
    const onTerminal = jest.fn();
    const { container } = renderWithTheme(
      <MobileRazorSenseMood
        mode="joyful"
        occurrenceId={1}
        playback={{ playback: 'repeat', repeatCount: 1, endBehavior: 'hold' }}
        onIteration={onIteration}
        onTerminal={onTerminal}
        assetsPath="/assets/spark"
      />,
    );
    const video = await prepareVideo(container);

    fireEvent.ended(video);
    expect(onIteration).toHaveBeenLastCalledWith(1);
    await flushAnimationFrame();
    await flushAnimationFrame();
    expect(video.currentTime).toBe(0);
    expect(onTerminal).not.toHaveBeenCalled();

    fireEvent.ended(video);
    expect(onIteration).toHaveBeenLastCalledWith(2);
    await flushAnimationFrame();
    await flushAnimationFrame();

    expect(onIteration).toHaveBeenCalledTimes(2);
    expect(onTerminal).toHaveBeenCalledTimes(1);
    expect(onTerminal).toHaveBeenCalledWith(2);
    expect(video.currentTime).toBeCloseTo(MODE_REPRESENTATIVE_PHASE_SECONDS.joyful, 5);

    fireEvent.ended(video);
    expect(onIteration).toHaveBeenCalledTimes(2);
    expect(onTerminal).toHaveBeenCalledTimes(1);
  });

  it('keeps a terminal boundary pending while manually paused', async () => {
    const onTerminal = jest.fn();
    const Example = (): React.ReactElement => {
      const [paused, setPaused] = React.useState(false);
      return (
        <>
          <button type="button" onClick={() => setPaused((isPaused) => !isPaused)}>
            Toggle pause
          </button>
          <MobileRazorSenseMood
            mode="joyful"
            occurrenceId={2}
            playback={{ playback: 'once', endBehavior: 'hold' }}
            paused={paused}
            onTerminal={onTerminal}
            assetsPath="/assets/spark"
          />
        </>
      );
    };
    const { container, getByRole } = renderWithTheme(<Example />);
    const video = await prepareVideo(container);

    fireEvent.ended(video);
    fireEvent.click(getByRole('button', { name: 'Toggle pause' }));
    await flushAnimationFrame();
    await flushAnimationFrame();
    expect(onTerminal).not.toHaveBeenCalled();

    fireEvent.click(getByRole('button', { name: 'Toggle pause' }));
    await flushAnimationFrame();
    await flushAnimationFrame();
    expect(onTerminal).toHaveBeenCalledTimes(1);
    expect(onTerminal).toHaveBeenCalledWith(1);
  });
});

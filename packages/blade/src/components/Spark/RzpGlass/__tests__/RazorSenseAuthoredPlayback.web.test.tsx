import * as React from 'react';
import { act, fireEvent, waitFor } from '@testing-library/react';
import { RazorSenseAuthored } from '../RazorSenseAuthored';
import { MODE_REPRESENTATIVE_PHASE_SECONDS } from '../razorSensePrograms';
import renderWithTheme from '~utils/testing/renderWithTheme';

type VideoController = {
  getCurrentTime: () => number;
  pause: jest.Mock;
  play: jest.Mock;
  setCurrentTime: (time: number) => void;
};

const configureVideo = (video: HTMLVideoElement): VideoController => {
  let currentTime = 0;
  let isPaused = true;
  const play = jest.fn(() => {
    isPaused = false;
    return Promise.resolve();
  });
  const pause = jest.fn(() => {
    isPaused = true;
  });

  Object.defineProperties(video, {
    currentTime: {
      configurable: true,
      get: () => currentTime,
      set: (nextTime: number) => {
        currentTime = nextTime;
      },
    },
    ended: { configurable: true, get: () => false },
    pause: { configurable: true, value: pause },
    paused: { configurable: true, get: () => isPaused },
    play: { configurable: true, value: play },
    readyState: { configurable: true, get: () => 4 },
    seeking: { configurable: true, get: () => false },
  });

  return {
    getCurrentTime: () => currentTime,
    pause,
    play,
    setCurrentTime: (time) => {
      currentTime = time;
    },
  };
};

describe('<RazorSenseAuthored /> managed playback', () => {
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

  const flushAnimationFrames = async (count: number): Promise<void> => {
    if (count === 0) return;
    await act(async () => {
      const callbacks = Array.from(rafCallbacks.values());
      rafCallbacks.clear();
      callbacks.forEach((callback) => callback(0));
      await Promise.resolve();
    });
    await flushAnimationFrames(count - 1);
  };

  const prepareVideo = async (video: HTMLVideoElement): Promise<VideoController> => {
    const controller = configureVideo(video);
    fireEvent.loadedData(video);
    await flushAnimationFrames(3);
    return controller;
  };

  it('holds the calibrated expressive frame and emits finite milestones once', async () => {
    const onIteration = jest.fn();
    const onTerminal = jest.fn();
    const { container } = renderWithTheme(
      <RazorSenseAuthored
        mode="typing"
        assetsPath="/assets/spark"
        occurrenceId={1}
        playback={{ playback: 'once', endBehavior: 'hold' }}
        onIteration={onIteration}
        onTerminal={onTerminal}
      />,
    );
    await waitFor(() => expect(container.querySelectorAll('video')).toHaveLength(1));
    const video = container.querySelector('video') as HTMLVideoElement;
    const controller = await prepareVideo(video);

    controller.setCurrentTime(3.3);
    fireEvent.timeUpdate(video);
    expect(onIteration).toHaveBeenCalledTimes(1);
    expect(onIteration).toHaveBeenLastCalledWith(1);
    expect(onTerminal).not.toHaveBeenCalled();

    await flushAnimationFrames(2);
    expect(controller.getCurrentTime()).toBeCloseTo(MODE_REPRESENTATIVE_PHASE_SECONDS.typing, 3);
    expect(controller.pause).toHaveBeenCalled();
    expect(onTerminal).toHaveBeenCalledTimes(1);
    expect(onTerminal).toHaveBeenLastCalledWith(1);

    fireEvent.timeUpdate(video);
    fireEvent.ended(video);
    await flushAnimationFrames(2);
    expect(onIteration).toHaveBeenCalledTimes(1);
    expect(onTerminal).toHaveBeenCalledTimes(1);
  });

  it('treats repeatCount as additional iterations before terminal hold', async () => {
    const onIteration = jest.fn();
    const onTerminal = jest.fn();
    const { container } = renderWithTheme(
      <RazorSenseAuthored
        mode="loading"
        assetsPath="/assets/spark"
        occurrenceId={2}
        playback={{ playback: 'repeat', repeatCount: 1, endBehavior: 'hold' }}
        onIteration={onIteration}
        onTerminal={onTerminal}
      />,
    );
    await waitFor(() => expect(container.querySelectorAll('video')).toHaveLength(1));
    const video = container.querySelector('video') as HTMLVideoElement;
    const controller = await prepareVideo(video);

    controller.setCurrentTime(3.1);
    fireEvent.timeUpdate(video);
    expect(onIteration).toHaveBeenLastCalledWith(1);
    await flushAnimationFrames(2);
    expect(controller.getCurrentTime()).toBe(0);
    expect(onTerminal).not.toHaveBeenCalled();

    controller.setCurrentTime(3.1);
    fireEvent.timeUpdate(video);
    expect(onIteration).toHaveBeenLastCalledWith(2);
    await flushAnimationFrames(2);
    expect(onIteration).toHaveBeenCalledTimes(2);
    expect(onTerminal).toHaveBeenCalledTimes(1);
    expect(onTerminal).toHaveBeenLastCalledWith(2);
  });

  it('reports every explicit loop seam without producing a terminal milestone', async () => {
    const onIteration = jest.fn();
    const onTerminal = jest.fn();
    const { container } = renderWithTheme(
      <RazorSenseAuthored
        mode="neutral"
        assetsPath="/assets/spark"
        occurrenceId={20}
        playback={{ playback: 'loop' }}
        onIteration={onIteration}
        onTerminal={onTerminal}
      />,
    );
    await waitFor(() => expect(container.querySelectorAll('video')).toHaveLength(1));
    const video = container.querySelector('video') as HTMLVideoElement;
    const controller = await prepareVideo(video);

    controller.setCurrentTime(8.7);
    fireEvent.timeUpdate(video);
    await flushAnimationFrames(2);
    controller.setCurrentTime(8.7);
    fireEvent.timeUpdate(video);
    await flushAnimationFrames(2);

    expect(onIteration.mock.calls).toEqual([[1], [2]]);
    expect(onTerminal).not.toHaveBeenCalled();
  });

  it('replays a same-mode occurrence and rejects milestones from its stale layer', async () => {
    const onIteration = jest.fn();
    const onTerminal = jest.fn();
    const Example = (): React.ReactElement => {
      const [occurrenceId, setOccurrenceId] = React.useState(1);
      return (
        <>
          <button type="button" onClick={() => setOccurrenceId(2)}>
            Replay
          </button>
          <RazorSenseAuthored
            mode="typing"
            assetsPath="/assets/spark"
            occurrenceId={occurrenceId}
            playback={{ playback: 'once', endBehavior: 'hold' }}
            modeTransitionDuration={10}
            onIteration={onIteration}
            onTerminal={onTerminal}
          />
        </>
      );
    };
    const { container, getByRole } = renderWithTheme(<Example />);
    await waitFor(() => expect(container.querySelectorAll('video')).toHaveLength(1));
    const firstVideo = container.querySelector('video') as HTMLVideoElement;
    const firstController = await prepareVideo(firstVideo);

    fireEvent.click(getByRole('button', { name: 'Replay' }));
    await waitFor(() => expect(container.querySelectorAll('video')).toHaveLength(2));
    const secondVideo = container.querySelectorAll('video')[1];
    const secondController = await prepareVideo(secondVideo);

    firstController.setCurrentTime(3.3);
    fireEvent.timeUpdate(firstVideo);
    await flushAnimationFrames(2);
    expect(onIteration).not.toHaveBeenCalled();
    expect(onTerminal).not.toHaveBeenCalled();

    secondController.setCurrentTime(3.3);
    fireEvent.timeUpdate(secondVideo);
    await flushAnimationFrames(2);
    expect(onIteration).toHaveBeenCalledTimes(1);
    expect(onTerminal).toHaveBeenCalledTimes(1);
  });

  it('does not advance or duplicate milestones while paused', async () => {
    const onIteration = jest.fn();
    const onTerminal = jest.fn();
    const Example = (): React.ReactElement => {
      const [paused, setPaused] = React.useState(true);
      return (
        <>
          <button type="button" onClick={() => setPaused(false)}>
            Resume
          </button>
          <RazorSenseAuthored
            mode="typing"
            assetsPath="/assets/spark"
            occurrenceId={3}
            playback={{ playback: 'once', endBehavior: 'reset-to-start' }}
            paused={paused}
            onIteration={onIteration}
            onTerminal={onTerminal}
          />
        </>
      );
    };
    const { container, getByRole } = renderWithTheme(<Example />);
    await waitFor(() => expect(container.querySelectorAll('video')).toHaveLength(1));
    const video = container.querySelector('video') as HTMLVideoElement;
    const controller = await prepareVideo(video);

    controller.setCurrentTime(3.3);
    fireEvent.timeUpdate(video);
    expect(onIteration).not.toHaveBeenCalled();

    fireEvent.click(getByRole('button', { name: 'Resume' }));
    fireEvent.timeUpdate(video);
    await flushAnimationFrames(2);
    expect(controller.getCurrentTime()).toBe(0);
    expect(onIteration).toHaveBeenCalledTimes(1);
    expect(onTerminal).toHaveBeenCalledTimes(1);
  });

  it('resumes an exact terminal-frame wait after runtime suspension', async () => {
    const onIteration = jest.fn();
    const onTerminal = jest.fn();
    const Example = (): React.ReactElement => {
      const [isSuspended, setIsSuspended] = React.useState(false);
      return (
        <>
          <button type="button" onClick={() => setIsSuspended(true)}>
            Suspend
          </button>
          <button type="button" onClick={() => setIsSuspended(false)}>
            Resume
          </button>
          <RazorSenseAuthored
            mode="typing"
            assetsPath="/assets/spark"
            occurrenceId={30}
            playback={{ playback: 'once', endBehavior: 'hold' }}
            runtimeState={isSuspended ? 'suspended' : 'active'}
            onIteration={onIteration}
            onTerminal={onTerminal}
          />
        </>
      );
    };
    const { container, getByRole } = renderWithTheme(<Example />);
    await waitFor(() => expect(container.querySelectorAll('video')).toHaveLength(1));
    const video = container.querySelector('video') as HTMLVideoElement;
    const controller = await prepareVideo(video);

    controller.setCurrentTime(3.3);
    fireEvent.timeUpdate(video);
    expect(onIteration).toHaveBeenCalledTimes(1);
    fireEvent.click(getByRole('button', { name: 'Suspend' }));
    await flushAnimationFrames(2);
    expect(onTerminal).not.toHaveBeenCalled();

    fireEvent.click(getByRole('button', { name: 'Resume' }));
    await flushAnimationFrames(2);
    expect(onIteration).toHaveBeenCalledTimes(1);
    expect(onTerminal).toHaveBeenCalledTimes(1);
  });

  it('holds Thinking on its calibrated expressive frame instead of entering the loop crossfade', async () => {
    const onIteration = jest.fn();
    const onTerminal = jest.fn();
    const { container } = renderWithTheme(
      <RazorSenseAuthored
        mode="thinking"
        assetsPath="/assets/spark"
        occurrenceId={4}
        playback={{ playback: 'once', endBehavior: 'hold' }}
        onIteration={onIteration}
        onTerminal={onTerminal}
      />,
    );
    await waitFor(() => expect(container.querySelectorAll('video')).toHaveLength(2));
    const [primary, secondary] = Array.from(container.querySelectorAll('video'));
    const primaryController = configureVideo(primary);
    const secondaryController = configureVideo(secondary);
    fireEvent.loadedData(primary);
    fireEvent.loadedData(secondary);
    await flushAnimationFrames(4);

    primaryController.setCurrentTime(4);
    await flushAnimationFrames(1);
    expect(primary.style.opacity).toBe('1');
    expect(secondary.style.opacity).toBe('0');
    expect(secondaryController.play).not.toHaveBeenCalled();

    primaryController.setCurrentTime(4.48);
    await flushAnimationFrames(3);
    expect(primaryController.getCurrentTime()).toBeCloseTo(
      MODE_REPRESENTATIVE_PHASE_SECONDS.thinking,
      3,
    );
    expect(primary.style.opacity).toBe('1');
    expect(secondary.style.opacity).toBe('0');
    expect(onIteration).toHaveBeenCalledTimes(1);
    expect(onTerminal).toHaveBeenCalledTimes(1);
  });
});

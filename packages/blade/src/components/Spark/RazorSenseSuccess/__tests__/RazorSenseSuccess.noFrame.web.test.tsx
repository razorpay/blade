/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { act } from '@testing-library/react';
import { RazorSenseSuccess } from '../index';
import renderWithTheme from '~utils/testing/renderWithTheme';

// Its stage, driven by hand: when it starts (its turn, on screen), whether it draws, whether its GPU holds its frames. A success
// never waits on a GPU or a line: the badge pops in alone, and onError says why. Its waits count from its start, not its mount
// (behind six others in line, or below the fold, the orb played nothing on the device test).
let run: any = null;
jest.mock('../../RazorSenseEngine', () => ({
  ...jest.requireActual('../../RazorSenseEngine'),
  runFreshStage: jest.fn((options: any) => {
    run = options;
    return () => undefined;
  }),
}));

type Driver = (engine: any, dt: number) => void;
const stageMock = (): { stage: any; engine: any; driver: () => Driver } => {
  let driver: Driver | null = null;
  const engine = { player: { seek: jest.fn() }, waitsOnGpu: jest.fn(() => false) };
  const stage = {
    mount: () => engine,
    setDriver: (d: Driver | null) => {
      driver = d;
    },
    setPaused: jest.fn(),
    hasEngine: () => true,
    isRunning: () => true,
    destroy: jest.fn(),
  };
  return { stage, engine, driver: () => driver! };
};

/** its turn comes: started on its stage (as runFreshStage does) */
const start = (stage: any): void => {
  run.stageRef.current = stage;
  act(() => {
    run.start(stage, { successLight: {}, successDark: {} });
    run.onStarted();
  });
};
const later = (ms: number): void => {
  act(() => {
    jest.advanceTimersByTime(ms);
  });
};
const hasOrb = (container: HTMLElement): boolean =>
  Boolean(container.querySelector('[role="img"] > div[style*="pointer-events"]'));

type IntersectionCb = (entries: { isIntersecting: boolean }[]) => void;

describe('<RazorSenseSuccess />: its waits count from its start', () => {
  beforeEach(() => {
    run = null;
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
    delete (window as any).IntersectionObserver;
  });

  it('starts late (other RazorSense ahead of it): it plays its orb, its first-frame wait counted from its start', () => {
    const onError = jest.fn();
    const onLoad = jest.fn();
    const { container } = renderWithTheme(<RazorSenseSuccess onError={onError} onLoad={onLoad} />);
    later(1500);
    const { stage } = stageMock();
    start(stage);
    later(700);
    act(() => {
      run.onDrawn();
    });
    later(3000);
    expect(onError).not.toHaveBeenCalled();
    expect(onLoad).toHaveBeenCalledTimes(1);
    expect(hasOrb(container)).toBe(true);
  });

  it('mounted below the fold and scrolled to 2 s later: it plays its orb', () => {
    let seen: IntersectionCb = () => undefined;
    (window as any).IntersectionObserver = class {
      constructor(cb: IntersectionCb) {
        seen = cb;
      }

      observe = (): void => undefined;
      disconnect = (): void => undefined;
    };
    const onError = jest.fn();
    const { container } = renderWithTheme(<RazorSenseSuccess onError={onError} />);
    act(() => {
      seen([{ isIntersecting: false }]);
    });
    later(5000);
    expect(onError).not.toHaveBeenCalled();
    act(() => {
      seen([{ isIntersecting: true }]);
    });
    later(400);
    const { stage } = stageMock();
    start(stage);
    later(300);
    act(() => {
      run.onDrawn();
    });
    later(3000);
    expect(onError).not.toHaveBeenCalled();
    expect(hasOrb(container)).toBe(true);
  });

  it('started, never drawing: the badge alone and onError 0.8 s after its start', () => {
    const onError = jest.fn();
    const onLoad = jest.fn();
    const { container } = renderWithTheme(<RazorSenseSuccess onError={onError} onLoad={onLoad} />);
    later(1000);
    start(stageMock().stage);
    later(790);
    expect(onError).not.toHaveBeenCalled();
    later(20);
    expect(onError).toHaveBeenCalledTimes(1);
    expect(String(onError.mock.calls[0][0])).toMatch(/no first frame within 800 ms of its start/);
    expect(hasOrb(container)).toBe(false);
    expect(onLoad).not.toHaveBeenCalled();
  });

  it('on screen and never started (its engine never in): the badge alone and onError after 2 s', () => {
    const onError = jest.fn();
    const { container } = renderWithTheme(<RazorSenseSuccess onError={onError} />);
    later(1990);
    expect(onError).not.toHaveBeenCalled();
    later(20);
    expect(onError).toHaveBeenCalledTimes(1);
    expect(String(onError.mock.calls[0][0])).toMatch(/not started within 2000 ms on screen/);
    expect(hasOrb(container)).toBe(false);
  });

  it('its clock holds while its GPU holds its frames, and past 0.8 s of that the badge comes', () => {
    const onError = jest.fn();
    renderWithTheme(<RazorSenseSuccess onError={onError} />);
    const { stage, engine, driver } = stageMock();
    start(stage);
    // (till its first frame its clock holds at its start)
    act(() => driver()(engine, 0.1));
    expect(engine.player.seek).toHaveBeenLastCalledWith(0, 0);
    act(() => {
      run.onDrawn();
    });
    act(() => driver()(engine, 0.1));
    expect(engine.player.seek.mock.calls[engine.player.seek.mock.calls.length - 1][0]).toBeCloseTo(
      0.1,
    );
    // a Direct3D copy of its shader compiling: frames held back, its clock holds
    engine.waitsOnGpu.mockReturnValue(true);
    act(() => driver()(engine, 0.1));
    expect(engine.player.seek.mock.calls[engine.player.seek.mock.calls.length - 1][0]).toBeCloseTo(
      0.1,
    );
    for (let i = 0; i < 8; i++) act(() => driver()(engine, 0.1));
    expect(onError).toHaveBeenCalledTimes(1);
    expect(String(onError.mock.calls[0][0])).toMatch(/its GPU held its frames/);
  });

  it('short holds with frames between them don’t add up to the badge', () => {
    const onError = jest.fn();
    renderWithTheme(<RazorSenseSuccess onError={onError} />);
    const { stage, engine, driver } = stageMock();
    start(stage);
    act(() => {
      run.onDrawn();
    });
    // three holds of 0.3 s (0.9 s in all), each with frames after it
    for (let k = 0; k < 3; k++) {
      engine.waitsOnGpu.mockReturnValue(true);
      for (let i = 0; i < 3; i++) act(() => driver()(engine, 0.1));
      engine.waitsOnGpu.mockReturnValue(false);
      act(() => driver()(engine, 0.016));
    }
    expect(onError).not.toHaveBeenCalled();
  });

  it('unmounted before its end: onComplete is never called', () => {
    const onComplete = jest.fn();
    const { unmount } = renderWithTheme(<RazorSenseSuccess onComplete={onComplete} />);
    const { stage, engine, driver } = stageMock();
    start(stage);
    act(() => {
      run.onDrawn();
    });
    // past the orb's going: its end set for a moment later
    for (let i = 0; i < 60; i++) act(() => driver()?.(engine, 0.1));
    unmount();
    later(5000);
    expect(onComplete).not.toHaveBeenCalled();
  });
});

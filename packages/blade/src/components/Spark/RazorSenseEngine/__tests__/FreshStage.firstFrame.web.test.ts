/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-var-requires */
// A stage looks for its first frame only while one can come: a stage paused before its engine has drawn polls nothing (no frame
// callbacks, no timers) once its short grace is up, and looks again as it runs. Frames and the clock are driven by hand.

type Frame = (time: number) => void;

const setup = (): {
  FreshStage: any;
  runFrames: (count: number, gapMs: number) => void;
  pendingFrames: () => number;
} => {
  let queue: Frame[] = [];
  let time = 0;
  jest.spyOn(performance, 'now').mockImplementation(() => time);
  (window as any).requestAnimationFrame = (cb: Frame): number => {
    queue.push(cb);
    return queue.length;
  };
  (window as any).cancelAnimationFrame = (): void => undefined;
  jest
    .spyOn(HTMLCanvasElement.prototype, 'getContext')
    .mockImplementation(((type: string) =>
      type === 'webgl2' ? { getExtension: () => null, getParameter: () => '' } : null) as any);
  let FreshStage: any;
  jest.isolateModules(() => {
    ({ FreshStage } = require('../FreshStage'));
  });
  const runFrames = (count: number, gapMs: number): void => {
    for (let i = 0; i < count; i++) {
      time += gapMs;
      const at = time;
      const run = queue;
      queue = [];
      run.forEach((cb) => cb(at));
    }
  };
  return { FreshStage, runFrames, pendingFrames: () => queue.length };
};

const engineMock = (): any => {
  let drawn = 0;
  return {
    ok: true,
    player: { seek: jest.fn() },
    setRunning: jest.fn(),
    destroy: jest.fn(),
    drawn: () => drawn,
    draw: () => {
      drawn += 1;
    },
    stats: {},
  };
};

describe('FreshStage: looking for its first frame', () => {
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('polls nothing while paused before its first frame, and shows it once it runs and draws', () => {
    jest.useFakeTimers();
    const { FreshStage, runFrames, pendingFrames } = setup();
    // (the screen's rate measured while the page loads)
    runFrames(70, 1000 / 60);
    const onShown = jest.fn();
    const engine = engineMock();
    const box = document.createElement('div');
    const stage = new FreshStage(box, () => engine, { onShown });
    stage.mount({ doc: {}, opts: {} });
    stage.setPaused(true);
    const canvas = box.querySelector('canvas')!;
    expect(canvas.style.visibility).toBe('hidden');

    // past its grace: no frame callbacks and no first-draw clock left running
    runFrames(90, 1000 / 60);
    jest.advanceTimersByTime(2000);
    expect(pendingFrames()).toBe(0);
    expect(jest.getTimerCount()).toBe(0);

    // running again: it looks each frame, and shows the first frame drawn
    stage.setPaused(false);
    expect(pendingFrames()).toBeGreaterThan(0);
    runFrames(3, 1000 / 60);
    expect(onShown).not.toHaveBeenCalled();
    engine.draw();
    runFrames(1, 1000 / 60);
    expect(canvas.style.visibility).toBe('');
    expect(onShown).toHaveBeenCalledTimes(1);
    stage.destroy();
  });

  it('shows a frame drawn while paused by settle', () => {
    const { FreshStage, runFrames } = setup();
    runFrames(70, 1000 / 60);
    const engine = engineMock();
    const box = document.createElement('div');
    const stage = new FreshStage(box, () => engine, {});
    stage.mount({ doc: {}, opts: {} });
    stage.setPaused(true);
    runFrames(90, 1000 / 60);
    stage.settle(() => engine.draw(), 0.1);
    expect(box.querySelector('canvas')!.style.visibility).toBe('');
    stage.destroy();
  });
});

export {};

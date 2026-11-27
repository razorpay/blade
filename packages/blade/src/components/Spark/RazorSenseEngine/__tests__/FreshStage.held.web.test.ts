/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-var-requires */
// After its first frame, its GPU holding its frames back (a look whose Direct3D copy is still compiling: an outcome, the voice look)
// past 0.8 s: the stage hides its canvas, so the component's still (clear, laid over it) doesn't double the frozen frame, and shows
// it again at its next frame (the PR review). Counted in its own frames: paused or off screen, nothing is counted.

type Frame = (time: number) => void;

const setup = (): {
  FreshStage: any;
  measureScreen: () => void;
  runFrames: (n: number, gap: number) => void;
} => {
  let queue: { id: number; cb: Frame }[] = [];
  let time = 0;
  let next = 0;
  (window as any).requestAnimationFrame = (cb: Frame): number => {
    next += 1;
    queue.push({ id: next, cb });
    return next;
  };
  (window as any).cancelAnimationFrame = (id: number): void => {
    queue = queue.filter((f) => f.id !== id);
  };
  jest
    .spyOn(HTMLCanvasElement.prototype, 'getContext')
    .mockImplementation(((type: string) =>
      type === 'webgl2' ? { getExtension: () => null, getParameter: () => '' } : null) as any);
  let mod: any;
  jest.isolateModules(() => {
    mod = require('../FreshStage');
  });
  const runFrames = (n: number, gap: number): void => {
    for (let i = 0; i < n; i++) {
      time += gap;
      const at = time;
      const run = queue;
      queue = [];
      run.forEach((f) => f.cb(at));
    }
  };
  return { ...mod, runFrames };
};

describe('FreshStage: its GPU holding its frames back after the first', () => {
  afterEach(() => jest.restoreAllMocks());

  it('hides its canvas past 0.8 s (and says so), and shows it again at its next frame', () => {
    const { FreshStage, measureScreen, runFrames } = setup();
    measureScreen();
    runFrames(70, 1000 / 60);
    let drawn = 0;
    let isHeld = false;
    const engine = {
      ok: true,
      player: { seek: jest.fn() },
      setRunning: jest.fn(),
      destroy: jest.fn(),
      sharpness: jest.fn(),
      stats: {},
      drawn: () => drawn,
      waitsOnGpu: () => isHeld,
    };
    const onShown = jest.fn();
    const onHeld = jest.fn();
    const box = document.createElement('div');
    const stage = new FreshStage(box, () => engine, { onShown, onHeld });
    stage.mount({ doc: {}, opts: {} });
    stage.setDriver(() => {
      if (!isHeld) drawn += 1;
    });
    const canvas = box.querySelector('canvas')!;
    runFrames(10, 1000 / 60);
    expect(canvas.style.visibility).toBe('');
    expect(onShown).toHaveBeenCalledTimes(1);
    // a look whose copy is compiling: frames held back
    isHeld = true;
    runFrames(40, 1000 / 60);
    expect(canvas.style.visibility).toBe('');
    expect(onHeld).not.toHaveBeenCalled();
    runFrames(12, 1000 / 60);
    expect(canvas.style.visibility).toBe('hidden');
    expect(onHeld).toHaveBeenCalledTimes(1);
    // compiled: its next frame shows it again
    isHeld = false;
    runFrames(3, 1000 / 60);
    expect(canvas.style.visibility).toBe('');
    expect(onShown).toHaveBeenCalledTimes(2);
    stage.destroy();
  });

  it('counts nothing while paused', () => {
    const { FreshStage, measureScreen, runFrames } = setup();
    measureScreen();
    runFrames(70, 1000 / 60);
    let drawn = 0;
    let isHeld = false;
    const engine = {
      ok: true,
      player: { seek: jest.fn() },
      setRunning: jest.fn(),
      destroy: jest.fn(),
      sharpness: jest.fn(),
      stats: {},
      drawn: () => drawn,
      waitsOnGpu: () => isHeld,
    };
    const onHeld = jest.fn();
    const box = document.createElement('div');
    const stage = new FreshStage(box, () => engine, { onHeld });
    stage.mount({ doc: {}, opts: {} });
    stage.setDriver(() => {
      drawn += 1;
    });
    runFrames(10, 1000 / 60);
    isHeld = true;
    stage.setPaused(true);
    runFrames(120, 1000 / 60);
    expect(onHeld).not.toHaveBeenCalled();
    stage.destroy();
  });
});

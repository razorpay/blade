/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-var-requires */
// The weak-device steps (FreshStage): a stage on a device slow from its first frame steps down (every other frame, then a lower
// sharpness) and then goes to its still, while one that keeps up never does. Frames are driven by hand: the screen runs at
// 60 fps while nothing draws (as the page loads), then at the device's rate once the engine draws.

type Frame = (time: number) => void;

const setup = (): {
  FreshStage: any;
  runFrames: (count: number, gapMs: number) => void;
  now: () => number;
} => {
  let queue: Frame[] = [];
  let time = 0;
  (window as any).requestAnimationFrame = (cb: Frame): number => {
    queue.push(cb);
    return queue.length;
  };
  (window as any).cancelAnimationFrame = (): void => undefined;
  // a GPU the stage takes as usable (no renderer name, no caveat)
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
      const run = queue;
      queue = [];
      run.forEach((cb) => cb(time));
    }
  };
  return { FreshStage, runFrames, now: () => time };
};

const engineMock = (): any => ({
  ok: true,
  player: { seek: jest.fn() },
  setRunning: jest.fn(),
  destroy: jest.fn(),
  drawn: () => 1,
  sharpness: jest.fn(),
  stats: {},
});

describe('FreshStage: the weak-device steps', () => {
  afterEach(() => jest.restoreAllMocks());

  it('steps down and then goes to its still on a device slow from the start', () => {
    const { FreshStage, runFrames, now } = setup();
    // the page loading: its screen at 60 fps
    runFrames(70, 1000 / 60);
    const onError = jest.fn();
    const engine = engineMock();
    const stage = new FreshStage(document.createElement('div'), () => engine, { onError });
    stage.mount({ doc: {}, opts: {} });
    stage.setDriver(() => undefined);
    // drawing: 14 fps, from its first frame
    const start = now();
    let steppedAt = 0;
    let stillAt = 0;
    for (let i = 0; i < 200 && !stillAt; i++) {
      runFrames(1, 70);
      if (!steppedAt && engine.sharpness.mock.calls.some(([cap]: [number]) => cap > 0)) {
        steppedAt = now() - start;
      }
      if (onError.mock.calls.some(([reason]: [string]) => reason === 'slow'))
        stillAt = now() - start;
    }
    // every other frame, then a lower sharpness, then the still: all within about 10 s
    expect(steppedAt).toBeGreaterThan(0);
    expect(steppedAt).toBeLessThan(8000);
    expect(stillAt).toBeGreaterThan(steppedAt);
    expect(stillAt).toBeLessThan(11000);
  });

  it('never steps down on a device that keeps up', () => {
    const { FreshStage, runFrames } = setup();
    runFrames(70, 1000 / 60);
    const onError = jest.fn();
    const engine = engineMock();
    const stage = new FreshStage(document.createElement('div'), () => engine, { onError });
    stage.mount({ doc: {}, opts: {} });
    stage.setDriver(() => undefined);
    runFrames(15 * 60, 1000 / 60);
    expect(engine.sharpness.mock.calls.filter(([cap]: [number]) => cap > 0)).toHaveLength(0);
    expect(onError).not.toHaveBeenCalled();
  });
});

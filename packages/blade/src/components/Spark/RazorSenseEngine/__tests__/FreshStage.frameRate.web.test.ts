/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-var-requires */
// A stage draws 60 frames a second at most, on any screen of 60 Hz or more: a 75 Hz or 144 Hz one too, not only the multiples of
// 60 (the PR review: measured from the last frame drawn, those drew at 37.5 and 48). Frames are driven by hand.

type Frame = (time: number) => void;

/** frames drawn by a running stage over 10 s of frames at `hz` */
const drawnIn10s = (hz: number): number => {
  let queue: Frame[] = [];
  let time = 0;
  (window as any).requestAnimationFrame = (cb: Frame): number => {
    queue.push(cb);
    return queue.length;
  };
  (window as any).cancelAnimationFrame = (): void => undefined;
  jest
    .spyOn(HTMLCanvasElement.prototype, 'getContext')
    .mockImplementation(((type: string) =>
      type === 'webgl2' ? { getExtension: () => null, getParameter: () => '' } : null) as any);
  let FreshStage: any, measureScreen: any;
  jest.isolateModules(() => {
    ({ FreshStage, measureScreen } = require('../FreshStage'));
  });
  const runFrames = (count: number): void => {
    for (let i = 0; i < count; i++) {
      time += 1000 / hz;
      const at = time;
      const run = queue;
      queue = [];
      run.forEach((cb) => cb(at));
    }
  };
  // a component mounting: the screen's rate measured, then its engine drawing
  measureScreen();
  runFrames(70);
  const engine = {
    ok: true,
    player: { seek: jest.fn() },
    setRunning: jest.fn(),
    destroy: jest.fn(),
    drawn: () => 1,
    sharpness: jest.fn(),
    stats: {},
  };
  const stage = new FreshStage(document.createElement('div'), () => engine, {});
  stage.mount({ doc: {}, opts: {} });
  let drawn = 0;
  stage.setDriver(() => {
    drawn += 1;
  });
  runFrames(10 * hz);
  stage.destroy();
  return drawn;
};

describe('FreshStage: frames drawn a second', () => {
  afterEach(() => jest.restoreAllMocks());

  it.each([60, 75, 90, 120, 144, 165])('draws 60 a second on a %i Hz screen', (hz) => {
    const drawn = drawnIn10s(hz);
    // (within a frame or two of 600 over the 10 s)
    expect(drawn).toBeGreaterThanOrEqual(595);
    expect(drawn).toBeLessThanOrEqual(605);
  });

  it('draws every frame of a screen slower than 60 Hz', () => {
    expect(drawnIn10s(50)).toBeGreaterThanOrEqual(495);
  });
});

// (a module of its own: its helpers are its own, not shared with the other test files)
export {};

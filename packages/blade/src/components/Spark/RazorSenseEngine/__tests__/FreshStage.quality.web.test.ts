/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-var-requires */
// Quality to the device, both ways (the PR review): a page starts at its device's level (deviceLevel.ts: today's RazorSense's GPU class), and its
// steps go back up once frames hold again, not only down. Frames are driven by hand.

type Frame = (time: number) => void;
type Gpu = { renderer?: string; webgl1?: boolean };

const DEBUG_INFO = { UNMASKED_RENDERER_WEBGL: 0x9246, UNMASKED_VENDOR_WEBGL: 0x9245 };

/** a page whose GPU is `gpu` (its name, or none where the browser hides it), with frames driven by hand */
const setup = (
  gpu: Gpu,
  device: { cores?: number; memory?: number; mobile?: boolean; ua?: string } = {},
): {
  FreshStage: any;
  freshEaseLevel: () => number;
  setStartLevel: (level: number) => void;
  readGpuNames: () => { renderer: string | null; vendor: string | null };
  whyCantAnimate: () => string | null;
  measureScreen: () => void;
  runFrames: (count: number, gapMs: number) => void;
} => {
  let queue: Frame[] = [];
  let time = 0;
  (window as any).requestAnimationFrame = (cb: Frame): number => {
    queue.push(cb);
    return queue.length;
  };
  (window as any).cancelAnimationFrame = (): void => undefined;
  const gl = {
    getExtension: (name: string) =>
      name === 'WEBGL_debug_renderer_info' && gpu.renderer ? DEBUG_INFO : null,
    getParameter: (p: number) =>
      p === DEBUG_INFO.UNMASKED_RENDERER_WEBGL
        ? gpu.renderer
        : p === DEBUG_INFO.UNMASKED_VENDOR_WEBGL
        ? 'Google Inc.'
        : null,
  };
  jest
    .spyOn(HTMLCanvasElement.prototype, 'getContext')
    .mockImplementation(((type: string) =>
      type === 'webgl2' || (type === 'webgl' && gpu.webgl1 !== false) ? gl : null) as any);
  jest.spyOn(window.navigator, 'hardwareConcurrency', 'get').mockReturnValue(device.cores ?? 8);
  Object.defineProperty(window.navigator, 'deviceMemory', {
    configurable: true,
    get: () => device.memory,
  });
  jest
    .spyOn(window.navigator, 'userAgent', 'get')
    .mockReturnValue(
      device.ua ??
        (device.mobile ? 'Mozilla/5.0 (Linux; Android 14) Mobile' : 'Mozilla/5.0 (Macintosh)'),
    );
  let mod: any;
  jest.isolateModules(() => {
    mod = require('../FreshStage');
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
  return { ...mod, runFrames };
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

describe('FreshStage: quality to the device, both ways', () => {
  afterEach(() => jest.restoreAllMocks());

  it.each(
    ([
      [
        'a low GPU (old Intel HD)',
        { renderer: 'ANGLE (Intel, Intel(R) HD Graphics 520 Direct3D11 vs_5_0 ps_5_0)' },
        {},
        2,
      ],
      ['a low phone GPU (Mali-G52)', { renderer: 'Mali-G52 MC2' }, { mobile: true }, 2],
      [
        'a mid GPU on a phone',
        { renderer: 'Adreno (TM) 610' },
        { mobile: true, cores: 8, memory: 4 },
        1,
      ],
      ['a mid GPU on a laptop', { renderer: 'Adreno (TM) 610' }, { cores: 4, memory: 4 }, 0],
      [
        'a high GPU (GTX 1650)',
        { renderer: 'ANGLE (NVIDIA, NVIDIA GeForce GTX 1650 Direct3D11 vs_5_0 ps_5_0)' },
        {},
        0,
      ],
      [
        'an M1',
        { renderer: 'ANGLE (Apple, ANGLE Metal Renderer: Apple M1, Unspecified Version)' },
        {},
        0,
      ],
      ['a hidden name, 2 cores', {}, { cores: 2 }, 2],
      [
        'an iPhone (Safari hides its GPU: mid by its signals)',
        {},
        { cores: 6, ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) Mobile/15E148' },
        0,
      ],
      ['an Android phone with a hidden name', {}, { cores: 8, mobile: true }, 1],
      [
        'Intel UHD on a laptop (no pattern: by its signals)',
        {
          renderer:
            'ANGLE (Intel, Intel(R) UHD Graphics (0x00009BC4) Direct3D11 vs_5_0 ps_5_0, D3D11)',
        },
        { cores: 12, memory: 8 },
        0,
      ],
      [
        'Iris Xe on a laptop',
        { renderer: 'ANGLE (Intel, Intel(R) Iris(R) Xe Graphics Direct3D11 vs_5_0 ps_5_0, D3D11)' },
        { cores: 8, memory: 8 },
        0,
      ],
      ['a hidden name, 8 cores, 8 GB', {}, { cores: 8, memory: 8 }, 0],
    ] as [string, Gpu, Record<string, unknown>, number][]).map(([name, gpu, device, level]) => ({
      name,
      gpu,
      device,
      level,
    })),
  )('$name: its page starts at level $level', ({ gpu, device, level }) => {
    const { whyCantAnimate, readGpuNames } = setup(gpu, device);
    expect(whyCantAnimate()).toBeNull();
    let deviceStartLevel: any;
    jest.isolateModules(() => {
      ({ deviceStartLevel } = require('../deviceLevel'));
    });
    expect(deviceStartLevel(readGpuNames())).toBe(level);
  });

  it('its device level makes no probe context of its own (its WebGL2 check asked about a caveat already)', () => {
    const { whyCantAnimate, readGpuNames } = setup({
      renderer: 'ANGLE (Intel, Intel(R) UHD Graphics (0x00009BC4) Direct3D11 vs_5_0 ps_5_0, D3D11)',
    });
    expect(whyCantAnimate()).toBeNull();
    const getContext = HTMLCanvasElement.prototype.getContext as jest.Mock;
    getContext.mockClear();
    let deviceStartLevel: any;
    jest.isolateModules(() => {
      ({ deviceStartLevel } = require('../deviceLevel'));
    });
    deviceStartLevel(readGpuNames());
    expect(getContext).not.toHaveBeenCalled();
  });

  it('a page started two steps down draws at 0.75 of a CSS px from its first frame', () => {
    const {
      FreshStage,
      whyCantAnimate,
      setStartLevel,
      freshEaseLevel,
      measureScreen,
      runFrames,
    } = setup({
      renderer: 'ANGLE (Intel, Intel(R) HD Graphics 4000 Direct3D11)',
    });
    expect(whyCantAnimate()).toBeNull();
    setStartLevel(2);
    expect(freshEaseLevel()).toBe(2);
    measureScreen();
    runFrames(70, 1000 / 60);
    const engine = engineMock();
    const stage = new FreshStage(document.createElement('div'), () => engine, {});
    stage.mount({ doc: {}, opts: {} });
    expect(engine.sharpness).toHaveBeenCalledWith(0.75);
    stage.destroy();
  });

  it('a slow stretch steps down, and once frames hold again it steps back up to full', () => {
    const { FreshStage, whyCantAnimate, freshEaseLevel, measureScreen, runFrames } = setup({
      renderer: 'ANGLE (Apple, ANGLE Metal Renderer: Apple M1)',
    });
    expect(whyCantAnimate()).toBeNull();
    measureScreen();
    runFrames(70, 1000 / 60);
    const onError = jest.fn();
    const engine = engineMock();
    const stage = new FreshStage(document.createElement('div'), () => engine, { onError });
    stage.mount({ doc: {}, opts: {} });
    stage.setDriver(() => undefined);
    // full, keeping up
    runFrames(5 * 60, 1000 / 60);
    expect(freshEaseLevel()).toBe(0);
    // a stall (a video call): 35 fps for 8 s, every step down (2 s each), the last at 0.5 of a CSS px
    runFrames(8 * 35, 1000 / 35);
    expect(freshEaseLevel()).toBe(3);
    expect(engine.sharpness).toHaveBeenCalledWith(0.75);
    expect(engine.sharpness).toHaveBeenLastCalledWith(0.5);
    // the machine free again: back up a step, then to full
    const levels: number[] = [];
    for (let s = 0; s < 20; s++) {
      runFrames(60, 1000 / 60);
      levels.push(freshEaseLevel());
    }
    expect(levels).toEqual(expect.arrayContaining([2, 1]));
    expect(freshEaseLevel()).toBe(0);
    expect(engine.sharpness).toHaveBeenLastCalledWith(0);
    // (never the still: it never went under 20 fps)
    expect(onError).not.toHaveBeenCalled();
    stage.destroy();
  });

  it('a sharp drop (a typing surge on a page only just keeping up) steps two at once, within about a second', () => {
    const { FreshStage, whyCantAnimate, freshEaseLevel, measureScreen, runFrames } = setup({
      renderer: 'ANGLE (Intel, Intel(R) UHD Graphics (0x00009BC4) Direct3D11 vs_5_0 ps_5_0, D3D11)',
    });
    expect(whyCantAnimate()).toBeNull();
    measureScreen();
    runFrames(70, 1000 / 60);
    const onError = jest.fn();
    const engine = engineMock();
    const stage = new FreshStage(document.createElement('div'), () => engine, { onError });
    stage.mount({ doc: {}, opts: {} });
    stage.setDriver(() => undefined);
    runFrames(5 * 60, 1000 / 60);
    expect(freshEaseLevel()).toBe(0);
    // typing with everything on the page: 12 fps
    let at = 0;
    for (let i = 0; i < 40 && freshEaseLevel() < 2; i++) {
      runFrames(1, 1000 / 12);
      at += 1000 / 12;
    }
    expect(freshEaseLevel()).toBe(2);
    expect(at).toBeLessThan(2200);
    expect(engine.sharpness).toHaveBeenLastCalledWith(0.75);
    expect(onError).not.toHaveBeenCalled();
    stage.destroy();
  });

  it('a step up that does not hold waits longer before the next', () => {
    const { FreshStage, whyCantAnimate, freshEaseLevel, measureScreen, runFrames } = setup({
      renderer: 'ANGLE (Apple, ANGLE Metal Renderer: Apple M1)',
    });
    expect(whyCantAnimate()).toBeNull();
    measureScreen();
    runFrames(70, 1000 / 60);
    const engine = engineMock();
    const stage = new FreshStage(document.createElement('div'), () => engine, {});
    stage.mount({ doc: {}, opts: {} });
    stage.setDriver(() => undefined);
    runFrames(3 * 60, 1000 / 60);
    // a device on its edge: 60 fps while it draws every other frame, 35 at full
    const upAt: number[] = [];
    let t = 0;
    for (let s = 0; s < 60; s++) {
      const level = freshEaseLevel();
      runFrames(level === 0 ? 35 : 60, level === 0 ? 1000 / 35 : 1000 / 60);
      t += 1;
      if (level > 0 && freshEaseLevel() === 0) upAt.push(t);
    }
    // it tries again, but each try waits longer than the one before
    expect(upAt.length).toBeGreaterThanOrEqual(2);
    for (let i = 2; i < upAt.length; i++) {
      expect(upAt[i] - upAt[i - 1]).toBeGreaterThan(upAt[i - 1] - upAt[i - 2]);
    }
    stage.destroy();
  });

  it('a device on its edge stops trying after three step ups that don’t hold', () => {
    const { FreshStage, whyCantAnimate, freshEaseLevel, measureScreen, runFrames } = setup({
      renderer: 'ANGLE (Apple, ANGLE Metal Renderer: Apple M1)',
    });
    expect(whyCantAnimate()).toBeNull();
    measureScreen();
    runFrames(70, 1000 / 60);
    const engine = engineMock();
    const stage = new FreshStage(document.createElement('div'), () => engine, {});
    stage.mount({ doc: {}, opts: {} });
    stage.setDriver(() => undefined);
    runFrames(3 * 60, 1000 / 60);
    // 60 fps while it draws every other frame, 35 at full: ten minutes of it
    let raises = 0;
    for (let s = 0; s < 600; s++) {
      const level = freshEaseLevel();
      runFrames(level === 0 ? 35 : 60, level === 0 ? 1000 / 35 : 1000 / 60);
      if (level > 0 && freshEaseLevel() < level) raises += 1;
    }
    // (each try that doesn't hold is ~2 s of jank: three, then it stays down)
    expect(raises).toBe(3);
    expect(freshEaseLevel()).toBeGreaterThan(0);
    stage.destroy();
  });
});

// (a module of its own: its helpers are its own, not shared with the other test files)
export {};

import { RzpGlassMount } from '../RzpGlassMount';
import type { RzpGlassPlaybackOccurrence } from '../RzpGlassMount';

type MockVideo = HTMLVideoElement & {
  play: jest.Mock<Promise<void>, []>;
  pause: jest.Mock<void, []>;
  load: jest.Mock<void, []>;
};

let mockVideo: MockVideo;
const mockTextureUpdate = jest.fn();

jest.mock('../utils', () => ({
  loadImage: jest.fn(() => Promise.resolve(globalThis.document.createElement('img'))),
  loadVideo: jest.fn(() => Promise.resolve(mockVideo)),
  isSafari: jest.fn(() => false),
  bestGuessBrowserZoom: jest.fn(() => 1),
}));

jest.mock('../webgl-utils', () => ({
  createProgram: jest.fn(() => ({})),
  setupFullscreenQuad: jest.fn(() => ({ positionBuffer: {}, uvBuffer: {} })),
  Texture: jest.fn().mockImplementation(() => ({
    image: jest.fn(),
    update: mockTextureUpdate,
    destroy: jest.fn(),
  })),
}));

jest.mock('../PerformanceManager', () => ({
  LEVEL_RENDER_SETTINGS: {
    0: { maxPixelCount: 0, minPixelRatio: 1 },
    1: { maxPixelCount: 1, minPixelRatio: 1 },
    2: { maxPixelCount: 1, minPixelRatio: 1 },
    3: { maxPixelCount: 1, minPixelRatio: 1 },
  },
  WebGLPerformanceController: jest.fn().mockImplementation(() => ({
    isPotato: jest.fn(() => false),
    dispose: jest.fn(),
  })),
}));

const createMockVideo = (): MockVideo =>
  (({
    currentTime: 0,
    duration: 2,
    readyState: 4,
    HAVE_CURRENT_DATA: 2,
    seeking: false,
    playbackRate: 1,
    loop: true,
    muted: true,
    playsInline: true,
    videoWidth: 640,
    videoHeight: 400,
    play: jest.fn(() => Promise.resolve()),
    pause: jest.fn(),
    load: jest.fn(),
  } as unknown) as MockVideo);

const createMockGl = (): WebGLRenderingContext =>
  (({
    ARRAY_BUFFER: 0x8892,
    ELEMENT_ARRAY_BUFFER: 0x8893,
    RENDERBUFFER: 0x8d41,
    FRAMEBUFFER: 0x8d40,
    COLOR_BUFFER_BIT: 0x4000,
    TRIANGLES: 0x0004,
    UNPACK_FLIP_Y_WEBGL: 0x9240,
    DEPTH_TEST: 0x0b71,
    CULL_FACE: 0x0b44,
    pixelStorei: jest.fn(),
    disable: jest.fn(),
    clearColor: jest.fn(),
    getUniformLocation: jest.fn(() => ({})),
    useProgram: jest.fn(),
    uniform1i: jest.fn(),
    uniform1f: jest.fn(),
    uniform2f: jest.fn(),
    uniform3f: jest.fn(),
    uniform4f: jest.fn(),
    uniform1fv: jest.fn(),
    uniform2fv: jest.fn(),
    uniform3fv: jest.fn(),
    uniform4fv: jest.fn(),
    viewport: jest.fn(),
    clear: jest.fn(),
    drawArrays: jest.fn(),
    deleteProgram: jest.fn(),
    bindBuffer: jest.fn(),
    bindRenderbuffer: jest.fn(),
    bindFramebuffer: jest.fn(),
    getError: jest.fn(),
  } as unknown) as WebGLRenderingContext);

const assets = {
  videoSrc: '/legacy.mp4',
  gradientMapSrc: '/gradient.png',
  gradientMap2Src: '/gradient-2.png',
  centerGradientMapSrc: '/center.png',
};

describe('RzpGlassMount declarative legacy playback', () => {
  let animationFrames: FrameRequestCallback[], gl: WebGLRenderingContext, parent: HTMLDivElement;

  const runNextFrame = (time = 16): void => {
    const frame = animationFrames.shift();
    expect(frame).toBeDefined();
    frame!(time);
  };

  const createMount = (): RzpGlassMount =>
    new RzpGlassMount(parent, assets, {
      startTime: 0,
      endTime: 14,
      paused: false,
      playbackRate: 1,
    });

  beforeEach(() => {
    animationFrames = [];
    mockVideo = createMockVideo();
    mockTextureUpdate.mockClear();
    gl = createMockGl();
    parent = document.createElement('div');
    Object.defineProperties(parent, {
      clientWidth: { configurable: true, value: 640 },
      clientHeight: { configurable: true, value: 400 },
    });
    document.body.append(parent);

    if (!document.querySelector('style[data-rzp-glass-style]')) {
      const style = document.createElement('style');
      style.setAttribute('data-rzp-glass-style', '');
      document.head.append(style);
    }
    Object.defineProperty(globalThis, 'visualViewport', {
      configurable: true,
      value: {
        scale: 1,
        width: 640,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      },
    });

    jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(gl);
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      animationFrames.push(callback);
      return animationFrames.length;
    });
    jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => undefined);
    global.ResizeObserver = class ResizeObserver {
      public observe(): void {
        // The mount only needs observer registration in this focused test.
      }
      public unobserve(): void {
        // The mount only needs observer registration in this focused test.
      }
      public disconnect(): void {
        // The mount only needs observer registration in this focused test.
      }
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
    parent.remove();
  });

  it('holds the exact terminal frame and emits finite milestones once', async () => {
    const onPresentationReady = jest.fn();
    const onIteration = jest.fn();
    const onTerminal = jest.fn();
    const mount = createMount();
    mount.setPlaybackOccurrence({
      occurrenceId: 1,
      playback: { playback: 'once', endBehavior: 'hold' },
      onPresentationReady,
      onIteration,
      onTerminal,
    });

    await mount.loadAssets();
    expect(mockVideo.loop).toBe(false);
    expect(mockVideo.play).not.toHaveBeenCalled();

    runNextFrame();
    expect(onPresentationReady).toHaveBeenCalledTimes(1);
    expect(mockVideo.play).toHaveBeenCalledTimes(1);

    const drawCountBeforeBoundary = (gl.drawArrays as jest.Mock).mock.calls.length;
    mockVideo.currentTime = 2;
    runNextFrame(32);
    expect(onIteration).toHaveBeenCalledWith(1);
    expect(onTerminal).not.toHaveBeenCalled();
    expect((gl.drawArrays as jest.Mock).mock.calls).toHaveLength(drawCountBeforeBoundary);
    expect(mockVideo.currentTime).toBeCloseTo(2 - 1 / 30, 5);

    Object.defineProperty(mockVideo, 'seeking', { configurable: true, value: true });
    runNextFrame(48);
    expect(onTerminal).not.toHaveBeenCalled();
    expect((gl.drawArrays as jest.Mock).mock.calls).toHaveLength(drawCountBeforeBoundary);
    Object.defineProperty(mockVideo, 'seeking', { configurable: true, value: false });
    runNextFrame(64);
    expect(onTerminal).toHaveBeenCalledWith(1);
    expect(mockVideo.pause).toHaveBeenCalled();
    mount.play();
    runNextFrame(80);
    expect(mockVideo.play).toHaveBeenCalledTimes(1);
    expect(onIteration).toHaveBeenCalledTimes(1);
    expect(onTerminal).toHaveBeenCalledTimes(1);

    mount.dispose();
  });

  it('treats repeatCount as additional iterations and reset-to-start as terminal output', async () => {
    const onIteration = jest.fn();
    const onTerminal = jest.fn();
    const mount = createMount();
    mount.setPlaybackOccurrence({
      occurrenceId: 1,
      playback: { playback: 'repeat', repeatCount: 2, endBehavior: 'reset-to-start' },
      onIteration,
      onTerminal,
    });
    await mount.loadAssets();
    mount.pause();
    runNextFrame();
    expect(mockVideo.play).not.toHaveBeenCalled();
    mount.play();
    expect(mockVideo.play).toHaveBeenCalledTimes(1);

    for (let iteration = 1; iteration <= 3; iteration += 1) {
      mockVideo.currentTime = 2;
      runNextFrame(iteration * 32);
      expect(onIteration).toHaveBeenLastCalledWith(iteration);
      expect(mockVideo.currentTime).toBe(0);
      runNextFrame(iteration * 32 + 16);
    }

    expect(onIteration.mock.calls.map(([iteration]) => iteration)).toEqual([1, 2, 3]);
    expect(onTerminal).toHaveBeenCalledTimes(1);
    expect(onTerminal).toHaveBeenCalledWith(3);
    expect(mockVideo.currentTime).toBe(0);

    mount.dispose();
  });

  it('replays a same-preset occurrence without remount and suppresses stale terminal work', async () => {
    const firstTerminal = jest.fn();
    const secondReady = jest.fn();
    const mount = createMount();
    const firstOccurrence: RzpGlassPlaybackOccurrence = {
      occurrenceId: 1,
      playback: { playback: 'once', endBehavior: 'hold' },
      onTerminal: firstTerminal,
    };
    mount.setPlaybackOccurrence(firstOccurrence);
    await mount.loadAssets();
    runNextFrame();

    mockVideo.currentTime = 2;
    runNextFrame(32);
    expect(firstTerminal).not.toHaveBeenCalled();
    expect(mount.getCurrentFrame()).toBeGreaterThan(0);

    mount.setPlaybackOccurrence({
      occurrenceId: 2,
      playback: { playback: 'once', endBehavior: 'hold' },
      onPresentationReady: secondReady,
    });
    expect(mockVideo.currentTime).toBe(0);
    expect(mount.getCurrentFrame()).toBe(0);
    runNextFrame(48);
    expect(firstTerminal).not.toHaveBeenCalled();
    expect(secondReady).toHaveBeenCalledTimes(1);

    // Callback updates for the same occurrence are non-destructive.
    const replacementReady = jest.fn();
    mount.setPlaybackOccurrence({
      occurrenceId: 2,
      playback: { playback: 'once', endBehavior: 'hold' },
      onPresentationReady: replacementReady,
    });
    runNextFrame(64);
    expect(replacementReady).not.toHaveBeenCalled();

    mount.dispose();
  });

  it('reports declarative loop seams without ever becoming terminal', async () => {
    const onIteration = jest.fn();
    const onTerminal = jest.fn();
    const mount = createMount();
    mount.setPlaybackOccurrence({
      occurrenceId: 1,
      playback: { playback: 'loop' },
      onIteration,
      onTerminal,
    });
    await mount.loadAssets();
    runNextFrame();

    for (let iteration = 1; iteration <= 2; iteration += 1) {
      mockVideo.currentTime = 2;
      runNextFrame(iteration * 32);
      expect(mockVideo.currentTime).toBe(0);
      runNextFrame(iteration * 32 + 16);
    }

    expect(onIteration.mock.calls.map(([iteration]) => iteration)).toEqual([1, 2]);
    expect(onTerminal).not.toHaveBeenCalled();
    expect(mockVideo.play).toHaveBeenCalledTimes(3);

    mount.dispose();
  });

  it('keeps native looping behavior when managed playback is absent', async () => {
    const mount = createMount();
    await mount.loadAssets();

    expect(mockVideo.loop).toBe(true);
    expect(mockVideo.play).toHaveBeenCalledTimes(1);
    mockVideo.currentTime = 14;
    runNextFrame();
    expect(mockVideo.currentTime).toBe(0);

    mount.dispose();
  });
});

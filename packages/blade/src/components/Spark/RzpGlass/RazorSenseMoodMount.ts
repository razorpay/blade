/* eslint-disable @typescript-eslint/no-floating-promises */

import { getRazorSenseModeIndex, getRazorSenseModeVideoSources } from './modes';
import type { RazorSenseEmotionalMode } from './modes';
import { getRazorSenseAsset } from './razorSenseAssets';
import { razorSenseMoodFragmentShader, razorSenseMoodVertexShader } from './razorSenseMoodShader';
import { loadVideo } from './utils';
import { createProgram, setupFullscreenQuad, Texture } from './webgl-utils';
import type { FullscreenQuadBuffers } from './webgl-utils';
import type { ColorSchemeNames } from '~tokens/theme';

type RazorSenseMoodMountOptions = {
  mode: RazorSenseEmotionalMode;
  assetsPath: string;
  transitionDuration: number;
  paused: boolean;
  playbackRate: number;
  startTime: number;
  interactive: boolean;
  colorScheme: ColorSchemeNames;
  onError: (error: Error) => void;
  /** @internal Used by the fallback exporter after the requested frame is drawn. */
  onFrameReady?: () => void;
};

type PendingFrameReady = {
  mode: RazorSenseEmotionalMode;
  targetTime: number;
  frameDuration: number;
};

const MAX_PIXEL_COUNT = 4096 * 1024;
const POINTER_DELAY_MS = 4000;
const TRAIL_TEXTURE_WIDTH = 256;
const TRAIL_TEXTURE_HEIGHT = Math.round((TRAIL_TEXTURE_WIDTH * 440) / 1364);
const TRAIL_RADIUS = (TRAIL_TEXTURE_WIDTH * 268) / 1364;
const TRAIL_LIFE_FRAMES = Math.ceil(Math.log(0.01) / Math.log(0.9));

const oneHotMode = (mode: RazorSenseEmotionalMode): [number, number, number, number] => {
  const weights: [number, number, number, number] = [0, 0, 0, 0];
  weights[getRazorSenseModeIndex(mode)] = 1;
  return weights;
};

const quinticSmootherstep = (value: number): number => {
  const clamped = Math.max(0, Math.min(1, value));
  return clamped * clamped * clamped * (clamped * (clamped * 6 - 15) + 10);
};

class RazorSenseMoodMount {
  private readonly parentElement: HTMLElement;
  private readonly canvasElement: HTMLCanvasElement;
  private readonly gl: WebGLRenderingContext;
  private readonly program: WebGLProgram;
  private readonly buffers: FullscreenQuadBuffers;
  private readonly uniformLocations: Record<string, WebGLUniformLocation | null> = {};
  private readonly videos: HTMLVideoElement[] = [];
  private readonly textures: Texture[] = [];
  private readonly trailCanvas: HTMLCanvasElement;
  private readonly trailContext: CanvasRenderingContext2D;
  private trailTexture: Texture | null = null;
  private trailLifeFrames = 0;
  private readonly lastUploadedVideoTimes = [-1, -1, -1, -1];
  private resizeObserver: ResizeObserver | null = null;
  private rafId: number | null = null;
  private disposed = false;
  private initialized = false;
  private options: RazorSenseMoodMountOptions;
  private currentWeights: [number, number, number, number];
  private transitionStartWeights: [number, number, number, number];
  private transitionTargetWeights: [number, number, number, number];
  private transitionStartedAt = 0;
  private transitionActive = false;
  private currentColorSchemeMix: number;
  private colorSchemeTransitionStart: number;
  private colorSchemeTransitionTarget: number;
  private colorSchemeTransitionStartedAt = 0;
  private colorSchemeTransitionActive = false;
  private mountedAt = performance.now();
  private pendingFrameReady: PendingFrameReady | null = null;

  constructor(parentElement: HTMLElement, options: RazorSenseMoodMountOptions) {
    this.parentElement = parentElement;
    this.options = options;
    this.currentWeights = oneHotMode(options.mode);
    this.transitionStartWeights = [...this.currentWeights];
    this.transitionTargetWeights = [...this.currentWeights];
    this.currentColorSchemeMix = options.colorScheme === 'dark' ? 1 : 0;
    this.colorSchemeTransitionStart = this.currentColorSchemeMix;
    this.colorSchemeTransitionTarget = this.currentColorSchemeMix;

    this.trailCanvas = document.createElement('canvas');
    this.trailCanvas.width = TRAIL_TEXTURE_WIDTH;
    this.trailCanvas.height = TRAIL_TEXTURE_HEIGHT;
    const trailContext = this.trailCanvas.getContext('2d');
    if (!trailContext) {
      throw new Error('RazorSense: Failed to create the pointer trail surface');
    }
    this.trailContext = trailContext;

    this.canvasElement = document.createElement('canvas');
    Object.assign(this.canvasElement.style, {
      display: 'block',
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      borderRadius: 'inherit',
      pointerEvents: 'none',
    });
    this.canvasElement.setAttribute('aria-hidden', 'true');

    const gl = this.canvasElement.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      premultipliedAlpha: false,
      powerPreference: 'high-performance',
    });
    if (!gl) {
      throw new Error('RazorSense: WebGL is not supported in this browser');
    }
    this.gl = gl;
    this.gl.disable(this.gl.DEPTH_TEST);
    this.gl.disable(this.gl.CULL_FACE);
    if (options.colorScheme === 'dark') {
      this.gl.clearColor(0.0549, 0.0745, 0.0941, 1);
    } else {
      this.gl.clearColor(0.6588, 0.8118, 0.9961, 1);
    }

    const program = createProgram(
      this.gl,
      razorSenseMoodVertexShader,
      razorSenseMoodFragmentShader,
    );
    if (!program) {
      throw new Error('RazorSense: Failed to create the emotional-mode shader');
    }
    this.program = program;

    const buffers = setupFullscreenQuad(this.gl, this.program);
    if (!buffers) {
      this.gl.deleteProgram(this.program);
      throw new Error('RazorSense: Failed to create fullscreen geometry');
    }
    this.buffers = buffers;

    this.parentElement.prepend(this.canvasElement);
    this.parentElement.setAttribute('data-razor-sense-mode', options.mode);
    this.parentElement.setAttribute('data-razor-sense-color-scheme', options.colorScheme);

    for (const uniformName of [
      'uCalmTexture',
      'uJoyfulTexture',
      'uCautionTexture',
      'uRegretTexture',
      'uModeWeights',
      'uColorSchemeMix',
      'uResolution',
      'uTime',
      'uTrailTexture',
      'uTrailTexel',
    ]) {
      this.uniformLocations[uniformName] = this.gl.getUniformLocation(this.program, uniformName);
    }

    this.resizeObserver = new ResizeObserver(this.handleResize);
    this.resizeObserver.observe(this.parentElement);
    this.parentElement.addEventListener('pointermove', this.handlePointerMove);
    this.parentElement.addEventListener('pointerdown', this.handlePointerMove);
    this.canvasElement.addEventListener('webglcontextlost', this.handleContextLost);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  async loadAssets(): Promise<void> {
    const sources = getRazorSenseModeVideoSources(this.options.assetsPath);
    const loadedVideos: HTMLVideoElement[] = [];
    let videos: HTMLVideoElement[];
    try {
      videos = await Promise.all(
        (['calm', 'joyful', 'caution', 'regret'] as const).map(async (mode) => {
          const video = await loadVideo(sources[mode]);
          loadedVideos.push(video);
          return video;
        }),
      );
    } catch (error: unknown) {
      loadedVideos.forEach((video) => {
        video.src = '';
        video.load();
      });
      throw error;
    }

    if (this.disposed) {
      videos.forEach((video) => {
        video.src = '';
        video.load();
      });
      return;
    }

    this.gl.useProgram(this.program);
    videos.forEach((video, index) => {
      video.playbackRate = this.options.playbackRate;
      if (index === getRazorSenseModeIndex(this.options.mode)) {
        this.requestFrameReady(this.options.mode, this.options.startTime);
      }
      video.currentTime = Math.max(0, this.options.startTime);
      this.videos[index] = video;

      const texture = new Texture(this.gl, {
        textureUnit: index,
        minFilter: this.gl.LINEAR,
        magFilter: this.gl.LINEAR,
      });
      texture.image(video);
      this.textures[index] = texture;
      this.lastUploadedVideoTimes[index] =
        index === getRazorSenseModeIndex(this.options.mode) && this.pendingFrameReady
          ? -1
          : video.currentTime;
    });

    this.gl.uniform1i(this.uniformLocations.uCalmTexture, 0);
    this.gl.uniform1i(this.uniformLocations.uJoyfulTexture, 1);
    this.gl.uniform1i(this.uniformLocations.uCautionTexture, 2);
    this.gl.uniform1i(this.uniformLocations.uRegretTexture, 3);
    this.trailTexture = new Texture(this.gl, {
      textureUnit: 4,
      minFilter: this.gl.LINEAR,
      magFilter: this.gl.LINEAR,
    });
    this.trailTexture.image(this.trailCanvas);
    this.gl.uniform1i(this.uniformLocations.uTrailTexture, 4);
    this.gl.uniform2f(
      this.uniformLocations.uTrailTexel,
      1 / TRAIL_TEXTURE_WIDTH,
      1 / TRAIL_TEXTURE_HEIGHT,
    );

    this.initialized = true;
    this.handleResize();
    this.syncVideoPlayback();
    this.rafId = requestAnimationFrame(this.render);
  }

  setMode(mode: RazorSenseEmotionalMode): void {
    if (this.options.mode === mode) {
      const activeVideo = this.videos[getRazorSenseModeIndex(mode)];
      if (activeVideo) {
        this.requestFrameReady(mode, this.options.startTime);
        activeVideo.currentTime = Math.max(0, this.options.startTime);
        this.syncVideoPlayback();
      }
      return;
    }

    this.parentElement.setAttribute('data-razor-sense-mode', mode);
    const targetWeights = oneHotMode(mode);

    if (!this.initialized) {
      this.options.mode = mode;
      this.currentWeights = targetWeights;
      this.transitionStartWeights = [...targetWeights];
      this.transitionTargetWeights = [...targetWeights];
      return;
    }

    this.updateTransition(performance.now());
    this.transitionStartWeights = [...this.currentWeights];
    this.transitionTargetWeights = targetWeights;
    this.transitionStartedAt = performance.now();
    this.transitionActive = true;
    this.options.mode = mode;

    const targetVideo = this.videos[getRazorSenseModeIndex(mode)];
    if (targetVideo) {
      this.requestFrameReady(mode, this.options.startTime);
      targetVideo.currentTime = Math.max(0, this.options.startTime);
    }
    this.syncVideoPlayback();
  }

  setOptions(
    options: Pick<
      RazorSenseMoodMountOptions,
      | 'transitionDuration'
      | 'paused'
      | 'playbackRate'
      | 'startTime'
      | 'interactive'
      | 'colorScheme'
      | 'onFrameReady'
    >,
  ): void {
    const playbackRateChanged = this.options.playbackRate !== options.playbackRate;
    const startTimeChanged = this.options.startTime !== options.startTime;
    const colorSchemeChanged = this.options.colorScheme !== options.colorScheme;
    if (colorSchemeChanged) {
      const now = performance.now();
      this.updateColorSchemeTransition(now);
      this.colorSchemeTransitionStart = this.currentColorSchemeMix;
      this.colorSchemeTransitionTarget = options.colorScheme === 'dark' ? 1 : 0;
      this.colorSchemeTransitionStartedAt = now;
      this.colorSchemeTransitionActive = true;
      this.parentElement.setAttribute('data-razor-sense-color-scheme', options.colorScheme);
    }
    this.options = { ...this.options, ...options };

    if (playbackRateChanged) {
      this.videos.forEach((video) => {
        video.playbackRate = options.playbackRate;
      });
    }
    if (!options.interactive) {
      this.clearTrail();
    }
    if (startTimeChanged) {
      const activeVideo = this.videos[getRazorSenseModeIndex(this.options.mode)];
      if (activeVideo) {
        this.requestFrameReady(this.options.mode, options.startTime);
        activeVideo.currentTime = Math.max(0, options.startTime);
      }
    }
    if (!options.onFrameReady) this.pendingFrameReady = null;
    this.syncVideoPlayback();
  }

  private requestFrameReady(mode: RazorSenseEmotionalMode, targetTime: number): void {
    if (!this.options.onFrameReady) {
      this.pendingFrameReady = null;
      return;
    }
    const source = getRazorSenseAsset({
      assetsPath: this.options.assetsPath,
      mode,
      colorScheme: this.options.colorScheme,
      viewport: 'desktop',
    }).fallbackSource;
    const modeIndex = getRazorSenseModeIndex(mode);
    this.pendingFrameReady = {
      mode,
      targetTime: Math.max(0, targetTime),
      frameDuration: 1 / Math.max(1, source.framerate),
    };
    this.lastUploadedVideoTimes[modeIndex] = -1;
  }

  private updateColorSchemeTransition(now: number): void {
    if (!this.colorSchemeTransitionActive) return;

    const durationMs = Math.max(0, this.options.transitionDuration) * 1000;
    const rawProgress =
      durationMs === 0 ? 1 : (now - this.colorSchemeTransitionStartedAt) / durationMs;
    const progress = quinticSmootherstep(rawProgress);
    this.currentColorSchemeMix =
      this.colorSchemeTransitionStart +
      (this.colorSchemeTransitionTarget - this.colorSchemeTransitionStart) * progress;

    if (rawProgress >= 1) {
      this.currentColorSchemeMix = this.colorSchemeTransitionTarget;
      this.colorSchemeTransitionStart = this.currentColorSchemeMix;
      this.colorSchemeTransitionActive = false;
    }
  }

  private updateTransition(now: number): void {
    if (!this.transitionActive) return;

    const durationMs = Math.max(0, this.options.transitionDuration) * 1000;
    const rawProgress = durationMs === 0 ? 1 : (now - this.transitionStartedAt) / durationMs;
    const progress = quinticSmootherstep(rawProgress);

    this.currentWeights = this.transitionStartWeights.map(
      (weight, index) => weight + (this.transitionTargetWeights[index] - weight) * progress,
    ) as [number, number, number, number];

    if (rawProgress >= 1) {
      this.currentWeights = [...this.transitionTargetWeights];
      this.transitionStartWeights = [...this.currentWeights];
      this.transitionActive = false;
      this.syncVideoPlayback();
    }
  }

  private syncVideoPlayback(): void {
    if (!this.initialized) return;

    this.videos.forEach((video, index) => {
      const contributes = this.transitionActive
        ? this.transitionStartWeights[index] > 0.001 || this.transitionTargetWeights[index] > 0.001
        : this.currentWeights[index] > 0.001;

      if (!this.options.paused && contributes && !document.hidden) {
        video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    });
  }

  private handleResize = (): void => {
    const cssWidth = Math.max(1, this.parentElement.clientWidth);
    const cssHeight = Math.max(1, this.parentElement.clientHeight);
    let renderScale = Math.min(Math.max(1, window.devicePixelRatio), 2);
    const desiredPixels = cssWidth * cssHeight * renderScale * renderScale;
    if (desiredPixels > MAX_PIXEL_COUNT) {
      renderScale *= Math.sqrt(MAX_PIXEL_COUNT / desiredPixels);
    }

    const width = Math.max(1, Math.round(cssWidth * renderScale));
    const height = Math.max(1, Math.round(cssHeight * renderScale));
    if (this.canvasElement.width !== width || this.canvasElement.height !== height) {
      this.canvasElement.width = width;
      this.canvasElement.height = height;
      this.gl.viewport(0, 0, width, height);
    }
  };

  private handlePointerMove = (event: PointerEvent): void => {
    if (!this.options.interactive || performance.now() - this.mountedAt < POINTER_DELAY_MS) return;
    const bounds = this.parentElement.getBoundingClientRect();
    if (bounds.width === 0 || bounds.height === 0) return;

    const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    const y = 1 - Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
    this.addTrailPoint(x, y);
  };

  private addTrailPoint(x: number, y: number): void {
    const canvasX = x * TRAIL_TEXTURE_WIDTH;
    const canvasY = (1 - y) * TRAIL_TEXTURE_HEIGHT;
    const gradient = this.trailContext.createRadialGradient(
      canvasX,
      canvasY,
      0,
      canvasX,
      canvasY,
      TRAIL_RADIUS,
    );
    for (let stop = 0; stop <= 6; stop++) {
      const progress = stop / 6;
      const alpha = 0.68 * (1 - progress) ** 3.9;
      gradient.addColorStop(progress, `rgba(255,255,255,${alpha})`);
    }
    this.trailContext.globalCompositeOperation = 'source-over';
    this.trailContext.fillStyle = gradient;
    this.trailContext.fillRect(
      canvasX - TRAIL_RADIUS,
      canvasY - TRAIL_RADIUS,
      TRAIL_RADIUS * 2,
      TRAIL_RADIUS * 2,
    );
    this.trailLifeFrames = TRAIL_LIFE_FRAMES;
  }

  private updateTrail(): void {
    if (!this.trailTexture || this.trailLifeFrames <= 0) return;

    this.trailContext.globalCompositeOperation = 'destination-out';
    this.trailContext.fillStyle = 'rgba(0,0,0,0.1)';
    this.trailContext.fillRect(0, 0, TRAIL_TEXTURE_WIDTH, TRAIL_TEXTURE_HEIGHT);
    this.trailContext.globalCompositeOperation = 'source-over';
    this.trailTexture.update(this.trailCanvas);
    this.trailLifeFrames -= 1;

    if (this.trailLifeFrames === 0) {
      this.clearTrail();
    }
  }

  private clearTrail(): void {
    this.trailContext.clearRect(0, 0, TRAIL_TEXTURE_WIDTH, TRAIL_TEXTURE_HEIGHT);
    this.trailLifeFrames = 0;
    this.trailTexture?.update(this.trailCanvas);
  }

  private handleVisibilityChange = (): void => {
    if (document.hidden) {
      if (this.rafId !== null) cancelAnimationFrame(this.rafId);
      this.rafId = null;
      this.videos.forEach((video) => video.pause());
      return;
    }

    this.syncVideoPlayback();
    if (this.rafId === null && !this.disposed) {
      this.rafId = requestAnimationFrame(this.render);
    }
  };

  private handleContextLost = (event: Event): void => {
    event.preventDefault();
    if (this.disposed) return;
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.rafId = null;
    this.options.onError(new Error('RazorSense: WebGL context was lost'));
  };

  private render = (now: number): void => {
    if (this.disposed || !this.initialized) return;
    this.rafId = requestAnimationFrame(this.render);

    this.updateTransition(now);
    this.updateColorSchemeTransition(now);
    this.updateTrail();

    this.gl.useProgram(this.program);
    const pendingFrameReady = this.pendingFrameReady;
    let didUploadPendingFrame = false;
    this.videos.forEach((video, index) => {
      const contributes = this.transitionActive
        ? this.transitionStartWeights[index] > 0.001 || this.transitionTargetWeights[index] > 0.001
        : this.currentWeights[index] > 0.001;
      if (
        contributes &&
        !video.seeking &&
        video.readyState >= video.HAVE_CURRENT_DATA &&
        this.textures[index] &&
        video.currentTime !== this.lastUploadedVideoTimes[index]
      ) {
        this.textures[index].update(video);
        this.lastUploadedVideoTimes[index] = video.currentTime;
        if (
          pendingFrameReady?.mode === this.options.mode &&
          index === getRazorSenseModeIndex(pendingFrameReady.mode) &&
          Math.abs(video.currentTime - pendingFrameReady.targetTime) <=
            pendingFrameReady.frameDuration
        ) {
          didUploadPendingFrame = true;
        }
      }
    });

    this.gl.uniform4fv(this.uniformLocations.uModeWeights, this.currentWeights);
    this.gl.uniform1f(this.uniformLocations.uColorSchemeMix, this.currentColorSchemeMix);
    this.gl.uniform2f(
      this.uniformLocations.uResolution,
      this.canvasElement.width,
      this.canvasElement.height,
    );
    this.gl.uniform1f(this.uniformLocations.uTime, now / 1000);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    if (didUploadPendingFrame && this.pendingFrameReady === pendingFrameReady) {
      this.pendingFrameReady = null;
      this.options.onFrameReady?.();
    }
  };

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.pendingFrameReady = null;
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.rafId = null;

    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.parentElement.removeEventListener('pointermove', this.handlePointerMove);
    this.parentElement.removeEventListener('pointerdown', this.handlePointerMove);
    this.canvasElement.removeEventListener('webglcontextlost', this.handleContextLost);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);

    this.videos.forEach((video) => {
      video.pause();
      video.src = '';
      video.load();
    });
    this.textures.forEach((texture) => texture.destroy());
    this.trailTexture?.destroy();
    this.trailTexture = null;
    this.gl.deleteBuffer(this.buffers.positionBuffer);
    this.gl.deleteBuffer(this.buffers.uvBuffer);
    this.gl.deleteProgram(this.program);
    this.canvasElement.remove();
    this.parentElement.removeAttribute('data-razor-sense-mode');
    this.parentElement.removeAttribute('data-razor-sense-color-scheme');
  }
}

export { RazorSenseMoodMount };
export type { RazorSenseMoodMountOptions };

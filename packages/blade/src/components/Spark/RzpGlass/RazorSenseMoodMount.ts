/* eslint-disable @typescript-eslint/no-floating-promises */

import { getRazorSenseModeIndex, RAZOR_SENSE_EMOTIONAL_MODES } from './modes';
import type { RazorSenseEmotionalMode } from './modes';
import { getRazorSenseAsset, selectRazorSenseVideoSource } from './razorSenseAssets';
import type { RazorSenseLifecycleState } from './RazorSenseRuntime';
import { razorSenseMoodFragmentShader, razorSenseMoodVertexShader } from './razorSenseMoodShader';
import { seekToRazorSenseVideoFrame } from './RazorSenseVideoFrame';
import type { CancelVideoFrameWait } from './RazorSenseVideoFrame';
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
  runtimeState?: RazorSenseLifecycleState;
  isRuntimeAdmitted?: boolean;
  onError: (error: Error) => void;
  onFirstFrame?: () => void;
  /** @internal Used by the fallback exporter after the requested frame is drawn. */
  onFrameReady?: () => void;
};

type PendingFrameReady = {
  generation: number;
  mode: RazorSenseEmotionalMode;
  targetTime: number;
  frameDuration: number;
};

type VideoWithFrameCallback = HTMLVideoElement & {
  requestVideoFrameCallback?: (callback: () => void) => number;
  cancelVideoFrameCallback?: (callbackId: number) => void;
};

type MoodSlot = {
  video: VideoWithFrameCallback;
  texture: Texture | null;
  isPrepared: boolean;
  isDirty: boolean;
  frameCallbackId: number | null;
  lastUploadedTime: number;
  seekCleanup: CancelVideoFrameWait | null;
};

type PendingCapture = {
  target: HTMLCanvasElement;
  resolve: (didCapture: boolean) => void;
};

type LifecycleResult = {
  didCapture: boolean;
  didPresent: boolean;
};

const MAX_PIXEL_COUNT = 4096 * 1024;
const POINTER_DELAY_MS = 4000;
const TRAIL_TEXTURE_WIDTH = 256;
const TRAIL_TEXTURE_HEIGHT = Math.round((TRAIL_TEXTURE_WIDTH * 440) / 1364);
const TRAIL_RADIUS = (TRAIL_TEXTURE_WIDTH * 268) / 1364;
const TRAIL_LIFE_FRAMES = Math.ceil(Math.log(0.01) / Math.log(0.9));
const CONTRIBUTION_EPSILON = 0.001;

const oneHotMode = (mode: RazorSenseEmotionalMode): [number, number, number, number] => {
  const weights: [number, number, number, number] = [0, 0, 0, 0];
  weights[getRazorSenseModeIndex(mode)] = 1;
  return weights;
};

const quinticSmootherstep = (value: number): number => {
  const clamped = Math.max(0, Math.min(1, value));
  return clamped * clamped * clamped * (clamped * (clamped * 6 - 15) + 10);
};

const releaseVideo = (video: HTMLVideoElement): void => {
  video.pause();
  video.removeAttribute('src');
  video.load();
};

class MoodLoadCancelledError extends Error {}

class RazorSenseMoodMount {
  private readonly parentElement: HTMLElement;
  private readonly trailCanvas: HTMLCanvasElement;
  private readonly trailContext: CanvasRenderingContext2D;
  private canvasElement: HTMLCanvasElement | null = null;
  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private buffers: FullscreenQuadBuffers | null = null;
  private readonly uniformLocations: Record<string, WebGLUniformLocation | null> = {};
  private readonly placeholderTextures: Texture[] = [];
  private trailTexture: Texture | null = null;
  private trailLifeFrames = 0;
  private readonly slots = new Map<RazorSenseEmotionalMode, MoodSlot>();
  private readonly loadingByMode = new Map<RazorSenseEmotionalMode, Promise<MoodSlot>>();
  private resizeObserver: ResizeObserver | null = null;
  private rafId: number | null = null;
  private disposed = false;
  private rendererReady = false;
  private options: RazorSenseMoodMountOptions;
  private runtimeState: RazorSenseLifecycleState;
  private isRuntimeAdmitted: boolean;
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
  private readonly mountedAt = performance.now();
  private readonly clockStartedAt = performance.now();
  private accumulatedPausedDuration = 0;
  private clockPausedAt: number | null = null;
  private pendingFrameReady: PendingFrameReady | null = null;
  private pendingCaptures: PendingCapture[] = [];
  private modeGeneration = 0;
  private lifecycleGeneration = 0;
  private hasPresentedFirstFrame = false;
  private hasReportedUnexpectedContextLoss = false;
  private intentionalContextLoss = false;
  private readonly reportedAttemptErrors = new Set<number>();

  constructor(parentElement: HTMLElement, options: RazorSenseMoodMountOptions) {
    this.parentElement = parentElement;
    this.options = options;
    this.runtimeState = options.runtimeState ?? 'active';
    this.isRuntimeAdmitted = options.isRuntimeAdmitted ?? true;
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

    this.parentElement.setAttribute('data-razor-sense-mode', options.mode);
    this.parentElement.setAttribute('data-razor-sense-color-scheme', options.colorScheme);
    this.updateClockPauseState();
    this.updateDiagnostics();
  }

  async loadAssets(): Promise<void> {
    if (!this.canOwnMedia()) return;
    const generation = ++this.modeGeneration;
    let slot: MoodSlot;
    try {
      slot = await this.ensureModeLoaded(this.options.mode);
    } catch (error: unknown) {
      if (
        error instanceof MoodLoadCancelledError ||
        this.disposed ||
        generation !== this.modeGeneration
      ) {
        return;
      }
      throw error;
    }
    if (this.disposed || generation !== this.modeGeneration) return;

    const isExactFrameReady = await this.seekSlot(
      this.options.mode,
      slot,
      this.options.startTime,
      generation,
    );
    if (!isExactFrameReady || this.disposed || generation !== this.modeGeneration) return;

    if (this.shouldOwnRenderer()) {
      this.ensureRenderer();
      this.attachSlotTexture(this.options.mode, slot);
      slot.isDirty = true;
      this.draw(performance.now(), false);
    }
    this.syncVideoPlayback();
  }

  async setMode(mode: RazorSenseEmotionalMode): Promise<void> {
    if (this.disposed) return;
    if (
      this.options.mode === mode &&
      (this.loadingByMode.has(mode) || (!this.slots.has(mode) && this.modeGeneration > 0))
    ) {
      return;
    }

    this.parentElement.setAttribute('data-razor-sense-mode', mode);
    this.options.mode = mode;
    const generation = ++this.modeGeneration;

    if (!this.canOwnMedia()) {
      this.currentWeights = oneHotMode(mode);
      this.transitionStartWeights = [...this.currentWeights];
      this.transitionTargetWeights = [...this.currentWeights];
      this.transitionActive = false;
      this.pendingFrameReady = null;
      return;
    }

    try {
      const slot = await this.ensureModeLoaded(mode);
      if (this.disposed || generation !== this.modeGeneration) {
        this.releaseSlotIfUnused(mode);
        return;
      }
      const isExactFrameReady = await this.seekSlot(mode, slot, this.options.startTime, generation);
      if (!isExactFrameReady || this.disposed || generation !== this.modeGeneration) {
        this.releaseSlotIfUnused(mode);
        return;
      }

      if (this.runtimeState === 'warm') {
        this.currentWeights = oneHotMode(mode);
        this.transitionStartWeights = [...this.currentWeights];
        this.transitionTargetWeights = [...this.currentWeights];
        this.transitionActive = false;
        this.releaseZeroWeightSlots();
        return;
      }

      if (!this.shouldOwnRenderer()) return;
      this.ensureRenderer();
      this.attachSlotTexture(mode, slot);
      if (!this.hasPresentedFirstFrame) {
        this.currentWeights = oneHotMode(mode);
        this.transitionStartWeights = [...this.currentWeights];
        this.transitionTargetWeights = [...this.currentWeights];
        this.transitionActive = false;
        this.releaseZeroWeightSlots();
        slot.isDirty = true;
        this.syncVideoPlayback();
        this.draw(performance.now(), false);
        return;
      }
      const logicalNow = this.getLogicalNow(performance.now());
      this.updateTransition(logicalNow);
      this.transitionStartWeights = [...this.currentWeights];
      this.transitionTargetWeights = oneHotMode(mode);
      this.transitionStartedAt = logicalNow;
      this.transitionActive = this.options.transitionDuration > 0;
      if (!this.transitionActive) {
        this.currentWeights = [...this.transitionTargetWeights];
        this.releaseZeroWeightSlots();
      }
      slot.isDirty = true;
      this.syncVideoPlayback();
      this.scheduleRender();
    } catch (cause: unknown) {
      if (this.disposed || generation !== this.modeGeneration) return;
      if (cause instanceof MoodLoadCancelledError) return;
      this.reportAttemptError(
        generation,
        cause instanceof Error ? cause : new Error(String(cause)),
      );
    }
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
    if (this.disposed) return;
    const playbackRateChanged = this.options.playbackRate !== options.playbackRate;
    const startTimeChanged = this.options.startTime !== options.startTime;
    const colorSchemeChanged = this.options.colorScheme !== options.colorScheme;
    if (colorSchemeChanged) {
      const logicalNow = this.getLogicalNow(performance.now());
      this.updateColorSchemeTransition(logicalNow);
      this.colorSchemeTransitionStart = this.currentColorSchemeMix;
      this.colorSchemeTransitionTarget = options.colorScheme === 'dark' ? 1 : 0;
      this.colorSchemeTransitionStartedAt = logicalNow;
      this.colorSchemeTransitionActive = this.rendererReady && options.transitionDuration > 0;
      if (!this.colorSchemeTransitionActive) {
        this.currentColorSchemeMix = this.colorSchemeTransitionTarget;
      }
      this.parentElement.setAttribute('data-razor-sense-color-scheme', options.colorScheme);
    }
    this.options = { ...this.options, ...options };
    this.updateClockPauseState();

    if (playbackRateChanged) {
      this.slots.forEach((slot) => {
        slot.video.playbackRate = options.playbackRate;
      });
    }
    if (!options.interactive) this.clearTrail();
    if (!options.onFrameReady) this.pendingFrameReady = null;
    if (startTimeChanged) {
      const slot = this.slots.get(this.options.mode);
      if (slot) {
        const generation = ++this.modeGeneration;
        void this.seekSlot(this.options.mode, slot, options.startTime, generation).then(
          (isExactFrameReady) => {
            if (!isExactFrameReady || generation !== this.modeGeneration || this.disposed) return;
            slot.isDirty = true;
            this.scheduleRender();
          },
        );
      }
    }
    this.syncVideoPlayback();
    this.scheduleRender();
  }

  setActive(active: boolean): void {
    if (this.disposed) return;
    this.runtimeState = active ? 'active' : 'suspended';
    this.updateClockPauseState();
    this.syncVideoPlayback();
    if (active) this.scheduleRender();
    else this.cancelRenderIfIdle();
  }

  async setRuntimeState(
    runtimeState: RazorSenseLifecycleState,
    isRuntimeAdmitted: boolean,
    captureTarget?: HTMLCanvasElement | null,
  ): Promise<LifecycleResult> {
    if (this.disposed) return { didCapture: false, didPresent: false };
    const generation = ++this.lifecycleGeneration;
    const shouldReleaseRenderer =
      runtimeState === 'warm' ||
      runtimeState === 'dormant' ||
      runtimeState === 'cold' ||
      (runtimeState === 'active' && !isRuntimeAdmitted);
    let didCapture = false;

    if ((runtimeState === 'suspended' || shouldReleaseRenderer) && captureTarget) {
      didCapture = await this.captureFrame(captureTarget);
      if (this.disposed || generation !== this.lifecycleGeneration) {
        return { didCapture, didPresent: false };
      }
    }

    this.runtimeState = runtimeState;
    this.isRuntimeAdmitted = isRuntimeAdmitted;
    this.updateClockPauseState();

    if (runtimeState === 'suspended') {
      this.syncVideoPlayback();
      this.cancelRenderIfIdle();
      return { didCapture, didPresent: this.rendererReady };
    }

    if (!this.canOwnMedia()) {
      this.pauseAndCancelAllVideoCallbacks();
      this.releaseAllSlots();
      this.releaseRenderer(true);
      return { didCapture, didPresent: false };
    }

    let slot: MoodSlot;
    try {
      slot = await this.ensureModeLoaded(this.options.mode);
    } catch (cause: unknown) {
      if (cause instanceof MoodLoadCancelledError) {
        return { didCapture, didPresent: false };
      }
      if (generation === this.lifecycleGeneration) {
        this.reportAttemptError(
          this.modeGeneration,
          cause instanceof Error ? cause : new Error(String(cause)),
        );
      }
      return { didCapture, didPresent: false };
    }
    if (this.disposed || generation !== this.lifecycleGeneration) {
      return { didCapture, didPresent: false };
    }

    const modeGeneration = ++this.modeGeneration;
    if (slot.isPrepared && this.options.onFrameReady) {
      const source = getRazorSenseAsset({
        assetsPath: this.options.assetsPath,
        mode: this.options.mode,
        colorScheme: this.options.colorScheme,
        viewport: 'desktop',
      }).fallbackSource;
      this.pendingFrameReady = {
        generation: modeGeneration,
        mode: this.options.mode,
        targetTime: slot.video.currentTime,
        frameDuration: 1 / Math.max(1, source.framerate),
      };
      slot.isDirty = true;
      slot.lastUploadedTime = -1;
    }
    const isExactFrameReady = slot.isPrepared
      ? true
      : await this.seekSlot(this.options.mode, slot, this.options.startTime, modeGeneration);
    if (
      !isExactFrameReady ||
      this.disposed ||
      generation !== this.lifecycleGeneration ||
      modeGeneration !== this.modeGeneration
    ) {
      return { didCapture, didPresent: false };
    }

    this.currentWeights = oneHotMode(this.options.mode);
    this.transitionStartWeights = [...this.currentWeights];
    this.transitionTargetWeights = [...this.currentWeights];
    this.transitionActive = false;
    this.releaseZeroWeightSlots();

    if (runtimeState === 'warm') {
      this.pauseAndCancelAllVideoCallbacks();
      this.releaseRenderer(true);
      return { didCapture, didPresent: false };
    }

    this.ensureRenderer();
    this.attachSlotTexture(this.options.mode, slot);
    slot.isDirty = true;
    this.draw(performance.now(), false);
    this.syncVideoPlayback();
    return { didCapture, didPresent: true };
  }

  captureFrame(target: HTMLCanvasElement): Promise<boolean> {
    if (this.disposed || !this.rendererReady) return Promise.resolve(false);
    return new Promise((resolve) => {
      this.pendingCaptures.push({ target, resolve });
      this.draw(performance.now(), false);
    });
  }

  private canOwnMedia(): boolean {
    return this.runtimeState === 'warm' || this.shouldOwnRenderer();
  }

  private shouldOwnRenderer(): boolean {
    return this.runtimeState === 'active' && this.isRuntimeAdmitted;
  }

  private shouldPlay(): boolean {
    return this.shouldOwnRenderer() && !this.options.paused;
  }

  private async ensureModeLoaded(mode: RazorSenseEmotionalMode): Promise<MoodSlot> {
    const existing = this.slots.get(mode);
    if (existing) return existing;
    const loading = this.loadingByMode.get(mode);
    if (loading) return loading;

    const promise = selectRazorSenseVideoSource({
      assetsPath: this.options.assetsPath,
      mode,
      colorScheme: this.options.colorScheme,
      viewport: 'desktop',
    })
      .then(({ src }) => loadVideo(src))
      .then((loadedVideo) => {
        const video = loadedVideo as VideoWithFrameCallback;
        if (this.disposed || !this.canOwnMedia()) {
          releaseVideo(video);
          throw new MoodLoadCancelledError(
            `RazorSense: The ${mode} emotional mode load was cancelled`,
          );
        }
        const racedExisting = this.slots.get(mode);
        if (racedExisting) {
          releaseVideo(video);
          return racedExisting;
        }
        video.playbackRate = this.options.playbackRate;
        video.pause();
        const slot: MoodSlot = {
          video,
          texture: null,
          isPrepared: false,
          isDirty: true,
          frameCallbackId: null,
          lastUploadedTime: -1,
          seekCleanup: null,
        };
        this.slots.set(mode, slot);
        this.updateDiagnostics();
        return slot;
      })
      .finally(() => {
        if (this.loadingByMode.get(mode) === promise) this.loadingByMode.delete(mode);
      });
    this.loadingByMode.set(mode, promise);
    return promise;
  }

  private seekSlot(
    mode: RazorSenseEmotionalMode,
    slot: MoodSlot,
    targetTime: number,
    generation: number,
  ): Promise<boolean> {
    slot.seekCleanup?.();
    const requestedTime = Math.max(0, targetTime);
    const source = getRazorSenseAsset({
      assetsPath: this.options.assetsPath,
      mode,
      colorScheme: this.options.colorScheme,
      viewport: 'desktop',
    }).fallbackSource;

    return new Promise((resolve) => {
      let isSettled = false;
      const settle = (isReady: boolean): void => {
        if (isSettled) return;
        isSettled = true;
        resolve(isReady);
      };
      const cancelWait = seekToRazorSenseVideoFrame({
        video: slot.video,
        targetTime: requestedTime,
        frameRate: source.framerate,
        shouldRemainPaused: true,
        onReady: () => {
          slot.seekCleanup = null;
          if (
            this.disposed ||
            generation !== this.modeGeneration ||
            this.slots.get(mode) !== slot
          ) {
            settle(false);
            return;
          }
          slot.isDirty = true;
          slot.isPrepared = true;
          slot.lastUploadedTime = -1;
          if (this.options.onFrameReady) {
            this.pendingFrameReady = {
              generation,
              mode,
              targetTime: requestedTime,
              frameDuration: 1 / Math.max(1, source.framerate),
            };
          }
          settle(true);
        },
      });
      slot.seekCleanup = () => {
        cancelWait();
        slot.seekCleanup = null;
        settle(false);
      };
    });
  }

  private ensureRenderer(): void {
    if (this.rendererReady || this.disposed) return;

    const canvasElement = document.createElement('canvas');
    Object.assign(canvasElement.style, {
      display: 'block',
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      borderRadius: 'inherit',
      pointerEvents: 'none',
      zIndex: '1',
    });
    canvasElement.setAttribute('aria-hidden', 'true');
    const gl = canvasElement.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      powerPreference: 'default',
      preserveDrawingBuffer: false,
    });
    if (!gl) throw new Error('RazorSense: WebGL is not supported in this browser');

    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    const program = createProgram(gl, razorSenseMoodVertexShader, razorSenseMoodFragmentShader);
    if (!program) throw new Error('RazorSense: Failed to create the emotional-mode shader');
    const buffers = setupFullscreenQuad(gl, program);
    if (!buffers) {
      gl.deleteProgram(program);
      throw new Error('RazorSense: Failed to create fullscreen geometry');
    }

    this.canvasElement = canvasElement;
    this.gl = gl;
    this.program = program;
    this.buffers = buffers;
    this.intentionalContextLoss = false;
    this.hasReportedUnexpectedContextLoss = false;
    this.parentElement.prepend(canvasElement);
    gl.useProgram(program);

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
      this.uniformLocations[uniformName] = gl.getUniformLocation(program, uniformName);
    }

    const placeholderCanvas = document.createElement('canvas');
    placeholderCanvas.width = 1;
    placeholderCanvas.height = 1;
    RAZOR_SENSE_EMOTIONAL_MODES.forEach((_mode, index) => {
      const texture = new Texture(gl, {
        textureUnit: index,
        minFilter: gl.LINEAR,
        magFilter: gl.LINEAR,
      });
      texture.image(placeholderCanvas);
      this.placeholderTextures[index] = texture;
    });
    gl.uniform1i(this.uniformLocations.uCalmTexture, 0);
    gl.uniform1i(this.uniformLocations.uJoyfulTexture, 1);
    gl.uniform1i(this.uniformLocations.uCautionTexture, 2);
    gl.uniform1i(this.uniformLocations.uRegretTexture, 3);

    this.trailTexture = new Texture(gl, {
      textureUnit: 4,
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
    });
    this.trailTexture.image(this.trailCanvas);
    gl.uniform1i(this.uniformLocations.uTrailTexture, 4);
    gl.uniform2f(
      this.uniformLocations.uTrailTexel,
      1 / TRAIL_TEXTURE_WIDTH,
      1 / TRAIL_TEXTURE_HEIGHT,
    );

    this.resizeObserver = new ResizeObserver(this.handleResize);
    this.resizeObserver.observe(this.parentElement);
    this.parentElement.addEventListener('pointermove', this.handlePointerMove);
    this.parentElement.addEventListener('pointerdown', this.handlePointerMove);
    canvasElement.addEventListener('webglcontextlost', this.handleContextLost);
    this.rendererReady = true;
    this.updateDiagnostics();
    this.handleResize();

    this.slots.forEach((slot, mode) => {
      if (this.modeContributes(mode)) this.attachSlotTexture(mode, slot);
    });
  }

  private attachSlotTexture(mode: RazorSenseEmotionalMode, slot: MoodSlot): void {
    if (slot.texture || !this.gl) return;
    const texture = new Texture(this.gl, {
      textureUnit: getRazorSenseModeIndex(mode),
      minFilter: this.gl.LINEAR,
      magFilter: this.gl.LINEAR,
    });
    texture.image(slot.video);
    slot.texture = texture;
    slot.lastUploadedTime = slot.video.currentTime;
    slot.isDirty = Boolean(this.pendingFrameReady?.mode === mode);
  }

  private modeContributes(mode: RazorSenseEmotionalMode): boolean {
    const index = getRazorSenseModeIndex(mode);
    return this.transitionActive
      ? this.transitionStartWeights[index] > CONTRIBUTION_EPSILON ||
          this.transitionTargetWeights[index] > CONTRIBUTION_EPSILON
      : this.currentWeights[index] > CONTRIBUTION_EPSILON;
  }

  private syncVideoPlayback(): void {
    const shouldPlay = this.shouldPlay();
    this.slots.forEach((slot, mode) => {
      const contributes = this.modeContributes(mode);
      if (shouldPlay && contributes) {
        slot.video.playbackRate = this.options.playbackRate;
        slot.video
          .play()
          .then(() => {
            this.scheduleVideoFrame(mode, slot);
            this.updateDiagnostics();
          })
          .catch(() => undefined);
      } else {
        slot.video.pause();
        this.cancelVideoFrame(slot);
      }
    });
    this.updateClockPauseState();
    this.updateDiagnostics();
    if (shouldPlay) this.scheduleRender();
    else this.cancelRenderIfIdle();
  }

  private scheduleVideoFrame(mode: RazorSenseEmotionalMode, slot: MoodSlot): void {
    if (
      slot.frameCallbackId !== null ||
      !slot.video.requestVideoFrameCallback ||
      slot.video.paused ||
      this.disposed ||
      !this.shouldPlay() ||
      !this.modeContributes(mode)
    ) {
      return;
    }
    slot.frameCallbackId = slot.video.requestVideoFrameCallback(() => {
      slot.frameCallbackId = null;
      this.updateDiagnostics();
      if (this.disposed || this.slots.get(mode) !== slot) return;
      slot.isDirty = true;
      this.scheduleRender();
      this.scheduleVideoFrame(mode, slot);
    });
    this.updateDiagnostics();
  }

  private cancelVideoFrame(slot: MoodSlot): void {
    if (slot.frameCallbackId === null) return;
    slot.video.cancelVideoFrameCallback?.(slot.frameCallbackId);
    slot.frameCallbackId = null;
    this.updateDiagnostics();
  }

  private pauseAndCancelAllVideoCallbacks(): void {
    this.slots.forEach((slot) => {
      slot.video.pause();
      this.cancelVideoFrame(slot);
      slot.seekCleanup?.();
      slot.seekCleanup = null;
    });
  }

  private updateColorSchemeTransition(logicalNow: number): void {
    if (!this.colorSchemeTransitionActive) return;
    const durationMs = Math.max(0, this.options.transitionDuration) * 1000;
    const rawProgress =
      durationMs === 0 ? 1 : (logicalNow - this.colorSchemeTransitionStartedAt) / durationMs;
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

  private updateTransition(logicalNow: number): void {
    if (!this.transitionActive) return;
    const durationMs = Math.max(0, this.options.transitionDuration) * 1000;
    const rawProgress = durationMs === 0 ? 1 : (logicalNow - this.transitionStartedAt) / durationMs;
    const progress = quinticSmootherstep(rawProgress);
    this.currentWeights = this.transitionStartWeights.map(
      (weight, index) => weight + (this.transitionTargetWeights[index] - weight) * progress,
    ) as [number, number, number, number];
    if (rawProgress >= 1) {
      this.currentWeights = [...this.transitionTargetWeights];
      this.transitionStartWeights = [...this.currentWeights];
      this.transitionActive = false;
      this.releaseZeroWeightSlots();
      this.syncVideoPlayback();
    }
  }

  private updateClockPauseState(): void {
    const shouldPauseClock = !this.shouldPlay();
    const now = performance.now();
    if (shouldPauseClock && this.clockPausedAt === null) {
      this.clockPausedAt = now;
    } else if (!shouldPauseClock && this.clockPausedAt !== null) {
      this.accumulatedPausedDuration += now - this.clockPausedAt;
      this.clockPausedAt = null;
    }
  }

  private getLogicalNow(now: number): number {
    const effectiveNow = this.clockPausedAt ?? now;
    return effectiveNow - this.clockStartedAt - this.accumulatedPausedDuration;
  }

  private handleResize = (): void => {
    if (!this.canvasElement || !this.gl) return;
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
      this.scheduleRender();
    }
  };

  private handlePointerMove = (event: PointerEvent): void => {
    if (
      !this.shouldPlay() ||
      !this.options.interactive ||
      performance.now() - this.mountedAt < POINTER_DELAY_MS
    ) {
      return;
    }
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
    this.scheduleRender();
  }

  private updateTrail(): void {
    if (!this.trailTexture || this.trailLifeFrames <= 0) return;
    this.trailContext.globalCompositeOperation = 'destination-out';
    this.trailContext.fillStyle = 'rgba(0,0,0,0.1)';
    this.trailContext.fillRect(0, 0, TRAIL_TEXTURE_WIDTH, TRAIL_TEXTURE_HEIGHT);
    this.trailContext.globalCompositeOperation = 'source-over';
    this.trailTexture.update(this.trailCanvas);
    this.trailLifeFrames -= 1;
    if (this.trailLifeFrames === 0) this.clearTrail();
  }

  private clearTrail(): void {
    this.trailContext.clearRect(0, 0, TRAIL_TEXTURE_WIDTH, TRAIL_TEXTURE_HEIGHT);
    this.trailLifeFrames = 0;
    this.trailTexture?.update(this.trailCanvas);
  }

  private handleContextLost = (event: Event): void => {
    event.preventDefault();
    if (this.disposed || this.intentionalContextLoss || this.hasReportedUnexpectedContextLoss) {
      return;
    }
    this.hasReportedUnexpectedContextLoss = true;
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.rafId = null;
    this.pauseAndCancelAllVideoCallbacks();
    this.releaseRenderer(false);
    this.options.onError(new Error('RazorSense: WebGL context was lost'));
  };

  private scheduleRender(): void {
    if (this.rafId !== null || !this.rendererReady || this.disposed) return;
    this.rafId = requestAnimationFrame(this.render);
    this.updateDiagnostics();
  }

  private cancelRenderIfIdle(): void {
    if (this.hasTimeDependentWork()) return;
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.rafId = null;
    this.updateDiagnostics();
  }

  private hasTimeDependentWork(): boolean {
    if (!this.rendererReady || this.disposed) return false;
    if (
      this.pendingCaptures.length > 0 ||
      (this.shouldPlay() &&
        (this.transitionActive || this.colorSchemeTransitionActive || this.trailLifeFrames > 0))
    ) {
      return true;
    }
    for (const [mode, slot] of this.slots) {
      if (!this.modeContributes(mode)) continue;
      if (slot.isDirty || (!slot.video.requestVideoFrameCallback && !slot.video.paused))
        return true;
    }
    return false;
  }

  private render = (now: number): void => {
    this.rafId = null;
    this.updateDiagnostics();
    if (this.disposed || !this.rendererReady) {
      this.flushPendingCaptures(false);
      return;
    }
    this.draw(now, this.shouldPlay());
    if (this.hasTimeDependentWork()) this.scheduleRender();
  };

  private draw(now: number, advanceAnimations: boolean): void {
    const gl = this.gl;
    const canvas = this.canvasElement;
    const program = this.program;
    if (!this.rendererReady || !gl || !canvas || !program) {
      this.flushPendingCaptures(false);
      return;
    }

    const logicalNow = this.getLogicalNow(now);
    this.updateTransition(logicalNow);
    this.updateColorSchemeTransition(logicalNow);
    if (advanceAnimations) this.updateTrail();

    gl.useProgram(program);
    const pendingFrameReady = this.pendingFrameReady;
    let didUploadPendingFrame = false;
    let didDrawVideoFrame = false;
    this.slots.forEach((slot, mode) => {
      if (!this.modeContributes(mode)) return;
      this.attachSlotTexture(mode, slot);
      const canUpload =
        !slot.video.seeking &&
        slot.video.readyState >= slot.video.HAVE_CURRENT_DATA &&
        slot.texture;
      const shouldUpload =
        canUpload &&
        (slot.isDirty ||
          (!slot.video.requestVideoFrameCallback &&
            slot.video.currentTime !== slot.lastUploadedTime));
      if (shouldUpload && slot.texture) {
        slot.texture.update(slot.video);
        slot.lastUploadedTime = slot.video.currentTime;
        slot.isDirty = false;
        didDrawVideoFrame = true;
        if (
          pendingFrameReady?.generation === this.modeGeneration &&
          pendingFrameReady.mode === mode &&
          Math.abs(slot.video.currentTime - pendingFrameReady.targetTime) <=
            pendingFrameReady.frameDuration
        ) {
          didUploadPendingFrame = true;
        }
      } else if (canUpload) {
        didDrawVideoFrame = true;
      }
    });

    gl.uniform4fv(this.uniformLocations.uModeWeights, this.currentWeights);
    gl.uniform1f(this.uniformLocations.uColorSchemeMix, this.currentColorSchemeMix);
    gl.uniform2f(this.uniformLocations.uResolution, canvas.width, canvas.height);
    gl.uniform1f(this.uniformLocations.uTime, logicalNow / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    this.flushPendingCaptures(true);

    if (didDrawVideoFrame && !this.hasPresentedFirstFrame) {
      this.hasPresentedFirstFrame = true;
      this.options.onFirstFrame?.();
    }
    if (didUploadPendingFrame && this.pendingFrameReady === pendingFrameReady) {
      this.pendingFrameReady = null;
      this.options.onFrameReady?.();
    }
  }

  private flushPendingCaptures(didDraw: boolean): void {
    if (this.pendingCaptures.length === 0) return;
    const captures = this.pendingCaptures;
    this.pendingCaptures = [];
    const gl = this.gl;
    const canvas = this.canvasElement;
    if (!didDraw || !gl || !canvas) {
      captures.forEach(({ resolve }) => resolve(false));
      return;
    }

    const { width, height } = canvas;
    const pixels = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    captures.forEach(({ target, resolve }) => {
      target.width = width;
      target.height = height;
      const context = target.getContext('2d');
      const image = context?.createImageData(width, height);
      if (!context || !image) {
        resolve(false);
        return;
      }
      for (let row = 0; row < height; row += 1) {
        const sourceOffset = (height - row - 1) * width * 4;
        image.data.set(pixels.subarray(sourceOffset, sourceOffset + width * 4), row * width * 4);
      }
      context.putImageData(image, 0, 0);
      resolve(true);
    });
  }

  private releaseSlotIfUnused(mode: RazorSenseEmotionalMode): void {
    const index = getRazorSenseModeIndex(mode);
    if (
      this.currentWeights[index] > CONTRIBUTION_EPSILON ||
      this.transitionStartWeights[index] > CONTRIBUTION_EPSILON ||
      this.transitionTargetWeights[index] > CONTRIBUTION_EPSILON ||
      mode === this.options.mode
    ) {
      return;
    }
    this.releaseSlot(mode);
  }

  private releaseZeroWeightSlots(): void {
    this.slots.forEach((_slot, mode) => {
      const index = getRazorSenseModeIndex(mode);
      if (this.currentWeights[index] <= CONTRIBUTION_EPSILON && mode !== this.options.mode) {
        this.releaseSlot(mode);
      }
    });
  }

  private releaseSlot(mode: RazorSenseEmotionalMode): void {
    const slot = this.slots.get(mode);
    if (!slot) return;
    slot.seekCleanup?.();
    slot.seekCleanup = null;
    this.cancelVideoFrame(slot);
    releaseVideo(slot.video);
    slot.texture?.destroy();
    slot.texture = null;
    this.placeholderTextures[getRazorSenseModeIndex(mode)]?.bind();
    this.slots.delete(mode);
    this.updateDiagnostics();
  }

  private releaseAllSlots(): void {
    [...this.slots.keys()].forEach((mode) => this.releaseSlot(mode));
  }

  private releaseRenderer(loseContext: boolean): void {
    if (!this.canvasElement && !this.gl) return;
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.rafId = null;
    this.flushPendingCaptures(false);
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.parentElement.removeEventListener('pointermove', this.handlePointerMove);
    this.parentElement.removeEventListener('pointerdown', this.handlePointerMove);
    this.canvasElement?.removeEventListener('webglcontextlost', this.handleContextLost);
    this.slots.forEach((slot) => {
      slot.texture?.destroy();
      slot.texture = null;
    });
    this.placeholderTextures.forEach((texture) => texture.destroy());
    this.placeholderTextures.length = 0;
    this.trailTexture?.destroy();
    this.trailTexture = null;
    if (this.gl && this.buffers) {
      this.gl.deleteBuffer(this.buffers.positionBuffer);
      this.gl.deleteBuffer(this.buffers.uvBuffer);
    }
    if (this.gl && this.program) this.gl.deleteProgram(this.program);
    if (loseContext && this.gl) {
      this.intentionalContextLoss = true;
      this.gl.getExtension('WEBGL_lose_context')?.loseContext();
    }
    this.canvasElement?.remove();
    this.canvasElement = null;
    this.gl = null;
    this.program = null;
    this.buffers = null;
    this.rendererReady = false;
    this.updateDiagnostics();
  }

  private updateDiagnostics(): void {
    this.parentElement.setAttribute(
      'data-razor-sense-mood-slots',
      [...this.slots.keys()].join(','),
    );
    this.parentElement.setAttribute(
      'data-razor-sense-mood-renderer',
      this.rendererReady ? 'webgl' : 'fallback',
    );
    this.parentElement.setAttribute(
      'data-razor-sense-mood-playing',
      [...this.slots.entries()]
        .filter(([, slot]) => !slot.video.paused)
        .map(([mode]) => mode)
        .join(','),
    );
    this.parentElement.setAttribute(
      'data-razor-sense-mood-raf',
      this.rafId === null ? 'idle' : 'scheduled',
    );
    this.parentElement.setAttribute(
      'data-razor-sense-mood-frame-callbacks',
      String([...this.slots.values()].filter((slot) => slot.frameCallbackId !== null).length),
    );
  }

  private reportAttemptError(generation: number, error: Error): void {
    if (this.reportedAttemptErrors.has(generation)) return;
    this.reportedAttemptErrors.add(generation);
    this.options.onError(error);
  }

  dispose({ loseContext = false }: { loseContext?: boolean } = {}): void {
    if (this.disposed) return;
    this.disposed = true;
    this.modeGeneration += 1;
    this.lifecycleGeneration += 1;
    this.pendingFrameReady = null;
    this.pauseAndCancelAllVideoCallbacks();
    this.releaseAllSlots();
    this.releaseRenderer(loseContext);
    this.flushPendingCaptures(false);
    this.parentElement.removeAttribute('data-razor-sense-mode');
    this.parentElement.removeAttribute('data-razor-sense-color-scheme');
    this.parentElement.removeAttribute('data-razor-sense-mood-slots');
    this.parentElement.removeAttribute('data-razor-sense-mood-renderer');
    this.parentElement.removeAttribute('data-razor-sense-mood-playing');
    this.parentElement.removeAttribute('data-razor-sense-mood-raf');
    this.parentElement.removeAttribute('data-razor-sense-mood-frame-callbacks');
  }
}

export { RazorSenseMoodMount };
export type { LifecycleResult, RazorSenseMoodMountOptions };

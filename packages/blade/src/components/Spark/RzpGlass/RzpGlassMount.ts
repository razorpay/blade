/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-implicit-any-catch */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable one-var */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable default-case */
/* eslint-disable @typescript-eslint/no-inferrable-types */

/**
 * RzpGlassMount
 *
 * Core vanilla class for the RzpGlass WebGL shader effect.
 * Modeled after paper-shaders' ShaderMount with extensions for video textures.
 *
 * @see https://github.com/paper-design/shaders/blob/main/packages/shaders/src/shader-mount.ts
 */
import { rzpGlassVertexShader, rzpGlassFragmentShader } from './rzpGlassShader';
import type { RzpGlassConfig, RzpGlassAssets } from './types';
import { DEFAULT_CONFIG } from './presets';
import { loadImage, loadVideo, isSafari, bestGuessBrowserZoom } from './utils';
import { createProgram, setupFullscreenQuad, Texture } from './webgl-utils';
import { WebGLPerformanceController, LEVEL_RENDER_SETTINGS } from './PerformanceManager';
import type { PerformanceLevel } from './PerformanceManager';

// Reference resolution for zoom-independent displacement
const REF_RESOLUTION = { width: 3000, height: 2000 };

// Default max pixel count (1920 * 1080 * 4 = 8,294,400 pixels)
const DEFAULT_MAX_PIXEL_COUNT = 1920 * 1080 * 4;

// Default styles for the shader container
const defaultStyle = `@layer rzp-glass {
  :where([data-rzp-glass]) {
    isolation: isolate;
    position: relative;
    overflow: hidden;

    & canvas {
      contain: strict;
      display: block;
      position: absolute;
      z-index: -1;
      border-radius: inherit;
    }
  }
}`;

/** Map of config keys to uniform names */
const CONFIG_TO_UNIFORM: Record<string, string> = {
  enableDisplacement: 'uEnableDisplacement',
  enableColorama: 'uEnableColorama',
  enableBloom: 'uEnableBloom',
  enableLightSweep: 'uEnableLightSweep',
  inputMin: 'uInputMin',
  inputMax: 'uInputMax',
  modifyGamma: 'uModifyGamma',
  posterizeLevels: 'uPosterizeLevels',
  cycleRepetitions: 'uCycleRepetitions',
  phaseShift: 'uPhaseShift',
  cycleSpeed: 'uCycleSpeed',
  wrapMode: 'uWrapMode',
  reverse: 'uReverse',
  blendWithOriginal: 'uBlendWithOriginal',
  lightIntensity: 'uLightIntensity',
  lightStartFrame: 'uLightStartFrame',
  numSegments: 'uNumSegments',
  slitAngle: 'uSlitAngle',
  displacementX: 'uDisplacementX',
  displacementY: 'uDisplacementY',
  enableCenterElement: 'uEnableCenterElement',
  centerAnimDuration: 'uCenterAnimDuration',
  ccBlackPoint: 'uCCBlackPoint',
  ccWhitePoint: 'uCCWhitePoint',
  ccMidtoneGamma: 'uCCMidtoneGamma',
  ccGamma: 'uCCGamma',
  ccContrast: 'uCCContrast',
  zoom: 'uZoom',
  // panX and panY are combined into uPan (vec2) in setUniformValues
  // backgroundColor is handled separately (needs clear color update)
  edgeFeather: 'uEdgeFeather',
};

export class RzpGlassMount {
  public parentElement: HTMLElement;
  public canvasElement: HTMLCanvasElement;

  private gl: WebGLRenderingContext;
  private program: WebGLProgram | null = null;
  private uniformLocations: Record<string, WebGLUniformLocation | null> = {};
  private uniformCache: Record<string, unknown> = {};

  // Textures
  private videoTexture: Texture | null = null;
  private gradientMapTexture: Texture | null = null;
  private gradientMap2Texture: Texture | null = null;
  private centerGradientMapTexture: Texture | null = null;

  // Gradient map blend animation state
  private currentGradientMapBlend = 0;

  // Video element
  private video: HTMLVideoElement | null = null;
  private videoFrameCallbackId: number | null = null;

  // Animation state (paper-shader style)
  private rafId: number | null = null;
  /** Last render time in seconds */
  private lastRenderTime = 0;
  /** Frame count (increments every frame) */
  private currentFrame = 0;

  // Video-specific animation state
  /** Time for independent light animation (accumulates deltaTime) */
  private independentLightTime = 0;
  /** Last video animation time (for detecting jumps) */
  private lastVideoTime = 0;

  // Configuration
  private config: Required<RzpGlassConfig>;
  private assets: RzpGlassAssets;

  // State flags
  private hasBeenDisposed = false;
  private isInitialized = false;
  private resolutionChanged = true;

  // Visible UV bounds (where container clips the canvas)
  // vec4(minX, minY, maxX, maxY) - portion of canvas UV that's visible
  private visibleUvBounds: [number, number, number, number] = [0, 0, 1, 1];

  // Resize handling
  private resizeObserver: ResizeObserver | null = null;
  private renderScale = 1;
  private parentWidth = 0;
  private parentHeight = 0;
  private parentDevicePixelWidth = 0;
  private parentDevicePixelHeight = 0;
  private devicePixelsSupported = false;
  private minPixelRatio: number;
  private maxPixelCount: number;
  private isSafariBrowser = isSafari();

  // Performance monitoring
  private performanceController: WebGLPerformanceController | null = null;

  constructor(
    parentElement: HTMLElement,
    assets: RzpGlassAssets,
    config: Partial<RzpGlassConfig> = {},
    /** Starting frame offset in ms for deterministic results */
    frame = 0,
    /** Minimum pixel ratio to render at (default: 2) */
    minPixelRatio = 1,
    /** Maximum pixel count to render (default: ~8.3M) */
    maxPixelCount = DEFAULT_MAX_PIXEL_COUNT,
  ) {
    this.parentElement = parentElement;
    this.assets = assets;
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.currentFrame = frame;
    this.minPixelRatio = minPixelRatio;
    this.maxPixelCount = maxPixelCount;

    // Inject default styles if not already present
    if (!document.querySelector('style[data-rzp-glass-style]')) {
      const styleElement = document.createElement('style');
      styleElement.innerHTML = defaultStyle;
      styleElement.setAttribute('data-rzp-glass-style', '');
      document.head.prepend(styleElement);
    }

    // Create canvas element
    this.canvasElement = document.createElement('canvas');
    this.parentElement.prepend(this.canvasElement);
    this.parentElement.setAttribute('data-rzp-glass', '');

    // Get WebGL context with alpha for transparency during loading
    const gl = this.canvasElement.getContext('webgl', {
      antialias: false,
      premultipliedAlpha: false,
      depth: false,
      alpha: true,
      powerPreference: 'high-performance',
    })!;
    this.gl = gl;

    this.performanceController = new WebGLPerformanceController({
      gl: this.gl,
      onLevelChange: this.handlePerformanceLevelChange,
    });

    this.stopIfPotato();

    // Flip Y axis when uploading textures (video/images have Y=0 at top, WebGL has Y=0 at bottom)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // WebGL state setup (matching OGL defaults for 2D rendering)
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);

    // Set clear color to transparent (for alpha blending during loading)
    gl.clearColor(0, 0, 0, 0);

    // Initialize program
    this.initProgram();
    this.setupPositionAttribute();
    this.setupUniformLocations();
    this.setupResizeObserver();

    // Visual viewport listener for zoom changes
    visualViewport?.addEventListener('resize', this.handleVisualViewportChange);

    // Listen for visibility changes to pause when tab is hidden
    document.addEventListener('visibilitychange', this.handleDocumentVisibilityChange);
  }

  private stopIfPotato(): asserts this is this {
    if (!this.performanceController?.isPotato()) {
      return;
    }
    this.stopRenderLoop();
    throw new Error('RzpGlass: WebGL is not supported in this browser');
  }

  /**
   * Load all assets (video or static image + gradient maps) and start rendering.
   * When `assets.imageSrc` is provided it is used as a static base texture and
   * no video element is created.
   */
  async loadAssets(): Promise<void> {
    this.stopIfPotato();
    try {
      const useStaticImage = Boolean(this.assets.imageSrc);

      const gradientMap2Src = this.assets.gradientMap2Src ?? this.assets.gradientMapSrc!;

      const [baseAsset, gradientMap, gradientMap2, centerGradientMap] = await Promise.all([
        useStaticImage ? loadImage(this.assets.imageSrc!) : loadVideo(this.assets.videoSrc!),
        loadImage(this.assets.gradientMapSrc!),
        loadImage(gradientMap2Src),
        loadImage(this.assets.centerGradientMapSrc!),
      ]);

      if (useStaticImage) {
        // Static image path — upload once to texture unit 0, no video loop needed
        this.setupImageTexture('uVideoTexture', baseAsset as HTMLImageElement, 0);
      } else {
        this.video = baseAsset as HTMLVideoElement;
        this.setupVideoTexture();
        // Set video to start time and apply playback rate before playback
        this.video.currentTime = this.config.startTime;
        this.video.playbackRate = this.config.playbackRate;
        if (!this.config.paused) {
          await this.video.play().catch((e) => {
            console.warn('Video autoplay failed:', e);
          });
        }
      }

      this.setupImageTexture('uGradientMap', gradientMap as HTMLImageElement, 1);
      this.setupImageTexture('uCenterGradientMap', centerGradientMap as HTMLImageElement, 2);
      this.setupImageTexture('uGradientMap2', gradientMap2 as HTMLImageElement, 3);

      // Set initial uniform values
      this.setAllUniforms();

      this.isInitialized = true;

      // Initial resize
      this.handleResize();

      // Start the render loop (runs continuously)
      this.startRenderLoop();
    } catch (error) {
      console.error('RzpGlass: Failed to load assets', error);
      throw error;
    }
  }

  private initProgram(): void {
    const program = createProgram(this.gl, rzpGlassVertexShader, rzpGlassFragmentShader);
    if (!program) {
      throw new Error('RzpGlass: Failed to create WebGL program');
    }
    this.program = program;
  }

  private setupPositionAttribute(): void {
    const buffers = setupFullscreenQuad(this.gl, this.program!);
    if (!buffers) {
      throw new Error('RzpGlass: Failed to setup fullscreen quad');
    }
  }

  private setupUniformLocations(): void {
    const gl = this.gl;
    const program = this.program!;

    // All uniform names from the shader
    const uniformNames = [
      'uTime',
      'iResolution',
      'uDpr',
      'uVideoTexture',
      'uGradientMap',
      'uGradientMap2',
      'uGradientMapBlend',
      'uCenterGradientMap',
      'uEnableDisplacement',
      'uEnableColorama',
      'uEnableBloom',
      'uEnableLightSweep',
      'uInputMin',
      'uInputMax',
      'uModifyGamma',
      'uPosterizeLevels',
      'uCycleRepetitions',
      'uPhaseShift',
      'uCycleSpeed',
      'uWrapMode',
      'uReverse',
      'uBlendWithOriginal',
      'uLightIntensity',
      'uFrameCount',
      'uLightStartFrame',
      'uNumSegments',
      'uSlitAngle',
      'uDisplacementX',
      'uDisplacementY',
      'uEnableCenterElement',
      'uCenterAnimDuration',
      'uCenterAnimTime',
      'uCCBlackPoint',
      'uCCWhitePoint',
      'uCCMidtoneGamma',
      'uCCGamma',
      'uCCContrast',
      'uZoom',
      'uPan', // vec2(panX, panY) - set in vertex shader
      'uEdgeFeather',
      'uRefResolution',
      'uVisibleUvBounds', // vec4(minX, minY, maxX, maxY) - visible portion of canvas in UV space
      'uBackgroundColor', // vec3(r, g, b) - background color to blend with
      // Ripple wave
      'uEnableRippleWave',
      'uRippleSpeed',
      'uRippleBlend',
      'uRippleAngularPower',
      'uRippleRadialFalloff',
      'uRippleWaitTime',
    ];

    for (const name of uniformNames) {
      this.uniformLocations[name] = gl.getUniformLocation(program, name);
    }
  }

  private setupVideoTexture(): void {
    this.videoTexture = new Texture(this.gl, { textureUnit: 0 });

    // Use requestVideoFrameCallback for efficient video texture updates
    if (this.video && 'requestVideoFrameCallback' in this.video) {
      const updateVideoFrame = () => {
        if (this.hasBeenDisposed || !this.video || !this.videoTexture) return;

        this.videoTexture.update(this.video);

        this.videoFrameCallbackId = (this.video as any).requestVideoFrameCallback(updateVideoFrame);
      };
      this.videoFrameCallbackId = (this.video as any).requestVideoFrameCallback(updateVideoFrame);
    }
  }

  private setupImageTexture(
    uniformName: string,
    image: HTMLImageElement,
    textureUnit: number,
  ): void {
    const texture = new Texture(this.gl, { textureUnit });
    texture.image(image);

    if (uniformName === 'uVideoTexture') {
      this.videoTexture = texture;
    } else if (uniformName === 'uGradientMap') {
      this.gradientMapTexture = texture;
    } else if (uniformName === 'uGradientMap2') {
      this.gradientMap2Texture = texture;
    } else if (uniformName === 'uCenterGradientMap') {
      this.centerGradientMapTexture = texture;
    }
  }

  /**
   * Hot-swap the gradient map texture at runtime.
   * Accepts an HTMLCanvasElement (generated by generateGradientCanvas) or an HTMLImageElement.
   * No reinitialization required — the next frame will pick up the new texture.
   */
  public updateGradientMapTexture(source: HTMLCanvasElement | HTMLImageElement): void {
    if (!this.isInitialized || !this.gradientMapTexture) return;
    this.gradientMapTexture.image(source);
  }

  private setupResizeObserver(): void {
    this.resizeObserver = new ResizeObserver(([entry]) => {
      if (entry?.borderBoxSize[0]) {
        const physicalPixelSize = entry.devicePixelContentBoxSize?.[0];

        if (physicalPixelSize !== undefined) {
          this.devicePixelsSupported = true;
          this.parentDevicePixelWidth = physicalPixelSize.inlineSize;
          this.parentDevicePixelHeight = physicalPixelSize.blockSize;
        }

        this.parentWidth = entry.borderBoxSize[0].inlineSize;
        this.parentHeight = entry.borderBoxSize[0].blockSize;
      }

      this.handleResize();
    });

    this.resizeObserver.observe(this.parentElement);
  }

  private handleVisualViewportChange = (): void => {
    // Restart resize observer to get fresh callback on zoom change
    this.resizeObserver?.disconnect();
    this.setupResizeObserver();
  };

  private handleResize = (): void => {
    // Container dimensions (use stored values or fallback to clientWidth/Height)
    const containerWidth = this.parentWidth || this.parentElement.clientWidth;
    const containerHeight = this.parentHeight || this.parentElement.clientHeight;
    const containerAspect = containerWidth / containerHeight;

    // "Cover" behavior: fill container while maintaining aspect ratio (crop overflow)
    let canvasWidth: number;
    let canvasHeight: number;

    const targetAspectRatio = this.config.aspectRatio;
    if (containerAspect > targetAspectRatio) {
      // Container is wider than target - fit to width, crop top/bottom
      canvasWidth = containerWidth;
      canvasHeight = containerWidth / targetAspectRatio;
    } else {
      // Container is taller than target - fit to height, crop left/right
      canvasHeight = containerHeight;
      canvasWidth = containerHeight * targetAspectRatio;
    }

    // Center the canvas (overflow will be hidden by parent)
    const offsetX = (containerWidth - canvasWidth) / 2;
    const offsetY = (containerHeight - canvasHeight) / 2;

    // Calculate visible UV bounds (where container clips the canvas)
    // When canvas overflows container, we need to know which portion is visible
    const visibleMinX = -offsetX / canvasWidth;
    const visibleMaxX = (containerWidth - offsetX) / canvasWidth;
    const visibleMinY = -offsetY / canvasHeight;
    const visibleMaxY = (containerHeight - offsetY) / canvasHeight;
    this.visibleUvBounds = [visibleMinX, visibleMinY, visibleMaxX, visibleMaxY];

    // Set display size (CSS pixels)
    this.canvasElement.style.width = `${canvasWidth}px`;
    this.canvasElement.style.height = `${canvasHeight}px`;
    this.canvasElement.style.left = `${offsetX}px`;
    this.canvasElement.style.top = `${offsetY}px`;

    // Calculate target pixel dimensions for rendering
    let targetPixelWidth = 0;
    let targetPixelHeight = 0;

    const dpr = Math.max(1, window.devicePixelRatio);
    const pinchZoom = visualViewport?.scale ?? 1;

    if (this.devicePixelsSupported) {
      // Use real pixel size if we know it, but maintain aspect ratio
      // Calculate the scale ratio from parent to canvas (for aspect ratio correction)
      const canvasToParentRatioX = canvasWidth / containerWidth;
      const canvasToParentRatioY = canvasHeight / containerHeight;

      const scaleToMeetMinPixelRatio = Math.max(1, this.minPixelRatio / dpr);
      // Apply aspect ratio correction to device pixel dimensions
      targetPixelWidth =
        this.parentDevicePixelWidth * canvasToParentRatioX * scaleToMeetMinPixelRatio * pinchZoom;
      targetPixelHeight =
        this.parentDevicePixelHeight * canvasToParentRatioY * scaleToMeetMinPixelRatio * pinchZoom;
    } else {
      // Approximate using devicePixelRatio
      let targetRenderScale = Math.max(dpr, this.minPixelRatio) * pinchZoom;

      if (this.isSafariBrowser) {
        // Safari reports physical devicePixelRatio, need to factor in zoom manually
        const zoomLevel = bestGuessBrowserZoom();
        targetRenderScale *= Math.max(1, zoomLevel);
      }

      targetPixelWidth = Math.round(canvasWidth) * targetRenderScale;
      targetPixelHeight = Math.round(canvasHeight) * targetRenderScale;
    }

    // Prevent total rendered pixels from exceeding maxPixelCount
    const maxPixelCountHeadroom =
      Math.sqrt(this.maxPixelCount) / Math.sqrt(targetPixelWidth * targetPixelHeight);
    const scaleToMeetMaxPixelCount = Math.min(1, maxPixelCountHeadroom);
    const newWidth = Math.round(targetPixelWidth * scaleToMeetMaxPixelCount);
    const newHeight = Math.round(targetPixelHeight * scaleToMeetMaxPixelCount);
    const newRenderScale = newWidth / Math.round(canvasWidth);

    if (
      this.canvasElement.width !== newWidth ||
      this.canvasElement.height !== newHeight ||
      this.renderScale !== newRenderScale
    ) {
      this.renderScale = newRenderScale;
      this.canvasElement.width = newWidth;
      this.canvasElement.height = newHeight;
      this.resolutionChanged = true;
      this.gl.viewport(0, 0, newWidth, newHeight);

      // Only render immediately when the loop isn't running — if it is,
      // resolutionChanged=true is enough and the next RAF picks it up.
      // Calling render() while the loop is active spawns a duplicate RAF chain.
      if (this.rafId === null) {
        this.render(performance.now());
      }
    }
  };

  private handleDocumentVisibilityChange = (): void => {
    if (document.hidden) {
      // Pause render loop when tab is hidden
      this.stopRenderLoop();
      this.video?.pause();
    } else {
      // Resume render loop when tab is visible
      this.startRenderLoop();
      // Only resume video if not paused
      if (!this.config.paused) {
        this.video?.play().catch(() => {});
      }
    }
  };

  private setAllUniforms(): void {
    const gl = this.gl;
    gl.useProgram(this.program);

    // Texture units
    gl.uniform1i(this.uniformLocations.uVideoTexture, 0);
    gl.uniform1i(this.uniformLocations.uGradientMap, 1);
    gl.uniform1i(this.uniformLocations.uCenterGradientMap, 2);
    gl.uniform1i(this.uniformLocations.uGradientMap2, 3);
    gl.uniform1f(this.uniformLocations.uGradientMapBlend, this.currentGradientMapBlend);

    // Set all config-based uniforms
    this.setUniformValues(this.config);

    // Explicitly set pan uniform (vertex shader uniform)
    gl.uniform2f(this.uniformLocations.uPan, this.config.panX, this.config.panY);

    // Reference resolution (constant)
    gl.uniform2f(this.uniformLocations.uRefResolution, REF_RESOLUTION.width, REF_RESOLUTION.height);

    // Background color (or set to -1 if not provided)
    if (this.config.backgroundColor) {
      const [r, g, b] = this.config.backgroundColor;
      gl.uniform3f(this.uniformLocations.uBackgroundColor, r, g, b);
      // Also set clear color to match
      gl.clearColor(r, g, b, 1.0);
    } else {
      // Set to -1 to indicate no background color blending
      gl.uniform3f(this.uniformLocations.uBackgroundColor, -1.0, -1.0, -1.0);
      // Use transparent clear color
      gl.clearColor(0, 0, 0, 0);
    }

    // Visible UV bounds (where container clips the canvas)
    gl.uniform4f(
      this.uniformLocations.uVisibleUvBounds,
      this.visibleUvBounds[0],
      this.visibleUvBounds[1],
      this.visibleUvBounds[2],
      this.visibleUvBounds[3],
    );
  }

  /** Check if uniform values are equal (handles arrays) */
  private areUniformValuesEqual(a: unknown, b: unknown): boolean {
    if (a === b) return true;
    if (Array.isArray(a) && Array.isArray(b) && a.length === b.length) {
      return a.every((val, i) => this.areUniformValuesEqual(val, b[i]));
    }
    return false;
  }

  /** Set uniform values with caching to avoid redundant updates */
  private setUniformValues(config: Partial<RzpGlassConfig>): void {
    const gl = this.gl;
    gl.useProgram(this.program);

    Object.entries(config).forEach(([key, value]) => {
      if (value === undefined) return;

      // Check if value has changed
      if (this.areUniformValuesEqual(this.uniformCache[key], value)) return;
      this.uniformCache[key] = value;

      // Get uniform name from config key
      const uniformName = CONFIG_TO_UNIFORM[key];
      if (!uniformName) return; // Skip non-uniform config values

      const location = this.uniformLocations[uniformName];
      if (!location) return;

      if (typeof value === 'boolean') {
        gl.uniform1f(location, value ? 1 : 0);
      } else if (typeof value === 'number') {
        gl.uniform1f(location, value);
      } else if (Array.isArray(value)) {
        // Handle array uniforms (cast to number[] since config values are all numbers/booleans)
        const flatArray = (value as number[]).flat() as number[];
        switch (flatArray.length) {
          case 2:
            gl.uniform2fv(location, flatArray);
            break;
          case 3:
            gl.uniform3fv(location, flatArray);
            break;
          case 4:
            gl.uniform4fv(location, flatArray);
            break;
        }
      }
    });

    // Handle special pan uniform (vec2 in vertex shader)
    if (config.panX !== undefined || config.panY !== undefined) {
      const panCacheKey = 'pan';
      const panValue = [this.config.panX, this.config.panY];
      if (!this.areUniformValuesEqual(this.uniformCache[panCacheKey], panValue)) {
        this.uniformCache[panCacheKey] = panValue;
        gl.uniform2f(this.uniformLocations.uPan, panValue[0], panValue[1]);
      }
    }

    // Handle special backgroundColor uniform (vec3 in fragment shader)
    if (config.backgroundColor !== undefined) {
      const bgCacheKey = 'backgroundColor';
      if (!this.areUniformValuesEqual(this.uniformCache[bgCacheKey], config.backgroundColor)) {
        this.uniformCache[bgCacheKey] = config.backgroundColor;
        if (config.backgroundColor) {
          const [r, g, b] = config.backgroundColor;
          gl.uniform3f(this.uniformLocations.uBackgroundColor, r, g, b);
          // Also update clear color to match
          gl.clearColor(r, g, b, 1.0);
        } else {
          // Set to -1 to indicate no background color blending
          gl.uniform3f(this.uniformLocations.uBackgroundColor, -1.0, -1.0, -1.0);
          // Use transparent clear color
          gl.clearColor(0, 0, 0, 0);
        }
      }
    }
  }

  /**
   * Update uniforms from config (partial update supported)
   */
  public setUniforms(newConfig: Partial<RzpGlassConfig>): void {
    this.config = { ...this.config, ...newConfig };

    if (!this.isInitialized) return;

    // Use the new caching-based uniform setter
    this.setUniformValues(newConfig);

    // Handle paused state changes - control video play/pause
    if (newConfig.paused !== undefined) {
      if (newConfig.paused) {
        this.video?.pause();
      } else {
        this.video?.play().catch(() => {});
      }
    }

    if (newConfig.playbackRate !== undefined && this.video) {
      this.video.playbackRate = newConfig.playbackRate;
    }

    if (newConfig.aspectRatio !== undefined) {
      this.handleResize();
    }
  }

  private startRenderLoop(): void {
    if (this.rafId !== null) return; // Already running
    this.lastRenderTime = performance.now() * 0.001; // Initialize in seconds
    this.rafId = requestAnimationFrame(this.render);
  }

  private stopRenderLoop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private render = (currentTime: number): void => {
    if (this.hasBeenDisposed) return;

    // ALWAYS schedule next frame first (like the original loop)
    this.rafId = requestAnimationFrame(this.render);

    if (this.program === null) {
      console.warn('Tried to render before program was initialized');
      return;
    }

    const gl = this.gl;
    const video = this.video;

    // Calculate delta time in seconds (framerate independent)
    const currentTimeSeconds = currentTime * 0.001; // Convert ms to seconds
    const deltaTime = currentTimeSeconds - this.lastRenderTime;
    this.lastRenderTime = currentTimeSeconds;
    this.currentFrame++; // Increment frame count every frame

    const usingStaticImage = !video && this.videoTexture !== null;

    // Skip rendering if video isn't ready — do NOT clear the canvas here so the
    // last rendered frame stays visible instead of flashing transparent/black.
    // This prevents flickering during video native loop boundary frames.
    if (!usingStaticImage) {
      if (!video || video.readyState < video.HAVE_CURRENT_DATA) {
        return;
      }

      // Update video texture (fallback for browsers without requestVideoFrameCallback)
      if (!('requestVideoFrameCallback' in video) && this.videoTexture) {
        this.videoTexture.update(video);
      }

      // Handle video looping within start/end time range (only when not paused)
      if (!this.config.paused) {
        if (video.currentTime < this.config.startTime || video.currentTime >= this.config.endTime) {
          video.currentTime = this.config.startTime;
        }
      }
    }

    // Clear canvas now that we know we have data to draw.
    // Doing this after the readyState guard means we keep the last frame
    // during any brief gaps (e.g. native video loop boundary).
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Animation time: driven by video position for video mode, real elapsed time for static image
    const videoAnimTime = usingStaticImage
      ? currentTimeSeconds
      : video!.currentTime - this.config.startTime;

    // Update center animation time (always accumulate real time for smooth animation)
    if (this.config.animateLightIndependently || usingStaticImage) {
      this.independentLightTime += deltaTime;
    } else {
      const videoTimeDelta = videoAnimTime - this.lastVideoTime;
      const isVideoJump = Math.abs(videoTimeDelta) > 0.1 || videoTimeDelta < -0.01;

      if (isVideoJump) {
        this.independentLightTime = videoAnimTime;
      } else {
        this.independentLightTime += deltaTime;
      }
    }
    this.lastVideoTime = videoAnimTime;

    // Use program and set per-frame uniforms
    gl.useProgram(this.program);

    // Time uniforms
    gl.uniform1f(this.uniformLocations.uTime, currentTimeSeconds);
    // When animateLightIndependently is true, use real elapsed time for frame count
    // so light effects aren't tied to video playback
    const frameCount = this.config.animateLightIndependently
      ? this.independentLightTime * 30 // Use independent time (in seconds * 30fps)
      : videoAnimTime * 30; // Use video time (in seconds * 30fps)
    gl.uniform1f(this.uniformLocations.uFrameCount, frameCount);
    gl.uniform1f(this.uniformLocations.uCenterAnimTime, this.independentLightTime);

    // Resolution uniforms (only when changed)
    if (this.resolutionChanged) {
      gl.uniform2f(
        this.uniformLocations.iResolution,
        this.canvasElement.width,
        this.canvasElement.height,
      );
      gl.uniform1f(this.uniformLocations.uDpr, this.renderScale);
      // Update visible UV bounds (where container clips the canvas)
      gl.uniform4f(
        this.uniformLocations.uVisibleUvBounds,
        this.visibleUvBounds[0],
        this.visibleUvBounds[1],
        this.visibleUvBounds[2],
        this.visibleUvBounds[3],
      );
      this.resolutionChanged = false;
    }

    // Animate cycleRepetitions if enabled
    if (
      this.config.animateCycleReps &&
      this.currentFrame > this.config.cycleRepetitionsStartFrame
    ) {
      const elapsed = this.currentFrame - this.config.cycleRepetitionsStartFrame;
      const cycleProgress =
        (elapsed % (this.config.cycleRepetitionsDuration * 2)) /
        this.config.cycleRepetitionsDuration;
      const pingPong = cycleProgress <= 1 ? cycleProgress : 2 - cycleProgress;
      const eased = pingPong * pingPong * (3 - 2 * pingPong); // smoothstep
      const delta = this.config.cycleRepetitionsEnd - this.config.cycleRepetitionsStart;
      gl.uniform1f(
        this.uniformLocations.uCycleRepetitions,
        this.config.cycleRepetitionsStart + eased * delta,
      );
    } else {
      gl.uniform1f(this.uniformLocations.uCycleRepetitions, this.config.cycleRepetitions);
    }

    // Animate gradientMapBlend smoothly towards target
    const targetBlend = this.config.gradientMapBlend;
    if (this.currentGradientMapBlend !== targetBlend) {
      const speed = 1.0 / this.config.gradientMapBlendDuration;
      const diff = targetBlend - this.currentGradientMapBlend;
      const step = Math.sign(diff) * Math.min(Math.abs(diff), speed * deltaTime);
      this.currentGradientMapBlend += step;
      gl.uniform1f(this.uniformLocations.uGradientMapBlend, this.currentGradientMapBlend);
    }

    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  // ===== Public API (paper-shader style) =====

  /** Get the current animation frame (in ms) */
  public getCurrentFrame(): number {
    return this.currentFrame;
  }

  /** Set a specific frame for deterministic results */
  public setFrame(newFrame: number): void {
    this.currentFrame = newFrame;
  }

  /** Set the maximum pixel count for performance tuning */
  public setMaxPixelCount(newMaxPixelCount: number = DEFAULT_MAX_PIXEL_COUNT): void {
    this.maxPixelCount = newMaxPixelCount;
    this.handleResize();
  }

  /** Set the minimum pixel ratio for quality tuning */
  public setMinPixelRatio(newMinPixelRatio: number = 2): void {
    this.minPixelRatio = newMinPixelRatio;
    this.handleResize();
  }

  /** Play video */
  public play(): void {
    this.config.paused = false;
    this.video?.play().catch(() => {});
  }

  /** Pause video */
  public pause(): void {
    this.config.paused = true;
    this.video?.pause();
  }

  /** Seek to specific time in video */
  public setTime(time: number): void {
    if (this.video) {
      this.video.currentTime = time;
    }
  }

  private handlePerformanceLevelChange = (level: PerformanceLevel): void => {
    if (level === 0) {
      this.stopRenderLoop();
      this.canvasElement.style.display = 'none';
      return;
    }

    const { maxPixelCount, minPixelRatio } = LEVEL_RENDER_SETTINGS[level];
    this.maxPixelCount = maxPixelCount;
    this.minPixelRatio = minPixelRatio;

    // Restore canvas + render loop if they were previously hidden/stopped
    if (this.canvasElement.style.display === 'none') {
      this.canvasElement.style.display = '';
    }
    if (this.isInitialized) {
      this.startRenderLoop();
    }

    this.handleResize();
  };

  /** Clean up all WebGL resources */
  public dispose(): void {
    // Immediately mark as disposed to prevent future renders
    this.hasBeenDisposed = true;

    // Cancel any pending RAF
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    // Cancel video frame callback
    if (
      this.videoFrameCallbackId !== null &&
      this.video &&
      'cancelVideoFrameCallback' in this.video
    ) {
      (this.video as any).cancelVideoFrameCallback(this.videoFrameCallbackId);
    }

    // Pause and remove video
    if (this.video) {
      this.video.pause();
      this.video.src = '';
      this.video.load();
      this.video = null;
    }

    // Clean up WebGL resources
    if (this.gl && this.program) {
      this.videoTexture?.destroy();
      this.gradientMapTexture?.destroy();
      this.gradientMap2Texture?.destroy();
      this.centerGradientMapTexture?.destroy();
      this.gl.deleteProgram(this.program);
      this.program = null;

      // Reset WebGL state
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
      this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

      // Clear any errors
      this.gl.getError();
    }

    // Clean up performance controller
    this.performanceController?.dispose();
    this.performanceController = null;

    // Clean up observers and listeners
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    visualViewport?.removeEventListener('resize', this.handleVisualViewportChange);
    document.removeEventListener('visibilitychange', this.handleDocumentVisibilityChange);

    this.uniformLocations = {};
    this.uniformCache = {};

    // Remove canvas
    this.canvasElement.remove();
    this.parentElement.removeAttribute('data-rzp-glass');
  }
}

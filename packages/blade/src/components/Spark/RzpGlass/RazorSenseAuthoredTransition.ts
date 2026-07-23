import type { RazorSenseOperationalMode } from './modes';
import { createProgram, setupFullscreenQuad, Texture } from './webgl-utils';
import type { FullscreenQuadBuffers } from './webgl-utils';

const vertexShader = `
precision highp float;

attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

varying vec2 vUv;

uniform sampler2D uFromTexture;
uniform sampler2D uToTexture;
uniform float uProgress;
uniform float uProfile;

float smootherstep(float value) {
  float t = clamp(value, 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

vec2 transformedUv(vec2 uv, vec2 scale, vec2 translation) {
  return clamp((uv - 0.5 - translation) / scale + 0.5, 0.0, 1.0);
}

float directionalBlend(vec2 uv, float progress, float profile) {
  float flute = fract((uv.x * 13.0 - uv.y * 7.0) * 1.7);
  float spatialPosition = 0.5
    + (uv.x - 0.5) * 0.14
    + (0.5 - uv.y) * 0.42
    + (flute - 0.5) * 0.055;
  if (profile > 1.5 && profile < 2.5) spatialPosition = 1.0 - spatialPosition;
  return smoothstep(spatialPosition - 0.045, spatialPosition + 0.045, progress);
}

void main() {
  float spatialProfile = clamp(
    step(0.5, uProfile) * (1.0 - step(2.5, uProfile)) + step(3.5, uProfile),
    0.0,
    1.0
  );
  float spatialProgress = smootherstep((uProgress - 0.18) / 0.82);
  float progress = mix(smootherstep(uProgress), spatialProgress, spatialProfile);
  vec2 fromUv = vUv;
  vec2 toUv = vUv;

  // The launch-film aura grows from roughly 44% to 100% viewport width while
  // moving from the message plane to the bottom stage. The inverse profile
  // makes the same path reversible without an opacity reset.
  if (uProfile > 0.5 && uProfile < 1.5) {
    fromUv = transformedUv(
      vUv,
      mix(vec2(1.0), vec2(2.25, 1.32), progress),
      mix(vec2(0.0), vec2(0.05, -0.39), progress)
    );
    toUv = transformedUv(
      vUv,
      mix(vec2(0.44, 0.76), vec2(1.0), progress),
      mix(vec2(-0.05, 0.39), vec2(0.0), progress)
    );
  } else if (uProfile > 1.5 && uProfile < 2.5) {
    fromUv = transformedUv(
      vUv,
      mix(vec2(1.0), vec2(0.44, 0.76), progress),
      mix(vec2(0.0), vec2(-0.05, 0.39), progress)
    );
    toUv = transformedUv(
      vUv,
      mix(vec2(2.25, 1.32), vec2(1.0), progress),
      mix(vec2(0.05, -0.39), vec2(0.0), progress)
    );
  } else if (uProfile > 2.5 && uProfile < 3.5) {
    fromUv = transformedUv(
      vUv,
      mix(vec2(1.0), vec2(0.085, 0.11), progress),
      vec2(0.0)
    );
  } else if (uProfile > 3.5 && uProfile < 4.5) {
    toUv = transformedUv(
      vUv,
      mix(vec2(0.085, 0.11), vec2(1.0), progress),
      vec2(0.0)
    );
  } else {
    // Other operational states use a restrained aperture push rather than
    // exposing two complete flute fields at once.
    fromUv = transformedUv(vUv, mix(vec2(1.0), vec2(1.045), progress), vec2(0.0));
    toUv = transformedUv(vUv, mix(vec2(0.955), vec2(1.0), progress), vec2(0.0));
  }

  vec4 fromColor = texture2D(uFromTexture, fromUv);
  vec4 toColor = texture2D(uToTexture, toUv);
  float blend = directionalBlend(vUv, progress, uProfile);
  vec3 targetBackground = texture2D(uToTexture, vec2(0.97, 0.97)).rgb;
  float targetMaterial = smoothstep(0.012, 0.12, distance(toColor.rgb, targetBackground));
  float backgroundCleanup = smootherstep((progress - 0.72) / 0.28);
  blend *= max(targetMaterial, backgroundCleanup);

  if (uProgress <= 0.0) blend = 0.0;
  if (uProgress >= 1.0) blend = 1.0;
  gl_FragColor = mix(fromColor, toColor, blend);
}
`;

type RazorSenseAuthoredTransitionProfile =
  | 'material-aperture'
  | 'thinking-to-typing'
  | 'typing-to-thinking'
  | 'field-to-loader'
  | 'loader-to-field';

type RazorSenseAuthoredTransitionOptions = {
  from: HTMLCanvasElement;
  to: HTMLCanvasElement;
  fromMode: RazorSenseOperationalMode;
  toMode: RazorSenseOperationalMode;
  durationMs: number;
  onBeforeFrame?: () => void;
  isPaused?: () => boolean;
  onComplete: () => void;
};

const getTransitionProfile = (
  fromMode: RazorSenseOperationalMode,
  toMode: RazorSenseOperationalMode,
): RazorSenseAuthoredTransitionProfile => {
  if (fromMode === 'thinking' && toMode === 'typing') return 'thinking-to-typing';
  if (fromMode === 'typing' && toMode === 'thinking') return 'typing-to-thinking';
  if (fromMode === 'neutral' && toMode === 'loading') return 'field-to-loader';
  if (fromMode === 'loading' && toMode === 'neutral') return 'loader-to-field';
  return 'material-aperture';
};

const getProfileUniform = (profile: RazorSenseAuthoredTransitionProfile): number => {
  if (profile === 'thinking-to-typing') return 1;
  if (profile === 'typing-to-thinking') return 2;
  if (profile === 'field-to-loader') return 3;
  if (profile === 'loader-to-field') return 4;
  return 0;
};

class RazorSenseAuthoredTransitionRenderer {
  private readonly canvas: HTMLCanvasElement;
  private gl?: WebGLRenderingContext;
  private program?: WebGLProgram;
  private buffers?: FullscreenQuadBuffers;
  private fromTexture?: Texture;
  private toTexture?: Texture;
  private animationFrame?: number;
  private generation = 0;
  private presenting = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  isPresenting(): boolean {
    return this.presenting;
  }

  start(options: RazorSenseAuthoredTransitionOptions): boolean {
    try {
      this.stop();
      if (!this.ensureRenderer()) return false;

      const { gl, program, fromTexture, toTexture } = this;
      if (!gl || !program || !fromTexture || !toTexture) return false;

      const width = Math.max(1, options.from.width, options.to.width);
      const height = Math.max(1, options.from.height, options.to.height);
      if (this.canvas.width !== width || this.canvas.height !== height) {
        this.canvas.width = width;
        this.canvas.height = height;
      }

      fromTexture.image(options.from);
      toTexture.image(options.to);
    } catch {
      this.dispose();
      return false;
    }
    const { gl, program, fromTexture, toTexture } = this;
    if (!gl || !program || !fromTexture || !toTexture) return false;
    const profile = getTransitionProfile(options.fromMode, options.toMode);
    const profileLocation = gl.getUniformLocation(program, 'uProfile');
    const progressLocation = gl.getUniformLocation(program, 'uProgress');
    gl.useProgram(program);
    gl.uniform1f(profileLocation, getProfileUniform(profile));
    this.presenting = true;
    const generation = ++this.generation;
    const durationMs = Math.max(1, options.durationMs);
    let elapsedMs = 0;
    let previousFrameAt = performance.now();
    let hasDrawn = false;

    const draw = (now: number): void => {
      if (generation !== this.generation || !this.presenting) return;
      const isPaused = options.isPaused?.() ?? false;
      if (isPaused && hasDrawn) {
        previousFrameAt = now;
        this.animationFrame = window.requestAnimationFrame(draw);
        return;
      }
      if (!isPaused) elapsedMs += Math.max(0, now - previousFrameAt);
      previousFrameAt = now;
      const progress = Math.min(1, Math.max(0, elapsedMs / durationMs));
      if (!isPaused) {
        options.onBeforeFrame?.();
        fromTexture.update(options.from);
        toTexture.update(options.to);
      }
      gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      gl.useProgram(program);
      fromTexture.bind();
      toTexture.bind();
      gl.uniform1f(progressLocation, progress);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      hasDrawn = true;
      if (progress >= 1) {
        this.animationFrame = undefined;
        options.onComplete();
        return;
      }
      this.animationFrame = window.requestAnimationFrame(draw);
    };

    draw(previousFrameAt);
    return true;
  }

  copyFrameTo(target: HTMLCanvasElement): boolean {
    if (!this.presenting || this.canvas.width === 0 || this.canvas.height === 0) return false;
    if (target.width !== this.canvas.width || target.height !== this.canvas.height) {
      target.width = this.canvas.width;
      target.height = this.canvas.height;
    }
    const context = target.getContext('2d');
    if (!context) return false;
    context.clearRect(0, 0, target.width, target.height);
    context.drawImage(this.canvas, 0, 0);
    return true;
  }

  stop(): void {
    this.generation += 1;
    this.presenting = false;
    if (this.animationFrame !== undefined) {
      window.cancelAnimationFrame(this.animationFrame);
      this.animationFrame = undefined;
    }
  }

  dispose(): void {
    this.stop();
    this.fromTexture?.destroy();
    this.toTexture?.destroy();
    this.fromTexture = undefined;
    this.toTexture = undefined;
    if (this.gl && this.buffers) {
      this.gl.deleteBuffer(this.buffers.positionBuffer);
      this.gl.deleteBuffer(this.buffers.uvBuffer);
    }
    if (this.gl && this.program) this.gl.deleteProgram(this.program);
    this.buffers = undefined;
    this.program = undefined;
    this.gl = undefined;
  }

  private ensureRenderer(): boolean {
    if (this.gl && this.program && this.buffers && this.fromTexture && this.toTexture) return true;
    const gl = this.canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    });
    if (!gl) return false;
    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return false;
    gl.useProgram(program);
    const buffers = setupFullscreenQuad(gl, program);
    if (!buffers) {
      gl.deleteProgram(program);
      return false;
    }
    const fromTexture = new Texture(gl, {
      textureUnit: 0,
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
    });
    const toTexture = new Texture(gl, {
      textureUnit: 1,
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
    });
    gl.uniform1i(gl.getUniformLocation(program, 'uFromTexture'), 0);
    gl.uniform1i(gl.getUniformLocation(program, 'uToTexture'), 1);
    this.gl = gl;
    this.program = program;
    this.buffers = buffers;
    this.fromTexture = fromTexture;
    this.toTexture = toTexture;
    return true;
  }
}

export { RazorSenseAuthoredTransitionRenderer, getTransitionProfile };
export type { RazorSenseAuthoredTransitionOptions, RazorSenseAuthoredTransitionProfile };

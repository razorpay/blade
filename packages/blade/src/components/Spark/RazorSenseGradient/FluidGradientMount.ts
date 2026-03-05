/**
 * FluidGradientMount
 *
 * Vanilla class that owns the full WebGL lifecycle for the fluid gradient effect.
 * Modelled after RzpGlassMount — create it with a parent element, call setOrigin()
 * to update the gradient origin reactively, and dispose() to clean up.
 */

import { createProgram, setupFullscreenQuad } from '../RzpGlass/webgl-utils';
import { fragmentShader, FLUID_GRADIENT_LOOP } from './shader';
import type { FullscreenQuadBuffers } from '../RzpGlass/webgl-utils';

const vertexShader = /* glsl */ `
  precision mediump float;
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0, 1);
  }
`;

export class FluidGradientMount {
  public readonly canvasElement: HTMLCanvasElement;

  private readonly parentElement: HTMLElement;
  private readonly gl: WebGLRenderingContext | null = null;

  private program: WebGLProgram | null = null;
  private buffers: FullscreenQuadBuffers | null = null;
  private rafId: number | null = null;

  // Uniform locations
  private uTimeLoc: WebGLUniformLocation | null = null;
  private uOriginLoc: WebGLUniformLocation | null = null;

  private hasBeenDisposed = false;

  constructor(parentElement: HTMLElement, size: number, origin: [number, number] = [0.5, 0.5]) {
    this.parentElement = parentElement;

    const dpr = Math.min(window.devicePixelRatio, 2);
    const pixelSize = Math.round(size * dpr);

    this.canvasElement = document.createElement('canvas');
    this.canvasElement.width = pixelSize;
    this.canvasElement.height = pixelSize;
    this.canvasElement.style.display = 'block';
    this.canvasElement.style.width = `${size}px`;
    this.canvasElement.style.height = `${size}px`;
    parentElement.appendChild(this.canvasElement);

    const gl = this.canvasElement.getContext('webgl', {
      antialias: false,
      powerPreference: 'high-performance',
      alpha: true,
    });

    if (!gl) {
      console.error('FluidGradientMount: WebGL not supported');
      return;
    }

    this.gl = gl;
    this.setup(gl, pixelSize, origin);
    this.rafId = requestAnimationFrame(this.render);
  }

  private setup(gl: WebGLRenderingContext, pixelSize: number, origin: [number, number]): void {
    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;
    this.program = program;

    const buffers = setupFullscreenQuad(gl, program);
    if (!buffers) {
      gl.deleteProgram(program);
      this.program = null;
      return;
    }
    this.buffers = buffers;

    gl.useProgram(program);
    gl.viewport(0, 0, pixelSize, pixelSize);
    gl.disable(gl.DEPTH_TEST);

    this.uTimeLoc = gl.getUniformLocation(program, 'uTime');
    this.uOriginLoc = gl.getUniformLocation(program, 'uOrigin');
    const iResolutionLoc = gl.getUniformLocation(program, 'iResolution');

    gl.uniform2f(iResolutionLoc, pixelSize, pixelSize);
    gl.uniform2f(this.uOriginLoc, origin[0], origin[1]);
  }

  private render = (t: number): void => {
    if (this.hasBeenDisposed || !this.gl) return;
    this.rafId = requestAnimationFrame(this.render);
    this.gl.uniform1f(this.uTimeLoc, (t * 0.001) % FLUID_GRADIENT_LOOP);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  };

  /** Update the gradient origin in UV space without re-initialising WebGL. */
  public setOrigin(origin: [number, number]): void {
    if (!this.gl || !this.uOriginLoc) return;
    this.gl.uniform2f(this.uOriginLoc, origin[0], origin[1]);
  }

  /** Tear down the render loop, release all WebGL resources, and remove the canvas. */
  public dispose(): void {
    this.hasBeenDisposed = true;

    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    if (this.gl) {
      if (this.program) {
        this.gl.deleteProgram(this.program);
        this.program = null;
      }
      if (this.buffers) {
        this.gl.deleteBuffer(this.buffers.positionBuffer);
        this.gl.deleteBuffer(this.buffers.uvBuffer);
        this.buffers = null;
      }
      this.gl.getExtension('WEBGL_lose_context')?.loseContext();
    }

    if (this.parentElement.contains(this.canvasElement)) {
      this.parentElement.removeChild(this.canvasElement);
    }
  }
}

/**
 * WebGL utility functions for shader compilation, program creation,
 * geometry setup, and texture handling.
 */

// Fullscreen quad vertices (two triangles covering clip space -1 to 1)
// prettier-ignore
const FULLSCREEN_QUAD_POSITIONS = new Float32Array([
  -1, -1,  // bottom-left
   1, -1,  // bottom-right
  -1,  1,  // top-left
  -1,  1,  // top-left
   1, -1,  // bottom-right
   1,  1,  // top-right
]);

// Standard UV coordinates for fullscreen quad
// prettier-ignore
const FULLSCREEN_QUAD_UVS = new Float32Array([
  0, 0,  // bottom-left
  1, 0,  // bottom-right
  0, 1,  // top-left
  0, 1,  // top-left
  1, 0,  // bottom-right
  1, 1,  // top-right
]);

/**
 * Creates and compiles a WebGL shader
 */
function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

/**
 * Creates a WebGL program from vertex and fragment shaders
 */
function createProgram(
  gl: WebGLRenderingContext,
  vertexSource: string,
  fragmentSource: string,
): WebGLProgram | null {
  // Check shader precision and upgrade if needed
  const format = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT);
  const precision = format ? format.precision : null;

  // MEDIUM_FLOAT precision can be 10, 16 or 23 bits depending on device
  // Shaders fail on 10 bit => we force 23-bit by switching to highp
  if (precision && precision < 23) {
    vertexSource = vertexSource.replace(
      /precision\s+(lowp|mediump)\s+float;/g,
      'precision highp float;',
    );
    fragmentSource = fragmentSource
      .replace(/precision\s+(lowp|mediump)\s+float/g, 'precision highp float')
      .replace(/\b(uniform|varying|attribute)\s+(lowp|mediump)\s+(\w+)/g, '$1 highp $3');
  }

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

  if (!vertexShader || !fragmentShader) return null;

  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program linking error:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return null;
  }

  // Clean up shaders after successful linking
  gl.detachShader(program, vertexShader);
  gl.detachShader(program, fragmentShader);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  return program;
}

type FullscreenQuadBuffers = {
  positionBuffer: WebGLBuffer;
  uvBuffer: WebGLBuffer;
};

/**
 * Sets up a fullscreen quad with position and UV attributes.
 * This is the standard geometry for post-processing shaders.
 *
 * @param gl - WebGL rendering context
 * @param program - WebGL program to get attribute locations from
 * @param positionAttr - Name of position attribute (default: 'position')
 * @param uvAttr - Name of UV attribute (default: 'uv')
 * @returns The created buffers for cleanup, or null if setup failed
 */
function setupFullscreenQuad(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  positionAttr = 'position',
  uvAttr = 'uv',
): FullscreenQuadBuffers | null {
  // Position attribute
  const positionLocation = gl.getAttribLocation(program, positionAttr);
  const positionBuffer = gl.createBuffer();
  if (!positionBuffer) return null;

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, FULLSCREEN_QUAD_POSITIONS, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  // UV attribute
  const uvLocation = gl.getAttribLocation(program, uvAttr);
  const uvBuffer = gl.createBuffer();
  if (!uvBuffer) return null;

  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, FULLSCREEN_QUAD_UVS, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(uvLocation);
  gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 0, 0);

  return { positionBuffer, uvBuffer };
}

type TextureOptions = {
  minFilter?: number;
  magFilter?: number;
  wrapS?: number;
  wrapT?: number;
};

/**
 * OGL-style Texture class for WebGL texture management.
 * Supports images, videos, and canvas elements as sources.
 *
 * @see https://github.com/oframe/ogl/blob/master/src/core/Texture.js
 */
type TextureParams = {
  textureUnit?: number;
  minFilter?: number;
  magFilter?: number;
  wrapS?: number;
  wrapT?: number;
  flipY?: boolean;
};

type TextureSource = HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | null;

class Texture {
  public gl: WebGLRenderingContext;
  public texture: WebGLTexture | null;
  public textureUnit: number;

  private minFilter: number;
  private magFilter: number;
  private wrapS: number;
  private wrapT: number;
  private flipY: boolean;

  constructor(gl: WebGLRenderingContext, params: TextureParams = {}) {
    this.gl = gl;
    this.textureUnit = params.textureUnit ?? 0;
    this.minFilter = params.minFilter ?? gl.NEAREST;
    this.magFilter = params.magFilter ?? gl.NEAREST;
    this.wrapS = params.wrapS ?? gl.CLAMP_TO_EDGE;
    this.wrapT = params.wrapT ?? gl.CLAMP_TO_EDGE;
    this.flipY = params.flipY ?? true;

    this.texture = gl.createTexture();
    this.bind();
    this.setParameters();
  }

  bind(): void {
    const { gl } = this;
    gl.activeTexture(gl.TEXTURE0 + this.textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
  }

  private setParameters(): void {
    const { gl } = this;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.minFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.magFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.wrapS);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.wrapT);
  }

  /**
   * Upload image data to the texture (OGL-style)
   */
  image(source: TextureSource): void {
    const { gl } = this;
    if (!source) return;

    this.bind();

    if (this.flipY) {
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    }

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
  }

  /**
   * Update texture from video frame (call each frame for video textures)
   */
  update(source: TextureSource): void {
    this.image(source);
  }

  destroy(): void {
    this.gl.deleteTexture(this.texture);
    this.texture = null;
  }
}

export { createShader, createProgram, setupFullscreenQuad, Texture };

export type { FullscreenQuadBuffers, TextureOptions, TextureParams };

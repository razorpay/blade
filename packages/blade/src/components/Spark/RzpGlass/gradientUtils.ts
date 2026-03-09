/**
 * Gradient Map Utilities
 *
 * Generates 1D gradient map textures from color stops using Canvas 2D API.
 * The resulting canvas can be passed directly to WebGL as a texture source,
 * replacing the static JPEG gradient map.
 */

export type GradientStop = {
  /** CSS color string (hex, rgb, hsl, etc.) */
  color: string;
  /** Position in the gradient: 0 = left (dark), 1 = right (bright) */
  position: number;
};

export const DEFAULT_GRADIENT_STOPS: GradientStop[] = [
  { color: '#8a8fa8', position: 0 },
  { color: '#1535cc', position: 0.2 },
  { color: '#2255ff', position: 0.35 },
  { color: '#55bbff', position: 0.5 },
  { color: '#88ffcc', position: 0.63 },
  { color: '#ddfff4', position: 0.78 },
  { color: '#ffffff', position: 1 },
];

/**
 * Generates a horizontal linear gradient on a canvas from the given color stops.
 * The canvas is 512×1 px — a 1D lookup texture for the colorama shader.
 *
 * WebGL reads this left-to-right: position 0 = dark input, position 1 = bright input.
 */
export function generateGradientCanvas(
  stops: GradientStop[],
  width = 512,
  height = 1,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const sorted = [...stops].sort((a, b) => a.position - b.position);

  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  for (const stop of sorted) {
    gradient.addColorStop(Math.min(1, Math.max(0, stop.position)), stop.color);
  }

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  return canvas;
}

/**
 * Renders a preview of the gradient into a given canvas element (for display).
 * Unlike generateGradientCanvas which is a 1×N texture, this renders to
 * whatever size the canvas already is.
 */
export function renderGradientPreview(canvas: HTMLCanvasElement, stops: GradientStop[]): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { width, height } = canvas;
  const sorted = [...stops].sort((a, b) => a.position - b.position);
  const gradient = ctx.createLinearGradient(0, 0, width, 0);

  for (const stop of sorted) {
    gradient.addColorStop(Math.min(1, Math.max(0, stop.position)), stop.color);
  }

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

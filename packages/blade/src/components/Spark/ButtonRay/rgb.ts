/**
 * A CSS colour as [r, g, b] (0-255), as the wash mixes it. The tint is a theme token a consumer can set to any CSS colour, and the
 * label's computed colour can come back in any form, so this never gives NaN: hex (3, 4, 6 or 8 digits), rgb() and hsl() are read
 * here, and anything else (a named colour, oklch(), color(), ...) is read back from what the browser paints for it.
 */

const HEX = /^#([\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i;
const RGB = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)\s*[,/)]/i;
const HSL = /^hsla?\(\s*([\d.]+)(?:deg)?[\s,]+([\d.]+)%[\s,]+([\d.]+)%\s*[,/)]/i;

const channel = (v: number): number => Math.min(255, Math.max(0, Math.round(v)));

const fromHsl = (h: number, s: number, l: number): number[] => {
  const a = s * Math.min(l, 1 - l);
  const f = (k: number): number => {
    const m = (k + h / 30) % 12;
    return channel(255 * (l - a * Math.max(-1, Math.min(m - 3, 9 - m, 1))));
  };
  return [f(0), f(8), f(4)];
};

/** a one-pixel canvas the browser paints a colour into (made the first time one isn't read here; null where there's no 2D canvas) */
let probe: CanvasRenderingContext2D | null | undefined;
/** the colour as the browser paints it: black if it isn't a colour, or there's nothing to paint it with */
const painted = (c: string): number[] => {
  if (probe === undefined) {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    probe = canvas.getContext('2d', { willReadFrequently: true });
  }
  if (!probe) return [0, 0, 0];
  probe.clearRect(0, 0, 1, 1);
  // a value that isn't a colour leaves the fill as it was
  probe.fillStyle = '#000';
  probe.fillStyle = c;
  probe.fillRect(0, 0, 1, 1);
  const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
  return [r, g, b];
};

const rgb = (c: string): number[] => {
  const s = c.trim();
  const hex = HEX.exec(s)?.[1];
  if (hex) {
    const full = hex.length < 6 ? [...hex].map((d) => d + d).join('') : hex;
    return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
  }
  const n = RGB.exec(s);
  if (n) return [n[1], n[2], n[3]].map((v) => channel(Number(v)));
  const h = HSL.exec(s);
  if (h) return fromHsl(Number(h[1]), Number(h[2]) / 100, Number(h[3]) / 100);
  return painted(s);
};

export { rgb };

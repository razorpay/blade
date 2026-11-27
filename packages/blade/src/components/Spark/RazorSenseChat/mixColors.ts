// A colour mix for the thinking label's shine, small enough to keep tinycolor2 (about 5KB gzipped) out of every chat page.
// Blade's colour tokens are `hsla()` strings; `rgb()`/`rgba()` and `#rgb`/`#rrggbb` (a custom theme's) are read too.

type Rgba = [number, number, number, number];

/** a colour's red, green and blue (0 to 255) and alpha (0 to 1), or null for a colour it can't read */
const toRgba = (color: string): Rgba | null => {
  const c = color.trim().toLowerCase();
  if (c.startsWith('#')) {
    const hex = c.length === 4 ? [...c.slice(1)].map((d) => d + d).join('') : c.slice(1);
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
    return /^[\da-f]{6}$/.test(hex) ? [r, g, b, 1] : null;
  }
  const [x = NaN, y = NaN, z = NaN, alpha = 1] = (c.match(/-?[\d.]+/g) ?? []).map(Number);
  if ([x, y, z, alpha].some(Number.isNaN)) return null;
  if (c.startsWith('rgb')) return [x, y, z, alpha];
  if (!c.startsWith('hsl')) return null;
  // hsl to rgb, as CSS Color 4 defines it
  const [s, l] = [y / 100, z / 100];
  const at = (n: number): number => {
    const k = (n + x / 30) % 12;
    return 255 * (l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k - 3, 9 - k, 1)));
  };
  return [at(0), at(8), at(4), alpha];
};

/** `from` mixed with `to` by `percent` (0 is `from`, 100 is `to`), as an `rgba()` string; `from` as it is if either can't be read */
const mixColors = (from: string, to: string, percent: number): string => {
  const [a, b] = [toRgba(from), toRgba(to)];
  if (!a || !b) return from;
  const [r, g, bl, alpha] = a.map((v, i) => v + (b[i] - v) * (percent / 100));
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(bl)}, ${Number(alpha.toFixed(3))})`;
};

export { mixColors };

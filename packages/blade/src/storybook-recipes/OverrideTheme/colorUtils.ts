import tinycolor from 'tinycolor2';

const BLACK = '#000000';
const WHITE = '#ffffff';

export function darken(color: string, scale: number) {
  return tinycolor(color)
    .darken(scale * 100)
    .toHslString();
}

export function lighten(color: string, scale: number) {
  return tinycolor(color)
    .lighten(scale * 100)
    .toHslString();
}

export function shade(color: string, scale: number, referenceColor: string = BLACK) {
  return tinycolor.mix(color, referenceColor, scale * 100).toHslString();
}

export function tint(color: string, scale: number, referenceColor: string = WHITE) {
  return tinycolor.mix(color, referenceColor, scale * 100).toHslString();
}

export function readableColor(color: string) {
  const isReadable = tinycolor.isReadable(BLACK, color);
  if (!isReadable) {
    return WHITE;
  }
  return BLACK;
}

export function isRGB(string: string) {
  return /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/.test(string);
}

export function isRGBA(string: string) {
  return /^rgba\((\d{1,3}%?),\s*(\d{1,3}%?),\s*(\d{1,3}%?),\s*(\d*(?:\.\d+)?)\)$/.test(string);
}

export function isHex(string: string) {
  return /#([a-f0-9]{3}|[a-f0-9]{4}(?:[a-f0-9]{2}){0,2})\b/gi.test(string);
}

export function isHSL(string: string) {
  return /^hsl\(\s*(\d+)\s*,\s*(\d*(?:\.\d+)?%)\s*,\s*(\d*(?:\.\d+)?%)\)$/.test(string);
}

export function isHSLA(string: string) {
  return /^hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*(\d*(?:\.\d+)?)\)$/.test(string);
}

export function isRGBOrHSLOrHex(string: string) {
  return isRGB(string) || isRGBA(string) || isHSL(string) || isHSLA(string) || isHex(string);
}
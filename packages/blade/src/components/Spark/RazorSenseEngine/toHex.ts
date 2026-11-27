/**
 * A CSS colour as #rrggbb, as the engine takes its ground (the browser reads it: a token can be any CSS colour); null where there's
 * no canvas to ask (tests), or the colour isn't opaque.
 */
const toHex = (color: string): string | null => {
  const g =
    typeof document === 'undefined' ? null : document.createElement('canvas').getContext('2d');
  if (!g) return null;
  g.fillStyle = '#000000';
  g.fillStyle = color;
  return typeof g.fillStyle === 'string' && g.fillStyle.startsWith('#') ? g.fillStyle : null;
};

export { toHex };

import { spacings } from '../tokens';
import theme from '../tokens/theme';

const colorRange = [100, 200, 300, 400, 500, 600, 700, 800, 900];

const makePxValue = (value) => {
  const values = [].concat(value);
  return values.map((v) => (typeof v === 'string' ? v : `${v * spacings.unit}px`)).join(' ');
};

const getPxValue = (value) => `${value}px`;

const getColorKey = (color, shade) => `${color}.${shade}`;

const getColorKeys = () => {
  return Object.keys(theme.colors)
    .map((color) => colorRange.map((range) => getColorKey(color, range)))
    .reduce((acc, val) => [...acc, ...val]);
};

const getColor = (currentTheme, color) => {
  const [base, shade] = color.split('.');
  try {
    return currentTheme.colors[base][shade];
  } catch {
    throw new Error(`Invalid color prop\n\nValid color values:\n ${getColorKeys()}`);
  }
};

const getVariantColorKeys = () => Object.keys(theme.colors);

const getLineHeight = (currentTheme, size, lineHeight) =>
  parseFloat(currentTheme.fonts.lineHeight[lineHeight]) * parseFloat(currentTheme.fonts.size[size]);

export {
  makePxValue,
  getColorKey,
  getColorKeys,
  getColor,
  getVariantColorKeys,
  getLineHeight,
  getPxValue,
};

import { spacings } from '../tokens';
import theme from '../tokens/theme';

const makePxValue = (value) => {
  const values = [].concat(value);
  return values.map((v) => (typeof v === 'string' ? v : `${v * spacings.unit}px`)).join(' ');
};

const getColorKey = (color, shade) => `${color}.${shade}`;

const getColorKeys = () => {
  return Object.keys(theme.colors)
    .map((base) => {
      return Object.keys(theme.colors[base]).map((shade) => `${base}.${shade}`);
    })
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

export { makePxValue, getColorKey, getColorKeys, getColor, getVariantColorKeys, getLineHeight };

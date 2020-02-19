import { spacings } from '../tokens';
import theme from '../tokens/theme';

const makePxValue = (value) => {
  const values = [].concat(value);
  return values.map((v) => (typeof v === 'string' ? v : `${v * spacings.unit}px`)).join(' ');
};

// given a color and shade, returns a colorKey.
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

const getLineHeight = (currentTheme, textSize) => {
  switch (textSize) {
    case 'xxsmall':
      return currentTheme.fonts.lineHeight.xsmall;
    case 'xsmall':
      return currentTheme.fonts.lineHeight.small;
    case 'small':
      return currentTheme.fonts.lineHeight.small;
    case 'medium':
      return currentTheme.fonts.lineHeight.medium;
    case 'large':
    default:
      return currentTheme.fonts.lineHeight.large;
  }
};

export { getLineHeight };

export { makePxValue, getColorKey, getColorKeys, getColor, getVariantColorKeys };

import { spacings, colors } from '../tokens';
import theme from '../tokens/theme';

const makePxValue = (value) => {
  const values = [].concat(value);
  if (values.length > 4) {
    throw new Error('Error in makePxValue: array length should be less than or equal to 4');
  }
  return values.map((v) => (typeof v === 'string' ? v : `${v * spacings.unit}px`)).join(' ');
};

const getColorKeys = () => {
  return Object.keys(theme.bladeOld.colors)
    .map((base) => {
      return Object.keys(theme.bladeOld.colors[base]).map((shade) => `${base}.${shade}`);
    })
    .reduce((acc, val) => [...acc, ...val]);
};

const getColor = (currentTheme, color) => {
  const [base, shade] = color.split('.');
  try {
    return currentTheme.bladeOld.colors[base][shade];
  } catch {
    throw new Error(
      `Invalid color prop\n\nReceived color: ${color}\n\nValid color values:\n ${getColorKeys()}`,
    );
  }
};

const getVariantColorKeys = () => Object.keys(theme.bladeOld.colors);

const getLineHeight = (currentTheme, textSize) => {
  switch (textSize) {
    case 'xxsmall':
      return currentTheme.bladeOld.fonts.lineHeight.xsmall;
    case 'xsmall':
      return currentTheme.bladeOld.fonts.lineHeight.small;
    case 'small':
      return currentTheme.bladeOld.fonts.lineHeight.small;
    case 'medium':
      return currentTheme.bladeOld.fonts.lineHeight.medium;
    case 'xxxlarge':
      return currentTheme.bladeOld.fonts.lineHeight.xxlarge;
    case 'xxlarge':
      return currentTheme.bladeOld.fonts.lineHeight.xxlarge;
    case 'xlarge':
      return currentTheme.bladeOld.fonts.lineHeight.xlarge;
    case 'large':
    default:
      return currentTheme.bladeOld.fonts.lineHeight.large;
  }
};

const getThemeColors = () => {
  const getColors = (obj) => {
    return Object.keys(obj).reduce((themeColors, key) => {
      if (typeof obj[key] === 'object') {
        return themeColors.concat(getColors(obj[key]));
      } else themeColors.push(obj[key]);
      return themeColors;
    }, []);
  };
  return getColors(colors);
};

export { makePxValue, getColorKeys, getColor, getVariantColorKeys, getLineHeight, getThemeColors };

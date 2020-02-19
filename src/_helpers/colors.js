import theme from '../tokens/theme';

const colorRange = [100, 200, 300, 400, 500, 600, 700, 800, 900];

const getColorKeys = () => {
  return Object.keys(theme.colors)
    .map((color) => colorRange.map((range) => `${color}.${range}`))
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

export { getColorKeys, getColor };

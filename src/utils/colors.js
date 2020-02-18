import theme from '../tokens/theme';

const colorRange = [100, 200, 300, 400, 500, 600, 700, 800, 900];

const getAllColorNames = () => {
  return Object.keys(theme.colors)
    .map((color) => colorRange.map((range) => `${color}.${range}`))
    .reduce((acc, val) => [...acc, ...val]);
};

const resolveColorFromString = (currentTheme, colorString) => {
  const colorEntities = colorString.split('.');
  try {
    return currentTheme.colors[colorEntities[0]][colorEntities[1]];
  } catch {
    throw new Error(`Invalid color prop\n\nValid color values:\n ${getAllColorNames()}`);
  }
};

export { getAllColorNames, resolveColorFromString };

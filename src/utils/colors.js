import { flattenArray } from './index';
import theme from '../tokens/theme';

const colorRange = [100, 200, 300, 400, 500, 600, 700, 800, 900];

const getAllColorNames = () => {
  return flattenArray(
    flattenArray(Object.keys(theme.colors)).map((color) =>
      colorRange.map((range) => `${color}.${range}`),
    ),
  );
};

const resolveColorFromString = (currentTheme, colorString) => {
  const colorEntities = colorString.split('.');
  return currentTheme.colors[colorEntities[0]][colorEntities[1]];
};

export { getAllColorNames, resolveColorFromString };

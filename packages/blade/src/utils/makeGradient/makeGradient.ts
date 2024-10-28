import { Theme } from '~components/BladeProvider';
import getIn from '~utils/lodashButBetter/get';
import type { DotNotationToken } from '~utils/lodashButBetter/get';

type MakeGradientReturnType = (
  colors: Record<`${number}%`, DotNotationToken<Theme['colors']>>,
) => `linear-gradient(${string})`;

const makeGradient = (angle: `${number}deg`, theme: Theme): MakeGradientReturnType => {
  return (colors) => {
    return `linear-gradient(${angle}, ${Object.entries(colors)
      .map(([percentage, colorToken]) => `${getIn(theme.colors, colorToken)} ${percentage}`)
      .join(',')})`;
  };
};

export { makeGradient };

import { textColor } from './buttonTokens';
import type { Theme } from '~components/BladeProvider';
import type { DotNotationToken } from '~utils/lodashButBetter/get';

type ButtonColorTokenModifiers = {
  variant: 'primary' | 'secondary' | 'tertiary';
  state: 'default' | 'hover' | 'focus' | 'disabled';
  color?:
    | 'primary'
    | 'white'
    | 'positive'
    | 'negative'
    | 'notice'
    | 'information'
    | 'neutral'
    | 'transparent';
};

export const getTextColorToken = ({
  property,
  variant,
  state,
  color,
}: ButtonColorTokenModifiers & {
  property: 'icon' | 'text';
}): DotNotationToken<Theme['colors']> => {
  const tokens = textColor(property);
  const _state = state === 'focus' || state === 'hover' ? 'highlighted' : state;

  if (color === 'white') {
    return tokens.white[variant][_state];
  }

  if (color === 'transparent') {
    if (variant !== 'tertiary') {
      throw new Error(
        `Transparent color can only be used with tertiary variant but received "${variant}"`,
      );
    }
    return tokens.transparent.tertiary[_state];
  }

  if (color && color !== 'primary') {
    if (variant === 'tertiary') {
      throw new Error(
        `Tertiary variant can only be used with color: "primary" or "white" but received "${color}"`,
      );
    }
    return tokens.color(color)[variant][_state];
  }

  return tokens.base[variant][_state];
};

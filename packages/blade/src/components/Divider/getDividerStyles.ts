import type { CSSObject } from 'styled-components';
import type { DividerProps, StyledDividerProps } from './types';
import { makeSize } from '~utils/makeSize';
import type { ColorContrast } from '~tokens/theme/theme';
import type { Theme } from '~components/BladeProvider';

const makeStyledDividerProps = ({
  orientation = 'horizontal',
  style = 'solid',
  variant = 'normal',
  thickness = 'thin',
  contrast = 'low',
}: DividerProps): StyledDividerProps => ({
  orientation,
  type: style,
  variant,
  thickness,
  contrast,
});

const getDividerStyles = ({
  orientation,
  type,
  variant,
  thickness,
  contrast,
  theme,
}: StyledDividerProps & { theme: Theme }): CSSObject => {
  const borderPosition = orientation === 'horizontal' ? 'borderBottom' : 'borderLeft';
  const borderWidth =
    thickness === 'thinner' ? makeSize(0.5) : makeSize(theme.border.width[thickness]);
  const colorContrast: keyof ColorContrast = `${contrast}Contrast`;
  const dimension = orientation === 'vertical' ? { height: '100%' } : { width: '100%' };

  return {
    [`${borderPosition}Width`]: borderWidth,
    [`${borderPosition}Style`]: type,
    borderColor: theme.colors.surface.border[variant][colorContrast],
    ...dimension,
  };
};

export { getDividerStyles, makeStyledDividerProps };

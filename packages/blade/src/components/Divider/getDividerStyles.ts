import type { CSSObject } from 'styled-components';
import type { Theme } from '..';
import type { DividerProps } from './types';
import { makeSize } from '~utils';
import type { ColorContrast } from '~tokens/theme/theme';

const makeStyledDividerProps = ({
  orientation = 'horizontal',
  type = 'solid',
  variant = 'normal',
  thickness = 'thin',
  contrast = 'low',
}: DividerProps): Required<DividerProps> => ({ orientation, type, variant, thickness, contrast });

const getDividerStyles = ({
  orientation,
  type,
  variant,
  thickness,
  contrast,
  theme,
}: Required<DividerProps> & { theme: Theme }): CSSObject => {
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

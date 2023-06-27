import type { CSSObject } from 'styled-components';
import { makeSize } from '../../utils/makeSize';
import type { ColorContrast } from '../../tokens/theme/theme';
import type { DividerProps } from './types';
import type { Theme } from '~components/BladeProvider';

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

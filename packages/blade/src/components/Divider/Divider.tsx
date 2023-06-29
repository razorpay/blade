import React from 'react';
import type { DividerProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { useTheme } from '~components/BladeProvider';
import type { ColorContrast } from '~tokens/theme/theme';
import { makeSize } from '~utils';

const Divider = ({
  orientation = 'horizontal',
  style = 'solid',
  variant = 'normal',
  thickness = 'thin',
  contrast = 'low',
}: DividerProps): React.ReactElement => {
  const { theme } = useTheme();

  const borderPosition = orientation === 'horizontal' ? 'Bottom' : 'Left';
  const borderWidth =
    thickness === 'thinner' ? makeSize(0.5) : makeSize(theme.border.width[thickness]);
  const colorContrast: keyof ColorContrast = `${contrast}Contrast`;
  const dimension = orientation === 'vertical' ? { height: '100%' } : { width: '100%' };

  const borderColor = theme.colors.surface.border[variant][colorContrast];

  return (
    <BaseBox
      style={{
        border: 'none',
        [`border${borderPosition}Width`]: borderWidth,
        [`border${borderPosition}Style`]: style,
        [`border${borderPosition}Color`]: borderColor,
        ...dimension,
      }}
    />
  );
};

export { Divider };

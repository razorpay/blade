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

  const isDividerHorizontal = orientation === 'horizontal';
  const borderPosition = isDividerHorizontal ? 'borderBottom' : 'borderLeft';
  const size = isDividerHorizontal ? { width: '100%' } : { height: '100%' };

  const borderWidth =
    thickness === 'thinner' ? makeSize(0.5) : makeSize(theme.border.width[thickness]);

  const colorContrast: keyof ColorContrast = `${contrast}Contrast`;
  const borderColor = theme.colors.surface.border[variant][colorContrast];

  console.log(size, style);

  return (
    <BaseBox
      border="0"
      {...size}
      {...{ [`${borderPosition}Color`]: borderColor }}
      style={{ [`${borderPosition}Style`]: style, [`${borderPosition}Width`]: borderWidth }}
    />
  );
};

export { Divider };

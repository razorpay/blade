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

  const borderWidth =
    thickness === 'thinner' ? makeSize(0.5) : makeSize(theme.border.width[thickness]);

  const colorContrast: keyof ColorContrast = `${contrast}Contrast`;
  const borderColor = { [`${borderPosition}Color`]: `surface.border.${variant}.${colorContrast}` };

  const borderStyle = {
    [`${borderPosition}Style`]: style,
    [`${borderPosition}Width`]: borderWidth,
  };

  return (
    <BaseBox
      borderWidth="none"
      {...(isDividerHorizontal ? { flexGrow: 1 } : { alignSelf: 'stretch' })}
      {...borderColor}
      style={borderStyle}
    />
  );
};

export { Divider };

import React from 'react';
import styled from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import type { ColorContrast } from '~tokens/theme/theme';
import { makeBorderSize } from '~utils';

type DividerProps = {
  /**
   * Sets the orientation of divider
   *
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Sets the style of divider
   *
   * @default 'solid'
   */
  dividerStyle?: 'solid' | 'dashed';
  /**
   * Sets the variant of divider
   *
   * @default 'normal'
   */
  variant?: 'normal' | 'subtle';
  /**
   * Sets the thickness of divider
   *
   * @default 'thin'
   */
  thickness?: 'thinner' | 'thin' | 'thick';
  /**
   * Sets the contrast of divider
   *
   * @default 'low'
   */
  contrast?: 'low' | 'high';
};

const StyledDivider = styled(BaseBox)<{
  borderPosition: 'borderBottom' | 'borderLeft';
  dividerStyle: NonNullable<DividerProps['dividerStyle']>;
  thickness: NonNullable<DividerProps['thickness']>;
  isDividerHorizontal: boolean;
}>(({ theme, borderPosition, dividerStyle, thickness, isDividerHorizontal }) => ({
  [`${borderPosition}Style`]: dividerStyle,
  [`${borderPosition}Width`]: makeBorderSize(theme.border.width[thickness]),
  ...(isDividerHorizontal ? { flexGrow: 1 } : { alignSelf: 'stretch', minHeight: '100%' }),
}));

const Divider = ({
  orientation = 'horizontal',
  dividerStyle = 'solid',
  variant = 'normal',
  thickness = 'thin',
  contrast = 'low',
}: DividerProps): React.ReactElement => {
  const isDividerHorizontal = orientation === 'horizontal';
  const borderPosition = isDividerHorizontal ? 'borderBottom' : 'borderLeft';
  const colorContrast: keyof ColorContrast = `${contrast}Contrast`;
  const borderColor = { [`${borderPosition}Color`]: `surface.border.${variant}.${colorContrast}` };

  return (
    <StyledDivider
      borderWidth="none"
      borderPosition={borderPosition}
      isDividerHorizontal={isDividerHorizontal}
      dividerStyle={dividerStyle}
      thickness={thickness}
      {...borderColor}
    />
  );
};

export { Divider };
export type { DividerProps };

import React from 'react';
import type { CSSObject } from 'styled-components';
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
  /**
   * Sets the height of divider. Divider uses Flex by default, use height only when parent is not flex.
   *
   */
  height?: CSSObject['height'];
  /**
   * Sets the width of divider. Divider uses Flex by default, use width only when parent is not flex.
   *
   */
  width?: CSSObject['width'];
};

const StyledDivider = styled(BaseBox)<{
  borderPosition: 'borderBottom' | 'borderLeft';
  dividerStyle: NonNullable<DividerProps['dividerStyle']>;
  thickness: NonNullable<DividerProps['thickness']>;
  height: DividerProps['height'];
  width: DividerProps['width'];
  isDividerHorizontal: boolean;
}>(({ theme, borderPosition, dividerStyle, thickness, isDividerHorizontal, width, height }) => ({
  [`${borderPosition}Style`]: dividerStyle,
  [`${borderPosition}Width`]: makeBorderSize(theme.border.width[thickness]),
  ...(isDividerHorizontal ? { flexGrow: 1, width } : { alignSelf: 'stretch', height }),
}));

const Divider = ({
  orientation = 'horizontal',
  dividerStyle = 'solid',
  variant = 'normal',
  thickness = 'thin',
  contrast = 'low',
  height,
  width,
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
      height={height}
      width={width}
      {...borderColor}
    />
  );
};

export { Divider };
export type { DividerProps };

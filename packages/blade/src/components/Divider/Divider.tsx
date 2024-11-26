import React from 'react';
import type { CSSObject } from 'styled-components';
import styled from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { isReactNative, makeBorderSize } from '~utils';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import type { BladeElementRef, TestID } from '~utils/types';
import { makeAccessible } from '~utils/makeAccessible';

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
  variant?: 'normal' | 'subtle' | 'muted';
  /**
   * Sets the thickness of divider
   *
   * @default 'thin'
   */
  thickness?: 'thinner' | 'thin' | 'thick' | 'thicker';
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
} & TestID &
  StyledPropsBlade;

const StyledDivider = styled(BaseBox)<{
  borderPosition: 'borderBottom' | 'borderLeft';
  dividerStyle: NonNullable<DividerProps['dividerStyle']>;
  thickness: NonNullable<DividerProps['thickness']>;
  height: DividerProps['height'];
  width: DividerProps['width'];
  isDividerHorizontal: boolean;
}>(({ theme, borderPosition, dividerStyle, thickness, isDividerHorizontal, width, height }) => ({
  borderWidth: 0,
  [`${borderPosition}Style`]: dividerStyle,
  [`${borderPosition}Width`]: makeBorderSize(theme.border.width[thickness]),
  ...(isDividerHorizontal ? { flexGrow: 1, width } : { alignSelf: 'stretch', height }),
}));

const _Divider = (
  {
    orientation = 'horizontal',
    dividerStyle = 'solid',
    variant = 'muted',
    thickness = 'thin',
    height,
    width,
    testID,
    ...styledProps
  }: DividerProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
  const isDividerHorizontal = orientation === 'horizontal';
  const borderPosition = isDividerHorizontal ? 'borderBottom' : 'borderLeft';
  const borderColor = { [`${borderPosition}Color`]: `surface.border.gray.${variant}` };
  const accessibilityProps = isReactNative()
    ? {}
    : makeAccessible({
        role: 'separator',
      });

  return (
    <StyledDivider
      ref={ref as never}
      borderPosition={borderPosition}
      isDividerHorizontal={isDividerHorizontal}
      dividerStyle={dividerStyle}
      thickness={thickness}
      height={height}
      width={width}
      {...borderColor}
      {...metaAttribute({ name: MetaConstants.Divider, testID })}
      {...getStyledProps(styledProps)}
      {...accessibilityProps}
    />
  );
};

const Divider = React.forwardRef(_Divider);

export { Divider };
export type { DividerProps };

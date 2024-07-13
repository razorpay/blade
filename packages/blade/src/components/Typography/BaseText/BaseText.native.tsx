import React from 'react';
import type { ReactElement } from 'react';
import styled from 'styled-components/native';
import getBaseTextStyles from './getBaseTextStyles';
import type { BaseTextProps, StyledBaseTextProps } from './types';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps, useStyledProps } from '~components/Box/styledProps';
import { makeAccessible } from '~utils/makeAccessible';
import type { BladeElementRef } from '~utils/types';

const StyledBaseText = styled.Text<StyledBaseTextProps>(
  ({
    color,
    fontFamily,
    fontSize,
    fontWeight,
    fontStyle,
    textDecorationLine,
    numberOfLines,
    lineHeight,
    letterSpacing,
    textAlign,
    as,
    opacity,
    ...props
  }) => {
    const styledPropsCSSObject = useStyledProps(props);

    return {
      ...getBaseTextStyles({
        color,
        fontFamily,
        fontSize,
        fontWeight,
        fontStyle,
        textDecorationLine,
        numberOfLines,
        lineHeight,
        letterSpacing,
        textAlign,
        opacity,
        theme: props.theme,
      }),
      ...styledPropsCSSObject,
    };
  },
);

const _BaseText: React.ForwardRefRenderFunction<BladeElementRef, BaseTextProps> = (
  {
    id,
    color,
    fontFamily,
    fontSize,
    fontWeight,
    fontStyle,
    textDecorationLine,
    lineHeight,
    textAlign,
    children,
    truncateAfterLines,
    opacity,
    className,
    style,
    accessibilityProps = {},
    componentName = MetaConstants.BaseText,
    testID,
    ...styledProps
  },
  ref,
): ReactElement => {
  return (
    <StyledBaseText
      ref={ref}
      {...getStyledProps(styledProps)}
      color={color}
      fontFamily={fontFamily}
      fontSize={fontSize}
      fontWeight={fontWeight}
      fontStyle={fontStyle}
      textDecorationLine={textDecorationLine}
      lineHeight={lineHeight}
      as={undefined}
      textAlign={textAlign}
      numberOfLines={truncateAfterLines}
      opacity={opacity}
      className={className}
      style={style}
      id={id}
      {...makeAccessible(accessibilityProps)}
      {...metaAttribute({ name: componentName, testID })}
    >
      {children}
    </StyledBaseText>
  );
};

const BaseText = React.forwardRef(_BaseText);

export { BaseText };

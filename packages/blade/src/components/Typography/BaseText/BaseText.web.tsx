import React from 'react';
import type { ReactElement } from 'react';
import styled from 'styled-components';
import getBaseTextStyles from './getBaseTextStyles';
import type { BaseTextProps, StyledBaseTextProps } from './types';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps, useStyledProps } from '~components/Box/styledProps';
import { makeAccessible } from '~utils/makeAccessible';
import { omitPropsFromHTML } from '~utils/omitPropsFromHTML';
import type { BladeElementRef } from '~utils/types';

const StyledBaseText = styled.div.withConfig({
  shouldForwardProp: omitPropsFromHTML,
  displayName: 'StyledBaseText',
})<StyledBaseTextProps>(
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
    wordBreak,
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
        wordBreak,
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
    letterSpacing,
    as,
    textAlign,
    children,
    truncateAfterLines,
    wordBreak,
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
      ref={ref as never}
      {...getStyledProps(styledProps)}
      color={color}
      fontFamily={fontFamily}
      fontSize={fontSize}
      fontWeight={fontWeight}
      fontStyle={fontStyle}
      textDecorationLine={textDecorationLine}
      lineHeight={lineHeight}
      letterSpacing={letterSpacing}
      as={as}
      textAlign={textAlign}
      numberOfLines={truncateAfterLines}
      wordBreak={wordBreak}
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

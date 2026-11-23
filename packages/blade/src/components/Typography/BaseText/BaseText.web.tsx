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
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

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
    textTransform,
    textWrap,
    ...props
  }) => {
    const styledPropsCSSObject = useStyledProps(props);
    return {
      ...(textWrap ? { textWrap } : {}),
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
        textTransform,
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
    textWrap,
    children,
    truncateAfterLines,
    wordBreak,
    opacity,
    className,
    textTransform,
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
      textWrap={textWrap}
      numberOfLines={truncateAfterLines}
      wordBreak={wordBreak}
      opacity={opacity}
      className={className}
      style={style}
      id={id}
      textTransform={textTransform}
      {...makeAccessible(accessibilityProps)}
      {...metaAttribute({ name: componentName, testID })}
      {...makeAnalyticsAttribute(styledProps)}
    >
      {children}
    </StyledBaseText>
  );
};

const BaseText = React.forwardRef(_BaseText);
export { BaseText };

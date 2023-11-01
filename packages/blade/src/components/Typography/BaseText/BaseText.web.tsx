import React from 'react';
import type { ReactElement } from 'react';
import styled from 'styled-components';
import getBaseTextStyles from './getBaseTextStyles';
import type { BaseTextProps, StyledBaseTextProps } from './types';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps, useStyledProps } from '~components/Box/styledProps';
import { makeAccessible } from '~utils/makeAccessible';
import { omitPropsFromHTML } from '~utils/omitPropsFromHTML';

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
    textAlign,
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
        textAlign,
        theme: props.theme,
      }),
      ...styledPropsCSSObject,
    };
  },
);

export const BaseText = ({
  id,
  color,
  fontFamily,
  fontSize,
  fontWeight,
  fontStyle,
  textDecorationLine,
  lineHeight,
  as,
  textAlign,
  children,
  truncateAfterLines,
  className,
  style,
  accessibilityProps = {},
  componentName = MetaConstants.BaseText,
  testID,
  ...styledProps
}: BaseTextProps): ReactElement => {
  return (
    <StyledBaseText
      {...getStyledProps(styledProps)}
      color={color}
      fontFamily={fontFamily}
      fontSize={fontSize}
      fontWeight={fontWeight}
      fontStyle={fontStyle}
      textDecorationLine={textDecorationLine}
      lineHeight={lineHeight}
      as={as}
      textAlign={textAlign}
      numberOfLines={truncateAfterLines}
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

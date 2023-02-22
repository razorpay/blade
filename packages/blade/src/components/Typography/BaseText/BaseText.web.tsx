import type { ReactElement } from 'react';
import styled from 'styled-components';
import getBaseTextStyles from './getBaseTextStyles';
import type { BaseTextProps, StyledBaseTextProps } from './types';
import { metaAttribute, makeAccessible, MetaConstants, getStyledProps } from '~utils';
import BaseBox from '~components/Box/BaseBox';

const StyledBaseText = styled.div<StyledBaseTextProps>(
  ({
    color,
    fontFamily,
    fontSize,
    fontWeight,
    fontStyle,
    textDecorationLine,
    lineHeight,
    textAlign,
    ...props
  }) =>
    getBaseTextStyles({
      color,
      fontFamily,
      fontSize,
      fontWeight,
      fontStyle,
      textDecorationLine,
      lineHeight,
      textAlign,
      theme: props.theme,
    }),
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
  componentName,
  ...styledProps
}: BaseTextProps): ReactElement => {
  return (
    <BaseBox display={as === 'span' ? 'inline' : 'inline-block'} {...getStyledProps(styledProps)}>
      <StyledBaseText
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
        {...metaAttribute(MetaConstants.Component, componentName)}
      >
        {children}
      </StyledBaseText>
    </BaseBox>
  );
};

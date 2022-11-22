import type { ReactElement } from 'react';
import styled from 'styled-components';
import getBaseTextStyles from './getBaseTextStyles';
import type { BaseTextProps, StyledBaseTextProps } from './types';
import { metaAttribute, makeAccessible } from '~utils';

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
}: BaseTextProps): ReactElement => {
  return (
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
      {...metaAttribute('blade-component', componentName)}
    >
      {children}
    </StyledBaseText>
  );
};

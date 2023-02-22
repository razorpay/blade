import type { ReactElement } from 'react';
import styled from 'styled-components/native';
import getBaseTextStyles from './getBaseTextStyles';
import type { BaseTextProps, StyledBaseTextProps } from './types';
import { metaAttribute, makeAccessible, MetaConstants, getStyledProps } from '~utils';
import BaseBox from '~components/Box/BaseBox';

const StyledBaseText = styled.Text<StyledBaseTextProps>(
  ({
    color,
    fontFamily,
    fontSize,
    fontWeight,
    fontStyle,
    textDecorationLine,
    lineHeight,
    textAlign,
    as,
    ...props
  }) => {
    if (as) {
      throw new Error(`[Blade: BaseText]: "as" prop is not supported for BaseText on React Native`);
    } else {
      return getBaseTextStyles({
        color,
        fontFamily,
        fontSize,
        fontWeight,
        fontStyle,
        textDecorationLine,
        lineHeight,
        textAlign,
        theme: props.theme,
      });
    }
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
  componentName,
  ...styledProps
}: BaseTextProps): ReactElement => {
  return (
    <BaseBox {...getStyledProps(styledProps)}>
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
        {...metaAttribute(MetaConstants.Component, componentName!)}
      >
        {children}
      </StyledBaseText>
    </BaseBox>
  );
};

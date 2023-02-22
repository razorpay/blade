import React from 'react';
import type { ReactElement } from 'react';
import styled from 'styled-components';
import getBaseTextStyles from './getBaseTextStyles';
import type { BaseTextProps, StyledBaseTextProps } from './types';
import { metaAttribute, makeAccessible, MetaConstants, getStyledProps } from '~utils';
import { getBaseBoxStyles, getDependencyProps } from '~components/Box/BaseBox/getBaseBoxStyles';

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
  }) => {
    const styledPropsStyles = getStyledProps(props);
    const styledPropsMemoDependency = getDependencyProps(styledPropsStyles);
    const styledPropsCSSObject = React.useMemo(
      () => getBaseBoxStyles({ ...styledPropsStyles, theme: props.theme }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [styledPropsMemoDependency],
    );

    return {
      ...styledPropsCSSObject,
      ...getBaseTextStyles({
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
  componentName,
  ...styledProps
}: BaseTextProps): ReactElement => {
  return (
    <StyledBaseText
      {...styledProps}
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
  );
};

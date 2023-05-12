import type { ReactElement } from 'react';
import { useContext } from 'react';
import omit from 'lodash/omit';
import styled from 'styled-components/native';
import TextAncestor from './TextAncestor';
import getBaseTextStyles from './getBaseTextStyles';
import type { BaseTextProps, StyledBaseTextProps } from './types';
import { metaAttribute, makeAccessible } from '~utils';
import { useStyledProps } from '~components/Box/styledProps';

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
    const styledPropsCSSObject = useStyledProps(props);
    if (as) {
      throw new Error(`[Blade: BaseText]: "as" prop is not supported for BaseText on React Native`);
    } else {
      return {
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
        ...styledPropsCSSObject,
      };
    }
  },
);

export const BaseText = (baseTextProps: BaseTextProps): ReactElement => {
  const { value: hasTextAncestor, props: textAncestorProps } = useContext(TextAncestor);
  const props = { ...(textAncestorProps ?? {}), ...baseTextProps };
  const {
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
    testID,
    ...styledProps
  } = props;

  const styledBaseText = (
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
      {...metaAttribute({ name: componentName, testID })}
    >
      {children}
    </StyledBaseText>
  );

  if (!hasTextAncestor) {
    return (
      <TextAncestor.Provider
        value={{
          value: true,
          props: omit(props, ['id', 'testID', 'numberOfLines', 'truncateAfterLines', 'children']),
        }}
      >
        {styledBaseText}
      </TextAncestor.Provider>
    );
  }

  return styledBaseText;
};

import React from 'react';
import styled from 'styled-components';
import { BaseText } from '../BaseText';
import type { BaseTextProps, BaseTextSizes } from '../BaseText/types';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { getPlatformType } from '~utils';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import type { FontSize, Typography } from '~tokens/global';
import type { BladeElementRef, StringChildrenType, TestID } from '~utils/types';
import { makeSpace } from '~utils/makeSpace';
import { makeTypographySize } from '~utils/makeTypographySize';
import { throwBladeError } from '~utils/logger';

type CodeCommonProps = {
  /**
   * Sets the color of the Heading component.
   */
  children: StringChildrenType;
  /**
   * Decides the fontSize and padding of Code
   *
   * @default small
   */
  size?: Extract<BaseTextSizes, 'small' | 'medium'>;
  weight?: Extract<BaseTextProps['fontWeight'], 'regular' | 'bold'>;
  isHighlighted?: boolean;
  color?: BaseTextProps['color'];
} & TestID &
  StyledPropsBlade;

type CodeHighlightedProps = CodeCommonProps & {
  /**
   * Adds background color to highlight the text
   *
   * @default true
   */
  isHighlighted?: true;
  /**
   * color prop can only be added when `isHighlighted` is set to `false`
   */
  color?: undefined;
};

type CodeNonHighlightedProps = CodeCommonProps & {
  /**
   * Adds background color to highlight the text
   *
   * @default true
   */
  isHighlighted: false;
  /**
   * color prop to set color of text when `isHighlighted` is set to false
   */
  color?: BaseTextProps['color'];
};

export type CodeProps = CodeHighlightedProps | CodeNonHighlightedProps;

type CodeContainerProps = {
  size: CodeProps['size'];
  isHighlighted: CodeProps['isHighlighted'];
};

const platformType = getPlatformType();
const isPlatformWeb = platformType === 'browser' || platformType === 'node';

const getCodeFontSizeAndLineHeight = (
  size: CodeProps['size'],
): { fontSize: keyof FontSize; lineHeight: keyof Typography['lineHeights'] } | undefined => {
  switch (size) {
    case 'medium':
      return { fontSize: 75, lineHeight: 75 };
    case 'small':
      return { fontSize: 25, lineHeight: 25 };
    default:
      if (__DEV__) {
        throwBladeError({
          moduleName: 'Code',
          message: `Unexpected size: ${size}`,
        });
      }
      return undefined;
  }
};

const CodeContainer = styled(BaseBox)<CodeContainerProps>((props) => {
  const padding = `${makeSpace(props.theme.spacing[0])} ${makeSpace(props.theme.spacing[2])}`;
  return {
    padding,
    backgroundColor: props.isHighlighted
      ? props.theme.colors.feedback.background.neutral.subtle
      : undefined,
    borderRadius: props.theme.border.radius.medium,
    display: isPlatformWeb ? 'inline-block' : 'flex',
    alignSelf: isPlatformWeb ? undefined : 'center',
    verticalAlign: 'middle',
    lineHeight: makeTypographySize(props.theme.typography.lineHeights[0]),
  };
});

const getCodeColor = ({
  isHighlighted,
  color,
}: Pick<CodeProps, 'isHighlighted' | 'color'>): CodeProps['color'] => {
  if (isHighlighted) {
    if (__DEV__) {
      if (color) {
        throwBladeError({
          moduleName: 'Code',
          message: '`color` prop cannot be used without `isHighlighted={false}`',
        });
      }
    }

    return 'surface.text.gray.subtle';
  }

  if (color) {
    return color;
  }

  return 'surface.text.gray.normal';
};

const _Code = (
  {
    children,
    size = 'small',
    weight = 'regular',
    isHighlighted = true,
    color,
    testID,
    ...styledProps
  }: CodeProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
  const { fontSize, lineHeight } = getCodeFontSizeAndLineHeight(size)!;
  const codeTextColor = React.useMemo<CodeProps['color']>(
    () => getCodeColor({ isHighlighted, color }),
    [isHighlighted, color],
  );

  return (
    <CodeContainer
      ref={ref as never}
      size={size}
      isHighlighted={isHighlighted}
      as={isPlatformWeb ? 'span' : undefined}
      {...metaAttribute({ name: MetaConstants.Code, testID })}
      {...getStyledProps(styledProps)}
    >
      <BaseText
        color={codeTextColor}
        fontFamily="code"
        fontSize={fontSize}
        fontWeight={weight}
        as={isPlatformWeb ? 'code' : undefined}
        lineHeight={lineHeight}
      >
        {children}
      </BaseText>
    </CodeContainer>
  );
};

/**
 * Code component can be used for displaying token, variable names, or inlined code snippets.
 *
 * ## Usage
 *
 * ### In Web
 * In web, you can use it inside `Text` component or individually. The component is set to display `inline-block`
 *
 * ```tsx
 * <Text>
 *  Lorem ipsum <Code>SENTRY_TOKEN</Code> normal text
 * </Text>
 * ```
 *
 * ### In React Native
 *
 * In React Native, you would have to align it using flex to make sure the Code and the surrounding text is correctly aligned
 *
 * ```tsx
 *  <Box flexWrap="wrap" flexDirection="row" alignItems="flex-start">
 *   <Text>Lorem ipsum </Text>
 *   <Code>SENTRY_TOKEN</Code>
 *   <Text> normal text</Text>
 * </Box>
 * ```
 */
const Code = React.forwardRef(_Code);

export { Code };

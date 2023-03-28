import styled from 'styled-components';
import { BaseText } from '../BaseText';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import {
  metaAttribute,
  getPlatformType,
  makeSpace,
  makeTypographySize,
  MetaConstants,
} from '~utils';
import type { FontSize, Typography } from '~tokens/global/typography';
import type { StringChildrenType, TestID } from '~src/_helpers/types';

export type CodeProps = {
  children: StringChildrenType;
  /**
   * Decides the fontSize and padding of Code
   *
   * @default small
   */
  size?: 'small' | 'medium';
} & TestID &
  StyledPropsBlade;

type CodeContainerProps = {
  size: CodeProps['size'];
};

const platformType = getPlatformType();
const isPlatformWeb = platformType === 'browser' || platformType === 'node';

const getCodeFontSizeAndLineHeight = (
  size: CodeProps['size'],
): { fontSize: keyof FontSize; lineHeight: keyof Typography['lineHeights'] } => {
  switch (size) {
    case 'medium':
      return { fontSize: 75, lineHeight: 75 };
    default:
      return { fontSize: 25, lineHeight: 25 };
  }
};

const CodeContainer = styled(BaseBox)<CodeContainerProps>((props) => {
  const padding = `${makeSpace(props.theme.spacing[0])} ${makeSpace(props.theme.spacing[2])}`;
  return {
    padding,
    backgroundColor: props.theme.colors.brand.gray.a50.lowContrast,
    borderRadius: props.theme.border.radius.medium,
    display: isPlatformWeb ? 'inline-block' : undefined,
    // Removing the line height of container to remove extra surrounding space in background
    // The text itself will still have the normal lineHeight
    lineHeight: makeTypographySize(props.theme.typography.lineHeights[100]),
  };
});

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
 *  <BaseBox flexWrap="wrap" flexDirection="row" alignItems="flex-start">
 *   <Text>Lorem ipsum </Text>
 *   <Code>SENTRY_TOKEN</Code>
 *   <Text> normal text</Text>
 * </BaseBox>
 * ```
 */
const Code = ({ children, size = 'small', testID, ...styledProps }: CodeProps): JSX.Element => {
  const { fontSize, lineHeight } = getCodeFontSizeAndLineHeight(size);

  return (
    <CodeContainer
      size={size}
      as={isPlatformWeb ? 'span' : undefined}
      {...metaAttribute({ name: MetaConstants.Code, testID })}
      {...getStyledProps(styledProps)}
    >
      <BaseText
        color="surface.text.subtle.lowContrast"
        fontFamily="code"
        fontSize={fontSize}
        lineHeight={lineHeight}
        alignSelf="baseline"
        as={isPlatformWeb ? 'code' : undefined}
      >
        {children}
      </BaseText>
    </CodeContainer>
  );
};

export { Code };

import styled from 'styled-components';
import { BaseText } from '../BaseText';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import {
  metaAttribute,
  getPlatformType,
  makeSpace,
  MetaConstants,
  makeTypographySize,
} from '~utils';
import type { FontSize, Typography } from '~tokens/global';
import type { StringChildrenType, TestID } from '~src/_helpers/types';

export type CodeProps = {
  children: StringChildrenType;
  /**
   * Decides the fontSize and padding of Code
   *
   * @default small
   */
  size?: 'small' | 'medium';
  weight?: 'regular' | 'bold';
  /**
   * Adds code background to highlight the text
   *
   * @default true
   */
  isHighlighted?: boolean;
} & TestID &
  StyledPropsBlade;

type CodeContainerProps = {
  size: CodeProps['size'];
  isHighlighted: CodeProps['isHighlighted'];
};

const platformType = getPlatformType();
const isPlatformWeb = platformType === 'browser' || platformType === 'node';

const getCodeFontSizeAndLineHeight = (
  size: CodeProps['size'],
): { fontSize: keyof FontSize; lineHeight: keyof Typography['lineHeights'] } => {
  switch (size) {
    case 'medium':
      return { fontSize: 75, lineHeight: 75 };
    case 'small':
      return { fontSize: 25, lineHeight: 25 };
    default:
      throw new Error(`[Blade Code]: Unexpected size: ${size}`);
  }
};

const CodeContainer = styled(BaseBox)<CodeContainerProps>((props) => {
  const padding = `${makeSpace(props.theme.spacing[0])} ${makeSpace(props.theme.spacing[2])}`;
  return {
    padding,
    backgroundColor: props.isHighlighted
      ? props.theme.colors.brand.gray.a100.lowContrast
      : undefined,
    borderRadius: props.theme.border.radius.medium,
    display: isPlatformWeb ? 'inline-block' : 'flex',
    alignSelf: isPlatformWeb ? undefined : 'center',
    verticalAlign: 'middle',
    lineHeight: makeTypographySize(props.theme.typography.lineHeights[0]),
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
 *  <Box flexWrap="wrap" flexDirection="row" alignItems="flex-start">
 *   <Text>Lorem ipsum </Text>
 *   <Code>SENTRY_TOKEN</Code>
 *   <Text> normal text</Text>
 * </Box>
 * ```
 */

const Code = ({
  children,
  size = 'small',
  weight = 'regular',
  isHighlighted = true,
  testID,
  ...styledProps
}: CodeProps): JSX.Element => {
  const { fontSize, lineHeight } = getCodeFontSizeAndLineHeight(size);

  return (
    <CodeContainer
      size={size}
      isHighlighted={isHighlighted}
      as={isPlatformWeb ? 'span' : undefined}
      {...metaAttribute({ name: MetaConstants.Code, testID })}
      {...getStyledProps(styledProps)}
    >
      <BaseText
        color="surface.text.subtle.lowContrast"
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

export { Code };

import { default as React } from 'react';
import { BaseTextProps, BaseTextSizes } from '../BaseText/types';
import { StyledPropsBlade } from '../../Box/styledProps';
import { BladeElementRef, StringChildrenType, TestID } from '../../../utils/types';
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
    textTransform?: BaseTextProps['textTransform'];
    color?: BaseTextProps['color'];
} & TestID & StyledPropsBlade;
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
declare const Code: React.ForwardRefExoticComponent<CodeProps & React.RefAttributes<BladeElementRef>>;
export { Code };

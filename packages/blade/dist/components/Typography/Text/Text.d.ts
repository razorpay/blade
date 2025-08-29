import { default as React } from 'react';
import { BaseTextProps, BaseTextSizes } from '../BaseText/types';
import { StyledPropsBlade } from '../../Box/styledProps';
import { BladeElementRef, TestID } from '../../../utils/types';
declare const validAsValues: readonly ["p", "span", "div", "abbr", "figcaption", "cite", "q", "label"];
type TextCommonProps = {
    as?: typeof validAsValues[number];
    truncateAfterLines?: number;
    children: React.ReactNode;
    weight?: Extract<BaseTextProps['fontWeight'], 'regular' | 'medium' | 'semibold'>;
    /**
     * Overrides the color of the Text component.
     *
     * **Note** This takes priority over `type` and `contrast` prop to decide color of text
     */
    color?: BaseTextProps['color'];
    textAlign?: BaseTextProps['textAlign'];
    textTransform?: BaseTextProps['textTransform'];
    textDecorationLine?: BaseTextProps['textDecorationLine'];
    wordBreak?: BaseTextProps['wordBreak'];
} & TestID & StyledPropsBlade;
export type TextVariant = 'body' | 'caption';
type TextBodyVariant = TextCommonProps & {
    variant?: Extract<TextVariant, 'body'>;
    size?: Extract<BaseTextSizes, 'xsmall' | 'small' | 'medium' | 'large'>;
};
type TextCaptionVariant = TextCommonProps & {
    variant?: Extract<TextVariant, 'caption'>;
    size?: Extract<BaseTextSizes, 'small' | 'medium'>;
};
export type TextProps<T> = T extends {
    variant: infer Variant;
} ? Variant extends 'caption' ? TextCaptionVariant : Variant extends 'body' ? TextBodyVariant : T : T;
type GetTextPropsReturn = Omit<BaseTextProps, 'children'>;
type GetTextProps<T extends {
    variant: TextVariant;
}> = Pick<TextProps<T>, 'variant' | 'weight' | 'size' | 'color' | 'testID' | 'textAlign' | 'textDecorationLine' | 'textTransform'>;
declare const getTextProps: <T extends {
    variant: TextVariant;
}>({ variant, weight, size, color, testID, textAlign, textDecorationLine, }: GetTextProps<T>) => GetTextPropsReturn;
declare const Text: React.ForwardRefExoticComponent<(TextBodyVariant | TextCaptionVariant) & React.RefAttributes<BladeElementRef>>;
export { Text, getTextProps };

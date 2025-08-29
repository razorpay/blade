import { FontSize, Typography } from '../../tokens/global';
import { BaseTextProps } from '../Typography/BaseText/types';
type AmountSizes = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';
type AmountDisplayProps = {
    type?: 'display';
    size?: Extract<AmountSizes, 'small' | 'medium' | 'large' | 'xlarge'>;
    weight?: Extract<BaseTextProps['fontWeight'], 'regular' | 'medium' | 'semibold'>;
};
type AmountHeadingProps = {
    type?: 'heading';
    size?: Extract<AmountSizes, 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge'>;
    weight?: Extract<BaseTextProps['fontWeight'], 'regular' | 'semibold'>;
};
type AmountBodyProps = {
    type?: 'body';
    size?: Extract<AmountSizes, 'xsmall' | 'small' | 'medium' | 'large'>;
    weight?: Extract<BaseTextProps['fontWeight'], 'regular' | 'medium' | 'semibold'>;
};
type AmountTypeProps = AmountDisplayProps | AmountHeadingProps | AmountBodyProps;
declare const normalAmountSizes: Record<'body' | 'heading' | 'display', Partial<Record<NonNullable<AmountTypeProps['size']>, keyof FontSize>>>;
declare const subtleFontSizes: Record<'body' | 'heading' | 'display', Partial<Record<NonNullable<AmountTypeProps['size']>, keyof FontSize>>>;
declare const amountLineHeights: Record<'body' | 'heading' | 'display', Partial<Record<NonNullable<AmountTypeProps['size']>, keyof Typography['lineHeights']>>>;
export { subtleFontSizes, normalAmountSizes, amountLineHeights };
export type { AmountBodyProps, AmountDisplayProps, AmountHeadingProps, AmountTypeProps };

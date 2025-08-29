import { default as React } from 'react';
import { SpacingValueType } from '../Box/BaseBox';
import { DataAnalyticsAttribute } from '../../utils/types';
import { BoxProps } from '../Box';
type ModalBodyProps = {
    children: React.ReactNode;
    /**
     * Sets the padding equally on all sides. Only few `spacing` tokens are allowed deliberately
     * @default `spacing.6`
     *
     * **Links:**
     * - Docs: https://blade.razorpay.com/?path=/docs/tokens-spacing--docs
     */
    padding?: Extract<SpacingValueType, 'spacing.0' | 'spacing.6'>;
    height?: BoxProps['height'];
} & DataAnalyticsAttribute;
declare const ModalBody: ({ children, padding, height, ...rest }: ModalBodyProps) => React.ReactElement;
export { ModalBody };
export type { ModalBodyProps };

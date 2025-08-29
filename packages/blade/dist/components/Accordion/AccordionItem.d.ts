import { ReactElement, ReactNode } from 'react';
import { IconComponent } from '../Icons';
import { TestID, DataAnalyticsAttribute } from '../../utils/types';
type AccordionItemProps = {
    /**
     * Title text content
     *
     * @deprecated Use AccordionItemHeader and AccordionItemBody
     *
     * Checkout https://blade.razorpay.com/?path=/docs/components-accordion--docs for new API
     */
    title?: string;
    /**
     * Body text content
     *
     *  @deprecated Use AccordionItemHeader and AccordionItemBody
     *
     * Checkout https://blade.razorpay.com/?path=/docs/components-accordion--docs for new API
     */
    description?: string;
    /**
     * Renders a Blade icon as title prefix (requires `showNumberPrefix={false}`)
     *
     * @deprecated Use `leading={<StarIcon size="large" />}` on AccordionItemHeader instead
     *
     * Checkout https://blade.razorpay.com/?path=/docs/components-accordion--docs for new API
     */
    icon?: IconComponent;
    /**
     * Slot, renders any custom content
     */
    children?: ReactNode | ReactNode[];
    /**
     * Disabled state of the item
     *
     * @default false
     */
    isDisabled?: boolean;
    /**
     * **Internal:** used for determining numbering, you don't need to pass this,
     * instead pass `showNumberPrefix` to root `Accordion`
     */
    _index?: number;
} & TestID & DataAnalyticsAttribute;
declare const AccordionItem: ({ title, description, icon, children, isDisabled, _index, testID, ...rest }: AccordionItemProps) => ReactElement;
export type { AccordionItemProps };
export { AccordionItem };

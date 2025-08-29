import { AccordionProps } from './types';
type AccordionContextState = {
    expandedIndex?: number;
    defaultExpandedIndex?: number;
    onExpandChange: (expandedIndex: number) => void;
    showNumberPrefix: boolean;
    variant: AccordionProps['variant'];
    numberOfItems: number;
    size: NonNullable<AccordionProps['size']>;
};
type AccordionItemContextState = {
    index?: number;
    isDisabled?: boolean;
};
declare const AccordionContext: import('react').Context<AccordionContextState | null>;
declare const AccordionItemContext: import('react').Context<AccordionItemContextState>;
declare const useAccordion: () => AccordionContextState;
declare const useAccordionItemIndex: () => AccordionItemContextState;
export type { AccordionContextState };
export { AccordionContext, useAccordion, AccordionItemContext, useAccordionItemIndex };

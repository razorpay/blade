import { createContext, useContext } from 'react';
import type { AccordionVariantType } from './types';
import { throwBladeError } from '~utils/logger';

type AccordionContextState = {
  expandedIndex?: number;
  defaultExpandedIndex?: number;
  onExpandChange: (expandedIndex: number) => void;
  showNumberPrefix: boolean;
  variant?: AccordionVariantType;
  numberOfItems: number;
};

const AccordionContext = createContext<AccordionContextState | null>(null);

const useAccordion = (): AccordionContextState => {
  const accordionContext = useContext(AccordionContext);
  if (__DEV__) {
    if (!accordionContext) {
      throwBladeError({
        message: 'useAccordion should be only used within AccordionContext',
        moduleName: 'AccordionContext',
      });
    }
  }
  return accordionContext!;
};

export type { AccordionContextState };
export { AccordionContext, useAccordion };

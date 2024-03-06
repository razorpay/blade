import { createContext, useContext } from 'react';
import type { AccordionProps } from './types';
import { throwBladeError } from '~utils/logger';

type AccordionContextState = {
  expandedIndex?: number;
  defaultExpandedIndex?: number;
  onExpandChange: (expandedIndex: number) => void;
  showNumberPrefix: boolean;
  variant: AccordionProps['variant'];
  numberOfItems: number;
  size: AccordionProps['size'];
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

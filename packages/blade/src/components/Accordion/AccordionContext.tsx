import { createContext, useContext } from 'react';

type AccordionContextState = {
  expandedIndex?: number;
  defaultExpandedIndex?: number;
  onExpandChange: (expandedIndex: number) => void;
  showNumberPrefix: boolean;
};

const AccordionContext = createContext<AccordionContextState | null>(null);

const useAccordion = (): AccordionContextState => {
  const accordionContext = useContext(AccordionContext);
  if (!accordionContext) {
    throw new Error(
      `[Blade: AccordionContext]: useAccordion should be only used within AccordionContext`,
    );
  }
  return accordionContext;
};

export { AccordionContext, useAccordion, AccordionContextState };

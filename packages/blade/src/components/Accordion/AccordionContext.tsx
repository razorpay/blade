import { createContext, useContext } from 'react';

type AccordionContextState = {
  expandedIndex?: number;
};

const AccordionContext = createContext<AccordionContextState>({
  expandedIndex: undefined,
});

const useAccordionContext = (): AccordionContextState => useContext(AccordionContext);

export { AccordionContext, useAccordionContext, AccordionContextState };

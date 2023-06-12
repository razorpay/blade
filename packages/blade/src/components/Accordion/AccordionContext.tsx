import { createContext, useContext } from 'react';

type AccordionContextState = {
  expandedIndex?: number;
  onExpandChange: (expandedIndex: number) => void;
  showNumberPrefix: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

const AccordionContext = createContext<AccordionContextState>({
  expandedIndex: undefined,
  onExpandChange: noop,
  showNumberPrefix: false,
});

const useAccordion = (): AccordionContextState => useContext(AccordionContext);

export { AccordionContext, useAccordion, AccordionContextState };

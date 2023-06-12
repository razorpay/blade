import type { Dispatch, SetStateAction } from 'react';
import { createContext, useContext } from 'react';

type AccordionContextState = {
  expandedIndex?: number;
  setExpandedIndex: Dispatch<SetStateAction<number | undefined>>;
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

const AccordionContext = createContext<AccordionContextState>({
  expandedIndex: undefined,
  setExpandedIndex: noop,
});

const useAccordion = (): AccordionContextState => useContext(AccordionContext);

export { AccordionContext, useAccordion, AccordionContextState };

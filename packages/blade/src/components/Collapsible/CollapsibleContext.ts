import type { Dispatch, SetStateAction } from 'react';
import { createContext, useContext } from 'react';

type CollapsibleContextState = {
  isExpanded: boolean;
  defaultIsExpanded: boolean;
  setIsExpanded: Dispatch<SetStateAction<boolean>>;
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

const CollapsibleContext = createContext<CollapsibleContextState>({
  isExpanded: false,
  defaultIsExpanded: false,
  setIsExpanded: noop,
});

const useCollapsibleContext = (): CollapsibleContextState => useContext(CollapsibleContext);

export { CollapsibleContext, useCollapsibleContext, CollapsibleContextState };

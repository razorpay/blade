import type { Dispatch, SetStateAction } from 'react';
import { createContext, useContext } from 'react';
import type { CollapsibleProps } from './Collapsible';

type CollapsibleContextState = {
  isExpanded: boolean;
  defaultIsExpanded: boolean;
  setIsExpanded: Dispatch<SetStateAction<boolean>>;
  direction: CollapsibleProps['direction'];
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

const CollapsibleContext = createContext<CollapsibleContextState>({
  isExpanded: false,
  defaultIsExpanded: false,
  setIsExpanded: noop,
  direction: 'bottom',
});

const useCollapsibleContext = (): CollapsibleContextState => useContext(CollapsibleContext);

export { CollapsibleContext, useCollapsibleContext, CollapsibleContextState };

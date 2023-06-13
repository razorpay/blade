import { createContext, useContext } from 'react';
import type { CollapsibleProps } from './Collapsible';

type CollapsibleContextState = {
  isExpanded: boolean;
  defaultIsExpanded: boolean;
  onExpandChange: (isExpanded: boolean) => void;
  direction: CollapsibleProps['direction'];
  collapsibleBodyId: string;
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

const CollapsibleContext = createContext<CollapsibleContextState>({
  isExpanded: false,
  defaultIsExpanded: false,
  onExpandChange: noop,
  direction: 'bottom',
  collapsibleBodyId: '',
});

const useCollapsible = (): CollapsibleContextState => useContext(CollapsibleContext);

export { CollapsibleContext, useCollapsible, CollapsibleContextState };

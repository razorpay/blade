import { createContext, useContext } from 'react';
import type { CollapsibleProps } from './Collapsible';

type CollapsibleContextState = {
  isExpanded: boolean;
  defaultIsExpanded: boolean;
  onExpandChange: (isExpanded: boolean) => void;
  direction: CollapsibleProps['direction'];
  collapsibleBodyId: string;
};

const CollapsibleContext = createContext<CollapsibleContextState | null>(null);

const useCollapsible = (): CollapsibleContextState => {
  const collapsibleContext = useContext(CollapsibleContext);
  if (__DEV__) {
    if (!collapsibleContext) {
      throw new Error(
        `[Blade: CollapsibleContext]: You're trying to use Collapsible sub-components without Collapsible. useCollapsible should only be used within CollapsibleContext`,
      );
    }
  }
  return collapsibleContext!;
};

export { CollapsibleContext, useCollapsible, CollapsibleContextState };

import { CollapsibleProps } from './Collapsible';
type CollapsibleContextState = {
    isExpanded: boolean;
    defaultIsExpanded: boolean;
    onExpandChange: (isExpanded: boolean) => void;
    direction: CollapsibleProps['direction'];
    collapsibleBodyId: string;
};
declare const CollapsibleContext: import('react').Context<CollapsibleContextState | null>;
declare const useCollapsible: () => CollapsibleContextState;
export type { CollapsibleContextState };
export { CollapsibleContext, useCollapsible };

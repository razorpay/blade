import { getContext, setContext } from 'svelte';

const CARD_GROUP_CONTEXT_KEY = Symbol('card-group-context');
const CARD_GROUP_BODY_CONTEXT_KEY = Symbol('card-group-body-context');

export type CardGroupContextType = {
  isInsideCardGroup: true;
};

export function setCardGroupContext(getter: () => CardGroupContextType): void {
  setContext(CARD_GROUP_CONTEXT_KEY, getter);
}

export function getCardGroupContext(): CardGroupContextType | undefined {
  const getter = getContext<(() => CardGroupContextType) | undefined>(CARD_GROUP_CONTEXT_KEY);
  return getter?.();
}

/**
 * Marks the subtree rendered inside a `CardGroupCollapsibleItemBody`. A
 * `CardGroupItem` inside the body reads this to know it is content, not the
 * disclosure trigger — otherwise it would hijack the parent Collapsible's
 * expand/collapse behaviour.
 */
export function setInsideCardGroupBody(): void {
  setContext(CARD_GROUP_BODY_CONTEXT_KEY, true);
}

export function isInsideCardGroupBody(): boolean {
  return getContext<boolean | undefined>(CARD_GROUP_BODY_CONTEXT_KEY) === true;
}

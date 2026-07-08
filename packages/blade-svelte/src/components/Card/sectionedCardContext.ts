import { setContext, getContext } from 'svelte';
import type { Snippet } from 'svelte';

export const TICKET_CARD_CONTEXT_KEY = 'blade-ticket-card-context';
export const INFO_CARD_CONTEXT_KEY = 'blade-info-card-context';

export type SectionedCardRegistrarContext = {
  setBody: (content: Snippet) => void;
  setFooter: (content: Snippet) => void;
};

export function setSectionedCardContext(
  key: string,
  contextValue: SectionedCardRegistrarContext,
): void {
  setContext(key, contextValue);
}

export function getSectionedCardContext(
  key: string,
): SectionedCardRegistrarContext | undefined {
  return getContext<SectionedCardRegistrarContext | undefined>(key);
}

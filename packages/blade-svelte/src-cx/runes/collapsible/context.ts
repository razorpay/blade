import { defineContext } from '../context';

/** What a Collapsible offers the parts inside it: its chevron reads it. */
export interface CollapsibleContext {
  readonly isExpanded: boolean;
  readonly direction: 'bottom' | 'top';
}

const COLLAPSIBLE = defineContext<CollapsibleContext>('blade-collapsible');

export function provideCollapsible(collapsible: CollapsibleContext): void {
  COLLAPSIBLE.set(collapsible);
}

export function getCollapsible(): CollapsibleContext | undefined {
  return COLLAPSIBLE.get();
}

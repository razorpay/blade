import { defineContext } from '../context';
import type { ChoiceEntry } from '../base/choice-list.svelte';
import type { EntryHost } from '../base/ordered-entries.svelte';

/** One TabItem, as the tabs know it: a choice whose element is the tab. */
export type TabEntry = ChoiceEntry<string>;

/**
 * What Tabs offers its TabItems and TabPanels. `Shared` is the library's
 * own payload — the class parts — and the rune only passes it through.
 */
export interface TabsContext<Shared>
  extends Pick<EntryHost<TabEntry>, 'register' | 'reorder'> {
  readonly shared: Shared;
  /** The picked tab's value: the host's, else the first enabled tab's. Tracked. */
  readonly value: string | undefined;
  /** The tab that holds the tablist's one tab stop. Tracked. */
  isTabStop(value: string): boolean;
  /** A user pick: a press, or focus arriving with automatic activation. */
  select(value: string): void;
  /** Arrows, Home and End from this tab to another enabled one. */
  moveFocus(entry: TabEntry, event: KeyboardEvent): void;
  /** Focus landed on a tab. */
  focused(entry: TabEntry): void;
  tabId(value: string): string;
  panelId(value: string): string;
  /** Panels mount only while picked. */
  readonly isLazy: boolean;
}

const TABS = defineContext<unknown>('blade-tabs');

export function provideTabs<Shared>(tabs: TabsContext<Shared>): void {
  TABS.set(tabs);
}

export function getTabs<Shared>(): TabsContext<Shared> | undefined {
  return TABS.get() as TabsContext<Shared> | undefined;
}

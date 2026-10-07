import { onDestroy } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import { registerEntry } from '../base/ordered-entries.svelte';
import type { ActiveBy, PopupEntry } from './popup-list.svelte';

/** What a row needs from the list around it: Menu's and Dropdown's contexts both offer it. */
export interface PopupListHost<E extends PopupEntry> {
  register(entry: E): () => void;
  reorder(): void;
  pick(entry: E): void;
  hover(entry: E): void;
  activeBy(entry: E): ActiveBy | undefined;
}

export interface PopupItemOptions<Extra = Record<never, never>> {
  /** Fields of the owner's own entry type (a dropdown row's `value`). */
  extra?: Extra;
  /** The row's element id. */
  id: string;
  isDisabled: () => boolean;
  /** What typeahead and a search match; the row's text when absent. */
  text: () => string | undefined;
  isHidden?: () => boolean;
  /** The row was picked. */
  onPick: () => void;
}

export interface PopupItem<E extends PopupEntry> {
  readonly entry: E;
  /** `keyboard` or `pointer` while the row is the active one: its `data-active`. */
  readonly activeBy: ActiveBy | undefined;
  handleClick(): void;
  handlePointerMove(): void;
  /** Keeps focus where it is (the list, a search input) as the row is pressed. */
  handlePointerDown(event: PointerEvent): void;
  /** On the row: how the list orders it. */
  readonly attach: Attachment<HTMLElement>;
}

/**
 * One row of a popup list. Call during component initialisation, with the
 * host from the list's context. It registers with the list — the rows mount
 * while the list is open — and the list reads it back in document order.
 * Without a host the row still draws, inert.
 */
export function createPopupItem<E extends PopupEntry>(
  host: PopupListHost<E> | undefined,
  options: PopupItemOptions<Omit<E, keyof PopupEntry>>,
): PopupItem<E> {
  const registered = registerEntry<E>(host, {
    ...options.extra,
    id: options.id,
    isDisabled: () => options.isDisabled(),
    isHidden: () => options.isHidden?.() ?? false,
    text: () => options.text() ?? registered.node?.textContent?.trim() ?? '',
    pick: () => options.onPick(),
  } as unknown as Omit<E, 'getElement'>);
  onDestroy(registered.unregister);
  const { entry } = registered;
  return {
    entry,
    get activeBy() {
      return host?.activeBy(entry);
    },
    handleClick() {
      host?.pick(entry);
    },
    handlePointerMove() {
      host?.hover(entry);
    },
    handlePointerDown(event) {
      event.preventDefault();
    },
    attach: registered.attach,
  };
}

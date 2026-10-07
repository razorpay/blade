import { discloseList } from '../base/disclosed-list';
import type { DisclosedList } from '../base/disclosed-list';
import type { DisclosureOptions } from '../base/disclosure';
import { createNavigableList, dispatchListKey } from '../base/navigable-list.svelte';
import type { NavigableListModel, NavigableListOptions } from '../base/navigable-list.svelte';

export interface PopupListModelOptions<T> extends NavigableListOptions<T> {
  onPick?: (item: T) => void;
  /**
   * Whether picking this item closes the list. Default: always (a menu,
   * whose items act). A multiple-choice dropdown stays open.
   */
  closesOnPick?: (item: T) => boolean;
  disclosure?: DisclosureOptions;
}

/**
 * A navigable list behind a disclosure, whose items are picked: the active
 * item the keyboard is on, and the pick, which may close the list. What a
 * pick means (an action, a held value) is the owner's `onPick`.
 */
export interface PopupListModel<T> extends NavigableListModel<T>, DisclosedList {
  /** A click on an item: it emits `onPick`, then the list may close. Disabled items refuse. */
  pick(item: T): void;
}

/**
 * Closed: ArrowDown/ArrowUp/Enter/Space open it; open: the list keys, with
 * Enter and Space picking the active item.
 */
export function createPopupListModel<T>(options: PopupListModelOptions<T>): PopupListModel<T> {
  const list = createNavigableList<T>(options);

  function pick(item: T): void {
    const index = options.items().indexOf(item);
    if (index >= 0 && options.isDisabled?.(item, index)) {
      return;
    }
    // Activate first: the close below clears the active item, and
    // activating after it would resurrect it.
    list.setActive(index);
    options.onPick?.(item);
    if (options.closesOnPick?.(item) ?? true) {
      disclosed.disclosure.close('trigger');
    }
  }

  const disclosed = discloseList(
    {
      ...list,
      handleKey: (key, mods) =>
        dispatchListKey(list, key, mods, () => {
          const active = list.active();
          if (active !== undefined) {
            pick(active);
          }
        }),
    },
    options.disclosure,
  );

  return { ...list, ...disclosed, pick };
}

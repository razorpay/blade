import type { Attachment } from 'svelte/attachments';
import type { MoveAction } from '../base/navigable-list.svelte';
import {
  createOptionListCore,
  dispatchListKey,
  type OptionListCore,
  type OptionListCoreOptions,
} from '../base/option-list';

export interface TabsModelOptions<T> extends Omit<
  OptionListCoreOptions<T>,
  'strictOption' | 'loop' | 'orientation'
> {
  /** automatic: arrow keys select as they move (APG default); manual: Enter/Space selects. */
  activation?: 'automatic' | 'manual';
  orientation?: 'horizontal' | 'vertical';
}

export type TabsModel<T> = OptionListCore<T>;

/**
 * A tablist: an option list that always has one tab selected, wraps at the
 * ends, and (by default) selects as the focus moves.
 */
export function createTabsModel<T>(options: TabsModelOptions<T>): TabsModel<T> {
  const automatic = (options.activation ?? 'automatic') === 'automatic';
  const list = createOptionListCore<T>({
    ...options,
    strictOption: true,
    loop: true,
    orientation: options.orientation || 'horizontal',
  });

  function move(action: MoveAction): void {
    list.move(action);
    if (automatic) {
      list.selectActive();
    }
  }

  const model: TabsModel<T> = {
    ...list,
    move,
    handleKey(key, mods) {
      // Dispatch against `model`, so moves go through the activating `move`.
      return dispatchListKey(model, key, mods);
    },
  };
  return model;
}

/** Where the picked tab sits among the tabs. */
export interface TabsPick {
  index: number;
  count: number;
}

export interface TabsOptions<T> {
  /** The host's `$props.id()`: the tab and panel ids hang off it. */
  id: string;
  items: () => readonly T[];
  /** A stable key per item; it is also the value. */
  itemKey: (item: T) => string;
  isItemDisabled?: (item: T) => boolean;
  value: () => string | undefined;
  /** The bindable write. */
  onValue: (value: string) => void;
  /** A user pick changed the value. */
  onChange?: (value: string) => void;
  /** `manual`: arrows only move focus, Enter or Space picks. Fixed at mount. */
  activation: 'automatic' | 'manual';
}

export interface Tabs<T> {
  /** The picked item; undefined when `value` names none. */
  readonly picked: T | undefined;
  readonly pick: TabsPick;
  /** One tab stop: the tab being moved over, else the picked one. */
  readonly stop: number;
  tabId(item: T): string;
  panelId(item: T): string;
  select(item: T): void;
  clearActive(): void;
  handleKeyDown(event: KeyboardEvent): void;
  /** On the tablist: where the keyboard moves focus between tabs. */
  readonly attach: Attachment<HTMLElement>;
}

/**
 * The tablist behaviour: one tab always picked, the keyboard over the tabs
 * and the one tab stop. Call during component initialisation; `value` must
 * already name a tab (the component picks the first enabled one).
 */
export function createTabs<T>(options: TabsOptions<T>): Tabs<T> {
  let list: HTMLElement | undefined;
  let pending = $state(-1);

  const tabId = (item: T) => `${options.id}-tab-${options.itemKey(item)}`;
  const find = (key: string | undefined) =>
    options.items().find((item) => options.itemKey(item) === key);

  const model = createTabsModel<T>({
    items: options.items,
    isDisabled: (item) => Boolean(options.isItemDisabled?.(item)),
    compare: (a, b) => options.itemKey(a) === options.itemKey(b),
    activation: options.activation,
    value: () => find(options.value()) ?? null,
    onChange: (item) => {
      if (item) {
        const key = options.itemKey(item);
        options.onValue(key);
        options.onChange?.(key);
      }
    },
  });

  const activeIndex = $derived(model.activeIndex());

  const picked = $derived(find(options.value()));
  // Tabs that fill the row are equal in width, so the underline needs no
  // measuring: it is one tab wide and slides by whole tabs. Content-sized
  // tabs underline themselves instead (see `pick` in styles.ts).
  const pick: TabsPick = $derived({
    index: picked ? options.items().indexOf(picked) : -1,
    count: options.items().length,
  });
  const stop = $derived(activeIndex >= 0 ? activeIndex : pick.index);

  return {
    get picked() {
      return picked;
    },
    get pick() {
      return pick;
    },
    get stop() {
      return stop;
    },
    tabId,
    panelId: (item) => `${options.id}-panel-${options.itemKey(item)}`,
    select: (item) => model.select(item),
    clearActive: () => model.clearActive(),
    handleKeyDown(event) {
      const from = options
        .items()
        .findIndex((item) => tabId(item) === (event.target as HTMLElement).id);
      if (from < 0) {
        return;
      }
      model.setActive(from);
      const action = model.handleKey(event.key, {
        alt: event.altKey,
        ctrl: event.ctrlKey,
        meta: event.metaKey,
      });
      if (action && action !== 'type') {
        event.preventDefault();
        pending = model.activeIndex();
      }
    },
    // Focus moves once the tabs have re-rendered with the new stop: the
    // attachment re-runs on `pending` after the DOM update.
    attach(node) {
      list = node;
      const index = pending;
      if (index >= 0) {
        pending = -1;
        list
          .querySelector<HTMLElement>(`[data-index="${index}"]`)
          ?.focus({ preventScroll: true });
      }
      return () => {
        list = undefined;
      };
    },
  };
}

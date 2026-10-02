import { onDestroy } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import { createChoiceList, type ChoiceField } from '../base/choice-list.svelte';
import { PRESS_KEYS } from '../base/keys';
import { registerEntry } from '../base/ordered-entries.svelte';
import type { TabEntry, TabsContext } from './context';

export type { TabEntry, TabsContext };

export interface TabsOptions<Shared> {
  /** The host's `$props.id()`: tab and panel ids hang off it. */
  id: string;
  value: () => string | undefined;
  /** The bindable write: every accepted value. */
  onValue: (value: string) => void;
  /** A user pick changed the value. */
  onChange?: (value: string) => void;
  /** `automatic`: focus moving onto a tab picks it; `manual`: a press does. */
  activation: () => 'automatic' | 'manual';
  isLazy: () => boolean;
  shared: () => Shared;
}

/** Where the picked tab is inside the tablist's box, for the indicator. */
export interface TabsIndicator {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Tabs<Shared> extends TabsContext<Shared> {
  /** Measured from the picked tab; undefined before the first measure. Tracked. */
  readonly indicator: TabsIndicator | undefined;
  /** On the tablist's positioned box: keeps the indicator on the picked tab through resizes. */
  readonly attachList: Attachment<HTMLElement>;
}

const safe = (value: string) => value.replace(/[^\w-]/g, '_');

/**
 * The tabs behaviour: the headless choice list as a tablist — one value,
 * never cleared, the tabs registered and read back in document order, and
 * arrows (either axis), Home and End between them, wrapping. Call during
 * component initialisation; the component provides the result to its
 * TabItems and TabPanels (`provideTabs`).
 */
export function createTabs<Shared>(options: TabsOptions<Shared>): Tabs<Shared> {
  // Not a form field: the value lives in the host's prop.
  const field: ChoiceField = {
    record: {
      get value() {
        return current();
      },
    },
    updateValue(value, onValue) {
      onValue?.(value);
    },
    touch() {},
  };
  const choices = createChoiceList<string>(field, {
    loop: true,
    orientation: 'both',
  });
  // Blade picks the first tab when the host names none.
  const firstEnabled = $derived(
    choices.items().find((value, index) => !choices.isDisabled(value, index))
  );
  const current = (): string | undefined => options.value() ?? firstEnabled;

  let indicator = $state<TabsIndicator | undefined>();

  function measure() {
    const value = current();
    const element =
      value === undefined
        ? undefined
        : choices.elementAt(choices.items().indexOf(value));
    indicator = element
      ? {
          x: element.offsetLeft,
          y: element.offsetTop,
          width: element.offsetWidth,
          height: element.offsetHeight,
        }
      : undefined;
  }

  // Re-measure whenever the pick or the set of tabs changes.
  $effect(() => {
    void current();
    void choices.items();
    measure();
  });

  function select(value: string) {
    const index = choices.items().indexOf(value);
    if (value === current() || choices.isDisabled(value, index)) {
      return;
    }
    choices.toggle(value, index, (next) => {
      options.onValue(next as string);
      options.onChange?.(next as string);
    });
  }

  return {
    get shared() {
      return options.shared();
    },
    get value() {
      return current();
    },
    get isLazy() {
      return options.isLazy();
    },
    get indicator() {
      return indicator;
    },
    register: choices.register,
    reorder: choices.reorder,
    isTabStop(value) {
      const stop = choices.tabStop();
      const items = choices.items();
      // The picked tab holds the stop until the keyboard moves it.
      return choices.activeIndex() < 0
        ? value === current()
        : items[stop] === value;
    },
    select,
    moveFocus(entry, event) {
      choices.setActive(choices.items().indexOf(entry.value()));
      if (PRESS_KEYS.has(event.key)) {
        // Picks as a press would; a link tab still navigates on Enter.
        select(entry.value());
        if (event.key === ' ') {
          event.preventDefault();
        }
        return;
      }
      if (
        choices.handleMoveKey(event.key, {
          alt: event.altKey,
          ctrl: event.ctrlKey,
          meta: event.metaKey,
        })
      ) {
        event.preventDefault();
      }
    },
    focused(entry) {
      choices.setActive(choices.items().indexOf(entry.value()));
      if (options.activation() === 'automatic') {
        select(entry.value());
      }
    },
    tabId: (value) => `${options.id}-${safe(value)}-tab`,
    panelId: (value) => `${options.id}-${safe(value)}-panel`,
    attachList(node) {
      measure();
      if (typeof ResizeObserver === 'undefined') {
        return;
      }
      const observer = new ResizeObserver(() => measure());
      observer.observe(node);
      return () => observer.disconnect();
    },
  };
}

export interface TabItemOptions {
  value: () => string;
  isDisabled: () => boolean;
}

export interface TabItem<Shared> {
  readonly tabs: TabsContext<Shared> | undefined;
  readonly isSelected: boolean;
  readonly isTabStop: boolean;
  readonly tabId: string;
  readonly panelId: string;
  handleClick(): void;
  handleKeyDown(event: KeyboardEvent): void;
  handleFocus(): void;
  /** On the tab element: how the tabs order, focus and measure it. */
  readonly attach: Attachment<HTMLElement>;
}

/**
 * One tab. Call during component initialisation; the component passes
 * `getTabs()`. Outside Tabs it is inert.
 */
export function createTabItem<Shared>(
  tabs: TabsContext<Shared> | undefined,
  options: TabItemOptions
): TabItem<Shared> {
  const { entry, attach, unregister } = registerEntry<TabEntry>(tabs, {
    value: options.value,
    isDisabled: options.isDisabled,
  });
  onDestroy(unregister);
  return {
    tabs,
    get isSelected() {
      return tabs?.value === options.value();
    },
    get isTabStop() {
      return Boolean(tabs?.isTabStop(options.value()));
    },
    get tabId() {
      return tabs?.tabId(options.value()) ?? '';
    },
    get panelId() {
      return tabs?.panelId(options.value()) ?? '';
    },
    handleClick() {
      if (!options.isDisabled()) {
        tabs?.select(options.value());
      }
    },
    handleKeyDown(event) {
      tabs?.moveFocus(entry, event);
    },
    handleFocus() {
      tabs?.focused(entry);
    },
    attach,
  };
}

import {
  createDisclosure,
  type DisclosureModel,
  type DisclosureOptions,
} from './disclosure';
import type { KeyModifiers, ListAction } from './navigable-list.svelte';
import type { OptionListCore } from './option-list';

export interface DisclosedList {
  disclosure: DisclosureModel;
  isOpen(): boolean;
  open(): void;
  close(): void;
  toggle(): void;
  handleKey(key: string, mods?: KeyModifiers): ListAction | null;
}

/**
 * The glue shared by every option list behind a disclosure (a menu):
 * closed-state open keys resolved through the list's own key table — so the
 * modifier policy (ctrl/meta pass through, alt+ArrowDown opens) is decided
 * once, in `navigable-list` — Escape and Tab closing, and clearing the
 * active item whenever the surface closes, whatever closed it. Owns the
 * disclosure for that reason: the clear runs inside every close.
 */
export function discloseList<T>(
  list: OptionListCore<T>,
  options: DisclosureOptions = {}
): DisclosedList {
  const disclosure = createDisclosure({
    ...options,
    onOpenChange(open, source) {
      // Roving state must not survive a close (Escape, programmatic,
      // close-on-select alike), or it re-appears on the next open.
      if (!open) {
        list.clearActive();
      }
      options.onOpenChange?.(open, source);
    },
  });

  function openFromKeyboard(key: string): void {
    disclosure.open('trigger');
    const selected = list.selectedIndex();
    if (selected >= 0) {
      list.setActive(selected);
    } else {
      list.move(key === 'ArrowUp' ? 'last' : 'first');
    }
  }

  function handleKey(key: string, mods: KeyModifiers = {}): ListAction | null {
    if (!disclosure.isOpen()) {
      const action = list.keyAction(key, mods);
      // Arrows, Enter, Space and alt+ArrowDown open; jump keys (Home/End,
      // PageUp/PageDown) and typeahead stay inert while closed.
      if (
        action === 'open' ||
        action === 'next' ||
        action === 'prev' ||
        action === 'select'
      ) {
        openFromKeyboard(key);
        return 'open';
      }
      return null;
    }
    if (key === 'Tab') {
      // Focus is leaving the control; APG closes menus and comboboxes alike.
      disclosure.close('dismiss');
      return null;
    }
    const action = list.handleKey(key, mods);
    if (action === 'close') {
      disclosure.close('escape');
    }
    return action;
  }

  return {
    disclosure,
    handleKey,
    isOpen: disclosure.isOpen,
    open() {
      disclosure.open('trigger');
    },
    close() {
      disclosure.close('programmatic');
    },
    toggle() {
      disclosure.toggle('trigger');
    },
  };
}

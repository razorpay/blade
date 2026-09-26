import { onDestroy } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import { setupField, type FieldModel } from '../form/field.svelte';
import { createFieldLine } from '../form/field-line.svelte';
import { visibleFieldError, type FieldHint } from '../form/hint';
import type {
  AccordionContext,
  AccordionEntry,
  AccordionValue,
} from './context';

export type { AccordionValue };

export interface AccordionModel {
  isExpanded(value: AccordionValue): boolean;
  /**
   * One user press on an expandable item: opens it, closing any other, or
   * closes it when it is the open one. `onValue` sees the new value.
   */
  toggle(value: AccordionValue, onValue?: (value: unknown) => void): void;
}

/**
 * An accordion over a field: the open item's value is the field's value, so
 * a Form can require one and submit it. Blade's accordion: one item open at
 * a time, and pressing the open one closes it.
 */
export function createAccordionModel(field: FieldModel): AccordionModel {
  const isExpanded = (value: AccordionValue): boolean =>
    field.record.value === value;
  return {
    isExpanded,
    toggle(value, onValue) {
      field.updateValue(isExpanded(value) ? null : value, onValue);
      field.touch();
    },
  };
}

/** An item is open or one is missing: there is no success state to show. */
export type AccordionValidationState = 'none' | 'error';

export interface AccordionOptions<Shared> {
  /** The host's `$props.id()`: the label and hint ids hang off it. */
  id: string;
  value: () => AccordionValue | null | undefined;
  /** The bindable write: every accepted value, user press or not. */
  onValue: (value: AccordionValue | null) => void;
  /** A user press changed the value. */
  onChange?: (value: AccordionValue | null) => void;
  name: () => string | undefined;
  isRequired: () => boolean;
  isDisabled: () => boolean;
  validationState: () => AccordionValidationState | undefined;
  hint: () => string | undefined;
  /** Handed to every item as is. */
  shared: () => Shared;
}

export interface Accordion<Shared> extends AccordionContext<Shared> {
  readonly labelId: string;
  readonly hintId: string;
  /** The one line under the items and the state it puts the group in. */
  readonly hint: FieldHint;
  readonly isInvalid: boolean;
}

const PRECEDING = 2;

/**
 * The accordion behaviour: one form field holding the open item's value,
 * and the items registered in mount order, read back in document order.
 * Call during component initialisation; the component provides the result
 * to its AccordionItems (`provideAccordion`).
 */
export function createAccordion<Shared>(
  options: AccordionOptions<Shared>
): Accordion<Shared> {
  const fieldProps = () => ({
    name: options.name(),
    value: options.value(),
    required: options.isRequired(),
    disabled: options.isDisabled(),
  });

  const { field, form } = setupField(fieldProps(), 'radio', (next) => {
    options.onValue((next ?? null) as AccordionValue | null);
  });
  const model = createAccordionModel(field);

  $effect.pre(() => {
    field.updateProps(fieldProps());
  });

  const line = createFieldLine(
    form,
    () => ({
      validationState: options.validationState(),
      hint: options.hint(),
    }),
    (state) => visibleFieldError(field.record, state)
  );

  // A plain array in mount order; `version` tells readers it changed. It is
  // written from a plain counter, never `+=`: registering and mounting run
  // inside effects, and reading `version` there would make them loop.
  const entries: AccordionEntry[] = [];
  let changes = 0;
  let version = $state(0);
  const bump = () => {
    changes += 1;
    version = changes;
  };
  // Document order, not mount order: an item mounted later may sit before
  // an earlier one. Before mount (and on native) mount order it is.
  const ordered = $derived.by(() => {
    void version;
    return [...entries].sort((a, b) => {
      const one = a.getElement();
      const two = b.getElement();
      if (!one?.compareDocumentPosition || !two) {
        return 0;
      }
      return one.compareDocumentPosition(two) & PRECEDING ? 1 : -1;
    });
  });

  return {
    labelId: `${options.id}-label`,
    hintId: `${options.id}-hint`,
    get hint() {
      return line.hint;
    },
    get isInvalid() {
      return line.hint.validationState === 'error';
    },
    get isDisabled() {
      return options.isDisabled();
    },
    get shared() {
      return options.shared();
    },
    register(entry) {
      entries.push(entry);
      bump();
      return () => {
        const at = entries.indexOf(entry);
        if (at >= 0) {
          entries.splice(at, 1);
          bump();
        }
      };
    },
    indexOf: (entry) => ordered.indexOf(entry),
    reorder: bump,
    isExpanded: (value) => model.isExpanded(value),
    toggle(value) {
      model.toggle(value, (next) => {
        const stored = (next ?? null) as AccordionValue | null;
        options.onValue(stored);
        options.onChange?.(stored);
      });
    },
    moveFocus(entry, key) {
      const enabled = ordered.filter((it) => !it.isDisabled());
      if (enabled.length === 0) {
        return false;
      }
      const at = enabled.indexOf(entry);
      let target: AccordionEntry | undefined;
      switch (key) {
        case 'Home':
          target = enabled[0];
          break;
        case 'End':
          target = enabled[enabled.length - 1];
          break;
        case 'ArrowDown':
          target = enabled[(at + 1) % enabled.length];
          break;
        case 'ArrowUp':
          target = enabled[(at <= 0 ? enabled.length : at) - 1];
          break;
        default:
          return false;
      }
      target?.getElement()?.focus();
      return true;
    },
  };
}

export interface AccordionItemOptions {
  /** The host's `$props.id()`: the header and panel ids hang off it. */
  id: string;
  /** The item's identity in the accordion's value; its index when unset. */
  value: () => AccordionValue | undefined;
  isDisabled: () => boolean;
  /** Whether there is a body to expand into; without one a press only reports. */
  hasBody: () => boolean;
  /** Every header press, before anything changes. Return `false` to veto. */
  onClick?: (event: MouseEvent) => boolean | void;
}

export interface AccordionItemState {
  /** Position among the accordion's items, in document order. */
  index: number;
  isExpanded: boolean;
  isDisabled: boolean;
  /** No body: the item acts (a press only reports) instead of expanding. */
  isActionable: boolean;
}

export interface AccordionItem<Shared> {
  readonly state: AccordionItemState;
  readonly value: AccordionValue;
  readonly shared: Shared | undefined;
  readonly headerId: string;
  readonly panelId: string;
  handleClick(event: MouseEvent): void;
  handleKeyDown(event: KeyboardEvent): void;
  /** On the header button: how the accordion orders and focuses the item. */
  readonly attach: Attachment<HTMLElement>;
}

/**
 * One item of an accordion. Call during component initialisation; the
 * component passes `getAccordion()`. Outside an Accordion it is inert.
 */
export function createAccordionItem<Shared>(
  accordion: AccordionContext<Shared> | undefined,
  options: AccordionItemOptions
): AccordionItem<Shared> {
  let node: HTMLElement | undefined;
  const entry: AccordionEntry = {
    getElement: () => node,
    isDisabled: () => isDisabled,
  };
  if (accordion) {
    onDestroy(accordion.register(entry));
  }

  const index = $derived(accordion ? accordion.indexOf(entry) : 0);
  const value = $derived(options.value() ?? index);
  const isDisabled = $derived(
    options.isDisabled() || Boolean(accordion?.isDisabled)
  );
  const isActionable = $derived(!options.hasBody());
  const isExpanded = $derived(
    !isActionable && Boolean(accordion?.isExpanded(value))
  );
  const state: AccordionItemState = $derived({
    index,
    isExpanded,
    isDisabled,
    isActionable,
  });

  return {
    get state() {
      return state;
    },
    get value() {
      return value;
    },
    get shared() {
      return accordion?.shared;
    },
    headerId: `${options.id}-header`,
    panelId: `${options.id}-panel`,
    handleClick(event) {
      if (isDisabled) {
        return;
      }
      if (options.onClick?.(event) === false || isActionable) {
        return;
      }
      accordion?.toggle(value);
    },
    handleKeyDown(event) {
      if (event.altKey || event.ctrlKey || event.metaKey || !accordion) {
        return;
      }
      if (accordion.moveFocus(entry, event.key)) {
        event.preventDefault();
      }
    },
    attach(element) {
      node = element;
      accordion?.reorder();
      return () => {
        node = undefined;
      };
    },
  };
}

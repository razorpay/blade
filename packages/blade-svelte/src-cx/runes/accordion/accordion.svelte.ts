import { onDestroy } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import { createChoiceList } from '../base/choice-list.svelte';
import { setupField } from '../form/field.svelte';
import { createFieldLine } from '../form/field-line.svelte';
import { visibleFieldError, type FieldHint } from '../form/hint';
import type {
  AccordionContext,
  AccordionEntry,
  AccordionValue,
} from './context';

export type { AccordionValue };

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

/**
 * The accordion behaviour: the headless choice list (`base/choice-list`)
 * as expanding headers — one form field holding the open item's value, the
 * items registered and read back in document order, and arrows, Home and
 * End between the headers. Call during component initialisation; the
 * component provides the result to its AccordionItems (`provideAccordion`).
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
  // One open at a time, and pressing the open one closes it; the headers
  // are buttons, so the arrows wrap and Enter and Space stay theirs.
  const choices = createChoiceList<AccordionValue>(field, {
    deselectable: () => true,
    loop: true,
  });

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
    register: (entry) => choices.register(entry),
    indexOf: (entry) => choices.indexOf(entry),
    reorder: () => choices.reorder(),
    isExpanded: (value) => choices.isSelected(value),
    toggle(value) {
      const index = choices.items().indexOf(value);
      choices.toggle(value, index, (next) => {
        const stored = (next ?? null) as AccordionValue | null;
        options.onValue(stored);
        options.onChange?.(stored);
      });
    },
    moveFocus(entry, key) {
      choices.setActive(choices.indexOf(entry));
      return choices.handleMoveKey(key);
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
    value: () => value,
    isDisabled: () => isDisabled,
    getElement: () => node,
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

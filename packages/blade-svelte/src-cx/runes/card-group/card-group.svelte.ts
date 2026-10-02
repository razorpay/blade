import { onDestroy } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import { createChoiceList } from '../base/choice-list.svelte';
import { registerEntry } from '../base/ordered-entries.svelte';
import { createFieldShell } from '../form/field.svelte';
import type {
  ChoiceValidationState,
  FieldHint,
  HintContent,
} from '../form/hint';
import type {
  CardGroupContext,
  CardGroupEntry,
  CardGroupValue,
} from './context';

export type { CardGroupValue };

/** An item is open or one is missing: there is no success state to show. */
export type CardGroupValidationState = ChoiceValidationState;

export interface CardGroupOptions<Shared> {
  /** The host's `$props.id()`: the label and hint ids hang off it. */
  id: string;
  value: () => CardGroupValue | null | undefined;
  /** The bindable write: every accepted value, user press or not. */
  onValue: (value: CardGroupValue | null) => void;
  /** A user press changed the value. */
  onChange?: (value: CardGroupValue | null) => void;
  name: () => string | undefined;
  isRequired: () => boolean;
  isDisabled: () => boolean;
  validationState: () => CardGroupValidationState | undefined;
  hint: () => HintContent | undefined;
  /** Handed to every item as is. */
  shared: () => Shared;
}

export interface CardGroup<Shared> extends CardGroupContext<Shared> {
  readonly labelId: string;
  readonly hintId: string;
  /** The one line under the items and the state it puts the group in. */
  readonly hint: FieldHint;
  readonly isInvalid: boolean;
}

/**
 * The card group behaviour: the headless choice list (`base/choice-list`)
 * as expanding headers — one form field holding the open item's value, the
 * items registered and read back in document order, and arrows, Home and
 * End between the headers. Call during component initialisation; the
 * component provides the result to its CardGroupItems (`provideCardGroup`).
 */
export function createCardGroup<Shared>(
  options: CardGroupOptions<Shared>
): CardGroup<Shared> {
  // The form reveals the open item's header, else the first enabled one.
  const shell = createFieldShell({
    id: options.id,
    kind: 'radio',
    props: () => ({
      name: options.name(),
      value: options.value(),
      required: options.isRequired(),
      disabled: options.isDisabled(),
    }),
    onValue: (next) => options.onValue((next ?? null) as CardGroupValue | null),
    line: () => ({
      validationState: options.validationState(),
      hint: options.hint(),
    }),
    handle: () => choices.elementAt(choices.tabStop()),
  });
  // One open at a time, and pressing the open one closes it; the headers
  // are buttons, so the arrows wrap and Enter and Space stay theirs.
  const choices = createChoiceList<CardGroupValue>(shell.field, {
    deselectable: () => true,
    loop: true,
  });
  // Pre-effect: the field follows its props from before the first paint.
  $effect.pre(shell.syncProps);

  return {
    labelId: shell.labelId,
    hintId: shell.hintId,
    get hint() {
      return shell.hint;
    },
    get isInvalid() {
      return shell.isInvalid;
    },
    get isDisabled() {
      return options.isDisabled();
    },
    get shared() {
      return options.shared();
    },
    register: choices.register,
    indexOf: choices.indexOf,
    reorder: choices.reorder,
    isExpanded: (value) => choices.isSelected(value),
    toggle(value, event) {
      shell.edit(
        (onValue) =>
          choices.toggle(value, choices.items().indexOf(value), onValue),
        (next) => {
          const stored = (next ?? null) as CardGroupValue | null;
          options.onValue(stored);
          options.onChange?.(stored);
        },
        event
      );
    },
    moveFocus(entry, key) {
      choices.setActive(choices.indexOf(entry));
      return choices.handleMoveKey(key);
    },
  };
}

export interface CardGroupItemOptions {
  /** The host's `$props.id()`: the header and panel ids hang off it. */
  id: string;
  /** The item's identity in the card group's value; its index when unset. */
  value: () => CardGroupValue | undefined;
  isDisabled: () => boolean;
  /** Whether there is a body to expand into; without one a press only reports. */
  hasBody: () => boolean;
  /** Every header press, before anything changes. Return `false` to veto. */
  onClick?: (event: MouseEvent) => boolean | void;
}

export interface CardGroupItemState {
  /** Position among the card group's items, in document order. */
  index: number;
  isExpanded: boolean;
  isDisabled: boolean;
  /** No body: the item acts (a press only reports) instead of expanding. */
  isActionable: boolean;
}

export interface CardGroupItem<Shared> {
  readonly state: CardGroupItemState;
  readonly value: CardGroupValue;
  readonly shared: Shared | undefined;
  readonly headerId: string;
  readonly panelId: string;
  handleClick(event: MouseEvent): void;
  handleKeyDown(event: KeyboardEvent): void;
  /** Closes the item if it is open: the body's own way out ("Use this card"). */
  collapse(): void;
  /** On the header button: how the card group orders and focuses the item. */
  readonly attach: Attachment<HTMLElement>;
}

/**
 * One item of an card group. Call during component initialisation; the
 * component passes `getCardGroup()`. Outside a CardGroup it is inert.
 */
export function createCardGroupItem<Shared>(
  cardGroup: CardGroupContext<Shared> | undefined,
  options: CardGroupItemOptions
): CardGroupItem<Shared> {
  const { entry, attach, unregister } = registerEntry<CardGroupEntry>(
    cardGroup,
    {
      value: (): CardGroupValue => value,
      isDisabled: (): boolean => isDisabled,
    }
  );
  onDestroy(unregister);

  const index = $derived(cardGroup ? cardGroup.indexOf(entry) : 0);
  const value = $derived(options.value() ?? index);
  const isDisabled = $derived(
    options.isDisabled() || Boolean(cardGroup?.isDisabled)
  );
  const isActionable = $derived(!options.hasBody());
  const isExpanded = $derived(
    !isActionable && Boolean(cardGroup?.isExpanded(value))
  );
  const state: CardGroupItemState = $derived({
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
      return cardGroup?.shared;
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
      cardGroup?.toggle(value, event);
    },
    collapse() {
      if (isExpanded) {
        cardGroup?.toggle(value);
      }
    },
    handleKeyDown(event) {
      if (event.altKey || event.ctrlKey || event.metaKey || !cardGroup) {
        return;
      }
      if (cardGroup.moveFocus(entry, event.key)) {
        event.preventDefault();
      }
    },
    attach,
  };
}

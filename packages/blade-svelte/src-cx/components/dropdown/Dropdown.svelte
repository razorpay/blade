<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import { ChevronDownIcon } from '../../icons';
  import { provideDropdown } from '../../runes/dropdown/context';
  import { createDropdown } from '../../runes/dropdown/dropdown.svelte';
  import { sameItem } from '../../runes/base/selection';
  import type { HintContent, ValidationState } from '../../runes/form/hint';
  import { pickHintText } from '../../runes/form/hint';
  import type { Placement } from '../../runes/layer/placement';
  import { useComponentDefaults } from '../defaults';
  import Icon from '../icon/Icon.svelte';
  import PopoverPanel from '../popover/PopoverPanel.svelte';
  import Progress from '../progress/Progress.svelte';
  import FieldHint from '../shared/FieldHint.svelte';
  import FieldLabel from '../shared/FieldLabel.svelte';
  import { hintToneOf } from '../shared/field';
  import { resolveDropdown, type DropdownShared, type DropdownStyleProps } from './styles';

  type Props = DropdownStyleProps & {
    /**
     * An ActionList of ActionListItems (and ActionListSections), and
     * anything between them — a Divider. Only ActionListItems are options.
     */
    children: Snippet;
    /**
     * The pick: one value or null, or an array with `isMultiple`. Bindable.
     */
    value?: T | readonly T[] | null;
    /** A pick changed the value. */
    onChange?: (change: { name?: string; value: T | readonly T[] | null }) => void;
    /** Many picks: rows lead with a checkbox, and a pick keeps the list open. @default false */
    isMultiple?: boolean;
    /** Single choice: picking the pick clears it. @default false */
    isDeselectable?: boolean;
    /** Defaults to identity; pass it when values are rebuilt objects. */
    compare?: (a: T, b: T) => boolean;
    /** Whether the list shows: bindable. @default false */
    isOpen?: boolean;
    onOpenChange?: (change: { isOpen: boolean }) => void;
    /**
     * A trigger of your own (a Button): the wrapper around it opens the
     * list. Without it the dropdown is a select field: `label`, the
     * picked rows' titles (or `placeholder`), a chevron, and the hint.
     */
    trigger?: Snippet<[{ isOpen: boolean; selected: readonly string[] }]>;
    /** Above the list: a DropdownHeader (title, search). */
    header?: Snippet;
    /** Under the list: a DropdownFooter (Apply, Cancel); `close` closes it. */
    footer?: Snippet<[{ close: () => void }]>;
    /** The options are on their way: a loading row in place of them. @default false */
    isLoading?: boolean;
    /** What the no-results row says when a search hides every row. @default 'No results found' */
    emptyText?: string;
    /** The select field's label. */
    label?: string;
    /** The select field's text while nothing is picked. */
    placeholder?: string;
    helpText?: HintContent;
    errorText?: HintContent;
    successText?: HintContent;
    /** Omit inside a Form: the field mirrors its form error. */
    validationState?: ValidationState;
    /** The form field's name. */
    name?: string;
    /** @default false */
    isRequired?: boolean;
    /** @default false */
    isDisabled?: boolean;
    placement?: Placement;
    /** Names the list (and a select field without a `label`). */
    accessibilityLabel?: string;
    testID?: string;
    class?: string;
  };

  let {
    children,
    value = $bindable(null),
    onChange,
    isMultiple = false,
    isDeselectable = false,
    compare,
    isOpen = $bindable(false),
    onOpenChange,
    trigger,
    header,
    footer,
    isLoading = false,
    emptyText = 'No results found',
    label,
    placeholder,
    helpText,
    errorText,
    successText,
    validationState,
    name,
    isRequired = false,
    isDisabled = false,
    placement = 'bottom-start',
    accessibilityLabel,
    testID,
    class: className = '',
    ...styleProps
  }: Props = $props();

  const uid = $props.id();
  const style = useComponentDefaults('Dropdown', () => styleProps);
  const classes = $derived(resolveDropdown(style.current));
  const size = $derived(style.current.size ?? 'medium');

  const dropdown = createDropdown<T, DropdownShared>({
    id: uid,
    value: () => value,
    onValue: (next) => {
      value = next;
    },
    onChange: (next) => onChange?.({ name, value: next }),
    isMultiple: () => isMultiple,
    compare: (a, b) => (compare ?? sameItem)(a, b),
    isDeselectable: () => isDeselectable,
    name: () => name,
    isRequired: () => isRequired,
    isDisabled: () => isDisabled,
    validationState: () => validationState,
    hint: () => pickHintText({ validationState, helpText, errorText, successText }),
    isOpen: () => isOpen,
    onOpenValue: (next) => {
      isOpen = next;
    },
    onOpenChange: (open) => onOpenChange?.({ isOpen: open }),
    shared: () => ({ classes }),
    isSelectField: () => !trigger,
  });
  provideDropdown(dropdown);

  const hint = $derived(dropdown.hint);
  const close = (): void => dropdown.close();
  const listName = $derived(label ? undefined : accessibilityLabel);
</script>

<div class={cx(classes.root, !trigger && classes.trigger.root, className)} data-testid={testID}>
  {#if !trigger && label}
    <FieldLabel
      id={dropdown.labelId}
      text={label}
      {size}
      necessityIndicator={isRequired ? 'required' : 'none'}
    />
  {/if}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <span
    class="relative flex"
    onclick={isDisabled ? undefined : dropdown.handleTriggerClick}
    onkeydown={isDisabled ? undefined : dropdown.handleRootKeyDown}
    {@attach dropdown.root}
  >
    {#if trigger}
      {@render trigger({ isOpen: dropdown.isOpen, selected: dropdown.selectedTexts })}
    {:else}
      <!-- APG's select-only combobox: a button that opens a listbox. -->
      <button
        type="button"
        role="combobox"
        aria-expanded={dropdown.isOpen}
        aria-controls={dropdown.listId}
        class={cx(
          classes.trigger.box,
          isDisabled && classes.trigger.disabled,
          hint.validationState === 'error' && classes.trigger.invalid
        )}
        disabled={isDisabled}
        aria-labelledby={label ? `${dropdown.labelId} ${uid}-value` : undefined}
        aria-label={label ? undefined : accessibilityLabel}
        aria-describedby={hint.text ? dropdown.hintId : undefined}
        aria-invalid={hint.validationState === 'error' ? 'true' : undefined}
        aria-required={isRequired || undefined}
        data-testid={testID ? `${testID}-trigger` : undefined}
      >
        {#if dropdown.selectedTexts.length}
          <span id="{uid}-value" class={classes.trigger.value}>
            {isMultiple && dropdown.selectedTexts.length > 1
              ? `${dropdown.selectedTexts.length} selected`
              : dropdown.selectedTexts.join(', ')}
          </span>
        {:else}
          <span id="{uid}-value" class={classes.trigger.placeholder}>{placeholder ?? ''}</span>
        {/if}
        <span class={classes.trigger.chevron}>
          <Icon source={ChevronDownIcon} size={size === 'small' ? 'small' : 'medium'} />
        </span>
      </button>
    {/if}
    {#if dropdown.isOpen && dropdown.anchor}
      <PopoverPanel
        id={dropdown.panelId}
        anchor={dropdown.anchor}
        {placement}
        {classes}
        isFocusMoved={false}
        matchesAnchorWidth={!trigger}
        testID={testID ? `${testID}-panel` : undefined}
        onDismiss={dropdown.close}
        onKeyDown={dropdown.handleKey}
      >
        {@render header?.()}
        <div
          id={dropdown.listId}
          role="listbox"
          tabindex="-1"
          class={classes.list}
          aria-label={listName}
          aria-labelledby={label ? dropdown.labelId : undefined}
          aria-multiselectable={isMultiple || undefined}
          aria-activedescendant={dropdown.activeId}
          aria-busy={isLoading || undefined}
          {@attach dropdown.focusOwner}
        >
          {#if isLoading}
            <div class={classes.stateRow}>
              <Progress type="dots" size="small" accessibilityLabel="Loading" />
            </div>
          {:else}
            {@render children()}
            {#if dropdown.hasNoResults}
              <div class={classes.stateRow} role="status">{emptyText}</div>
            {/if}
          {/if}
        </div>
        {@render footer?.({ close })}
      </PopoverPanel>
    {:else}
      <!-- Closed, the rows still register (hidden), so the field knows the
           picked rows' titles. -->
      <div hidden>{@render children()}</div>
    {/if}
  </span>
  {#if !trigger && hint.text}
    <FieldHint id={dropdown.hintId} text={hint.text} tone={hintToneOf(hint.validationState)} {size} />
  {/if}
</div>

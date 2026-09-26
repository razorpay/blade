<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import { nativeOptionState } from '../../runes/base/option-list';
  import { createOptionList } from '../../runes/option-list/list.svelte';
  import VirtualWindow from '../virtual/VirtualWindow.svelte';
  import {
    resolveOptionList,
    type OptionListStyleProps,
    type OptionListValidationState,
    type OptionState,
  } from './styles';
  import OptionRow from './OptionRow.svelte';

  interface BehaviourProps {
    options: readonly T[];
    /** Identifies an option across re-orders and filtering. */
    optionKey: (option: T) => string;
    /**
     * The pick — an array of picks with `isMultiple`: the initial one, a
     * `bind:value`, or a value the host keeps driving.
     */
    value?: T | readonly T[] | null;
    /** Checkboxes instead of radios; the value is an array. */
    isMultiple?: boolean;
    onChange?: (value: T | readonly T[] | null) => void;
    /** Defaults to identity; pass it when options are rebuilt objects. */
    compare?: (a: T, b: T) => boolean;
    isOptionDisabled?: (option: T, index: number) => boolean;
    /** Enables typeahead: the text a typed prefix is matched against. */
    optionText?: (option: T) => string;
    /** Single choice: picking the picked option clears it. */
    isDeselectable?: boolean;
    /**
     * Mount only the rows in view. Rows may be of any height: they are
     * measured as they appear. Give the list a bounded height through
     * `class` (`h-80`); the rows scroll inside it.
     */
    virtualize?: boolean;
    /** Registers the list with the enclosing Form under this key. */
    name?: string;
    isRequired?: boolean;
    isDisabled?: boolean;
    /**
     * Omit inside a Form: the list mirrors its own form error once an option
     * was picked or a submit was attempted. Pass it to own the state.
     */
    validationState?: OptionListValidationState;
    /**
     * The line under the options while the state is `none`, and the stand-in
     * for `errorText`. Inside a Form a visible field error replaces the line
     * while it lasts.
     */
    helpText?: string;
    /** The line while `validationState` is `error`. */
    errorText?: string;
    label?: string;
    /** Names the list when there is no visible `label`. */
    accessibilityLabel?: string;
    /** Lands on the root; each row's control gets `${testID}-${index}`. */
    testID?: string;
    class?: string;
    /**
     * A row's content. The list owns the row — the control, the click, the
     * pick and disabled looks — so this never needs a click target of its own.
     */
    item: Snippet<[T, OptionState]>;
  }

  // Closed prop set: behaviour props declared here, style props in
  // `styles.ts`. The typed rest is handed to the resolver opaquely.
  type Props = BehaviourProps & OptionListStyleProps;

  let {
    options,
    optionKey,
    value = $bindable(),
    isMultiple = false,
    onChange,
    compare,
    isOptionDisabled,
    optionText,
    isDeselectable = false,
    virtualize = false,
    name,
    isRequired = false,
    isDisabled = false,
    validationState,
    helpText,
    errorText,
    label,
    accessibilityLabel,
    testID,
    class: className = '',
    item,
    ...styleProps
  }: Props = $props();

  const uid = $props.id();
  // Blade's two lines, one shown: the state's own, else the help text.
  const lineText = $derived(
    validationState === 'error' ? (errorText ?? helpText) : helpText
  );
  // svelte-ignore state_referenced_locally
  const list = createOptionList<T>({
    id: uid,
    options: () => options,
    value: () => value,
    onValue: (next) => {
      value = next;
    },
    onChange: (next) => onChange?.(next),
    isMultiple: () => isMultiple,
    compare,
    isOptionDisabled,
    optionText,
    isDeselectable: () => isDeselectable,
    name: () => name,
    isRequired: () => isRequired,
    isDisabled: () => isDisabled,
    validationState: () => validationState,
    hint: () => lineText,
  });

  const classes = $derived(resolveOptionList(styleProps));
  const hint = $derived(list.hint);
</script>

{#snippet row(option: T, index: number, stop: number)}
  {@const state = list.stateOf(option, index)}
  <OptionRow
    kind={isMultiple ? 'checkbox' : 'radio'}
    name={list.name}
    isSelected={state.isSelected}
    isDisabled={state.isDisabled}
    isInvalid={list.isInvalid}
    isActive={list.isKeyboardFocused && index === list.activeIndex}
    isTabStop={index === stop}
    onFocus={() => list.setActive(index)}
    {classes}
    optionState={nativeOptionState(state.isSelected, state.isDisabled)}
    onToggle={(event) => list.toggle(option, index, event)}
    testID={testID ? `${testID}-${index}` : undefined}
  >
    {@render item(option, state)}
  </OptionRow>
{/snippet}

<div
  class={cx(
    classes.root,
    virtualize && classes.virtual.root,
    isDisabled && classes.disabled,
    className
  )}
  role={isMultiple ? 'group' : 'radiogroup'}
  aria-label={label ? undefined : accessibilityLabel}
  aria-labelledby={label ? list.labelId : undefined}
  aria-required={isRequired && !isMultiple ? 'true' : undefined}
  aria-invalid={list.isInvalid && !isMultiple ? 'true' : undefined}
  aria-describedby={hint.text ? list.hintId : undefined}
  data-testid={testID}
  onkeydown={list.handleKeyDown}
  onpointerdown={list.handlePointerDown}
  onfocusin={list.handleFocusIn}
  onfocusout={list.handleFocusOut}
>
  {#if label}
    <span id={list.labelId} class={classes.label}>{label}</span>
  {/if}
  {#if virtualize}
    <!-- Opens at the pick, so a long list shows what is chosen, not its top. -->
    <VirtualWindow
      keys={options.map(optionKey)}
      reveal={list.isKeyboardFocused ? list.activeIndex : -1}
      startAt={list.tabStop}
      class={classes.virtual.viewport}
      contentClass={classes.virtual.options}
    >
      {#snippet children(range)}
        {@const stop = list.stopWithin(range.start, range.end)}
        {#each options.slice(range.start, range.end) as option, offset (optionKey(option))}
          {@render row(option, range.start + offset, stop)}
        {/each}
      {/snippet}
    </VirtualWindow>
  {:else}
    {@const stop = list.stopWithin(0, options.length)}
    <div class={classes.options}>
      {#each options as option, index (optionKey(option))}
        {@render row(option, index, stop)}
      {/each}
    </div>
  {/if}
  {#if hint.text}
    <p
      id={list.hintId}
      class={cx(
        classes.hint,
        classes.hintTone[hint.validationState === 'error' ? 'error' : 'none']
      )}
    >
      {hint.text}
    </p>
  {/if}
</div>

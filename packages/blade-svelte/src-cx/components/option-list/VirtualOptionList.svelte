<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import { provideOptionList } from '../../runes/option-list/context';
  import { createOptionList } from '../../runes/option-list/list.svelte';
  import VirtualWindow from '../virtual/VirtualWindow.svelte';
  import VirtualOptionRow from './VirtualOptionRow.svelte';
  import {
    resolveOptionList,
    type OptionListShared,
    type OptionListStyleProps,
    type OptionListValidationState,
    type OptionState,
  } from './styles';

  interface BehaviourProps {
    /**
     * Every option, as data: the list mounts only the rows in view, so it
     * must know them all up front — for the keyboard, typeahead and opening
     * at the pick.
     */
    options: readonly T[];
    /** Identifies an option across re-orders and filtering. */
    optionKey: (option: T) => string;
    /** What the keyboard skips and the list refuses. */
    isOptionDisabled?: (option: T, index: number) => boolean;
    /** Enables typeahead: the text a typed prefix is matched against. */
    optionText?: (option: T) => string;
    /**
     * The pick — an array of picks with `isMultiple`: the initial one, a
     * `bind:value`, or a value the host keeps driving.
     */
    value?: T | readonly T[] | null;
    isMultiple?: boolean;
    onChange?: (value: T | readonly T[] | null) => void;
    /** Defaults to identity; pass it when options are rebuilt objects. */
    compare?: (a: T, b: T) => boolean;
    isDeselectable?: boolean;
    name?: string;
    isRequired?: boolean;
    isDisabled?: boolean;
    validationState?: OptionListValidationState;
    helpText?: string;
    errorText?: string;
    label?: string;
    accessibilityLabel?: string;
    /** Lands on the root; each row's control gets `${testID}-${index}`. */
    testID?: string;
    /** Give the list a bounded height here (`h-80`): the rows scroll inside it. */
    class?: string;
    /**
     * One row: an OptionItem for the option. Rows may be of any height;
     * they are measured as they appear.
     */
    children: Snippet<[T, OptionState]>;
  }

  type Props = BehaviourProps & OptionListStyleProps;

  let {
    options,
    optionKey,
    isOptionDisabled,
    optionText,
    value = $bindable(),
    isMultiple = false,
    onChange,
    compare,
    isDeselectable = false,
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
    children,
    ...styleProps
  }: Props = $props();

  const uid = $props.id();
  const lineText = $derived(
    validationState === 'error' ? (errorText ?? helpText) : helpText
  );
  const classes = $derived(resolveOptionList(styleProps));
  // svelte-ignore state_referenced_locally
  const list = createOptionList<T, OptionListShared>({
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
    shared: () => ({ classes, testID }),
  });
  provideOptionList(list);

  const hint = $derived(list.hint);
</script>

<div
  class={cx(
    classes.root,
    classes.virtual.root,
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
  onpointerdown={list.handlePointerDown}
>
  {#if label}
    <span id={list.labelId} class={classes.label}>{label}</span>
  {/if}
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
        {@const index = range.start + offset}
        <VirtualOptionRow {option} {index} isTabStop={index === stop}>
          {@render rowContent(option, index)}
        </VirtualOptionRow>
      {/each}
    {/snippet}
  </VirtualWindow>
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

{#snippet rowContent(option: T, index: number)}
  {@render children(option, list.stateOf(option, index))}
{/snippet}

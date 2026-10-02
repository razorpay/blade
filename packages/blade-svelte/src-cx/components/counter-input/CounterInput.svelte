<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { FieldChange } from '../shared/change';
  import { useComponentDefaults } from '../defaults';
  import { cx } from '../../cx';
  import { createCounterInput } from '../../runes/counter-input/counter-input.svelte';
  import Icon from '../icon/Icon.svelte';
  import FieldLabel from '../shared/FieldLabel.svelte';
  import { minus, plus } from '../icons';
  import { resolveCounterInput, type CounterInputStyleProps } from './styles';

  interface Props extends CounterInputStyleProps {
    label?: string;
    /**
     * The label's area, to put content beside the label (Blade's
     * `labelSuffix` and `labelTrailing`): render the `label` snippet it
     * receives and anything else. Today the area is the row above the
     * control — items 4px apart, `ms-auto` pushes one to the end — and it
     * stays the place for the label wherever a future `labelPosition` puts
     * it. Only the label names the control.
     */
    labelArea?: Snippet<[{ label: Snippet }]>;
    /** Names the field when there is no visible `label`. */
    accessibilityLabel?: string;
    /**
     * The count: the initial one, a `bind:value`, or a value the host keeps
     * driving — so there is no `defaultValue`. `min` when unset.
     */
    value?: number;
    onChange?: (change: FieldChange<number>) => void;
    /** @default 0 */
    min?: number;
    max?: number;
    /** Registers the count with the enclosing Form under this key. */
    name?: string;
    /** @default false */
    isDisabled?: boolean;
    /** A change is being saved: the counter takes no input and shows a bar. @default false */
    isLoading?: boolean;
    onFocus?: (event: FocusEvent) => void;
    onBlur?: (event: FocusEvent) => void;
    testID?: string;
    class?: string;
  }

  let {
    label,
    labelArea,
    accessibilityLabel,
    value = $bindable(),
    onChange,
    min = 0,
    max,
    name,
    isDisabled = false,
    isLoading = false,
    onFocus,
    onBlur,
    testID,
    class: className = '',
    ...styleProps
  }: Props = $props();

  const style = useComponentDefaults('CounterInput', () => styleProps);

  const uid = $props.id();
  const classes = $derived(resolveCounterInput(style.current));
  const counter = createCounterInput({
    id: uid,
    value: () => value,
    onValue: (next) => {
      value = next;
    },
    onChange: (next) => onChange?.({ name, value: next }),
    min: () => min,
    max: () => max,
    name: () => name,
    isDisabled: () => isDisabled,
    isLoading: () => isLoading,
  });
</script>

<div class={cx(classes.root, className)} data-testid={testID}>
  {#if label}
    <FieldLabel
      as="label"
      id={counter.labelId}
      for={counter.inputId}
      text={label}
      size={style.current.size}
      area={labelArea}
    />
  {/if}
  <div class={classes.box[counter.isInert ? 'inert' : 'live']}>
    <div class={classes.controls}>
      <button
        type="button"
        class={classes.button.decrement}
        aria-label="Decrement value"
        disabled={counter.isDecrementDisabled}
        onclick={counter.decrement}
      >
        <Icon source={minus} size={classes.iconSize} />
      </button>
      <span
        class={cx(
          classes.field,
          counter.isKeyboardFocus && classes.fieldFocus,
          counter.slide && classes.slide[counter.slide]
        )}
        style:--counter-digits={counter.digits}
      >
        <input
          id={counter.inputId}
          type="number"
          class={classes.input[counter.isInert ? 'inert' : 'live']}
          {name}
          value={counter.current}
          disabled={isDisabled}
          aria-label={label ? undefined : accessibilityLabel}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={counter.current}
          aria-busy={isLoading || undefined}
          oninput={counter.handleInput}
          onfocus={onFocus}
          onblur={(event) => {
            counter.handleBlur();
            onBlur?.(event);
          }}
        />
      </span>
      <button
        type="button"
        class={classes.button.increment}
        aria-label="Increment value"
        disabled={counter.isIncrementDisabled}
        onclick={counter.increment}
      >
        <Icon source={plus} size={classes.iconSize} />
      </button>
    </div>
    {#if isLoading}
      <span class={classes.loader} aria-hidden="true">
        <span class={classes.loaderBar}></span>
      </span>
    {/if}
  </div>
</div>

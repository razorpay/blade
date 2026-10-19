<script lang="ts">
  import type { FieldChange } from '../shared/change';
  import { useComponentDefaults } from '../defaults';
  import { cx } from '../../cx';
  import { createCounterInput } from '../../runes/counter-input/counter-input.svelte';
  import Icon from '../icon/Icon.svelte';
  import FieldLabel from '../shared/FieldLabel.svelte';
  import { MinusIcon, PlusIcon } from '../../icons';
  import { analyticsAttributes, type AnalyticsAttributes } from '../../runes/dom/analytics';
  import { resolveCounterInput, type CounterInputStyleProps } from './styles';

  interface BehaviourProps extends CounterInputStyleProps {
    label?: string;
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
    /** A change is being saved: the counter takes no input (its field is disabled) and shows a bar. @default false */
    isLoading?: boolean;
    onFocus?: (event: FocusEvent) => void;
    onBlur?: (event: FocusEvent) => void;
    testID?: string;
    class?: string;
  }

  type Props = BehaviourProps & AnalyticsAttributes;

  let {
    label,
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
  // Blade puts them on the root.
  const analytics = $derived(analyticsAttributes(styleProps));

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

<div class={cx(classes.root, className)} data-testid={testID} {...analytics}>
  {#if label}
    <FieldLabel
      as="label"
      id={counter.labelId}
      for={counter.inputId}
      text={label}
      size={style.current.size}
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
        <Icon source={MinusIcon} size={classes.iconSize} />
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
          disabled={counter.isInert}
          aria-label={label ? undefined : accessibilityLabel}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={counter.current}
          aria-busy={isLoading || undefined}
          oninput={counter.handleInput}
          {@attach counter.attach}
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
        <Icon source={PlusIcon} size={classes.iconSize} />
      </button>
    </div>
    {#if isLoading}
      <span class={classes.loader} aria-hidden="true">
        <span class={classes.loaderBar}></span>
      </span>
    {/if}
  </div>
</div>

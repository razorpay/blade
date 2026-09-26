<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import { getRadioGroup } from '../../runes/radio/context';
  import { createRadio } from '../../runes/radio/radio.svelte';
  import type { RadioClasses } from './styles';

  interface Props {
    /** What the group's `value` becomes when this radio is picked. */
    value: string;
    isDisabled?: boolean;
    /** Names the control when there are no `children`. */
    accessibilityLabel?: string;
    /** Lands on the control, the element tests click. */
    testID?: string;
    class?: string;
    /** The label. */
    children?: Snippet;
  }

  // No style props: the look of a radio is the group's decision, and its
  // parts come from the group by context.
  let {
    value,
    isDisabled = false,
    accessibilityLabel,
    testID,
    class: className = '',
    children,
  }: Props = $props();

  // A Radio belongs in a RadioGroup; outside one it is an inert control.
  const radio = createRadio(getRadioGroup<RadioClasses>(), {
    value: () => value,
    isDisabled: () => isDisabled,
  });

  const classes = $derived(radio.shared);
  const indicator = $derived(classes?.indicator);
</script>

<label
  class={cx(
    classes?.row,
    classes?.pick[radio.pick],
    radio.isDisabled && classes?.disabled,
    className
  )}
>
  <input
    type="radio"
    class={classes?.control}
    name={radio.name}
    {value}
    checked={radio.isSelected}
    disabled={radio.isDisabled}
    aria-label={children ? undefined : accessibilityLabel}
    data-testid={testID}
    onchange={radio.handleChange}
    {@attach radio.sync}
  />
  {#if indicator}
    <span
      class={cx(indicator.root, indicator.look[radio.tone][radio.pick])}
      aria-hidden="true"
    >
      <span class={indicator.dot[radio.pick]}></span>
    </span>
  {/if}
  {#if children}
    <span class={classes?.label}>{@render children()}</span>
  {/if}
</label>

<script lang="ts">
  import { getRadioGroup } from '../../runes/radio/context';
  import Icon from '../icon/Icon.svelte';
  import Radio from '../radio/Radio.svelte';
  import type { RadioClasses } from '../radio/styles';
  import type { SegmentedControlItemProps } from './styles';

  let {
    value,
    leading,
    trailing,
    isDisabled,
    accessibilityLabel,
    testID,
    class: className = '',
    children: label,
  }: SegmentedControlItemProps = $props();

  const group = getRadioGroup<RadioClasses>();
  const iconSize = $derived(group?.shared.iconSize ?? 'medium');
  // A leading asset sits in the icon's box: 16px, 20px at large.
  const leadingBox = $derived(
    iconSize === 'large'
      ? 'flex shrink-0 items-center justify-center w-5 h-5'
      : 'flex shrink-0 items-center justify-center w-4 h-4'
  );
</script>

<!--
  The Radio's label is the segment. An icon-only segment is named through
  that label: the Icon carries the name, so the radio reads as its text.
-->
<Radio {value} {isDisabled} {testID} class={className}>
  {#snippet children(state)}
  {#if typeof leading === 'function'}
    <span class={leadingBox}>{@render leading(state)}</span>
  {:else if leading}
    <Icon
      source={leading}
      size={iconSize}
      accessibilityLabel={label ? undefined : accessibilityLabel}
    />
  {/if}
  {#if label}{@render label(state)}{/if}
  {@render trailing?.(state)}
  {/snippet}
</Radio>

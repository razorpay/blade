<script lang="ts">
  import { getRadioGroup } from '../../runes/radio/context';
  import Icon from '../icon/Icon.svelte';
  import Radio from '../radio/Radio.svelte';
  import type { RadioClasses } from '../radio/styles';
  import type { SegmentedControlItemProps } from './styles';

  let {
    value,
    icon,
    isDisabled,
    accessibilityLabel,
    testID,
    class: className = '',
    children: label,
  }: SegmentedControlItemProps = $props();

  const group = getRadioGroup<RadioClasses>();
</script>

<!--
  The Radio's label is the segment. An icon-only segment is named through
  that label: the Icon carries the name, so the radio reads as its text.
-->
<Radio {value} {isDisabled} {testID} class={className}>
  {#snippet children(state)}
  {#if icon}
    <Icon
      source={icon}
      size={group?.shared.iconSize ?? 'medium'}
      accessibilityLabel={label ? undefined : accessibilityLabel}
    />
  {/if}
  {#if label}{@render label(state)}{/if}
  {/snippet}
</Radio>

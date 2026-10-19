<script lang="ts">
  import { getRadioGroup } from '../../runes/radio/context';
  import Icon from '../icon/Icon.svelte';
  import Radio from '../radio/Radio.svelte';
  import type { RadioClasses } from '../radio/styles';
  import { segmentLeadingBox, type SegmentedControlItemProps } from './styles';

  let {
    value,
    leading,
    trailing,
    isDisabled,
    accessibilityLabel,
    testID,
    class: className = '',
    children: label,
    ...analytics
  }: SegmentedControlItemProps = $props();

  const group = getRadioGroup<RadioClasses>();
  const iconSize = $derived(group?.shared.iconSize ?? 'medium');
  const leadingBox = $derived(segmentLeadingBox(iconSize));
</script>

<!--
  The Radio's label is the segment. A segment with no label (an icon or a
  snippet alone) is named by hidden text in that label, so the radio reads
  as it.
-->
<Radio {value} {isDisabled} {testID} class={className} {...analytics}>
  {#snippet children(state)}
  {#if typeof leading === 'function'}
    <span class={leadingBox}>{@render leading(state)}</span>
  {:else if leading}
    <Icon source={leading} size={iconSize} />
  {/if}
  {#if label}{@render label(state)}{:else if accessibilityLabel}<span class="sr-only">{accessibilityLabel}</span>{/if}
  {@render trailing?.(state)}
  {/snippet}
</Radio>

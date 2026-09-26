<script lang="ts">
  import Icon from '../icon/Icon.svelte';
  import Radio from '../radio/Radio.svelte';
  import type { SegmentedControlItemProps } from './styles';

  let {
    value,
    leading,
    isDisabled,
    accessibilityLabel,
    testID,
    class: className = '',
    children,
  }: SegmentedControlItemProps = $props();
</script>

<!--
  The Radio's label is the segment. An icon-only segment is named through
  that label: the Icon carries the name, so the radio reads as its text.
-->
<Radio {value} {isDisabled} {testID} class={className}>
  {#if leading}
    <Icon
      source={leading}
      accessibilityLabel={children ? undefined : accessibilityLabel}
    />
  {/if}
  {#if children}{@render children()}{/if}
</Radio>

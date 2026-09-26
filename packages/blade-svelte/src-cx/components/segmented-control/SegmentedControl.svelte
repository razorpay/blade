<script lang="ts">
  import RadioGroup from '../radio/RadioGroup.svelte';
  import { segmentedLook, type SegmentedControlProps } from './styles';

  // Blade's names over RadioGroup, drawn through the group's internal
  // `look`: style-only, so the library ships it. The field, its value and
  // the keys are the group's; a RadioGroup given no look is a plain one.
  let {
    value = $bindable(),
    size = 'medium',
    color = 'neutral',
    children,
    ...group
  }: SegmentedControlProps = $props();
</script>

<RadioGroup look={segmentedLook(size, color)} bind:value {...group}>
  {@render children()}
</RadioGroup>

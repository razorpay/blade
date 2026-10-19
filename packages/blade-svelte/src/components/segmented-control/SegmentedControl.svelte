<script lang="ts">
  import { useComponentDefaults } from '../defaults';
  import BaseRadioGroup from '../radio/BaseRadioGroup.svelte';
  import { segmentedLook, type SegmentedControlProps } from './styles';

  // Blade's names over RadioGroup's base, drawn in the pill's classes:
  // style-only, so the library ships it. The field, its value and the keys
  // are the group's.
  let {
    value = $bindable(),
    size,
    color,
    children,
    ...group
  }: SegmentedControlProps = $props();

  const style = useComponentDefaults('SegmentedControl', () => ({ size, color }));
  const classes = $derived(
    segmentedLook(style.current.size ?? 'medium', style.current.color ?? 'neutral'),
  );
</script>

<BaseRadioGroup {classes} bind:value {...group}>
  {@render children()}
</BaseRadioGroup>

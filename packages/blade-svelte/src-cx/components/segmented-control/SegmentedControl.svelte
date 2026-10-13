<script lang="ts">
  import { useComponentDefaults } from '../defaults';
  import RadioGroup from '../radio/RadioGroup.svelte';
  import { segmentedLook, type SegmentedControlProps } from './styles';

  // Blade's names over RadioGroup, drawn through the group's internal
  // `look`: style-only, so the library ships it. The field, its value and
  // the keys are the group's; a RadioGroup given no look is a plain one.
  let {
    value = $bindable(),
    size,
    color,
    children,
    ...group
  }: SegmentedControlProps = $props();

  const style = useComponentDefaults('SegmentedControl', () => ({ size, color }));
</script>

<RadioGroup
  look={segmentedLook(style.current.size ?? 'medium', style.current.color ?? 'neutral')}
  bind:value
  {...group}
>
  {@render children()}
</RadioGroup>

<script lang="ts">
  import {
    SegmentedControl,
    SegmentedControlItem,
    Text,
    type SegmentedControlStyleProps,
  } from '../../index';

  interface Props {
    args: SegmentedControlStyleProps & {
      label?: string;
      helpText?: string;
      isDisabled?: boolean;
    };
  }

  let { args }: Props = $props();

  let tenure = $state<string | undefined>('3');
</script>

<!-- `white` is drawn for a brand-colour pane: the frame stands in for one. -->
<div
  class={`grid max-w-96 gap-4 rounded-small p-4 ${args.color === 'white' ? 'bg-interactive-primary-default' : ''}`}
>
  <SegmentedControl
    bind:value={tenure}
    size={args.size}
    color={args.color}
    label={args.label || undefined}
    accessibilityLabel="EMI tenure"
    helpText={args.helpText || undefined}
    isDisabled={args.isDisabled}
  >
    <SegmentedControlItem value="3">3 months</SegmentedControlItem>
    <SegmentedControlItem value="6">6 months</SegmentedControlItem>
    <SegmentedControlItem value="9" isDisabled>9 months</SegmentedControlItem>
    <SegmentedControlItem value="12">12 months</SegmentedControlItem>
  </SegmentedControl>
  <Text size="small" color="muted">value: {JSON.stringify(tenure)}</Text>
</div>

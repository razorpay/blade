<script lang="ts">
  import SegmentedControl from '../../components/segmented-control/SegmentedControl.svelte';
  import SegmentedControlItem from '../../components/segmented-control/SegmentedControlItem.svelte';
  import InputGroup from '../../components/input-group/InputGroup.svelte';
  import TextInput from '../../components/text-input/TextInput.svelte';

  interface Props {
    /** Mounts the first segment and the first member after the rest. */
    showFirst?: boolean;
  }

  let { showFirst = false }: Props = $props();
</script>

<SegmentedControl value="card" accessibilityLabel="Method" testID="methods">
  {#if showFirst}
    <SegmentedControlItem value="upi">UPI</SegmentedControlItem>
  {/if}
  <SegmentedControlItem value="card">Card</SegmentedControlItem>
</SegmentedControl>

<InputGroup label="Address">
  {#if showFirst}
    <TextInput name="line1" label="Line 1" testID="line1" />
  {/if}
  <TextInput name="city" label="City" testID="city" />
</InputGroup>

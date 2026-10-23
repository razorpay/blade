<script lang="ts">
  import { provideAdapters, type HapticKind } from '../../adapters';
  import Checkbox from '../../components/checkbox/Checkbox.svelte';
  import Chip from '../../components/chip/Chip.svelte';
  import ChipGroup from '../../components/chip/ChipGroup.svelte';
  import Radio from '../../components/radio/Radio.svelte';
  import RadioGroup from '../../components/radio/RadioGroup.svelte';
  import Switch from '../../components/switch/Switch.svelte';

  let { haptics }: { haptics: (kind: HapticKind) => void } = $props();
  // svelte-ignore state_referenced_locally
  provideAdapters({ vibrate: haptics });
</script>

<Checkbox testID="box">Box</Checkbox>
<Switch testID="switch" accessibilityLabel="Switch" />
<RadioGroup label="Radios" testID="radios">
  <Radio value="a">A</Radio>
</RadioGroup>
<ChipGroup label="Chips" testID="chips">
  <Chip value="a">A</Chip>
</ChipGroup>
<Checkbox testID="off" isDisabled>Off</Checkbox>

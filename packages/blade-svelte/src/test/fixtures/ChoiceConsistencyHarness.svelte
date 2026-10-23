<script lang="ts">
  import Checkbox from '../../components/checkbox/Checkbox.svelte';
  import Chip from '../../components/chip/Chip.svelte';
  import ChipGroup from '../../components/chip/ChipGroup.svelte';
  import Link from '../../components/link/Link.svelte';
  import Radio from '../../components/radio/Radio.svelte';
  import RadioGroup from '../../components/radio/RadioGroup.svelte';
  import Switch from '../../components/switch/Switch.svelte';

  interface Props {
    chipSelection?: 'single' | 'multiple';
    chipError?: boolean;
    onSwitchChange?: (change: { isChecked: boolean; value: string | undefined }) => void;
  }

  let { chipSelection = 'single', chipError = false, onSwitchChange }: Props = $props();
</script>

<RadioGroup label="Pay via" testID="pay" data-analytics-group="pay">
  <Radio value="qr" data-analytics-option="qr">QR code</Radio>
  <Radio value="web">Bank website</Radio>
  <Radio value="upi" testID="own">UPI</Radio>
</RadioGroup>

<ChipGroup
  label="Type"
  selectionType={chipSelection}
  isRequired
  validationState={chipError ? 'error' : undefined}
  helpText="Pick one"
  errorText="Required"
  testID="type"
  data-analytics-group="type"
>
  <Chip value="a" data-analytics-option="a">A</Chip>
  <Chip value="b">B</Chip>
</ChipGroup>

<Checkbox testID="terms" data-analytics-field="terms">Terms</Checkbox>
<Switch
  testID="save"
  value="yes"
  name="save"
  onChange={onSwitchChange}
  data-analytics-field="save">Save</Switch
>
<Link href="/x" testID="link" data-analytics-link="x">Go</Link>

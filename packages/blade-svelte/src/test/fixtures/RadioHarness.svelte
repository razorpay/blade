<script lang="ts">
  import Radio from '../../components/radio/Radio.svelte';
  import RadioGroup from '../../components/radio/RadioGroup.svelte';

  interface Props {
    value?: string;
    name?: string;
    onChange?: (change: { name: string | undefined; value: string }) => void;
    isDisabled?: boolean;
    webDisabled?: boolean;
    helpText?: string;
    errorText?: string;
  }

  let {
    value = $bindable(),
    name,
    onChange,
    isDisabled,
    webDisabled,
    helpText,
    errorText,
  }: Props = $props();
</script>

<RadioGroup
  label="Pay via"
  bind:value
  {name}
  {onChange}
  {isDisabled}
  {helpText}
  {errorText}
  testID="group"
  class="mt-2"
  data-analytics-section="pay-via"
>
  <Radio value="qr" testID="qr" helpText="Scan with any UPI app">QR code</Radio>
  <Radio value="web" isDisabled={webDisabled} testID="web">Bank website</Radio>
</RadioGroup>
<p data-testid="bound">{value ?? 'none'}</p>

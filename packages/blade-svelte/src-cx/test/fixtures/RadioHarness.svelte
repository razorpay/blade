<script lang="ts">
  import type { FormData } from '../../runes';
  import Button from '../../components/button/Button.svelte';
  import Form from '../../components/form/Form.svelte';
  import Radio from '../../components/radio/Radio.svelte';
  import RadioGroup from '../../components/radio/RadioGroup.svelte';

  interface Props {
    inForm?: boolean;
    value?: string;
    name?: string;
    onChange?: (value: string) => void;
    onSubmit?: (data: FormData) => void;
    isDisabled?: boolean;
    webDisabled?: boolean;
    helpText?: string;
    errorText?: string;
  }

  let {
    inForm = false,
    value = $bindable(),
    name,
    onChange,
    onSubmit,
    isDisabled,
    webDisabled,
    helpText,
    errorText,
  }: Props = $props();
</script>

{#snippet group(required: boolean)}
  <RadioGroup
    label="Pay via"
    bind:value
    {name}
    {onChange}
    {isDisabled}
    isRequired={required}
    {helpText}
    {errorText}
    testID="group"
    class="mt-2"
  >
    <Radio value="qr" testID="qr">QR code</Radio>
    <Radio value="web" isDisabled={webDisabled} testID="web">Bank website</Radio
    >
  </RadioGroup>
{/snippet}

{#if inForm}
  <Form name="nb" {onSubmit} formatConstraintError={(code) => `msg:${code}`}>
    {@render group(true)}
    <Button testID="continue">Continue</Button>
  </Form>
{:else}
  {@render group(false)}
{/if}
<p data-testid="bound">{value ?? 'none'}</p>

<script lang="ts">
  import type { FormData, FormErrors } from '../../runes';
  import Button from '../../components/button/Button.svelte';
  import Form from '../../components/form/Form.svelte';
  import TextInput from '../../components/text-input/TextInput.svelte';

  interface Props {
    onSubmit?: (data: FormData, event?: unknown) => unknown;
    onValidationFailed?: (errors: FormErrors) => void;
    formatConstraintError?: (code: string) => string;
    accessibilityLabel?: string;
    format?: {
      parse: (value: unknown) => string;
      format: (value: unknown) => string;
    };
  }

  let {
    onSubmit,
    onValidationFailed,
    formatConstraintError,
    accessibilityLabel,
    format,
  }: Props = $props();
</script>

<Form
  name="card"
  {onSubmit}
  {onValidationFailed}
  {formatConstraintError}
  {accessibilityLabel}
>
  <TextInput
    name="card.number"
    label="Card number"
    isRequired
    {format}
    testID="card-number"
  />
  <Button type="submit" testID="pay">Pay</Button>
</Form>

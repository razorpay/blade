<script lang="ts">
  import type { FormData } from '../../runes';
  import { provideAdapters } from '../../adapters';
  import Button from '../../components/button/Button.svelte';
  import Form from '../../components/form/Form.svelte';
  import OTPInput from '../../components/otp-input/OTPInput.svelte';

  interface Props {
    inForm?: boolean;
    onSubmit?: (data: FormData) => unknown;
    value?: string;
    otpLength?: number;
    onChange?: (value: string) => void;
    onFilled?: (value: string) => void;
    track?: (event: string, payload?: Record<string, unknown>) => void;
    isMasked?: boolean;
    isDisabled?: boolean;
    isRequired?: boolean;
    validationState?: 'none' | 'error' | 'success';
    helpText?: string;
    errorText?: string;
    successText?: string;
    className?: string;
  }

  let {
    inForm = false,
    onSubmit,
    value,
    otpLength,
    onChange,
    onFilled,
    track,
    isMasked,
    isDisabled,
    isRequired,
    validationState,
    helpText,
    errorText,
    successText,
    className,
  }: Props = $props();

  provideAdapters({ track: (event, payload) => track?.(event, payload) });
</script>

{#snippet otp()}
  <OTPInput
    name="otp"
    label="Enter OTP"
    {value}
    {otpLength}
    {onChange}
    {onFilled}
    {isMasked}
    {isDisabled}
    {isRequired}
    {validationState}
    {helpText}
    {errorText}
    {successText}
    class={className}
    testID="otp"
  />
{/snippet}

{#if inForm}
  <Form name="verify" {onSubmit}>
    {@render otp()}
    <Button type="submit" testID="go">Go</Button>
  </Form>
{:else}
  {@render otp()}
{/if}

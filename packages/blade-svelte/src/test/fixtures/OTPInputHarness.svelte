<script lang="ts">
  import { provideAdapters, type BladeAdapters } from '../../adapters';
  import OTPInput from '../../components/otp-input/OTPInput.svelte';

  interface Props {
    value?: string;
    otpLength?: number;
    onChange?: (change: { name: string | undefined; value: string }) => void;
    onFilled?: (change: { name: string | undefined; value: string }) => void;
    track?: (event: string, payload?: Record<string, unknown>) => void;
    readOTP?: BladeAdapters['readOTP'];
    reportError?: (error: unknown) => void;
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
    value,
    otpLength,
    onChange,
    onFilled,
    track,
    readOTP,
    reportError,
    isMasked,
    isDisabled,
    isRequired,
    validationState,
    helpText,
    errorText,
    successText,
    className,
  }: Props = $props();

  // svelte-ignore state_referenced_locally
  provideAdapters({
    track: (event, payload) => track?.(event, payload),
    readOTP,
    reportError: (error) => reportError?.(error),
  });
</script>

<OTPInput
  name="otp"
  label="Enter OTP"
  {value}
  {otpLength}
  {onChange}
  onOTPFilled={onFilled}
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

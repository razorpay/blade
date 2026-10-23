<script lang="ts">
  import type { BladeAdapters } from '../../adapters';
  import BladeProvider from '../../components/blade-provider/BladeProvider.svelte';
  import CounterInput from '../../components/counter-input/CounterInput.svelte';
  import OTPInput from '../../components/otp-input/OTPInput.svelte';
  import PasswordInput from '../../components/password-input/PasswordInput.svelte';
  import TextArea from '../../components/text-area/TextArea.svelte';
  import TextInput from '../../components/text-input/TextInput.svelte';

  // One field of each kind, under an app's adapters (a form, a sink).
  interface Props {
    adapters: BladeAdapters;
    field: 'text' | 'textarea' | 'password' | 'otp' | 'counter';
    format?: string;
    autoFocus?: boolean;
  }

  let { adapters, field, format, autoFocus }: Props = $props();
</script>

<BladeProvider {adapters}>
  {#if field === 'text'}
    <TextInput
      name="text"
      label="Text"
      {format}
      {autoFocus}
      showClearButton
      testID="field"
      data-analytics-field="text"
      transform={format
        ? undefined
        : {
            parse: (value) => String(value ?? '').replace(/\D/g, ''),
            format: (value) => String(value ?? ''),
          }}
    />
  {:else if field === 'textarea'}
    <TextArea name="notes" label="Notes" {autoFocus} testID="field" data-analytics-field="notes" />
  {:else if field === 'password'}
    <PasswordInput name="password" label="Password" {autoFocus} testID="field" data-analytics-field="password" />
  {:else if field === 'otp'}
    <OTPInput name="otp" label="Code" otpLength={4} {autoFocus} testID="field" data-analytics-field="otp" />
  {:else}
    <CounterInput name="count" label="Count" testID="field" data-analytics-field="count" />
  {/if}
</BladeProvider>

<script lang="ts">
  import { PasswordInput, type TextInputStyleProps } from '../../index';

  interface Props {
    args: Omit<TextInputStyleProps, 'size'> & {
      size?: 'medium' | 'large';
      label?: string;
      placeholder?: string;
      helpText?: string;
      isDisabled?: boolean;
      showRevealButton?: boolean;
      necessityIndicator?: 'required' | 'none';
      autoComplete?: 'off' | 'current-password' | 'new-password';
    };
  }

  let { args }: Props = $props();

  let value = $state('');
</script>

<div class="grid max-w-96 gap-4">
  <PasswordInput
    bind:value
    label={args.label}
    placeholder={args.placeholder}
    helpText={args.helpText || undefined}
    isDisabled={args.isDisabled}
    showRevealButton={args.showRevealButton}
    necessityIndicator={args.necessityIndicator}
    autoComplete={args.autoComplete}
    size={args.size}
    testID="password-input"
  />
  <p class="text-75 leading-50 text-surface-gray-subtle">value: {JSON.stringify(value)}</p>
</div>

<script lang="ts">
  import { TextInput, type TextInputStyleProps } from '../../index';

  type InputType = 'text' | 'tel' | 'email' | 'url' | 'number';

  interface Props {
    args: TextInputStyleProps & {
      label?: string;
      placeholder?: string;
      helpText?: string;
      type?: InputType;
      isDisabled?: boolean;
      isRequired?: boolean;
      isReadOnly?: boolean;
      maxCharacters?: number;
      necessityIndicator?: 'required' | 'optional' | 'none';
      showClearButton?: boolean;
    };
  }

  let { args }: Props = $props();

  let value = $state<string | number | null | undefined>('');
</script>

<div class="grid max-w-96 gap-4">
  <TextInput
    bind:value
    label={args.label}
    placeholder={args.placeholder}
    helpText={args.helpText || undefined}
    type={args.type}
    isDisabled={args.isDisabled}
    isRequired={args.isRequired}
    isReadOnly={args.isReadOnly}
    maxCharacters={args.maxCharacters}
    size={args.size}
    textAlign={args.textAlign}
    necessityIndicator={args.necessityIndicator}
    showClearButton={args.showClearButton}
    testID="basic-input"
  />
  <p class="text-75 leading-50 text-surface-gray-subtle">value: {JSON.stringify(value)}</p>
</div>

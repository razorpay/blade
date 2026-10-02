<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { createPasswordReveal } from '../../runes/text-input/reveal.svelte';
  import IconButton from '../icon-button/IconButton.svelte';
  import { eye, eyeOff } from '../icons';
  import TextInput from '../text-input/TextInput.svelte';

  type TextInputProps = ComponentProps<typeof TextInput>;

  // Blade's PasswordInput: TextInput's field chrome, masked, with a button
  // that reveals the text. No affixes, format or keyboard of its own.
  type Props = Pick<
    TextInputProps,
    | 'label'
    | 'accessibilityLabel'
    | 'labelArea'
    | 'value'
    | 'placeholder'
    | 'onChange'
    | 'onBlur'
    | 'onFocus'
    | 'isDisabled'
    | 'isRequired'
    | 'validationState'
    | 'helpText'
    | 'errorText'
    | 'successText'
    | 'maxCharacters'
    | 'autoFocus'
    | 'enterKeyHint'
    | 'name'
    | 'span'
    | 'size'
    | 'testID'
    | 'class'
    | 'attach'
  > & {
    /** `*` after the label; a password is never marked optional. @default 'none' */
    necessityIndicator?: 'required' | 'none';
    /**
     * What the browser or a password manager offers: `current-password` to
     * sign in, `new-password` to set one. Unset, the browser guesses.
     */
    autoComplete?: 'off' | 'current-password' | 'new-password';
    /** A button that shows and hides the password. @default true */
    showRevealButton?: boolean;
  };

  let {
    value = $bindable(''),
    isDisabled = false,
    showRevealButton = true,
    ...rest
  }: Props = $props();

  const reveal = createPasswordReveal({ isDisabled: () => isDisabled });
</script>

{#snippet revealButton()}
  <IconButton
    icon={reveal.isRevealed ? eyeOff : eye}
    size="medium"
    accessibilityLabel={reveal.isRevealed ? 'Hide password' : 'Show password'}
    onClick={reveal.toggle}
  />
{/snippet}

<TextInput
  bind:value
  {...rest}
  {isDisabled}
  type={reveal.isRevealed ? 'text' : 'password'}
  autoCapitalize="none"
  trailing={showRevealButton && !isDisabled ? revealButton : undefined}
/>

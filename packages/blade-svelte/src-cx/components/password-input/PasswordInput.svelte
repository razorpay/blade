<script lang="ts">
  import type { ComponentProps, Snippet } from 'svelte';
  import { createPasswordReveal } from '../../runes/text-input/reveal.svelte';
  import IconButton from '../icon-button/IconButton.svelte';
  import { EyeIcon, EyeOffIcon } from '../../icons';
  import TextInput from '../text-input/TextInput.svelte';

  type TextInputProps = ComponentProps<typeof TextInput>;

  // Blade's PasswordInput: TextInput's field chrome, masked, with a button
  // that reveals the text. Blade DSL's Password Input (Figma) also has a
  // leading icon, a prefix, a suffix and a trailing link, laid out as
  // TextInput's; no format or keyboard of its own.
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
    | 'leadingIcon'
    | 'prefix'
    | 'suffix'
    | 'testID'
    | 'class'
    | 'attach'
  > & {
    /** Blade DSL's Password Input (Figma) has medium and large only. @default 'medium' */
    size?: 'medium' | 'large';
    /** After the text, before the reveal button: Figma's trailing link (a Link). */
    trailing?: Snippet;
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
    trailing,
    ...rest
  }: Props = $props();

  const showReveal = $derived(showRevealButton && !isDisabled);

  const reveal = createPasswordReveal({ isDisabled: () => isDisabled });
</script>

<!-- The link and the reveal button share TextInput's trailing slot, 8px
     apart, as Figma's trailing items are. -->
{#snippet trailingItems()}
  <span class="flex flex-row items-center gap-2">
    {@render trailing?.()}
    {#if showReveal}
      <IconButton
        icon={reveal.isRevealed ? EyeOffIcon : EyeIcon}
        size={rest.size === 'large' ? 'large' : 'medium'}
        accessibilityLabel={reveal.isRevealed ? 'Hide password' : 'Show password'}
        onClick={reveal.toggle}
      />
    {/if}
  </span>
{/snippet}

<TextInput
  bind:value
  {...rest}
  {isDisabled}
  type={reveal.isRevealed ? 'text' : 'password'}
  autoCapitalize="none"
  trailing={showReveal || trailing ? trailingItems : undefined}
/>

<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { SearchIcon } from '../../icons';
  import TextInput from '../text-input/TextInput.svelte';

  type TextInputProps = ComponentProps<typeof TextInput>;

  // Blade's SearchInput: TextInput's field chrome as a searchbox, led by the
  // search glyph, with the clear button whenever it holds text and the
  // keyboard's search key. A text input underneath, as Blade: a
  // `type="search"` input would draw the browser's clear button beside it.
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
    | 'onClick'
    | 'onKeyDown'
    | 'onClearButtonClick'
    | 'isDisabled'
    | 'helpText'
    | 'autoFocus'
    | 'autoCapitalize'
    | 'name'
    | 'trailing'
    | 'testID'
    | 'class'
    | 'attach'
  > & {
    /** The search glyph ahead of the text. @default true */
    showSearchIcon?: boolean;
    /** Blade DSL's Search Input (Figma) has medium and large only. @default 'medium' */
    size?: 'medium' | 'large';
  };

  let {
    value = $bindable(''),
    showSearchIcon = true,
    ...rest
  }: Props = $props();
</script>

<TextInput
  bind:value
  {...rest}
  type="text"
  role="searchbox"
  enterKeyHint="search"
  showClearButton
  leadingIcon={showSearchIcon ? SearchIcon : undefined}
/>

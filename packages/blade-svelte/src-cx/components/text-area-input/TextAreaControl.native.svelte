<script lang="ts">
  import type { Attachment } from 'svelte/attachments';
  import { maxLength } from '../../runes/dom/max-length';

  interface Props {
    /** The text control's binding: goes on the element. */
    attach: Attachment<HTMLInputElement | HTMLTextAreaElement>;
    id: string;
    class: string;
    value: string;
    name?: string;
    placeholder?: string;
    numberOfLines: number;
    isRequired: boolean;
    isDisabled: boolean;
    isReadOnly: boolean;
    maxCharacters?: number;
    accessibilityLabel?: string;
    isInvalid: boolean;
    describedBy?: string;
    testID?: string;
    oninput: (event: Event) => void;
    onblur: (event: FocusEvent) => void;
    onfocus: (event: FocusEvent) => void;
  }

  let {
    attach,
    id,
    class: className,
    value,
    name,
    placeholder,
    numberOfLines,
    isRequired,
    isDisabled,
    isReadOnly,
    maxCharacters,
    accessibilityLabel,
    isInvalid,
    describedBy,
    testID,
    oninput,
    onblur,
    onfocus,
  }: Props = $props();
</script>

<!--
  Native maps only `input` to a text view — there is no multi-line mapping
  yet — so the text area degrades to a single-line field there.
-->
<input
  {id}
  class={className}
  {value}
  {name}
  {placeholder}
  required={isRequired || undefined}
  disabled={isDisabled || undefined}
  readonly={isReadOnly || undefined}
  spellcheck={false}
  aria-label={accessibilityLabel}
  aria-invalid={isInvalid ? 'true' : undefined}
  aria-describedby={describedBy}
  data-testid={testID}
  {oninput}
  {onblur}
  {onfocus}
  {@attach maxLength(() => maxCharacters)}
  {@attach attach}
/>

<script lang="ts">
  import type { Attachment } from 'svelte/attachments';

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
    onkeydown?: (event: KeyboardEvent) => void;
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
    onkeydown,
  }: Props = $props();
</script>

<!-- The element is the only platform difference: see the native twin. -->
<textarea
  {id}
  class={className}
  {value}
  {name}
  {placeholder}
  rows={numberOfLines}
  required={isRequired || undefined}
  disabled={isDisabled || undefined}
  readonly={isReadOnly || undefined}
  maxlength={maxCharacters}
  spellcheck={false}
  aria-label={accessibilityLabel}
  aria-invalid={isInvalid ? 'true' : undefined}
  aria-describedby={describedBy}
  data-testid={testID}
  {oninput}
  {onblur}
  {onfocus}
  {onkeydown}
  {@attach attach}></textarea>

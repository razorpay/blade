<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getAdapters } from '../../adapters';
  import { provideForm } from '../../runes/form/context';
  import { createForm } from '../../runes/form/form.svelte';
  import type {
    ConstraintErrorFormatter,
    FormData,
    FormErrors,
    FormState,
  } from '../../runes/form/types';

  interface Props {
    name?: string;
    validator?: (data: FormData) => FormErrors | Promise<FormErrors>;
    onSubmit?: (data: FormData, event?: unknown) => unknown;
    onInput?: (data: FormData, event?: unknown) => void;
    /** Maps a failed declarative constraint to the message shown (i18n is the caller's). */
    formatConstraintError?: ConstraintErrorFormatter;
    /**
     * A submit or validate attempt found errors — from any button inside or
     * the Enter key. The first invalid field is revealed either way.
     */
    onValidationFailed?: (errors: FormErrors) => void;
    /** Names the form, which also makes it a landmark. */
    accessibilityLabel?: string;
    testID?: string;
    class?: string;
    /** Receives the live form state (data, errors, touched, submitting). */
    children: Snippet<[FormState]>;
  }

  let {
    name = 'form',
    validator,
    onSubmit,
    onInput,
    formatConstraintError,
    onValidationFailed,
    accessibilityLabel,
    testID,
    class: className = '',
    children,
  }: Props = $props();

  const adapters = getAdapters();
  const form = createForm({
    name,
    formatConstraintError: (code, field) =>
      formatConstraintError?.(code, field) ?? code,
    validator: (data) => validator?.(data) ?? {},
    onSubmit: (data, event) => onSubmit?.(data, event),
    onInput: (data, event) => onInput?.(data, event),
    revealField: adapters.revealField,
    hooks: {
      onSubmitLogged: (payload) =>
        adapters.track?.('form_submit', { name, ...payload }),
      onError: (error) => adapters.captureError?.(error),
    },
  });
  function invalid(errors: FormErrors) {
    onValidationFailed?.(errors);
    form.revealFirstInvalid();
  }
  provideForm(form, { onInvalid: invalid });

  function handleSubmit(event: SubmitEvent) {
    // A submit Button drives the model itself and cancels the native
    // submit, so this path only fires for Enter in a field.
    event.preventDefault();
    form
      .submit({ source: 'enter', event })
      .then((outcome) => {
        if (!outcome.ok) {
          invalid(outcome.errors);
        }
      })
      .catch((error: unknown) => {
        adapters.captureError?.(error);
      });
  }

  export function model() {
    return form;
  }
</script>

<form
  {name}
  novalidate
  aria-label={accessibilityLabel}
  class={className}
  data-testid={testID}
  onsubmit={handleSubmit}
>
  {@render children(form.state)}
</form>

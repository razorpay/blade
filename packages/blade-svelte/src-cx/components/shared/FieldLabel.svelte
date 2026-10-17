<script lang="ts">
  import {
    resolveFieldLabel,
    type FieldNecessity,
    type FieldSize,
  } from './field';

  // Blade's FormLabel, on top. The label element holds the text and its
  // necessity only — it names the control.
  interface Props {
    text: string;
    /** `label` names a control through `for`; `span` is named by `id`. */
    as?: 'label' | 'span';
    for?: string;
    id?: string;
    /** @default 'medium' */
    size?: FieldSize;
    /** @default 'none' */
    necessityIndicator?: FieldNecessity;
    /** Read after the label, not shown. */
    accessibilityText?: string;
  }

  let {
    text,
    as = 'span',
    for: htmlFor,
    id,
    size = 'medium',
    necessityIndicator = 'none',
    accessibilityText,
  }: Props = $props();

  const classes = $derived(resolveFieldLabel(size, necessityIndicator));
</script>

<div class={classes.row}>
  <svelte:element
    this={as}
    {id}
    for={as === 'label' ? htmlFor : undefined}
    class={classes.label}
  >
    <span class={classes.text}>{text}</span>
    {#if necessityIndicator !== 'none' || accessibilityText}
      <span class="sr-only"
        >{necessityIndicator !== 'none' ? ` ${necessityIndicator}` : ''}{accessibilityText
          ? ` ${accessibilityText}`
          : ''}</span
      >
    {/if}
    {#if necessityIndicator === 'required'}
      <span class={classes.required} aria-hidden="true">*</span>
    {:else if necessityIndicator === 'optional'}
      <span class={classes.optional} aria-hidden="true">(optional)</span>
    {/if}
  </svelte:element>
</div>

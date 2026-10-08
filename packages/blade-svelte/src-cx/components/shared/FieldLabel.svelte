<script lang="ts">
  import type { Snippet } from 'svelte';
  import {
    resolveFieldLabel,
    type FieldNecessity,
    type FieldSize,
  } from './field';

  // Blade's FormLabel, on top. The label element holds the text and its
  // necessity only — it names the control, so nothing else may sit inside
  // it. `row` places it among other content: an info tooltip, a link.
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
    /**
     * The label's row: render the `label` snippet it receives with
     * anything beside it, items 4px apart, `ms-auto` pushing one to the end.
     */
    row?: Snippet<[{ label: Snippet }]>;
  }

  let {
    text,
    as = 'span',
    for: htmlFor,
    id,
    size = 'medium',
    necessityIndicator = 'none',
    accessibilityText,
    row,
  }: Props = $props();

  const classes = $derived(resolveFieldLabel(size, necessityIndicator));
</script>

{#snippet label()}
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
{/snippet}

<div class={classes.row}>
  {#if row}
    {@render row({ label })}
  {:else}
    {@render label()}
  {/if}
</div>

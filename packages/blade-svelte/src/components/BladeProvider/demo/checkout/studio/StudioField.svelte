<script lang="ts">
  import type { Snippet } from 'svelte';
  import Text from '../../../../Typography/Text/Text.svelte';

  let {
    label,
    controlId,
    layout = 'inline',
    children,
  }: {
    label: string;
    /** Set when the control is a labelable element so the label targets it. */
    controlId?: string;
    layout?: 'inline' | 'stacked';
    children: Snippet;
  } = $props();
</script>

<div class="studio-field" class:is-stacked={layout === 'stacked'}>
  {#if controlId}
    <label class="studio-field-label" for={controlId}>
      <Text size="small" weight="medium" color="surface.text.gray.subtle">{label}</Text>
    </label>
  {:else}
    <span class="studio-field-label">
      <Text size="small" weight="medium" color="surface.text.gray.subtle">{label}</Text>
    </span>
  {/if}
  <div class="studio-field-control">
    {@render children()}
  </div>
</div>

<style>
  .studio-field {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    width: 100%;
  }

  .studio-field.is-stacked {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-2);
  }

  .studio-field-label {
    flex-shrink: 0;
    width: 100px;
  }

  .is-stacked .studio-field-label {
    width: auto;
  }

  .studio-field-control {
    display: flex;
    flex: 1;
    align-items: center;
    gap: var(--spacing-3);
    min-width: 0;
  }

  .is-stacked .studio-field-control {
    width: 100%;
  }
</style>

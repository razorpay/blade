<script lang="ts">
  import type { Snippet } from 'svelte';
  import Text from '../../../../Typography/Text/Text.svelte';
  import { ChevronDownIcon } from '../../../../Icons';

  let {
    title,
    defaultIsExpanded = true,
    children,
  }: {
    title: string;
    defaultIsExpanded?: boolean;
    children: Snippet;
  } = $props();

  let isExpanded = $state(defaultIsExpanded);
</script>

<section class="studio-section">
  <button
    type="button"
    class="studio-section-header"
    aria-expanded={isExpanded}
    onclick={() => {
      isExpanded = !isExpanded;
    }}
  >
    <Text size="small" weight="semibold">{title}</Text>
    <span class="studio-section-chevron" class:is-expanded={isExpanded}>
      <ChevronDownIcon size="small" color="surface.icon.gray.subtle" />
    </span>
  </button>

  {#if isExpanded}
    <div class="studio-section-body">
      {@render children()}
    </div>
  {/if}
</section>

<style>
  .studio-section {
    display: flex;
    flex-direction: column;
    padding: var(--spacing-5) var(--spacing-7);
    border-bottom: 1px solid var(--surface-border-gray-subtle);
  }

  .studio-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-4);
    width: 100%;
    margin: 0;
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    text-align: left;
  }

  .studio-section-chevron {
    display: inline-flex;
    transition: transform 150ms ease;
  }

  .studio-section-chevron.is-expanded {
    transform: rotate(180deg);
  }

  .studio-section-body {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-5);
    padding-top: var(--spacing-5);
  }
</style>

<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { OptionListItemBehaviourProps } from '../option-list/styles';
  import { cx } from '../../cx';
  import { resolveOptionListItem } from './styles';

  let {
    title,
    description,
    leading,
    trailing,
    testID,
    class: className = '',
  }: OptionListItemBehaviourProps = $props();
</script>

{#snippet edge(content: string | Snippet)}
  {#if typeof content === 'string'}{content}{:else}{@render content()}{/if}
{/snippet}

<span class={cx(resolveOptionListItem().root, className)} data-testid={testID}>
  {#if leading}
    <span class={resolveOptionListItem().leading}>{@render edge(leading)}</span>
  {/if}
  <span class={resolveOptionListItem().text}>
    <span class={resolveOptionListItem().title}>{title}</span>
    {#if description}
      <span class={resolveOptionListItem().description}>{description}</span>
    {/if}
  </span>
  {#if trailing}
    <span class={resolveOptionListItem().trailing}>
      {@render edge(trailing)}
    </span>
  {/if}
</span>

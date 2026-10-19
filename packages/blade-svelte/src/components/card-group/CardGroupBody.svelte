<script lang="ts">
  import type { Snippet } from 'svelte';
  import CollapsePanel from '../shared/CollapsePanel.svelte';

  // A CardGroupItem's `body`: what the row reveals, under it in the row's
  // wrapper, with Blade's Collapsible motion; unmounted while closed.
  interface Props {
    id: string;
    isOpen: boolean;
    class: string;
    children: Snippet;
  }

  let { id, isOpen, class: className, children }: Props = $props();
</script>

{#if isOpen}
  <CollapsePanel {id} duration={280} scrollIntoView={false}>
    <div class={className}>{@render children()}</div>
  </CollapsePanel>
{/if}

<script lang="ts">
  import { onDestroy } from 'svelte';
  import {
    ModalStack,
    getNav,
    IconButton,
    icons,
    LayerHost,
    NavStack,
    Text,
  } from '../../index';
  import Step from './Step.svelte';

  const nav = getNav<{ title: string }>();

  // The chrome is the app's: it reads the stack, the library draws none.
  const top = $derived(nav.entries[nav.entries.length - 1]);

  let last = $state('—');

  if (!nav.depth()) {
    nav.push(Step, {
      props: { depth: 1 },
      name: 'step-1',
      meta: { title: 'Step 1' },
    });
  }
  onDestroy(() => nav.clear());
</script>

<div
  class="relative flex h-[28rem] w-full max-w-96 flex-col overflow-hidden rounded-small border-thin border-solid border-surface-gray-muted"
>
  <header
    class="flex h-12 items-center gap-2 border-b-thin border-solid border-surface-gray-muted px-2"
  >
    {#if nav.entries.length > 1}
      <IconButton
        icon={icons.arrowLeft}
        accessibilityLabel="Back"
        onClick={() => nav.back()}
      />
    {/if}
    <Text weight="semibold">{top?.entry.meta?.title ?? ''}</Text>
  </header>
  <NavStack
    accessibilityLabel="Checkout"
    onChange={(entry, direction) => {
      last = `${entry?.entry.name ?? 'none'} (${direction})`;
    }}
  />
  <ModalStack />
  <LayerHost />
</div>
<Text size="small" color="muted" class="mt-2">onChange: {last}</Text>

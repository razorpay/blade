<script lang="ts">
  import { onDestroy } from 'svelte';
  import {
    Button,
    BottomBar,
    getNav,
    openModal,
    Screen,
    Text,
    type NavScreenControl,
  } from '../../index';
  import Step from './Step.svelte';
  import Notice from './Notice.svelte';

  interface Props {
    depth: number;
    screen: NavScreenControl<string>;
  }

  let { depth, screen }: Props = $props();

  const nav = getNav<{ title: string }>();
  let isGuarded = $state(false);

  function next(isLazy: boolean) {
    // Stands in for a slow `import('./Step.svelte')`.
    const component = isLazy
      ? new Promise<typeof Step>((resolve) => {
          setTimeout(() => resolve(Step), 1200);
        })
      : Step;
    nav.push(component, {
      props: { depth: depth + 1 },
      name: `step-${depth + 1}`,
      meta: { title: `Step ${depth + 1}` },
    });
  }

  // A veto is an answer of `true`: the screen stays until it pops itself.
  // svelte-ignore state_referenced_locally
  onDestroy(screen.onBack(() => (isGuarded ? true : undefined)));
</script>

<Screen>
  <div class="flex flex-col items-start gap-3">
    <Text>Screen {depth}. Its state is its own: it unmounts when covered.</Text>
    <Button type="button" onClick={() => next(false)}>Push a screen</Button>
    <Button variant="secondary" type="button" onClick={() => next(true)}>
      Push a lazy screen
    </Button>
    <Button
      variant="secondary"
      type="button"
      onClick={() => openModal(Notice, { title: 'A layer over the stack' })}
    >
      Open a modal, then press Back
    </Button>
    <label class="flex items-center gap-2">
      <input type="checkbox" bind:checked={isGuarded} />
      <Text size="small">Veto back on this screen</Text>
    </label>
  </div>
  {#snippet footer()}
    <BottomBar>
      <div class="p-3">
        <Button type="button" class="w-full" onClick={() => screen.pop(`left ${depth}`)}>
          Done
        </Button>
      </div>
    </BottomBar>
  {/snippet}
</Screen>

<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import {
    Button,
    ModalStack,
    LayerHost,
    openModal,
    Text,
  } from '../../index';
  import ImperativeConfirm from './ImperativeConfirm.svelte';

  let answer = $state('—');

  // A flow in plain code: open, wait, act on the answer.
  function ask() {
    const handle = openModal<ComponentProps<typeof ImperativeConfirm>, boolean>(
      ImperativeConfirm,
      {
        props: { bank: 'HDFC Bank' },
        title: 'Redirecting',
        closeLabel: 'Close',
        variant: 'sheet',
      }
    );
    handle.result
      .then((result) => {
        answer = result ? 'continued' : 'dismissed';
      })
      .catch(() => {
        answer = 'failed';
      });
  }

  // Stands in for a slow `import('./Sheet.svelte')`.
  function askLazily() {
    const slow = new Promise<typeof ImperativeConfirm>((resolve) => {
      setTimeout(() => resolve(ImperativeConfirm), 1500);
    });
    openModal(slow, {
      props: { bank: 'a lazily loaded bank' },
      title: 'Loaded on demand',
      closeLabel: 'Close',
      pendingLabel: 'Loading',
      variant: 'sheet',
    });
  }
</script>

<div class="flex flex-col items-start gap-3">
  <Button type="button" onClick={ask}>Ask and wait</Button>
  <Button variant="secondary" type="button" onClick={askLazily}>
    Open a lazy component
  </Button>
  <Text size="small" color="muted">answer: {answer}</Text>
</div>
<ModalStack />
<LayerHost />

<script lang="ts">
  import { Alert, Async, Button, Text } from '../../index';

  interface Props {
    args: { pendingDelay?: number; lines?: number };
  }

  let { args }: Props = $props();

  function load(ms: number, isFailing = false): Promise<string[]> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (isFailing) {
          reject(new Error('The bank list did not load'));
        } else {
          resolve(['HDFC Bank', 'ICICI Bank', 'State Bank of India']);
        }
      }, ms);
    });
  }

  let promise = $state(load(1500));
</script>

<div class="flex w-72 flex-col gap-3">
  <div class="flex gap-2">
    <Button type="button" size="small" onClick={() => (promise = load(1500))}>
      Slow
    </Button>
    <Button type="button" size="small" onClick={() => (promise = load(50))}>
      Fast
    </Button>
    <Button
      type="button"
      size="small"
      variant="secondary"
      onClick={() => (promise = load(800, true))}
    >
      Failing
    </Button>
  </div>
  <Async
    {promise}
    pendingDelay={args.pendingDelay}
    lines={args.lines}
    pendingLabel="Loading banks"
  >
    {#snippet children({ value: banks })}
      {#each banks as bank (bank)}
        <Text>{bank}</Text>
      {/each}
    {/snippet}
    {#snippet failed({ error })}
      <Alert
        color="negative"
        description={(error as Error).message}
        isDismissible={false}
      />
    {/snippet}
  </Async>
</div>

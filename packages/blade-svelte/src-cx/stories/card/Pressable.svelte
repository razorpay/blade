<script lang="ts">
  import { Card, Text } from '../../index';

  interface Props {
    args: { isDisabled?: boolean };
  }

  let { args }: Props = $props();

  let picked = $state('—');
</script>

<div class="flex max-w-96 flex-col gap-3">
  {#each ['HDFC Bank', 'ICICI Bank'] as bank (bank)}
    <Card isDisabled={args.isDisabled} onPress={() => (picked = bank)}>
      {#snippet body()}
        <Text weight="semibold">{bank}</Text>
        <Text size="small" color="muted">Netbanking</Text>
      {/snippet}
    </Card>
  {/each}
  <Text size="small" color="muted">pressed: {picked}</Text>
</div>

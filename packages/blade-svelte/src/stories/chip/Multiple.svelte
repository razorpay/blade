<script lang="ts">
  import { Chip, ChipGroup, Text, type ChipGroupStyleProps } from '../../index';

  interface Props {
    args: ChipGroupStyleProps;
  }

  let { args }: Props = $props();

  // Blade's story values.
  const CAPABILITIES = [
    'Automated Payment Links',
    'Wallet on My App',
    'Offer discounts, Pay Later & EMI options',
  ];
  let value = $state<string | readonly string[] | null>([]);
</script>

<div class="flex flex-col gap-3">
  <ChipGroup
    selectionType="multiple"
    label="What other capabilities are you looking for?"
    bind:value
    size={args.size}
    color={args.color}
  >
    {#each CAPABILITIES as capability (capability)}
      <Chip value={capability}>{capability}</Chip>
    {/each}
  </ChipGroup>
  <Text size="small" color="muted">value: {JSON.stringify(value)}</Text>
</div>

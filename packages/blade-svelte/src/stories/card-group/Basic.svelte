<script lang="ts">
  import {
    CardGroupItem,
    CardGroup,
    type CardGroupStyleProps,
  } from '../../index';
  import { BANKS, type Bank } from './banks';

  interface Props {
    args: CardGroupStyleProps & {
      isDeselectable?: boolean;
      isDisabled?: boolean;
    };
  }

  let { args }: Props = $props();

  let value = $state<Bank | readonly Bank[] | null>(null);
</script>

<div class="grid max-w-96 gap-4">
  <CardGroup
    label="Bank"
    bind:value
    isDeselectable={args.isDeselectable}
    isDisabled={args.isDisabled}
  >
    {#each BANKS as bank (bank.code)}
      <CardGroupItem
        value={bank}
        isDisabled={Boolean(bank.isDown)}
        title={bank.name}
        description={bank.note}
        leading={bank.code.slice(0, 2).toUpperCase()}
      />
    {/each}
  </CardGroup>
  <p class="text-75 leading-50 text-surface-gray-subtle">value: {JSON.stringify(value)}</p>
</div>

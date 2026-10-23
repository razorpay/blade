<script lang="ts">
  import {
    CardGroupItem,
    CardGroup,
    type CardGroupStyleProps,
  } from '../../index';
  import { BANKS, type Bank } from './banks';

  interface Props {
    args: CardGroupStyleProps;
  }

  let { args }: Props = $props();

  let value = $state<Bank | readonly Bank[] | null>([]);
</script>

<div class="grid max-w-96 gap-4">
  <CardGroup
    label="Banks to show first"
    selectionType="multiple"
    bind:value
  >
    {#each BANKS as bank (bank.code)}
      <CardGroupItem
        value={bank}
        isDisabled={Boolean(bank.isDown)}
        title={bank.name}
        description={bank.note}
      />
    {/each}
  </CardGroup>
  <p class="text-75 leading-50 text-surface-gray-subtle">
    value: {JSON.stringify(
      Array.isArray(value) ? value.map((bank: Bank) => bank.code) : value
    )}
  </p>
</div>

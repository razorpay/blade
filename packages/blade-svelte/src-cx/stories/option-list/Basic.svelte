<script lang="ts">
  import {
    OptionList,
    OptionListItem,
    type OptionListStyleProps,
  } from '../../index';
  import { BANKS, type Bank } from './banks';

  interface Props {
    args: OptionListStyleProps & {
      isDeselectable?: boolean;
      isDisabled?: boolean;
    };
  }

  let { args }: Props = $props();

  let value = $state<Bank | readonly Bank[] | null>(null);
</script>

<div class="grid max-w-96 gap-4">
  <OptionList
    label="Bank"
    options={BANKS}
    optionKey={(bank) => bank.code}
    isOptionDisabled={(bank) => Boolean(bank.isDown)}
    bind:value
    variant={args.variant}
    indicator={args.indicator}
    isDeselectable={args.isDeselectable}
    isDisabled={args.isDisabled}
  >
    {#snippet item(bank)}
      <OptionListItem
        title={bank.name}
        description={bank.note}
        leading={bank.code.slice(0, 2).toUpperCase()}
      />
    {/snippet}
  </OptionList>
  <p class="text-75 leading-50 text-surface-gray-subtle">value: {JSON.stringify(value)}</p>
</div>

<script lang="ts">
  import {
    OptionList,
    OptionListItem,
    type OptionListStyleProps,
  } from '../../index';
  import { BANKS, type Bank } from './banks';

  interface Props {
    args: OptionListStyleProps;
  }

  let { args }: Props = $props();

  let value = $state<Bank | readonly Bank[] | null>([]);
</script>

<div class="grid max-w-96 gap-4">
  <OptionList
    label="Banks to show first"
    options={BANKS}
    optionKey={(bank) => bank.code}
    isOptionDisabled={(bank) => Boolean(bank.isDown)}
    isMultiple
    bind:value
    variant={args.variant}
    indicator={args.indicator}
  >
    {#snippet item(bank)}
      <OptionListItem title={bank.name} description={bank.note} />
    {/snippet}
  </OptionList>
  <p class="text-75 leading-50 text-surface-gray-subtle">
    value: {JSON.stringify(
      Array.isArray(value) ? value.map((bank: Bank) => bank.code) : value
    )}
  </p>
</div>

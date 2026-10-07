<script lang="ts">
  import { Button, Form, OptionItem, OptionList } from '../../index';
  import type { FormData } from '../../runes';
  import { describeConstraint } from '../helpers';
  import { BANKS } from './banks';

  let submitted = $state<FormData | null>(null);
</script>

<Form
  name="netbanking"
  formatConstraintError={describeConstraint}
  onSubmit={(data) => {
    submitted = data;
  }}
  class="grid max-w-96 gap-4"
>
  <OptionList
    label="Bank"
    name="bank"
    isRequired
  >
    {#each BANKS as bank (bank.code)}
      <OptionItem
        value={bank}
        isDisabled={Boolean(bank.isDown)}
        title={bank.name}
        description={bank.note}
      />
    {/each}
  </OptionList>
  <Button type="submit">Continue</Button>
  {#if submitted}
    <pre class="text-25 leading-50 text-surface-gray-subtle">{JSON.stringify(
        submitted,
        null,
        2
      )}</pre>
  {/if}
</Form>

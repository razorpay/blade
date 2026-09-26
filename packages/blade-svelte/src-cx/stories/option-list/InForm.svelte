<script lang="ts">
  import { Button, Form, OptionList, OptionListItem } from '../../index';
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
    options={BANKS}
    optionKey={(bank) => bank.code}
    isOptionDisabled={(bank) => Boolean(bank.isDown)}
    variant="card"
    indicator="leading"
  >
    {#snippet item(bank)}
      <OptionListItem title={bank.name} description={bank.note} />
    {/snippet}
  </OptionList>
  <Button>Continue</Button>
  {#if submitted}
    <pre class="text-25 leading-50 text-surface-gray-subtle">{JSON.stringify(
        submitted,
        null,
        2
      )}</pre>
  {/if}
</Form>

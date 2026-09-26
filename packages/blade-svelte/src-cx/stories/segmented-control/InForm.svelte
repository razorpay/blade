<script lang="ts">
  import {
    Button,
    Form,
    SegmentedControl,
    SegmentedControlItem,
  } from '../../index';
  import type { FormData } from '../../runes';
  import { describeConstraint } from '../helpers';

  let submitted = $state<FormData | null>(null);
</script>

<Form
  name="emi"
  formatConstraintError={describeConstraint}
  onSubmit={(data) => {
    submitted = data;
  }}
  class="grid max-w-96 gap-4"
>
  <SegmentedControl label="Billing cycle" name="cycle" isRequired>
    <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
    <SegmentedControlItem value="yearly">Yearly</SegmentedControlItem>
  </SegmentedControl>
  <Button>Continue</Button>
  {#if submitted}
    <pre class="text-25 leading-50 text-surface-gray-subtle">{JSON.stringify(
        submitted,
        null,
        2
      )}</pre>
  {/if}
</Form>

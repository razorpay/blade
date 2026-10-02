<script lang="ts">
  import { Button, Chip, ChipGroup, Form } from '../../index';
  import type { FormData } from '../../runes';
  import { describeConstraint } from '../helpers';

  let submitted = $state<FormData | null>(null);
</script>

<Form
  name="business"
  formatConstraintError={describeConstraint}
  onSubmit={(data) => {
    submitted = data;
  }}
  class="flex max-w-96 flex-col gap-4"
>
  <ChipGroup label="Business type" name="type" necessityIndicator="required">
    <Chip value="proprietorship">Proprietorship</Chip>
    <Chip value="public">Public</Chip>
    <Chip value="small-business">Small Business</Chip>
  </ChipGroup>
  <Button type="submit">Continue</Button>
  {#if submitted}
    <pre class="text-25 leading-50 text-surface-gray-subtle">{JSON.stringify(submitted)}</pre>
  {/if}
</Form>

<script lang="ts">
  import { Button, CounterInput, Form } from '../../index';
  import type { FormData } from '../../runes';

  let submitted = $state<FormData | null>(null);
</script>

<Form
  name="cart"
  onSubmit={(data) => {
    submitted = data;
  }}
  class="flex max-w-96 flex-col items-start gap-4"
>
  <CounterInput label="Quantity" name="quantity" value={1} min={1} max={10} />
  <Button type="submit">Add to cart</Button>
  {#if submitted}
    <pre class="text-25 leading-50 text-surface-gray-subtle">{JSON.stringify(submitted)}</pre>
  {/if}
</Form>

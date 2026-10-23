<script lang="ts">
  import {
    Amount,
    Collapsible,
    CollapsibleChevron,
    Divider,
    Link,
    Text,
  } from '@razorpay/blade-svelte/components';
</script>

<!-- A pure disclosure: the Link is the trigger, `content` what it reveals. -->
<section class="flex flex-col gap-2 rounded-medium bg-surface-gray-intense p-4 surface-raised">
  <div class="flex items-baseline justify-between">
    <Text weight="semibold">Order total</Text>
    <Amount value={1299} currency="INR" />
  </div>
  <Collapsible>
    <Link variant="button" size="small">View breakdown<CollapsibleChevron size="small" /></Link>
    {#snippet content()}
      <div class="flex flex-col gap-1 pt-3">
        <div class="flex justify-between">
          <Text size="small" color="muted">Items</Text>
          <Amount value={1199} currency="INR" size="small" />
        </div>
        <div class="flex justify-between">
          <Text size="small" color="muted">Delivery</Text>
          <Amount value={100} currency="INR" size="small" />
        </div>
        <Divider class="my-1" />
      </div>
    {/snippet}
  </Collapsible>
</section>

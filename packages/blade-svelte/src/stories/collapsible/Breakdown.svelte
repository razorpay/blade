<script lang="ts">
  import { Amount, Text } from '../../index';
</script>

<!-- Blade's story body: the price breakdown. -->
<div class="flex min-w-[200px] flex-col">
  <div class="flex flex-row items-baseline justify-between">
    <Text>Actual amount</Text>
    <Amount value={1000} />
  </div>
  <div class="flex flex-row items-baseline justify-between">
    <Text class="mt-1">Razorpay Platform Fees</Text>
    <Text>2%</Text>
  </div>
  <div class="flex flex-row items-baseline justify-between">
    <Text class="mt-1">GST</Text>
    <Text>18%</Text>
  </div>
</div>

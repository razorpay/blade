<script lang="ts">
  import { AMOUNT_AXES, Amount, Text } from '../../index';
</script>

<div class="flex flex-col gap-2">
  {#each AMOUNT_AXES.size as size (size)}
    <div class="flex items-baseline gap-4">
      <Text size="xsmall" color="muted" class="w-16">{size}</Text>
      {#each AMOUNT_AXES.affix as affix (affix)}
        <Amount
          value={4999.5}
          currency="INR"
          locale="en-IN"
          {size}
          {affix}
          weight="semibold"
        />
      {/each}
    </div>
  {/each}
</div>

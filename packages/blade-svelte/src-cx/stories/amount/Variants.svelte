<script lang="ts">
  import {
    Amount,
    AMOUNT_TYPE_SIZES,
    AMOUNT_TYPE_WEIGHTS,
    Text,
    type AmountStyleProps,
  } from '../../index';

  const types = ['body', 'heading', 'display'] as const;
</script>

<!-- Every Figma variant: each type's sizes, subtle and plain affixes, in
     each of the type's weights. Without `size` an Amount inherits instead. -->
<div class="flex flex-col gap-6">
  {#each types as type (type)}
    <div class="flex flex-col gap-3">
      <Text size="small" color="muted">{type}</Text>
      {#each AMOUNT_TYPE_SIZES[type] as size (size)}
        <div class="flex flex-wrap items-baseline gap-6">
          <Text size="xsmall" color="muted" class="w-16">{size}</Text>
          {#each AMOUNT_TYPE_WEIGHTS[type] as weight (weight)}
            <Amount
              value={4999.5}
              currency="INR"
              locale="en-IN"
              {...({ type, size, weight } as AmountStyleProps)}
            />
          {/each}
          <Amount
            value={4999.5}
            currency="INR"
            locale="en-IN"
            isAffixSubtle={false}
            {...({ type, size } as AmountStyleProps)}
          />
        </div>
      {/each}
    </div>
  {/each}
  <Amount value={4999.5} currency="INR" locale="en-IN" type="heading" size="large" color="success" />
</div>

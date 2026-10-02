<script lang="ts">
  import { COUNTER_INPUT_AXES, CounterInput } from '../../index';
</script>

<!-- Every size in both emphases, live, loading and disabled. -->
<div class="flex flex-col gap-6">
  {#each COUNTER_INPUT_AXES.emphasis as emphasis (emphasis)}
    <div class="flex flex-wrap items-end gap-6">
      {#each COUNTER_INPUT_AXES.size as size (size)}
        <CounterInput label={`${size} · ${emphasis}`} value={5} {size} {emphasis} />
      {/each}
      <CounterInput label="Loading" value={5} {emphasis} isLoading />
      <CounterInput label="Disabled" value={5} {emphasis} isDisabled />
    </div>
  {/each}
</div>

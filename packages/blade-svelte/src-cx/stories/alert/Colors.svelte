<script lang="ts">
  import { Alert, ALERT_AXES } from '../../index';
</script>

<div class="grid gap-3 m:grid-cols-2">
  {#each ALERT_AXES.emphasis as emphasis (emphasis)}
    <div class="flex flex-col gap-3">
      {#each ALERT_AXES.color as color (color)}
        <Alert
          {color}
          {emphasis}
          title={`${color} ${emphasis}`}
          description="Something the customer should know."
        />
      {/each}
    </div>
  {/each}
</div>

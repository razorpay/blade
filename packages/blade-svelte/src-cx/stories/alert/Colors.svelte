<script lang="ts">
  import { Alert, ALERT_AXES } from '../../index';
</script>

<div class="grid max-w-96 gap-3">
  {#each ALERT_AXES.color as color (color)}
    <Alert {color} title={color}>Something the customer should know.</Alert>
  {/each}
</div>

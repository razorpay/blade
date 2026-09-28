<script lang="ts">
  import { BUTTON_GROUP_AXES, Button, ButtonGroup } from '../../index';
</script>

<div class="flex flex-col gap-4">
  {#each BUTTON_GROUP_AXES.variant as variant (variant)}
    {#each BUTTON_GROUP_AXES.size as size (size)}
      <ButtonGroup {variant} {size}>
        <Button>Day</Button>
        <Button>Week</Button>
        <Button>Month</Button>
      </ButtonGroup>
    {/each}
  {/each}
</div>

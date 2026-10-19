<script lang="ts">
  import { CHIP_GROUP_AXES, Chip, ChipGroup } from '../../index';
</script>

<!-- Every size × colour, one picked and one disabled chip in each. -->
<div class="flex flex-col gap-4">
  {#each CHIP_GROUP_AXES.size as size (size)}
    {#each CHIP_GROUP_AXES.color as color (color)}
      <ChipGroup label={`${size} · ${color}`} {size} {color} value="picked">
        <Chip value="picked">Picked</Chip>
        <Chip value="rest">Rest</Chip>
        <Chip value="off" isDisabled>Disabled</Chip>
      </ChipGroup>
    {/each}
  {/each}
</div>

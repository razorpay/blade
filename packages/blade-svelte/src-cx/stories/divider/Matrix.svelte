<script lang="ts">
  import { DIVIDER_AXES, Divider, Text } from '../../index';
</script>

<div class="grid max-w-96 gap-4">
  {#each DIVIDER_AXES.dividerStyle as dividerStyle (dividerStyle)}
    {#each DIVIDER_AXES.variant as variant (variant)}
      {#each DIVIDER_AXES.thickness as thickness (thickness)}
        <div class="grid gap-1">
          <Text size="small" color="muted">{dividerStyle} · {variant} · {thickness}</Text>
          <Divider {dividerStyle} {variant} {thickness} />
        </div>
      {/each}
    {/each}
  {/each}
</div>

<script lang="ts">
  import { ICON_BUTTON_AXES, IconButton, icons, Text } from '../../index';
</script>

<div class="flex flex-col gap-3">
  {#each ICON_BUTTON_AXES.variant as variant (variant)}
    <div class="flex items-center gap-4">
      <Text size="xsmall" color="muted" class="w-12">{variant}</Text>
      {#each ICON_BUTTON_AXES.size as size (size)}
        <IconButton
          icon={icons.close}
          accessibilityLabel={`Close, ${variant} ${size}`}
          {variant}
          {size}
        />
      {/each}
      <IconButton
        icon={icons.close}
        accessibilityLabel={`Close, ${variant} disabled`}
        {variant}
        isDisabled
      />
      <IconButton
        icon={icons.close}
        accessibilityLabel={`Close, ${variant} busy`}
        {variant}
        isLoading
      />
    </div>
  {/each}
</div>

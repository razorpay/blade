<script lang="ts">
  import { ICON_BUTTON_AXES, IconButton, Text } from '../../index';
  import { CloseIcon } from '../../icons';
</script>

<div class="flex flex-col gap-3">
  {#each ICON_BUTTON_AXES.emphasis as emphasis (emphasis)}
    <!-- subtle is a white glyph, for dark surfaces. -->
    <div
      class={emphasis === 'intense'
        ? 'flex items-center gap-4 p-2'
        : 'flex items-center gap-4 rounded-small bg-feedback-neutral-intense p-2'}
    >
      <Text size="xsmall" color="muted" class="w-16">{emphasis}</Text>
      {#each ICON_BUTTON_AXES.size as size (size)}
        <IconButton
          icon={CloseIcon}
          accessibilityLabel={`Close, ${emphasis} ${size}`}
          {emphasis}
          {size}
        />
        {#if size !== 'large'}
          <IconButton
            icon={CloseIcon}
            accessibilityLabel={`Close, ${emphasis} ${size} highlighted`}
            {emphasis}
            {size}
            isHighlighted
          />
        {/if}
      {/each}
      <IconButton
        icon={CloseIcon}
        accessibilityLabel={`Close, ${emphasis} disabled`}
        {emphasis}
        isDisabled
      />
    </div>
  {/each}
</div>

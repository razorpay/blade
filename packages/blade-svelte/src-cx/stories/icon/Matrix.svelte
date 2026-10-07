<script lang="ts">
  import { ICON_AXES, Icon, Text } from '../../index';
  import { LockIcon } from '../../icons';
</script>

<div class="flex flex-col gap-3">
  {#each ICON_AXES.color as color (color)}
    <div
      class={[
        'flex items-center gap-4 rounded-small p-2 text-surface-gray-normal',
        color === 'white' && 'bg-feedback-neutral-intense',
      ]}
    >
      <Text
        size="xsmall"
        color={color === 'white' ? 'white' : 'muted'}
        class="w-16"
      >
        {color}
      </Text>
      {#each ICON_AXES.size as size (size)}
        <Icon source={LockIcon} {size} {color} />
      {/each}
    </div>
  {/each}
</div>

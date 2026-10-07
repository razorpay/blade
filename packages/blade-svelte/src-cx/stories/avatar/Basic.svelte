<script lang="ts">
  import { Avatar, type AvatarStyleProps } from '../../index';

  interface Props {
    args: AvatarStyleProps & { name?: string; withImage?: boolean; isInteractive?: boolean };
  }

  let { args }: Props = $props();
  let clicks = $state(0);
</script>

<div class="flex items-center gap-4">
  <Avatar
    name={args.name}
    size={args.size}
    variant={args.variant}
    color={args.color}
    isSelected={args.isSelected}
    src={args.withImage ? 'https://avatars.githubusercontent.com/u/46647141?v=4' : undefined}
    onClick={args.isInteractive ? () => (clicks += 1) : undefined}
  />
  {#if args.isInteractive}<span class="text-75 text-surface-gray-muted">clicked {clicks}×</span>{/if}
</div>

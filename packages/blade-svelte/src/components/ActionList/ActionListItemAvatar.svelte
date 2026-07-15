<script lang="ts">
  import Avatar from '../Avatar/Avatar.svelte';
  import type { ActionListItemAvatarProps } from './types';

  // `size` is forced to `xsmall` (mirrors React `_ActionListItemAvatar`); all
  // other Avatar props flow through.
  let { ...avatarProps }: ActionListItemAvatarProps = $props();
</script>

<Avatar size="xsmall" {...avatarProps} />

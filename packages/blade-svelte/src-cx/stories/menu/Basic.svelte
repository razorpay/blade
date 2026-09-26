<script lang="ts">
  import { IconButton, icons, LayerHost, Menu, Text } from '../../index';

  interface Props {
    args: { placement?: 'bottom-end' | 'bottom-start' | 'top-end' | 'right' };
  }

  let { args }: Props = $props();

  const ACTIONS = [
    { id: 'edit', label: 'Edit address', icon: icons.user },
    { id: 'copy', label: 'Copy address', icon: icons.copy },
    { id: 'default', label: 'Make default', icon: icons.check },
    { id: 'remove', label: 'Remove', icon: icons.close },
  ];

  let last = $state('—');
</script>

<div class="relative flex h-64 w-72 flex-col items-end gap-3 p-2">
  <Menu
    items={ACTIONS}
    itemKey={(action) => action.id}
    itemLabel={(action) => action.label}
    itemIcon={(action) => action.icon}
    isItemDisabled={(action) => action.id === 'default'}
    onSelect={(action) => (last = action.label)}
    placement={args.placement}
    accessibilityLabel="Address actions"
  >
    <IconButton icon={icons.more} accessibilityLabel="Address actions" />
  </Menu>
  <Text size="small" color="muted">chose: {last}</Text>
  <LayerHost class="pointer-events-none absolute inset-0" />
</div>

<script lang="ts">
  import { IconButton, LayerHost, Menu, MenuItem, Text } from '../../index';
  import { CheckIcon, CloseIcon, CopyIcon, MoreHorizontalIcon, UserIcon } from '../../icons';

  interface Props {
    args: { placement?: 'bottom-end' | 'bottom-start' | 'top-end' | 'right' };
  }

  let { args }: Props = $props();

  const ACTIONS = [
    { id: 'edit', label: 'Edit address', icon: UserIcon },
    { id: 'copy', label: 'Copy address', icon: CopyIcon },
    { id: 'default', label: 'Make default', icon: CheckIcon },
    { id: 'remove', label: 'Remove', icon: CloseIcon },
  ];

  let last = $state('—');
</script>

<div class="relative flex h-64 w-72 flex-col items-end gap-3 p-2">
  <Menu
    onSelect={(action: (typeof ACTIONS)[number]) => (last = action.label)}
    placement={args.placement}
    accessibilityLabel="Address actions"
    testID="menu"
  >
    {#snippet trigger()}
      <IconButton icon={MoreHorizontalIcon} accessibilityLabel="Address actions" testID="trigger" />
    {/snippet}
    {#each ACTIONS.slice(0, 3) as action (action.id)}
      <MenuItem
        value={action}
        title={action.label}
        icon={action.icon}
        isDisabled={action.id === 'default'}
      />
    {/each}
    <!-- Anything between items is left alone: a divider before the destructive one. -->
    <hr class="my-1 border-t-thin border-solid border-surface-gray-muted" />
    <MenuItem value={ACTIONS[3]} title={ACTIONS[3].label} icon={ACTIONS[3].icon} intent="negative" />
  </Menu>
  <Text size="small" color="muted">chose: <span data-testid="chose">{last}</span></Text>
  <LayerHost class="pointer-events-none absolute inset-0" />
</div>

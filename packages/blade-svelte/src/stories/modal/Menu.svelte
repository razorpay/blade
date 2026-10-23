<script lang="ts">
  import { BladeProvider, ActionList, ActionListItem, Divider, IconButton, Text } from '../../index';
    import { Menu } from '../../components/menu';
  import { CheckIcon, CloseIcon, CopyIcon, MoreHorizontalIcon, UserIcon } from '../../icons';

  interface Props {
    args: {
      placement?: 'bottom-end' | 'bottom-start' | 'top-end' | 'right';
    };
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
<BladeProvider>
  <Menu
    placement={args.placement}
    accessibilityLabel="Address actions"
    testID="menu"
  >
    {#snippet children()}
      <IconButton icon={MoreHorizontalIcon} accessibilityLabel="Address actions" testID="trigger" />
    {/snippet}
    {#snippet body({ close })}
      <!-- The menu holds an ActionList; a pick closes it. -->
      <ActionList
        onPick={({ value }) => {
          last = (value as (typeof ACTIONS)[number]).label;
          close();
        }}
      >
        {#each ACTIONS.slice(0, 3) as action (action.id)}
          <ActionListItem
            value={action}
            title={action.label}
            leading={action.icon}
            isDisabled={action.id === 'default'}
          />
        {/each}
        <!-- A divider before the destructive one: the keys pass over it. -->
        <Divider />
        <ActionListItem value={ACTIONS[3]} title={ACTIONS[3].label} leading={ACTIONS[3].icon} intent="negative" />
      </ActionList>
    {/snippet}
  </Menu>
  <Text size="small" color="muted">chose: <span data-testid="chose">{last}</span></Text>
</BladeProvider>
</div>

<script lang="ts">
  import { ActionList, ActionListItem, Divider, IconButton, OverlayStack, Text } from '../../index';
  import { Modal, type ModalStyleProps } from '../../components/modal';
  import { CheckIcon, CloseIcon, CopyIcon, MoreHorizontalIcon, UserIcon } from '../../icons';

  interface Props {
    args: Pick<ModalStyleProps, 'presentation'> & {
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

<!-- `presentation` is normally the provider's: `defaults={{ Modal: { presentation: 'sheet' } }}`. -->
<div class="relative flex h-64 w-72 flex-col items-end gap-3 p-2">
  <Modal
    variant="menu"
    presentation={args.presentation}
    placement={args.placement}
    accessibilityLabel="Address actions"
    testID="menu"
  >
    {#snippet trigger()}
      <IconButton icon={MoreHorizontalIcon} accessibilityLabel="Address actions" testID="trigger" />
    {/snippet}
    {#snippet body()}
      <!-- Every row acts and closes the menu: an ActionList inside a menu holds no pick. -->
      <ActionList onChange={({ value }) => (last = (value as (typeof ACTIONS)[number]).label)}>
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
  </Modal>
  <Text size="small" color="muted">chose: <span data-testid="chose">{last}</span></Text>
  <OverlayStack class="pointer-events-none absolute inset-0" />
</div>

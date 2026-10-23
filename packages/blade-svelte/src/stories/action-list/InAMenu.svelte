<script lang="ts">
  import { BladeProvider, ActionList, ActionListItem, Button, Text } from '../../index';
    import { Menu } from '../../components/menu';
  import { ChevronDownIcon, ExternalLinkIcon } from '../../icons';

  let last = $state('—');
</script>

<div class="relative flex h-72 flex-col items-start gap-3 p-2">
<BladeProvider>
  <!-- A Menu holds whatever the app puts in it: here an
       ActionList whose pick closes it (`onPick` reports every pick, the
       current one again included). -->
  <Menu accessibilityLabel="Account status">
    {#snippet children({ isOpen })}
      <Button variant="secondary" trailingIcon={ChevronDownIcon}>{isOpen ? 'Choose…' : 'Status'}</Button>
    {/snippet}
    {#snippet body({ close })}
      <ActionList
        value={last}
        onPick={({ value }) => {
          last = String(value);
          close();
        }}
      >
        <ActionListItem value="active" title="Active" />
        <ActionListItem value="paused" title="Paused" />
        <!-- A destructive choice: red. -->
        <ActionListItem value="blocked" title="Blocked" intent="negative" />
        <!-- A link row: navigates, holds no value; it closes the menu itself. -->
        <ActionListItem
          value="help"
          title="What do these mean?"
          href="#status-help"
          leading={ExternalLinkIcon}
          onClick={close}
        />
      </ActionList>
    {/snippet}
  </Menu>
  <Text size="small" color="muted">chose: {last}</Text>
</BladeProvider>
</div>

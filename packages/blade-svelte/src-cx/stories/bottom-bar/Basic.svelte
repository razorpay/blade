<script lang="ts">
  import { BottomBar, Icon, Text } from '../../index';
  import { HomeIcon, ReportsIcon, SettingsIcon, WalletIcon } from '../../icons';

  const items = [
    { label: 'Home', icon: HomeIcon },
    { label: 'Payments', icon: WalletIcon },
    { label: 'Reports', icon: ReportsIcon },
    { label: 'Settings', icon: SettingsIcon },
  ];
</script>

<!-- A phone-sized screen: the bar is placed by the consumer's class. -->
<div class="relative h-[480px] w-[375px] max-w-full overflow-hidden rounded-medium bg-surface-gray-subtle">
  <div class="p-4"><Text color="muted">Screen content</Text></div>
  <BottomBar class="absolute inset-x-0 bottom-0" testID="bar">
    <nav class="flex h-16 w-full flex-row items-center" aria-label="Main">
      {#each items as item (item.label)}
        <a href="#{item.label.toLowerCase()}" class="flex flex-1 flex-col items-center gap-1 text-surface-gray-muted no-underline">
          <Icon source={item.icon} size="large" />
          <Text size="xsmall" color="inherit">{item.label}</Text>
        </a>
      {/each}
    </nav>
  </BottomBar>
</div>

<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Tabs from './Tabs.svelte';

  const { Story } = defineMeta({
    title: 'Components/Tabs',
    component: Tabs,
    tags: ['autodocs'],
    args: {
      variant: 'bordered',
      size: 'medium',
      orientation: 'horizontal',
      isFullWidthTabItem: false,
      isLazy: false,
    },
    argTypes: {
      children: { table: { disable: true } },
      value: { table: { disable: true } },
      defaultValue: { table: { disable: true } },
      onChange: { table: { disable: true } },
      variant: {
        control: 'select',
        options: ['bordered', 'borderless', 'filled'],
        description: 'The variant of the tabs',
        table: { defaultValue: { summary: 'bordered' } },
      },
      size: {
        control: 'select',
        options: ['small', 'medium', 'large'],
        description: 'The size of the tabs',
        table: { defaultValue: { summary: 'medium' } },
      },
      orientation: {
        control: 'select',
        options: ['horizontal', 'vertical'],
        description: 'The orientation of the tabs',
        table: { defaultValue: { summary: 'horizontal' } },
      },
      isFullWidthTabItem: {
        control: 'boolean',
        description: 'If true, TabItems will grow to use all available space',
        table: { defaultValue: { summary: 'false' } },
      },
      isLazy: {
        control: 'boolean',
        description: 'If true, TabPanel renders only when active',
        table: { defaultValue: { summary: 'false' } },
      },
    },
  });
</script>

<script lang="ts">
  import TabList from './TabList.svelte';
  import TabItem from './TabItem.svelte';
  import TabPanel from './TabPanel.svelte';
  import Text from '../Typography/Text/Text.svelte';
  import Badge from '../Badge/Badge.svelte';
  import Counter from '../Counter/Counter.svelte';
  import Button from '../Button/Button.svelte';
  import { HomeIcon } from '../Icons/HomeIcon';
  import { SearchIcon } from '../Icons/SearchIcon';
  import { CreditCardIcon } from '../Icons/CreditCardIcon';
  import type { TabsProps } from './types';

  type TabsStoryArgs = Partial<Omit<TabsProps, 'children'>> & { children?: unknown };

  let controlledValue = $state('plans');

  function getTabsArgs(args: TabsStoryArgs): Omit<TabsProps, 'children'> {
    const { children: _children, ...tabsArgs } = args;
    return tabsArgs as Omit<TabsProps, 'children'>;
  }

  function getPanelStyle(orientation: TabsProps['orientation'] = 'horizontal'): string {
    return orientation === 'vertical'
      ? 'padding-left: var(--spacing-4);'
      : 'padding-top: var(--spacing-4);';
  }
</script>

{#snippet interactiveTabs(args: TabsStoryArgs)}
  {@const panelStyle = getPanelStyle(args.orientation)}
  {@const panelSize = args.size ?? 'medium'}
  <Tabs {...getTabsArgs(args)}>
    {#snippet children()}
      <TabList>
        {#snippet children()}
          <TabItem value="subscriptions">
            {#snippet children()}Subscription{/snippet}
          </TabItem>
          <TabItem value="plans">
            {#snippet children()}Plans{/snippet}
          </TabItem>
          <TabItem value="settings">
            {#snippet children()}Settings{/snippet}
          </TabItem>
        {/snippet}
      </TabList>
      <TabPanel value="subscriptions">
        {#snippet children()}
          <div style={panelStyle}>
            <Text size={panelSize}>
              Subscriptions Panel - This is an overview of your active subscriptions.
            </Text>
          </div>
        {/snippet}
      </TabPanel>
      <TabPanel value="plans">
        {#snippet children()}
          <div style={panelStyle}>
            <Text size={panelSize}>Plans Panel - This is an overview of all your plans.</Text>
          </div>
        {/snippet}
      </TabPanel>
      <TabPanel value="settings">
        {#snippet children()}
          <div style={panelStyle}>
            <Text size={panelSize}>Settings Panel - This is an overview of your settings.</Text>
          </div>
        {/snippet}
      </TabPanel>
    {/snippet}
  </Tabs>
{/snippet}

<Story name="Playground">
  {#snippet template(args)}
    {@render interactiveTabs(args)}
  {/snippet}
</Story>

<Story name="Controlled" asChild>
  <div>
    <div style="margin-bottom: 16px;">
      <Text weight="semibold">Current Tab: {controlledValue}</Text>
      <div style="display: flex; flex-direction: row; gap: 8px; margin-top: 8px;">
        <Button variant="tertiary" onClick={() => { controlledValue = 'subscriptions'; }}>
          Go to Subscriptions
        </Button>
        <Button variant="tertiary" onClick={() => { controlledValue = 'plans'; }}>
          Go to Plans
        </Button>
        <Button variant="tertiary" onClick={() => { controlledValue = 'settings'; }}>
          Go to Settings
        </Button>
      </div>
    </div>
    <Tabs
      value={controlledValue}
      onChange={(val) => { controlledValue = val; }}
    >
      {#snippet children()}
        <TabList>
          {#snippet children()}
            <TabItem value="subscriptions">
              {#snippet children()}Subscription{/snippet}
            </TabItem>
            <TabItem value="plans">
              {#snippet children()}Plans{/snippet}
            </TabItem>
            <TabItem value="settings">
              {#snippet children()}Settings{/snippet}
            </TabItem>
          {/snippet}
        </TabList>
        <TabPanel value="subscriptions">
          {#snippet children()}
            <div style="padding-top: var(--spacing-4);">
              <Text>Subscriptions Panel</Text>
            </div>
          {/snippet}
        </TabPanel>
        <TabPanel value="plans">
          {#snippet children()}
            <div style="padding-top: var(--spacing-4);">
              <Text>Plans Panel</Text>
            </div>
          {/snippet}
        </TabPanel>
        <TabPanel value="settings">
          {#snippet children()}
            <div style="padding-top: var(--spacing-4);">
              <Text>Settings Panel</Text>
            </div>
          {/snippet}
        </TabPanel>
      {/snippet}
    </Tabs>
  </div>
</Story>

<Story name="Size: Medium">
  {#snippet template(args)}
    {@render interactiveTabs(args)}
  {/snippet}
</Story>

<Story name="Size: Small" args={{ size: 'small' }}>
  {#snippet template(args)}
    {@render interactiveTabs(args)}
  {/snippet}
</Story>

<Story name="Size: Large" args={{ size: 'large' }}>
  {#snippet template(args)}
    {@render interactiveTabs(args)}
  {/snippet}
</Story>

<Story name="Filled" args={{ variant: 'filled' }}>
  {#snippet template(args)}
    {@render interactiveTabs(args)}
  {/snippet}
</Story>

<Story name="Filled Vertical" args={{ variant: 'filled', orientation: 'vertical' }}>
  {#snippet template(args)}
    {@render interactiveTabs(args)}
  {/snippet}
</Story>

<Story name="Bordered Vertical" args={{ orientation: 'vertical' }}>
  {#snippet template(args)}
    {@render interactiveTabs(args)}
  {/snippet}
</Story>

<Story name="Borderless" args={{ variant: 'borderless' }}>
  {#snippet template(args)}
    {@render interactiveTabs(args)}
  {/snippet}
</Story>

<Story name="Full Width TabItem" args={{ isFullWidthTabItem: true }}>
  {#snippet template(args)}
    {@render interactiveTabs(args)}
  {/snippet}
</Story>

<Story name="With Leading Icon" asChild>
  <Tabs variant="bordered">
    {#snippet children()}
      <TabList>
        {#snippet children()}
          <TabItem value="subscriptions" leading={HomeIcon}>
            {#snippet children()}Subscription{/snippet}
          </TabItem>
          <TabItem value="plans" leading={CreditCardIcon}>
            {#snippet children()}Plans{/snippet}
          </TabItem>
          <TabItem value="settings" leading={SearchIcon}>
            {#snippet children()}Settings{/snippet}
          </TabItem>
        {/snippet}
      </TabList>
      <TabPanel value="subscriptions">
        {#snippet children()}
          <div style="padding-top: var(--spacing-4);">
            <Text>Subscriptions Panel</Text>
          </div>
        {/snippet}
      </TabPanel>
      <TabPanel value="plans">
        {#snippet children()}
          <div style="padding-top: var(--spacing-4);">
            <Text>Plans Panel</Text>
          </div>
        {/snippet}
      </TabPanel>
      <TabPanel value="settings">
        {#snippet children()}
          <div style="padding-top: var(--spacing-4);">
            <Text>Settings Panel</Text>
          </div>
        {/snippet}
      </TabPanel>
    {/snippet}
  </Tabs>
</Story>

<Story name="With Trailing Badge" asChild>
  <Tabs variant="bordered">
    {#snippet children()}
      <TabList>
        {#snippet children()}
          <TabItem value="subscriptions">
            {#snippet children()}Subscription{/snippet}
            {#snippet trailing()}
              <Badge size="small" color="positive">NEW</Badge>
            {/snippet}
          </TabItem>
          <TabItem value="plans">
            {#snippet children()}Plans{/snippet}
            {#snippet trailing()}
              <Counter size="small" color="positive" value={2} />
            {/snippet}
          </TabItem>
          <TabItem value="settings">
            {#snippet children()}Settings{/snippet}
          </TabItem>
        {/snippet}
      </TabList>
      <TabPanel value="subscriptions">
        {#snippet children()}
          <div style="padding-top: var(--spacing-4);">
            <Text>Subscriptions Panel</Text>
          </div>
        {/snippet}
      </TabPanel>
      <TabPanel value="plans">
        {#snippet children()}
          <div style="padding-top: var(--spacing-4);">
            <Text>Plans Panel</Text>
          </div>
        {/snippet}
      </TabPanel>
      <TabPanel value="settings">
        {#snippet children()}
          <div style="padding-top: var(--spacing-4);">
            <Text>Settings Panel</Text>
          </div>
        {/snippet}
      </TabPanel>
    {/snippet}
  </Tabs>
</Story>

<Story name="With Disabled Tab" asChild>
  <Tabs variant="bordered">
    {#snippet children()}
      <TabList>
        {#snippet children()}
          <TabItem value="subscriptions">
            {#snippet children()}Subscription{/snippet}
          </TabItem>
          <TabItem value="plans" isDisabled={true}>
            {#snippet children()}Plans (Disabled){/snippet}
          </TabItem>
          <TabItem value="settings">
            {#snippet children()}Settings{/snippet}
          </TabItem>
        {/snippet}
      </TabList>
      <TabPanel value="subscriptions">
        {#snippet children()}
          <div style="padding-top: var(--spacing-4);">
            <Text>Subscriptions Panel</Text>
          </div>
        {/snippet}
      </TabPanel>
      <TabPanel value="plans">
        {#snippet children()}
          <div style="padding-top: var(--spacing-4);">
            <Text>Plans Panel</Text>
          </div>
        {/snippet}
      </TabPanel>
      <TabPanel value="settings">
        {#snippet children()}
          <div style="padding-top: var(--spacing-4);">
            <Text>Settings Panel</Text>
          </div>
        {/snippet}
      </TabPanel>
    {/snippet}
  </Tabs>
</Story>

<Story name="Lazy Rendering" args={{ isLazy: true }}>
  {#snippet template(args)}
    <div>
      <Text color="surface.text.gray.subtle" size="small">
        With isLazy=true, TabPanel content only mounts when selected (check DOM inspector).
      </Text>
      <div style="margin-top: var(--spacing-4);">
        {@render interactiveTabs(args)}
      </div>
    </div>
  {/snippet}
</Story>

<Story name="With Href (Link Tab)" asChild>
  <Tabs variant="bordered">
    {#snippet children()}
      <TabList>
        {#snippet children()}
          <TabItem value="subscriptions">
            {#snippet children()}Subscription{/snippet}
          </TabItem>
          <TabItem value="plans">
            {#snippet children()}Plans{/snippet}
          </TabItem>
          <TabItem value="external" href="https://razorpay.com" onClick={(e) => e.preventDefault()}>
            {#snippet children()}External Link{/snippet}
          </TabItem>
        {/snippet}
      </TabList>
      <TabPanel value="subscriptions">
        {#snippet children()}
          <div style="padding-top: var(--spacing-4);">
            <Text>Subscriptions Panel</Text>
          </div>
        {/snippet}
      </TabPanel>
      <TabPanel value="plans">
        {#snippet children()}
          <div style="padding-top: var(--spacing-4);">
            <Text>Plans Panel</Text>
          </div>
        {/snippet}
      </TabPanel>
      <TabPanel value="external">
        {#snippet children()}
          <div style="padding-top: var(--spacing-4);">
            <Text>External link tab selected</Text>
          </div>
        {/snippet}
      </TabPanel>
    {/snippet}
  </Tabs>
</Story>

<Story name="Icon Only Tabs" asChild>
  <Tabs variant="bordered">
    {#snippet children()}
      <TabList>
        {#snippet children()}
          <TabItem value="clipboard" leading={HomeIcon} />
          <TabItem value="card" leading={CreditCardIcon} />
          <TabItem value="settings" leading={SearchIcon} />
        {/snippet}
      </TabList>
      <TabPanel value="clipboard">
        {#snippet children()}
          <div style="padding-top: var(--spacing-4);">
            <Text>Clipboard Panel</Text>
          </div>
        {/snippet}
      </TabPanel>
      <TabPanel value="card">
        {#snippet children()}
          <div style="padding-top: var(--spacing-4);">
            <Text>Card Panel</Text>
          </div>
        {/snippet}
      </TabPanel>
      <TabPanel value="settings">
        {#snippet children()}
          <div style="padding-top: var(--spacing-4);">
            <Text>Settings Panel</Text>
          </div>
        {/snippet}
      </TabPanel>
    {/snippet}
  </Tabs>
</Story>

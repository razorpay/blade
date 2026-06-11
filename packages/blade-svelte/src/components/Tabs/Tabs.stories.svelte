<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Tabs from './Tabs.svelte';

  const { Story } = defineMeta({
    title: 'Components/Tabs',
    component: Tabs,
    tags: ['autodocs'],
    args: {},
    argTypes: {
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

  let controlledValue = $state('plans');
</script>

<Story name="Default" asChild>
  <Tabs variant="bordered" orientation="horizontal">
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
            <Text>Subscriptions Panel - This is an overview of your active subscriptions.</Text>
          </div>
        {/snippet}
      </TabPanel>
      <TabPanel value="plans">
        {#snippet children()}
          <div style="padding-top: var(--spacing-4);">
            <Text>Plans Panel - This is an overview of all your plans.</Text>
          </div>
        {/snippet}
      </TabPanel>
      <TabPanel value="settings">
        {#snippet children()}
          <div style="padding-top: var(--spacing-4);">
            <Text>Settings Panel - This is an overview of your settings.</Text>
          </div>
        {/snippet}
      </TabPanel>
    {/snippet}
  </Tabs>
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

<Story name="Size: Small" asChild>
  <Tabs variant="bordered" size="small">
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
            <Text size="small">Subscriptions Panel</Text>
          </div>
        {/snippet}
      </TabPanel>
      <TabPanel value="plans">
        {#snippet children()}
          <div style="padding-top: var(--spacing-4);">
            <Text size="small">Plans Panel</Text>
          </div>
        {/snippet}
      </TabPanel>
      <TabPanel value="settings">
        {#snippet children()}
          <div style="padding-top: var(--spacing-4);">
            <Text size="small">Settings Panel</Text>
          </div>
        {/snippet}
      </TabPanel>
    {/snippet}
  </Tabs>
</Story>

<Story name="Size: Large" asChild>
  <Tabs variant="bordered" size="large">
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
            <Text size="large">Subscriptions Panel</Text>
          </div>
        {/snippet}
      </TabPanel>
      <TabPanel value="plans">
        {#snippet children()}
          <div style="padding-top: var(--spacing-4);">
            <Text size="large">Plans Panel</Text>
          </div>
        {/snippet}
      </TabPanel>
      <TabPanel value="settings">
        {#snippet children()}
          <div style="padding-top: var(--spacing-4);">
            <Text size="large">Settings Panel</Text>
          </div>
        {/snippet}
      </TabPanel>
    {/snippet}
  </Tabs>
</Story>

<Story name="Filled" asChild>
  <Tabs variant="filled">
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
</Story>

<Story name="Filled Vertical" asChild>
  <Tabs variant="filled" orientation="vertical">
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
          <div style="padding-left: var(--spacing-4);">
            <Text>Subscriptions Panel</Text>
          </div>
        {/snippet}
      </TabPanel>
      <TabPanel value="plans">
        {#snippet children()}
          <div style="padding-left: var(--spacing-4);">
            <Text>Plans Panel</Text>
          </div>
        {/snippet}
      </TabPanel>
      <TabPanel value="settings">
        {#snippet children()}
          <div style="padding-left: var(--spacing-4);">
            <Text>Settings Panel</Text>
          </div>
        {/snippet}
      </TabPanel>
    {/snippet}
  </Tabs>
</Story>

<Story name="Bordered Vertical" asChild>
  <Tabs variant="bordered" orientation="vertical">
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
          <div style="padding-left: var(--spacing-4);">
            <Text>Subscriptions Panel</Text>
          </div>
        {/snippet}
      </TabPanel>
      <TabPanel value="plans">
        {#snippet children()}
          <div style="padding-left: var(--spacing-4);">
            <Text>Plans Panel</Text>
          </div>
        {/snippet}
      </TabPanel>
      <TabPanel value="settings">
        {#snippet children()}
          <div style="padding-left: var(--spacing-4);">
            <Text>Settings Panel</Text>
          </div>
        {/snippet}
      </TabPanel>
    {/snippet}
  </Tabs>
</Story>

<Story name="Borderless" asChild>
  <Tabs variant="borderless">
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
</Story>

<Story name="Full Width TabItem" asChild>
  <Tabs variant="bordered" isFullWidthTabItem={true}>
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
</Story>

<Story name="With Leading Icon" asChild>
  <Tabs variant="bordered">
    {#snippet children()}
      <TabList>
        {#snippet children()}
          <TabItem value="subscriptions">
            {#snippet leading()}
              <HomeIcon size="medium" />
            {/snippet}
            {#snippet children()}Subscription{/snippet}
          </TabItem>
          <TabItem value="plans">
            {#snippet leading()}
              <CreditCardIcon size="medium" />
            {/snippet}
            {#snippet children()}Plans{/snippet}
          </TabItem>
          <TabItem value="settings">
            {#snippet leading()}
              <SearchIcon size="medium" />
            {/snippet}
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
              <Badge color="positive">NEW</Badge>
            {/snippet}
          </TabItem>
          <TabItem value="plans">
            {#snippet children()}Plans{/snippet}
            {#snippet trailing()}
              <Counter color="positive" value={2} />
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

<Story name="Lazy Rendering" asChild>
  <div>
    <Text color="surface.text.gray.subtle" size="small">
      With isLazy=true, TabPanel content only mounts when selected (check DOM inspector).
    </Text>
    <div style="margin-top: var(--spacing-4);">
      <Tabs variant="bordered" isLazy={true}>
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
                <Text>Subscriptions Panel (lazy loaded)</Text>
              </div>
            {/snippet}
          </TabPanel>
          <TabPanel value="plans">
            {#snippet children()}
              <div style="padding-top: var(--spacing-4);">
                <Text>Plans Panel (lazy loaded)</Text>
              </div>
            {/snippet}
          </TabPanel>
          <TabPanel value="settings">
            {#snippet children()}
              <div style="padding-top: var(--spacing-4);">
                <Text>Settings Panel (lazy loaded)</Text>
              </div>
            {/snippet}
          </TabPanel>
        {/snippet}
      </Tabs>
    </div>
  </div>
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
          <TabItem value="clipboard">
            {#snippet leading()}
              <HomeIcon size="medium" />
            {/snippet}
          </TabItem>
          <TabItem value="card">
            {#snippet leading()}
              <CreditCardIcon size="medium" />
            {/snippet}
          </TabItem>
          <TabItem value="settings">
            {#snippet leading()}
              <SearchIcon size="medium" />
            {/snippet}
          </TabItem>
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

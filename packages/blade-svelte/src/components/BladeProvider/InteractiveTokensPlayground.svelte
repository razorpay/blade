<script lang="ts">
  /**
   * Interactive-token visual playground.
   *
   * Mirrors exactly what a real app does: pick a brand color, run it through
   * Blade's real `createTheme` pipeline, and feed the resulting `themeTokens`
   * into `BladeProvider`. Every component below re-renders from the derived
   * `interactive.*` tokens via BladeProvider's CSS variables — no bespoke color
   * math, no forked shade logic.
   *
   * Note: `createTheme` only brands `primary` (positive / negative / notice /
   * neutral / gray / static* are fixed Blade tokens with no app-facing override),
   * so this playground exposes a single brand-color control by design.
   */
  import { bladeNeutralTheme, createTheme } from '@razorpay/blade-core/tokens';
  import type { ColorSchemeNamesInput, ThemeTokens } from '@razorpay/blade-core/tokens';

  import BladeProvider from './BladeProvider.svelte';
  import Text from '../Typography/Text/Text.svelte';
  import Heading from '../Typography/Heading/Heading.svelte';
  import Code from '../Typography/Code/Code.svelte';
  import Button from '../Button/Button.svelte';
  import Accordion from '../Accordion/Accordion.svelte';
  import AccordionItem from '../Accordion/AccordionItem.svelte';
  import AccordionItemHeader from '../Accordion/AccordionItemHeader.svelte';
  import AccordionItemBody from '../Accordion/AccordionItemBody.svelte';
  import ActionList from '../ActionList/ActionList.svelte';
  import ActionListItem from '../ActionList/ActionListItem.svelte';
  import ActionListItemIcon from '../ActionList/ActionListItemIcon.svelte';
  import ActionListItemText from '../ActionList/ActionListItemText.svelte';
  import ActionListSection from '../ActionList/ActionListSection.svelte';
  import Breadcrumb from '../Breadcrumb/Breadcrumb.svelte';
  import BreadcrumbItem from '../Breadcrumb/BreadcrumbItem.svelte';
  import SegmentedControl from '../SegmentedControl/SegmentedControl.svelte';
  import SegmentedControlItem from '../SegmentedControl/SegmentedControlItem.svelte';
  import TextInput from '../Input/TextInput/TextInput.svelte';
  import Checkbox from '../Checkbox/Checkbox.svelte';
  import CheckboxGroup from '../Checkbox/CheckboxGroup.svelte';
  import Radio from '../Radio/Radio.svelte';
  import RadioGroup from '../Radio/RadioGroup.svelte';
  import Switch from '../Switch/Switch.svelte';
  import Chip from '../Chip/Chip.svelte';
  import ChipGroup from '../Chip/ChipGroup.svelte';
  import IconButton from '../Button/IconButton/IconButton.svelte';
  import Link from '../Link/Link.svelte';
  import Alert from '../Alert/Alert.svelte';
  import Tabs from '../Tabs/Tabs.svelte';
  import TabList from '../Tabs/TabList.svelte';
  import TabItem from '../Tabs/TabItem.svelte';
  import TabPanel from '../Tabs/TabPanel.svelte';
  import Collapsible from '../Collapsible/Collapsible.svelte';
  import CollapsibleButton from '../Collapsible/CollapsibleButton.svelte';
  import CollapsibleBody from '../Collapsible/CollapsibleBody.svelte';
  import Avatar from '../Avatar/Avatar.svelte';
  import CounterInput from '../CounterInput/CounterInput.svelte';
  import AnnouncementBanner from '../AnnouncementBanner/AnnouncementBanner.svelte';
  import {
    HomeIcon,
    SearchIcon,
    InfoIcon,
    CreditCardIcon,
    UserIcon,
    BuildingIcon,
    CloseIcon,
  } from '../Icons';

  // ---------------------------------------------------------------------------
  // Brand color -> real theme pipeline
  // ---------------------------------------------------------------------------

  // `createTheme` brands only `primary`, so this is the single meaningful knob.
  const DEFAULT_BRAND_COLOR = '#2B6BF6';

  let brandColor = $state(DEFAULT_BRAND_COLOR);
  // Untouched by default so the first render is the pristine bladeNeutralTheme.
  let dirty = $state(false);
  let colorScheme = $state<ColorSchemeNamesInput>('light');

  function onPick(value: string): void {
    brandColor = value;
    dirty = true;
  }

  function resetAll(): void {
    dirty = false;
    brandColor = DEFAULT_BRAND_COLOR;
  }

  function onSchemeChange(payload: { value: string }): void {
    if (payload.value === 'light' || payload.value === 'dark' || payload.value === 'system') {
      colorScheme = payload.value;
    }
  }

  // Exactly the app pipeline: brandColor -> createTheme -> themeTokens -> BladeProvider.
  const themeTokens = $derived.by((): ThemeTokens => {
    if (!dirty) return bladeNeutralTheme;
    return createTheme({ brandColor, baseTheme: bladeNeutralTheme }).theme;
  });

  const INTERACTIVE_TEXT_COLORS = [
    'primary',
    'positive',
    'negative',
    'notice',
    'information',
    'neutral',
    'gray',
  ] as const;
</script>

<div class="page">
  <!-- ─── Controls ─────────────────────────────────────────────────── -->
  <aside class="controls">
    <div class="controls-head">
      <Heading size="medium" weight="semibold">Brand theme</Heading>
      <Text size="small" color="surface.text.gray.muted">
        Pick a brand color. It runs through Blade's real
        <Code size="small">createTheme</Code> pipeline and feeds
        <Code size="small">BladeProvider</Code> — exactly like a themed app. The whole
        <Code size="small">interactive.primary.*</Code> scale (<Code size="small">highlighted</Code>,
        <Code size="small">faded</Code>, <Code size="small">disabled</Code>…) is derived for you.
      </Text>
    </div>

    <div class="scheme-row">
      <Text size="small" weight="semibold">Color scheme</Text>
      <SegmentedControl
        accessibilityLabel="Color scheme"
        size="small"
        value={colorScheme}
        onChange={onSchemeChange}
      >
        <SegmentedControlItem value="light">Light</SegmentedControlItem>
        <SegmentedControlItem value="dark">Dark</SegmentedControlItem>
        <SegmentedControlItem value="system">System</SegmentedControlItem>
      </SegmentedControl>
    </div>

    <div class="picker-grid">
      <label class="picker" class:is-dirty={dirty}>
        <input
          type="color"
          value={brandColor}
          aria-label="Brand color"
          oninput={(event) => onPick(event.currentTarget.value)}
        />
        <span class="picker-meta">
          <Text size="small" weight="medium">Brand color</Text>
          <Text size="xsmall" color="surface.text.gray.muted">
            {dirty ? brandColor : 'default'}
          </Text>
        </span>
      </label>
    </div>

    <div class="controls-foot">
      <Text size="xsmall" color="surface.text.gray.muted">
        {dirty ? 'brand override active' : 'default theme'}
      </Text>
      <Button variant="tertiary" size="small" isDisabled={!dirty} onClick={resetAll}>
        Reset
      </Button>
    </div>
  </aside>

  <!-- ─── Live component preview ───────────────────────────────────── -->
  <BladeProvider {themeTokens} {colorScheme}>
    <main class="preview">
      <!-- Button -->
      <section class="showcase">
        <Heading size="small" weight="semibold">Button</Heading>
        <Text size="small" color="surface.text.gray.muted">
          Uses <Code size="small">interactive.background.primary.*</Code> and
          <Code size="small">interactive.text.onPrimary.*</Code>.
        </Text>
        <div class="row">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="tertiary">Tertiary</Button>
        </div>
        <div class="row">
          <Button color="primary">Primary</Button>
          <Button color="positive">Positive</Button>
          <Button color="negative">Negative</Button>
        </div>
        <div class="row">
          <Button isDisabled>Disabled</Button>
          <Button isLoading>Loading</Button>
        </div>
      </section>

      <!-- Typography -->
      <section class="showcase">
        <Heading size="small" weight="semibold">Text &amp; Heading</Heading>
        <Text size="small" color="surface.text.gray.muted">
          Uses <Code size="small">interactive.text.&lt;color&gt;.&lt;emphasis&gt;</Code>.
        </Text>
        <div class="row wrap">
          {#each INTERACTIVE_TEXT_COLORS as textColor (textColor)}
            <Text weight="semibold" color={`interactive.text.${textColor}.normal`}>
              {textColor}
            </Text>
          {/each}
        </div>
        <div class="row wrap">
          <Text color="interactive.text.primary.normal">normal</Text>
          <Text color="interactive.text.primary.subtle">subtle</Text>
          <Text color="interactive.text.primary.muted">muted</Text>
          <Text color="interactive.text.primary.disabled">disabled</Text>
        </div>
        <Heading size="medium" weight="semibold" color="interactive.text.primary.normal">
          Heading on interactive primary
        </Heading>
      </section>

      <!-- Icons -->
      <section class="showcase">
        <Heading size="small" weight="semibold">Icons</Heading>
        <Text size="small" color="surface.text.gray.muted">
          Uses <Code size="small">interactive.icon.&lt;color&gt;.normal</Code>.
        </Text>
        <div class="row wrap">
          <HomeIcon size="large" color="interactive.icon.primary.normal" />
          <SearchIcon size="large" color="interactive.icon.positive.normal" />
          <InfoIcon size="large" color="interactive.icon.negative.normal" />
          <CreditCardIcon size="large" color="interactive.icon.gray.normal" />
          <UserIcon size="large" color="interactive.icon.gray.subtle" />
          <BuildingIcon size="large" color="interactive.icon.gray.muted" />
          <CloseIcon size="large" color="interactive.icon.gray.disabled" />
        </div>
      </section>

      <!-- Breadcrumb -->
      <section class="showcase">
        <Heading size="small" weight="semibold">Breadcrumb (stepper)</Heading>
        <Text size="small" color="surface.text.gray.muted">
          Stepper links use <Code size="small">interactive.text.primary.*</Code> and
          <Code size="small">interactive.icon.*</Code>.
        </Text>
        <Breadcrumb variant="stepper" color="primary">
          {#snippet children()}
            <BreadcrumbItem icon={HomeIcon} href="/home" accessibilityLabel="Home" />
            <BreadcrumbItem href="/details">Details</BreadcrumbItem>
            <BreadcrumbItem isCurrentPage href="/review">Review</BreadcrumbItem>
          {/snippet}
        </Breadcrumb>
      </section>

      <!-- SegmentedControl -->
      <section class="showcase">
        <Heading size="small" weight="semibold">SegmentedControl</Heading>
        <Text size="small" color="surface.text.gray.muted">
          Item icons use <Code size="small">interactive.icon.gray.*</Code>.
        </Text>
        <SegmentedControl accessibilityLabel="View" defaultValue="overview" size="medium">
          <SegmentedControlItem value="overview" leading={HomeIcon}>Overview</SegmentedControlItem>
          <SegmentedControlItem value="cards" leading={CreditCardIcon}>Cards</SegmentedControlItem>
          <SegmentedControlItem value="team" leading={UserIcon} isDisabled>Team</SegmentedControlItem>
        </SegmentedControl>
      </section>

      <!-- ActionList -->
      <section class="showcase">
        <Heading size="small" weight="semibold">ActionList</Heading>
        <Text size="small" color="surface.text.gray.muted">
          Item text/icons use <Code size="small">interactive.text.gray.*</Code> /
          <Code size="small">interactive.icon.gray.*</Code>.
        </Text>
        <div class="action-list-wrap">
          <ActionList>
            {#snippet children()}
              <ActionListSection title="Account">
                {#snippet children()}
                  <ActionListItem title="Overview" value="overview">
                    {#snippet leading()}
                      <ActionListItemIcon icon={HomeIcon} />
                    {/snippet}
                    {#snippet trailing()}
                      <ActionListItemText>⌘ O</ActionListItemText>
                    {/snippet}
                  </ActionListItem>
                  <ActionListItem title="Transactions" value="transactions">
                    {#snippet leading()}
                      <ActionListItemIcon icon={CreditCardIcon} />
                    {/snippet}
                  </ActionListItem>
                  <ActionListItem title="Disabled" value="disabled" isDisabled />
                {/snippet}
              </ActionListSection>
            {/snippet}
          </ActionList>
        </div>
      </section>

      <!-- Accordion -->
      <section class="showcase">
        <Heading size="small" weight="semibold">Accordion</Heading>
        <Text size="small" color="surface.text.gray.muted">
          Chevron uses <Code size="small">interactive.icon.gray.*</Code>.
        </Text>
        <Accordion>
          {#snippet children()}
            <AccordionItem>
              {#snippet children()}
                <AccordionItemHeader title="How does theming work?" />
                <AccordionItemBody>
                  <Text>Theme tokens flow through BladeProvider as CSS variables.</Text>
                </AccordionItemBody>
              {/snippet}
            </AccordionItem>
            <AccordionItem>
              {#snippet children()}
                <AccordionItemHeader title="What are interactive tokens?" />
                <AccordionItemBody>
                  <Text>Colors used for interactive elements across states.</Text>
                </AccordionItemBody>
              {/snippet}
            </AccordionItem>
          {/snippet}
        </Accordion>
      </section>

      <!-- Input -->
      <section class="showcase">
        <Heading size="small" weight="semibold">Input</Heading>
        <Text size="small" color="surface.text.gray.muted">
          Disabled trailing icon uses <Code size="small">interactive.icon.gray.disabled</Code>.
        </Text>
        <div class="input-grid">
          <TextInput label="Name" placeholder="Enter your name" />
          <TextInput
            label="Email"
            placeholder="you@example.com"
            validationState="error"
            errorText="Enter a valid email"
          />
          <TextInput label="Locked" placeholder="Disabled" isDisabled value="Cannot edit" />
        </div>
      </section>

      <!-- Checkbox -->
      <section class="showcase">
        <Heading size="small" weight="semibold">Checkbox</Heading>
        <Text size="small" color="surface.text.gray.muted">
          Checked fill uses <Code size="small">interactive.background.primary.*</Code>.
        </Text>
        <CheckboxGroup label="Preferences" defaultValue={['email']}>
          {#snippet children()}
            <Checkbox value="email">Email updates</Checkbox>
            <Checkbox value="sms">SMS updates</Checkbox>
            <Checkbox value="disabled" isDisabled>Disabled</Checkbox>
          {/snippet}
        </CheckboxGroup>
      </section>

      <!-- Radio -->
      <section class="showcase">
        <Heading size="small" weight="semibold">Radio</Heading>
        <Text size="small" color="surface.text.gray.muted">
          Selected dot uses <Code size="small">interactive.background.primary.*</Code>.
        </Text>
        <RadioGroup label="Plan" defaultValue="standard">
          {#snippet children()}
            <Radio value="standard">Standard</Radio>
            <Radio value="pro">Pro</Radio>
            <Radio value="enterprise" isDisabled>Enterprise</Radio>
          {/snippet}
        </RadioGroup>
      </section>

      <!-- Switch -->
      <section class="showcase">
        <Heading size="small" weight="semibold">Switch</Heading>
        <Text size="small" color="surface.text.gray.muted">
          On-state track uses <Code size="small">interactive.background.primary.*</Code>.
        </Text>
        <div class="row wrap">
          <Switch accessibilityLabel="Toggle A" defaultChecked />
          <Switch accessibilityLabel="Toggle B" />
          <Switch accessibilityLabel="Toggle C" defaultChecked isDisabled />
        </div>
      </section>

      <!-- Chip -->
      <section class="showcase">
        <Heading size="small" weight="semibold">Chip</Heading>
        <Text size="small" color="surface.text.gray.muted">
          Selected chip uses <Code size="small">interactive.background.primary.*</Code> and
          <Code size="small">interactive.border.primary.*</Code>.
        </Text>
        <ChipGroup label="Business type" selectionType="single" defaultValue="proprietorship">
          {#snippet children()}
            <Chip value="proprietorship">Proprietorship</Chip>
            <Chip value="public">Public</Chip>
            <Chip value="private">Private</Chip>
          {/snippet}
        </ChipGroup>
      </section>

      <!-- IconButton -->
      <section class="showcase">
        <Heading size="small" weight="semibold">IconButton</Heading>
        <Text size="small" color="surface.text.gray.muted">
          Hover/pressed surface uses <Code size="small">interactive.background.gray.*</Code>.
        </Text>
        <div class="row wrap">
          <IconButton icon={SearchIcon} accessibilityLabel="Search" onClick={() => {}} />
          <IconButton icon={InfoIcon} accessibilityLabel="Info" onClick={() => {}} />
          <IconButton icon={CloseIcon} accessibilityLabel="Close" onClick={() => {}} isDisabled />
        </div>
      </section>

      <!-- Link -->
      <section class="showcase">
        <Heading size="small" weight="semibold">Link</Heading>
        <Text size="small" color="surface.text.gray.muted">
          Link text/icon use <Code size="small">interactive.text.primary.*</Code>.
        </Text>
        <div class="row wrap">
          <Link href="https://razorpay.com" target="_blank" rel="noreferrer noopener">
            Anchor link
          </Link>
          <Link icon={InfoIcon} iconPosition="left" onClick={() => {}}>Button link</Link>
        </div>
      </section>

      <!-- Alert -->
      <section class="showcase">
        <Heading size="small" weight="semibold">Alert</Heading>
        <Text size="small" color="surface.text.gray.muted">
          Action buttons use <Code size="small">interactive.*</Code> for the alert color.
        </Text>
        <Alert
          title="Heads up"
          description="Interactive action colors follow the alert's feedback color."
          color="information"
          actions={{ primary: { text: 'Take action', onClick: () => {} } }}
        />
      </section>

      <!-- Tabs -->
      <section class="showcase">
        <Heading size="small" weight="semibold">Tabs</Heading>
        <Text size="small" color="surface.text.gray.muted">
          Selected tab uses <Code size="small">interactive.text/icon.primary.*</Code>.
        </Text>
        <Tabs defaultValue="plans">
          {#snippet children()}
            <TabList>
              {#snippet children()}
                <TabItem value="subscriptions">
                  {#snippet children()}Subscriptions{/snippet}
                </TabItem>
                <TabItem value="plans">
                  {#snippet children()}Plans{/snippet}
                </TabItem>
              {/snippet}
            </TabList>
            <TabPanel value="subscriptions">
              {#snippet children()}
                <Text size="small">Subscriptions content</Text>
              {/snippet}
            </TabPanel>
            <TabPanel value="plans">
              {#snippet children()}
                <Text size="small">Plans content</Text>
              {/snippet}
            </TabPanel>
          {/snippet}
        </Tabs>
      </section>

      <!-- Collapsible -->
      <section class="showcase">
        <Heading size="small" weight="semibold">Collapsible</Heading>
        <Text size="small" color="surface.text.gray.muted">
          Trigger text/chevron use <Code size="small">interactive.text/icon.primary.*</Code>.
        </Text>
        <Collapsible>
          {#snippet children()}
            <CollapsibleButton>View details</CollapsibleButton>
            <CollapsibleBody>
              {#snippet children()}
                <Text size="small">Hidden content revealed on expand.</Text>
              {/snippet}
            </CollapsibleBody>
          {/snippet}
        </Collapsible>
      </section>

      <!-- Avatar -->
      <section class="showcase">
        <Heading size="small" weight="semibold">Avatar</Heading>
        <Text size="small" color="surface.text.gray.muted">
          Interactive avatars use <Code size="small">interactive.background/border.*</Code>.
        </Text>
        <div class="row wrap">
          <Avatar name="Nitin Kumar" color="primary" />
          <Avatar name="Rama Behera" color="positive" />
          <Avatar name="Kamlesh C" color="negative" />
        </div>
      </section>

      <!-- CounterInput -->
      <section class="showcase">
        <Heading size="small" weight="semibold">CounterInput</Heading>
        <Text size="small" color="surface.text.gray.muted">
          Increment/decrement controls use <Code size="small">interactive.*</Code>.
        </Text>
        <div class="input-grid">
          <CounterInput label="Quantity" defaultValue={5} />
          <CounterInput label="Locked" defaultValue={2} isDisabled />
        </div>
      </section>

      <!-- AnnouncementBanner -->
      <section class="showcase">
        <Heading size="small" weight="semibold">AnnouncementBanner</Heading>
        <Text size="small" color="surface.text.gray.muted">
          Dismiss/action controls use <Code size="small">interactive.*</Code>.
        </Text>
        <AnnouncementBanner icon={InfoIcon}>
          Switch to the new dashboard experience today.
        </AnnouncementBanner>
      </section>
    </main>
  </BladeProvider>
</div>

<style>
  /*
   * Storybook's `layout: 'fullscreen'` makes `#storybook-root` a scroll container
   * (overflow: auto; height: 100%). Combined with the page's own `min-height: 100vh`
   * that produced a nested scroll → two vertical scrollbars. Let the document be the
   * single scroller instead. Scoped via `:has(> .page)` so it only applies in the
   * fullscreen story view, not the Docs page (where `.page` is nested deeper).
   */
  :global(#storybook-root:has(> .page)) {
    overflow: visible;
    height: auto;
  }

  .page {
    box-sizing: border-box;
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: var(--spacing-6);
    min-height: 100vh;
    padding: var(--spacing-6);
    background-color: var(--surface-background-gray-subtle);
  }

  .controls {
    position: sticky;
    top: var(--spacing-6);
    align-self: start;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-5);
    box-sizing: border-box;
    padding: var(--spacing-6);
    max-height: calc(100vh - var(--spacing-10));
    overflow-y: auto;
    background-color: var(--surface-background-gray-intense);
    border: 1px solid var(--surface-border-gray-muted);
    border-radius: var(--border-radius-large);
    box-shadow: var(--elevation-low-raised);
  }

  .controls-head {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2);
  }

  .scheme-row {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
  }

  .picker-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--spacing-3);
  }

  .picker {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    padding: var(--spacing-3);
    border: 1px solid var(--surface-border-gray-muted);
    border-radius: var(--border-radius-medium);
    cursor: pointer;
    background-color: var(--surface-background-gray-subtle);
  }

  .picker.is-dirty {
    border-color: var(--surface-border-primary-normal);
  }

  .picker input[type='color'] {
    inline-size: 36px;
    block-size: 36px;
    padding: 0;
    border: 1px solid var(--surface-border-gray-muted);
    border-radius: var(--border-radius-small);
    background: transparent;
    cursor: pointer;
  }

  .picker-meta {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-1);
    min-width: 0;
  }

  .controls-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-3);
    padding-top: var(--spacing-3);
    border-top: 1px solid var(--surface-border-gray-muted);
  }

  .preview {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: var(--spacing-5);
    align-content: start;
  }

  .showcase {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-4);
    box-sizing: border-box;
    padding: var(--spacing-6);
    background-color: var(--surface-background-gray-intense);
    border: 1px solid var(--surface-border-gray-muted);
    border-radius: var(--border-radius-large);
  }

  .row {
    display: flex;
    align-items: center;
    gap: var(--spacing-4);
  }

  .row.wrap {
    flex-wrap: wrap;
  }

  .action-list-wrap {
    border: 1px solid var(--surface-border-gray-muted);
    border-radius: var(--border-radius-medium);
    overflow: hidden;
  }

  .input-grid {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-5);
  }

  @media (max-width: 900px) {
    .page {
      grid-template-columns: 1fr;
    }

    .controls {
      position: static;
      max-height: none;
    }
  }
</style>

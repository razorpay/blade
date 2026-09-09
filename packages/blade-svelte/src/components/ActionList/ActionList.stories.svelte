<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ActionList from './ActionList.svelte';
  import type { ActionListProps } from './types';

  /* Title deviates from React's Dropdown-nested `Components/Dropdown/ActionList/Stories`
   * (Dropdown is out of scope). Uses the blade-svelte top-level convention. */
  const { Story } = defineMeta({
    title: 'Components/ActionList',
    component: ActionList,
    tags: ['autodocs'],
    args: {
      selectionType: 'single',
    },
    argTypes: {
      children: { table: { disable: true } },
      onAction: { table: { disable: true } },
      selectionType: { control: 'select', options: ['single', 'multiple'] },
      selectedValue: { control: 'text' },
    } as Record<string, unknown>,
  } as Parameters<typeof defineMeta>[0] & { argTypes: Record<string, unknown> });
</script>

<script lang="ts">
  import { untrack } from 'svelte';
  import { getFlagOfCountry, getFlagsForAllCountries } from '@razorpay/i18nify-js/geo';
  import ActionListItem from './ActionListItem.svelte';
  import ActionListItemAsset from './ActionListItemAsset.svelte';
  import ActionListItemText from './ActionListItemText.svelte';
  import ActionListItemIcon from './ActionListItemIcon.svelte';
  import ActionListItemAvatar from './ActionListItemAvatar.svelte';
  import ActionListItemBadge from './ActionListItemBadge.svelte';
  import ActionListItemBadgeGroup from './ActionListItemBadgeGroup.svelte';
  import ActionListSection from './ActionListSection.svelte';
  import BottomSheet from '../BottomSheet/BottomSheet.svelte';
  import BottomSheetHeader from '../BottomSheet/BottomSheetHeader.svelte';
  import BottomSheetBody from '../BottomSheet/BottomSheetBody.svelte';
  import Button from '../Button/Button.svelte';
  import {
    HomeIcon,
    CreditCardIcon,
    UserIcon,
    BuildingIcon,
    SearchIcon,
    InfoIcon,
    CloseIcon,
  } from '../Icons';

  const flags = untrack(() => getFlagsForAllCountries()) as Record<string, { '4X3': string }>;
  const indiaFlagSrc = getFlagOfCountry('IN')['4X3'];

  // Country List is the only BottomSheet story, so it owns the single open-state bucket.
  let isCountryOpen = $state(false);
  let selectedCountry = $state<string | undefined>('IN');

  // Drives the interactive standalone single-select story.
  let selectedStandalone = $state<string | undefined>('transactions');

  // Drives the interactive standalone multi-select story — the consumer owns the
  // array; `onAction` toggles membership.
  let selectedMulti = $state<string[]>(['payments', 'analytics']);

  function toggleMulti(value: string): void {
    selectedMulti = selectedMulti.includes(value)
      ? selectedMulti.filter((v) => v !== value)
      : [...selectedMulti, value];
  }

  const countries = [
    { value: 'IN', name: 'India', code: 'IN', dialCode: '+91' },
    { value: 'US', name: 'United States', code: 'US', dialCode: '+1' },
    { value: 'GB', name: 'United Kingdom', code: 'GB', dialCode: '+44' },
    { value: 'AU', name: 'Australia', code: 'AU', dialCode: '+61' },
    { value: 'DE', name: 'Germany', code: 'DE', dialCode: '+49' },
    { value: 'FR', name: 'France', code: 'FR', dialCode: '+33' },
    { value: 'JP', name: 'Japan', code: 'JP', dialCode: '+81' },
    { value: 'SG', name: 'Singapore', code: 'SG', dialCode: '+65' },
    { value: 'AE', name: 'United Arab Emirates', code: 'AE', dialCode: '+971' },
    { value: 'BR', name: 'Brazil', code: 'BR', dialCode: '+55' },
  ];
</script>

<!-- Mirrors React `Default`. Args drive Controls panel. -->
<Story name="Default">
  {#snippet template(args: ActionListProps)}
    <ActionList {...args}>
      {#snippet children()}
        <ActionListItem title="Item 1" value="item1" />
        <ActionListItem title="Item 2" value="item2" />
      {/snippet}
    </ActionList>
  {/snippet}
</Story>

<!-- Mirrors React `Leading icons/images on Items`. -->
<Story name="Leading icons/images on Items">
  {#snippet template()}
    <ActionList>
      {#snippet children()}
        <ActionListItem title="Settings" value="settings">
          {#snippet leading()}
            <ActionListItemIcon icon={SearchIcon} />
          {/snippet}
        </ActionListItem>
        <ActionListItem title="Download" value="download">
          {#snippet leading()}
            <ActionListItemIcon icon={HomeIcon} />
          {/snippet}
        </ActionListItem>
        <ActionListItem title="Pricing" value="pricing">
          {#snippet leading()}
            <ActionListItemAsset src={indiaFlagSrc} alt="India" />
          {/snippet}
        </ActionListItem>
      {/snippet}
    </ActionList>
  {/snippet}
</Story>

<!-- Mirrors React `Trailing icons/texts on Items`. -->
<Story name="Trailing icons/texts on Items">
  {#snippet template()}
    <ActionList>
      {#snippet children()}
        <ActionListItem title="Bank Settings" value="bank_settings">
          {#snippet trailing()}
            <ActionListItemIcon icon={BuildingIcon} />
          {/snippet}
        </ActionListItem>
        <ActionListItem title="FAQs, Live Chat" value="faqs">
          {#snippet trailing()}
            <ActionListItemText>⌘ + H</ActionListItemText>
          {/snippet}
        </ActionListItem>
      {/snippet}
    </ActionList>
  {/snippet}
</Story>

<!-- Interactive single-select — clicking a row updates `selectedValue` via `onAction`. -->
<Story name="Single Select (Interactive)">
  {#snippet template()}
    <ActionList
      selectedValue={selectedStandalone}
      onAction={({ value }) => (selectedStandalone = value)}
    >
      {#snippet children()}
        <ActionListItem title="Overview" value="overview">
          {#snippet leading()}
            <HomeIcon size="medium" color="interactive.icon.gray.normal" />
          {/snippet}
        </ActionListItem>
        <ActionListItem title="Transactions" value="transactions">
          {#snippet leading()}
            <CreditCardIcon size="medium" color="interactive.icon.gray.normal" />
          {/snippet}
        </ActionListItem>
        <ActionListItem title="Team" value="team">
          {#snippet leading()}
            <UserIcon size="medium" color="interactive.icon.gray.normal" />
          {/snippet}
        </ActionListItem>
        <ActionListItem title="Organization" value="organization">
          {#snippet leading()}
            <BuildingIcon size="medium" color="interactive.icon.gray.normal" />
          {/snippet}
        </ActionListItem>
      {/snippet}
    </ActionList>
  {/snippet}
</Story>

<!-- Item descriptions — secondary text rendered under the title. -->
<Story name="Item Descriptions">
  {#snippet template()}
    <ActionList>
      {#snippet children()}
        <ActionListItem
          title="My Profile"
          description="Manage your personal information"
          value="profile"
        >
          {#snippet leading()}
            <UserIcon size="medium" color="interactive.icon.gray.normal" />
          {/snippet}
        </ActionListItem>
        <ActionListItem
          title="Billing"
          description="View invoices and payment methods"
          value="billing"
        >
          {#snippet leading()}
            <CreditCardIcon size="medium" color="interactive.icon.gray.normal" />
          {/snippet}
        </ActionListItem>
        <ActionListItem
          title="Security"
          description="Password, 2FA, and active sessions"
          value="security"
        >
          {#snippet leading()}
            <InfoIcon size="medium" color="interactive.icon.gray.normal" />
          {/snippet}
        </ActionListItem>
      {/snippet}
    </ActionList>
  {/snippet}
</Story>

<!-- Link items — `href`/`target` render each row as an `<a>`. -->
<Story name="Link Items (href)">
  {#snippet template()}
    <ActionList>
      {#snippet children()}
        <ActionListItem
          title="Documentation"
          value="docs"
          href="https://razorpay.com/docs"
          target="_blank"
        >
          {#snippet leading()}
            <InfoIcon size="medium" color="interactive.icon.gray.normal" />
          {/snippet}
        </ActionListItem>
        <ActionListItem
          title="Dashboard"
          value="dashboard"
          href="https://dashboard.razorpay.com"
          target="_blank"
        >
          {#snippet leading()}
            <HomeIcon size="medium" color="interactive.icon.gray.normal" />
          {/snippet}
        </ActionListItem>
        <ActionListItem
          title="API Reference"
          value="api"
          href="https://razorpay.com/docs/api"
          target="_blank"
        >
          {#snippet leading()}
            <SearchIcon size="medium" color="interactive.icon.gray.normal" />
          {/snippet}
        </ActionListItem>
      {/snippet}
    </ActionList>
  {/snippet}
</Story>

<!-- Mirrors React `With Sections`. -->
<Story name="With Sections">
  {#snippet template()}
    <ActionList>
      {#snippet children()}
        <ActionListSection title="Account">
          {#snippet children()}
            <ActionListItem title="My Profile" value="profile">
              {#snippet leading()}
                <UserIcon size="medium" color="interactive.icon.gray.normal" />
              {/snippet}
              {#snippet trailing()}
                <ActionListItemText>⌘ + P</ActionListItemText>
              {/snippet}
            </ActionListItem>
            <ActionListItem title="Organization" value="organization">
              {#snippet leading()}
                <BuildingIcon size="medium" color="interactive.icon.gray.normal" />
              {/snippet}
            </ActionListItem>
          {/snippet}
        </ActionListSection>
        <ActionListSection title="Preferences">
          {#snippet children()}
            <ActionListItem title="Search settings" value="search">
              {#snippet leading()}
                <SearchIcon size="medium" color="interactive.icon.gray.normal" />
              {/snippet}
              {#snippet trailing()}
                <InfoIcon size="medium" color="interactive.icon.gray.normal" />
              {/snippet}
            </ActionListItem>
            <ActionListItem title="Offline sync (unavailable)" value="sync" isDisabled />
          {/snippet}
        </ActionListSection>
        <ActionListSection title="Danger">
          {#snippet children()}
            <ActionListItem title="Delete account" value="delete" intent="negative">
              {#snippet leading()}
                <CloseIcon size="medium" color="interactive.icon.gray.normal" />
              {/snippet}
            </ActionListItem>
          {/snippet}
        </ActionListSection>
      {/snippet}
    </ActionList>
  {/snippet}
</Story>

<!-- Mirrors React `Custom Items`. Icon set differs from React — nearest available icons used. -->
<Story name="Custom Items">
  {#snippet template()}
    <ActionList>
      {#snippet children()}
        <ActionListSection title="Account">
          {#snippet children()}
            <ActionListItem title="Profile" value="profile">
              {#snippet leading()}
                <ActionListItemAvatar icon={UserIcon} color="primary" name="Saurabh Daware" />
              {/snippet}
            </ActionListItem>
            <ActionListItem title="Credit" value="credit" description="check your credit here!">
              {#snippet leading()}
                <ActionListItemIcon icon={CreditCardIcon} />
              {/snippet}
            </ActionListItem>
            <ActionListItem title="Disabled" value="disabled" isDisabled />
          {/snippet}
        </ActionListSection>
        <ActionListItem
          title="Go to Home"
          value="home"
          href="https://razorpay.com"
          target="_blank"
        />
        <ActionListItem
          title="Alert user"
          value="alert_user"
          onClick={() => window.alert('Alert user is clicked!')}
        />
        <ActionListItem
          title="Systems"
          value="systems"
          href="https://razorpay.com/careers"
          target="_blank"
        >
          {#snippet titleSuffix()}
            <ActionListItemBadgeGroup>
              {#snippet children()}
                <ActionListItemBadge icon={InfoIcon} color="information">unstable</ActionListItemBadge>
                <ActionListItemBadge>last updated: 2hr ago</ActionListItemBadge>
              {/snippet}
            </ActionListItemBadgeGroup>
          {/snippet}
        </ActionListItem>
        <ActionListItem title="saurabhdaware.razorpay@gmail.com" value="email">
          {#snippet leading()}
            <ActionListItemIcon icon={UserIcon} />
          {/snippet}
        </ActionListItem>
        <ActionListItem title="Log Out" value="logout" intent="negative">
          {#snippet leading()}
            <ActionListItemIcon icon={CloseIcon} />
          {/snippet}
        </ActionListItem>
      {/snippet}
    </ActionList>
  {/snippet}
</Story>

<!-- Multi Select (Interactive) — `selectionType="multiple"`, consumer owns `selectedValue` array. -->
<Story name="Multi Select (Interactive)">
  {#snippet template()}
    <ActionList
      selectionType="multiple"
      selectedValue={selectedMulti}
      onAction={({ value }) => toggleMulti(value)}
    >
      {#snippet children()}
        <ActionListItem title="Payments" value="payments" description="Accept online payments" />
        <ActionListItem title="Analytics" value="analytics" description="Track your revenue" />
        <ActionListItem title="Settlements" value="settlements" description="Manage payouts" />
        <ActionListItem title="Disputes" value="disputes" description="Handle chargebacks" />
        <ActionListItem title="Archived (unavailable)" value="archived" isDisabled />
      {/snippet}
    </ActionList>
  {/snippet}
</Story>

<!-- Single Select Country List — the PhoneNumberInput CountrySelector parity target and the
     only in-BottomSheet story: exercises the `isInBottomSheet` render branch + close-on-select. -->
<Story name="Single Select Country List (in BottomSheet)">
  {#snippet template()}
    <div>
      <Button onClick={() => (isCountryOpen = true)}>
        Select country{selectedCountry ? ` (${selectedCountry.toUpperCase()})` : ''}
      </Button>
      <BottomSheet isOpen={isCountryOpen} onDismiss={() => (isCountryOpen = false)}>
        {#snippet children()}
          <BottomSheetHeader title="Select country" />
          <BottomSheetBody hasActionList>
            {#snippet children()}
              <ActionList
                selectedValue={selectedCountry}
                onAction={({ value }) => {
                  selectedCountry = value;
                  isCountryOpen = false;
                }}
              >
                {#snippet children()}
                  {#each countries as country (country.value)}
                    <ActionListItem title={country.name} value={country.value}>
                      {#snippet leading()}
                        <ActionListItemAsset
                          src={flags[country.code]?.['4X3'] ?? ''}
                          alt={`${country.name} flag`}
                        />
                      {/snippet}
                      {#snippet trailing()}
                        <ActionListItemText>{country.dialCode}</ActionListItemText>
                      {/snippet}
                    </ActionListItem>
                  {/each}
                {/snippet}
              </ActionList>
            {/snippet}
          </BottomSheetBody>
        {/snippet}
      </BottomSheet>
    </div>
  {/snippet}
</Story>

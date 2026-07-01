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
      onItemSelect: { table: { disable: true } },
      isInBottomSheet: { table: { disable: true } },
      selectionType: { control: 'select', options: ['single'] },
      selectedValue: { control: 'text' },
    } as Record<string, unknown>,
  } as Parameters<typeof defineMeta>[0] & { argTypes: Record<string, unknown> });
</script>

<script lang="ts">
  import ActionListItem from './ActionListItem.svelte';
  import ActionListItemAsset from './ActionListItemAsset.svelte';
  import ActionListItemText from './ActionListItemText.svelte';
  import ActionListSection from './ActionListSection.svelte';
  import BottomSheet from '../BottomSheet/BottomSheet.svelte';
  import BottomSheetHeader from '../BottomSheet/BottomSheetHeader.svelte';
  import BottomSheetBody from '../BottomSheet/BottomSheetBody.svelte';
  import Button from '../Button/Button.svelte';
  import { HomeIcon, CreditCardIcon, UserIcon, BuildingIcon, SearchIcon } from '../Icons';

  /* One open-state bucket per story so they stay independent. */
  let isPlaygroundOpen = $state(false);
  let isDefaultOpen = $state(false);
  let isLeadingOpen = $state(false);
  let isTrailingOpen = $state(false);
  let isSectionsOpen = $state(false);
  let isCountryOpen = $state(false);
  let isDisabledNegativeOpen = $state(false);

  let selectedCountry = $state<string | undefined>('in');

  const countries = [
    { value: 'in', name: 'India', code: 'in', dialCode: '+91' },
    { value: 'us', name: 'United States', code: 'us', dialCode: '+1' },
    { value: 'gb', name: 'United Kingdom', code: 'gb', dialCode: '+44' },
    { value: 'au', name: 'Australia', code: 'au', dialCode: '+61' },
    { value: 'de', name: 'Germany', code: 'de', dialCode: '+49' },
    { value: 'fr', name: 'France', code: 'fr', dialCode: '+33' },
    { value: 'jp', name: 'Japan', code: 'jp', dialCode: '+81' },
    { value: 'sg', name: 'Singapore', code: 'sg', dialCode: '+65' },
    { value: 'ae', name: 'United Arab Emirates', code: 'ae', dialCode: '+971' },
    { value: 'br', name: 'Brazil', code: 'br', dialCode: '+55' },
  ];

  function flagSrc(code: string): string {
    return `https://flagcdn.com/w20/${code}.png`;
  }
</script>

<!-- Story 1: Playground — args drive the ActionList; a trigger toggles the sheet. -->
<Story name="Playground">
  {#snippet template(args: ActionListProps)}
    <div>
      <Button onClick={() => (isPlaygroundOpen = true)}>Open ActionList</Button>
      <BottomSheet isOpen={isPlaygroundOpen} onDismiss={() => (isPlaygroundOpen = false)}>
        {#snippet children()}
          <BottomSheetHeader title="Actions" />
          <BottomSheetBody hasActionList>
            {#snippet children()}
              <ActionList {...args}>
                {#snippet children()}
                  <ActionListItem title="Home" value="home" />
                  <ActionListItem title="Pricing" value="pricing" />
                  <ActionListItem title="Settings" value="settings" />
                {/snippet}
              </ActionList>
            {/snippet}
          </BottomSheetBody>
        {/snippet}
      </BottomSheet>
    </div>
  {/snippet}
</Story>

<!-- Story 2: Default — items only. -->
<Story name="Default">
  {#snippet template()}
    <div>
      <Button onClick={() => (isDefaultOpen = true)}>Open</Button>
      <BottomSheet isOpen={isDefaultOpen} onDismiss={() => (isDefaultOpen = false)}>
        {#snippet children()}
          <BottomSheetHeader title="Actions" />
          <BottomSheetBody hasActionList>
            {#snippet children()}
              <ActionList>
                {#snippet children()}
                  <ActionListItem title="Item 1" value="item-1" />
                  <ActionListItem title="Item 2" value="item-2" />
                {/snippet}
              </ActionList>
            {/snippet}
          </BottomSheetBody>
        {/snippet}
      </BottomSheet>
    </div>
  {/snippet}
</Story>

<!-- Story 3: Leading Icons/Images on Items. -->
<Story name="Leading Icons/Images on Items">
  {#snippet template()}
    <div>
      <Button onClick={() => (isLeadingOpen = true)}>Open</Button>
      <BottomSheet isOpen={isLeadingOpen} onDismiss={() => (isLeadingOpen = false)}>
        {#snippet children()}
          <BottomSheetHeader title="Quick Actions" />
          <BottomSheetBody hasActionList>
            {#snippet children()}
              <ActionList>
                {#snippet children()}
                  <ActionListItem title="Settings" value="settings">
                    {#snippet leading()}
                      <HomeIcon size="medium" color="interactive.icon.gray.normal" />
                    {/snippet}
                  </ActionListItem>
                  <ActionListItem title="Payments" value="payments">
                    {#snippet leading()}
                      <CreditCardIcon size="medium" color="interactive.icon.gray.normal" />
                    {/snippet}
                  </ActionListItem>
                  <ActionListItem title="Pricing" value="pricing">
                    {#snippet leading()}
                      <ActionListItemAsset src={flagSrc('in')} alt="India flag" />
                    {/snippet}
                  </ActionListItem>
                {/snippet}
              </ActionList>
            {/snippet}
          </BottomSheetBody>
        {/snippet}
      </BottomSheet>
    </div>
  {/snippet}
</Story>

<!-- Story 4: Trailing Icons/Texts on Items. -->
<Story name="Trailing Icons/Texts on Items">
  {#snippet template()}
    <div>
      <Button onClick={() => (isTrailingOpen = true)}>Open</Button>
      <BottomSheet isOpen={isTrailingOpen} onDismiss={() => (isTrailingOpen = false)}>
        {#snippet children()}
          <BottomSheetHeader title="Help" />
          <BottomSheetBody hasActionList>
            {#snippet children()}
              <ActionList>
                {#snippet children()}
                  <ActionListItem title="Bank Settings" value="bank-settings">
                    {#snippet trailing()}
                      <ActionListItemText>⌘ + B</ActionListItemText>
                    {/snippet}
                  </ActionListItem>
                  <ActionListItem title="FAQs" value="faqs">
                    {#snippet trailing()}
                      <SearchIcon size="medium" color="interactive.icon.gray.normal" />
                    {/snippet}
                  </ActionListItem>
                {/snippet}
              </ActionList>
            {/snippet}
          </BottomSheetBody>
        {/snippet}
      </BottomSheet>
    </div>
  {/snippet}
</Story>

<!-- Story 5: With Sections. -->
<Story name="With Sections">
  {#snippet template()}
    <div>
      <Button onClick={() => (isSectionsOpen = true)}>Open</Button>
      <BottomSheet isOpen={isSectionsOpen} onDismiss={() => (isSectionsOpen = false)}>
        {#snippet children()}
          <BottomSheetHeader title="Account" />
          <BottomSheetBody hasActionList>
            {#snippet children()}
              <ActionList>
                {#snippet children()}
                  <ActionListSection title="Profile">
                    {#snippet children()}
                      <ActionListItem title="My Account" value="account">
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
                  </ActionListSection>
                  <ActionListSection title="Danger">
                    {#snippet children()}
                      <ActionListItem title="Logout" value="logout" intent="negative" />
                    {/snippet}
                  </ActionListSection>
                {/snippet}
              </ActionList>
            {/snippet}
          </BottomSheetBody>
        {/snippet}
      </BottomSheet>
    </div>
  {/snippet}
</Story>

<!-- Story 6: Single Select Country List — the PhoneNumberInput CountrySelector parity target. -->
<Story name="Single Select Country List">
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
                onItemSelect={({ value }) => {
                  selectedCountry = value;
                  isCountryOpen = false;
                }}
              >
                {#snippet children()}
                  {#each countries as country (country.value)}
                    <ActionListItem title={country.name} value={country.value}>
                      {#snippet leading()}
                        <ActionListItemAsset src={flagSrc(country.code)} alt={`${country.name} flag`} />
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

<!-- Story 7: Disabled & Negative Items. -->
<Story name="Disabled & Negative Items">
  {#snippet template()}
    <div>
      <Button onClick={() => (isDisabledNegativeOpen = true)}>Open</Button>
      <BottomSheet
        isOpen={isDisabledNegativeOpen}
        onDismiss={() => (isDisabledNegativeOpen = false)}
      >
        {#snippet children()}
          <BottomSheetHeader title="Actions" />
          <BottomSheetBody hasActionList>
            {#snippet children()}
              <ActionList>
                {#snippet children()}
                  <ActionListItem title="Available action" value="available" />
                  <ActionListItem title="Disabled action" value="disabled" isDisabled />
                  <ActionListItem title="Logout" value="logout" intent="negative" />
                {/snippet}
              </ActionList>
            {/snippet}
          </BottomSheetBody>
        {/snippet}
      </BottomSheet>
    </div>
  {/snippet}
</Story>

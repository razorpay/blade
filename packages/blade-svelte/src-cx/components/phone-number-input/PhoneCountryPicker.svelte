<script lang="ts">
  import {
    findPhoneCountry,
    phoneCountryMatches,
    type PhoneCountry,
  } from '../../runes/phone/parts';
  import { createPhonePicker } from '../../runes/phone/picker.svelte';
  import ActionListItem from '../action-list/ActionListItem.svelte';
  import type { ModalControl } from '../modal/overlays';
  import VirtualOptionList from '../option-list/VirtualOptionList.svelte';
  import SearchInput from '../search-input/SearchInput.svelte';
  import {
    resolvePhoneNumberInput,
    type PhoneNumberInputStyleProps,
  } from './styles';

  // The body of the country picker. Loaded on the first tap, so a phone
  // field costs no list, no virtual window and no search box until then.
  interface Props {
    countries: readonly PhoneCountry[];
    /** ISO code of the country picked now. */
    selected?: string;
    countryLabel: string;
    searchLabel?: string;
    emptyText?: string;
    testID?: string;
    styleProps: PhoneNumberInputStyleProps;
    modal: ModalControl<PhoneCountry>;
  }

  let {
    countries,
    selected,
    countryLabel,
    searchLabel,
    emptyText,
    testID,
    styleProps,
    modal,
  }: Props = $props();

  const classes = $derived(resolvePhoneNumberInput(styleProps));
  const picker = createPhonePicker();
</script>

{#snippet noMatch()}
  <p class={classes.empty}>{emptyText}</p>
{/snippet}

{#if searchLabel}
  <SearchInput
    bind:value={picker.query}
    placeholder={searchLabel}
    accessibilityLabel={searchLabel}
    autoFocus
    testID={testID ? `${testID}-search` : undefined}
    class={classes.search}
  />
{/if}
<!-- ActionList's look over the virtual list: its rows are ActionListItems.
     Deselectable, so a tap on the country already picked still closes. -->
<VirtualOptionList
  options={countries}
  query={picker.query}
  filter={phoneCountryMatches}
  empty={emptyText ? noMatch : undefined}
  optionKey={(option) => option.code}
  optionText={(option) => option.name}
  compare={(a, b) => a.code === b.code}
  isDeselectable
  value={findPhoneCountry(countries, selected)}
  onChange={({ value: next }) => modal.close((next as PhoneCountry | null) ?? undefined)}
  accessibilityLabel={countryLabel}
  testID={testID ? `${testID}-countries` : undefined}
  class={classes.list}
  classes={classes.optionList}
>
  {#snippet children(option)}
    <!-- The flag leads, the dial code trails. -->
    <ActionListItem value={option} title={option.name}>
      {#snippet leading()}
        {#if option.flag}
          <img class={classes.flag} src={option.flag} alt="" loading="lazy" />
        {/if}
      {/snippet}
      {#snippet trailing()}
        <span class={classes.rowDialCode}>{option.dialCode}</span>
      {/snippet}
    </ActionListItem>
  {/snippet}
</VirtualOptionList>

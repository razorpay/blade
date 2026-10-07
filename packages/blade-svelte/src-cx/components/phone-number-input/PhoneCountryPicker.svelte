<script lang="ts">
  import { findPhoneCountry, type PhoneCountry } from '../../runes/phone/parts';
  import { createPhonePicker } from '../../runes/phone/picker.svelte';
  import type { ModalControl } from '../modal/overlays';
  import OptionItem from '../option-list/OptionItem.svelte';
  import ActionListRow from '../shared/ActionListRow.svelte';
  import { POPUP_ITEM } from '../shared/popup-list';
  import VirtualOptionList from '../option-list/VirtualOptionList.svelte';
  import TextInput from '../text-input/TextInput.svelte';
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
  const picker = createPhonePicker(() => countries);
  const matches = $derived(picker.matches);
</script>

{#if searchLabel}
  <TextInput
    bind:value={picker.query}
    placeholder={searchLabel}
    accessibilityLabel={searchLabel}
    autoFocus
    testID={testID ? `${testID}-search` : undefined}
    class={classes.search}
  />
{/if}
{#if matches.length === 0}
  {#if emptyText}
    <p class={classes.empty} role="status">{emptyText}</p>
  {/if}
{:else}
  <!-- Deselectable, so a tap on the country already picked still closes. -->
  <VirtualOptionList
    options={matches}
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
      <OptionItem value={option} text={option.name}>
        <!-- ActionList's row: the flag leads, the dial code trails. -->
        {#snippet children()}
          <ActionListRow classes={POPUP_ITEM} title={option.name}>
            {#snippet leading()}
              {#if option.flag}
                <img class={classes.flag} src={option.flag} alt="" loading="lazy" />
              {/if}
            {/snippet}
            {#snippet trailing()}
              <span class={classes.rowDialCode}>{option.dialCode}</span>
            {/snippet}
          </ActionListRow>
        {/snippet}
      </OptionItem>
    {/snippet}
  </VirtualOptionList>
{/if}

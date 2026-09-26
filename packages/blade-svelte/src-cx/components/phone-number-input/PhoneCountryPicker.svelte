<script lang="ts">
  import { findPhoneCountry, type PhoneCountry } from '../../runes/phone/parts';
  import { createPhonePicker } from '../../runes/phone/picker.svelte';
  import type { ModalControl } from '../modal/overlays';
  import OptionList from '../option-list/OptionList.svelte';
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
  <OptionList
    virtualize
    options={matches}
    optionKey={(option) => option.code}
    optionText={(option) => option.name}
    compare={(a, b) => a.code === b.code}
    isDeselectable
    value={findPhoneCountry(countries, selected)}
    onChange={(next) => modal.close((next as PhoneCountry | null) ?? undefined)}
    accessibilityLabel={countryLabel}
    testID={testID ? `${testID}-countries` : undefined}
    class={classes.list}
    {...classes.optionList}
  >
    {#snippet item(option)}
      <span class={classes.row}>
        {#if option.flag}
          <img class={classes.flag} src={option.flag} alt="" loading="lazy" />
        {/if}
        <span class={classes.rowName}>{option.name}</span>
        <span class={classes.rowDialCode}>{option.dialCode}</span>
      </span>
    {/snippet}
  </OptionList>
{/if}

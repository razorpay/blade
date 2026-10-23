<script lang="ts">
  import { provideAdapters } from '../../adapters';
  import { findPhoneCountry, type PhoneCountry } from '../../runes/phone/parts';
  import ActionList from '../action-list/ActionList.svelte';
  import ActionListItem from '../action-list/ActionListItem.svelte';
  import { resolvePhoneNumberInput, type PhoneNumberInputStyleProps } from './styles';

  // The country list, as Blade's CountrySelector: ActionList's rows, the
  // flag leading and the dial code trailing. PhoneNumberInput loads it on
  // the first tap and shows it in its dropdown; an app presenting the list
  // its own way (`adapters.presentDropdown('dial-code', …)`) renders it from
  // the request. Virtualized: only the rows in view mount, so the list is
  // bounded by its container. Its rows keep the overlay's gutter
  // (`--overlay-gutter`) inside its own scroll box: none under the field.
  interface Props extends PhoneNumberInputStyleProps {
    /** The countries to pick from (an `ActionListRequest`'s `items`). */
    items: readonly PhoneCountry[];
    /** The country picked now (its `value`). */
    value?: PhoneCountry;
    /** Localized; the list's accessible name (its `label`; the field's `countryLabel`). */
    label: string;
    /** Lands on the list: rows are `${testID}-${index}`. */
    testID?: string;
    /** A row was picked, the one picked already too. */
    onPick: (country: PhoneCountry) => void;
  }

  let { items, value, label, testID, onPick, ...styleProps }: Props = $props();

  const classes = $derived(resolvePhoneNumberInput(styleProps));
  // Bound: the list writes its pick back (a derived takes the write until
  // `value` changes).
  let picked = $derived(findPhoneCountry(items, value?.code) ?? null);
  // The list is part of the phone field, not a field of the app's form:
  // it neither registers with it nor reports its picks.
  provideAdapters({ form: null });

  const pick = ({ value: next }: { value: PhoneCountry }): void => onPick(next);
</script>

{#snippet row(option: PhoneCountry)}
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

<ActionList
  inset="overlay"
  {items}
  {row}
  itemKey={(option: PhoneCountry) => option.code}
  itemText={(option: PhoneCountry) => option.name}
  isVirtualized
  compare={(a: PhoneCountry, b: PhoneCountry) => a.code === b.code}
  bind:value={picked}
  onPick={pick}
  accessibilityLabel={label}
  {testID}
  class="min-h-0 flex-1"
/>

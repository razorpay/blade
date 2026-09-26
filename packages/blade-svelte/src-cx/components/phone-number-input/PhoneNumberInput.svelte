<script lang="ts">
  import { getAdapters } from '../../adapters';
  import type { PhoneCountry } from '../../runes/phone/parts';
  import { createPhone } from '../../runes/phone/phone.svelte';
  import { getOverlays } from '../modal/overlays';
  import Icon from '../icon/Icon.svelte';
  import type { ComponentProps } from 'svelte';
  import type PhoneCountryPicker from './PhoneCountryPicker.svelte';
  import type { InputGroupSpan } from '../input-group/styles';
  import TextInput from '../text-input/TextInput.svelte';
  import type { TextInputValidationState } from '../text-input/styles';
  import {
    resolvePhoneNumberInput,
    type PhoneNumberChange,
    type PhoneNumberInputStyleProps,
  } from './styles';

  type PickerProps = ComponentProps<typeof PhoneCountryPicker>;

  interface BehaviourProps {
    /**
     * The selectable countries, in display order. The library ships no
     * country data: dial codes, localized names, flags and patterns are the
     * app's.
     */
    countries: readonly PhoneCountry[];
    /** Narrows `countries` by ISO code; one country leaves nothing to pick. */
    allowedCountries?: readonly string[];
    /**
     * The whole number with its dial code (`+919876543210`), which is also
     * what a Form submits. A value without a plus is read as national to
     * `country`.
     */
    value?: string;
    /** ISO code. A `value` with a plus names its own country and wins. */
    country?: string;
    onChange?: (change: PhoneNumberChange) => void;
    onCountryChange?: (country: string) => void;
    label?: string;
    placeholder?: string;
    isDisabled?: boolean;
    isRequired?: boolean;
    /** Shows the country as text only: no button, no picker. */
    isCountryFixed?: boolean;
    /** The dial code beside the flag; off for a field whose country is fixed and named elsewhere. */
    showDialCode?: boolean;
    validationState?: TextInputValidationState;
    helpText?: string;
    errorText?: string;
    successText?: string;
    autoFocus?: boolean;
    span?: InputGroupSpan;
    name?: string;
    /**
     * Localized name of the country button and title of the picker — the
     * library ships no copy.
     */
    countryLabel: string;
    /** Localized; the picker has a search box only when this is given. */
    searchLabel?: string;
    /** Localized; shown when the search matches no country. */
    emptyText?: string;
    /** Localized name of the picker's close button. */
    closeLabel?: string;
    accessibilityLabel?: string;
    /** Lands on the number control; the button is `${testID}-country`. */
    testID?: string;
    class?: string;
  }

  type Props = BehaviourProps & PhoneNumberInputStyleProps;

  let {
    countries,
    allowedCountries,
    value = $bindable(''),
    country = $bindable(),
    onChange,
    onCountryChange,
    label,
    placeholder,
    isDisabled = false,
    isRequired = false,
    isCountryFixed = false,
    showDialCode = true,
    validationState,
    helpText,
    errorText,
    successText,
    autoFocus = false,
    span,
    name,
    countryLabel,
    searchLabel,
    emptyText,
    closeLabel,
    accessibilityLabel,
    testID,
    class: className = '',
    ...styleProps
  }: Props = $props();

  const classes = $derived(resolvePhoneNumberInput(styleProps));
  const overlays = getOverlays();
  const adapters = getAdapters();

  const phone = createPhone({
    countries: () => countries,
    allowedCountries: () => allowedCountries,
    value: () => value,
    country: () => country,
    onValue: (next) => {
      value = next;
    },
    onCountry: (next) => {
      country = next;
    },
    onChange: (change) => onChange?.(change),
    onCountryChange: (next) => onCountryChange?.(next),
    isCountryFixed: () => isCountryFixed,
    // The picker is a modal on the page's stack (a mounted ModalStack), and
    // its body is its own chunk: neither is part of this field's cost.
    openPicker: (selectable, selected) => {
      if (!overlays.hasHost) {
        adapters.captureError?.(
          new Error('PhoneNumberInput: the country picker needs a ModalStack')
        );
        return undefined;
      }
      return overlays.openModal<PickerProps, PhoneCountry>(
        import(
          /* webpackChunkName: "blade-phone-country-picker" */ './PhoneCountryPicker.svelte'
        ),
        {
          props: {
            countries: selectable,
            selected: selected?.code,
            countryLabel,
            searchLabel,
            emptyText,
            testID,
            styleProps,
          },
          title: countryLabel,
          closeLabel,
          pendingLabel: countryLabel,
          testID: testID ? `${testID}-picker` : undefined,
          ...classes.modal,
        }
      );
    },
  });
  const selected = $derived(phone.selected);

  /** Focuses the number control. */
  export function focus() {
    phone.focus();
  }
</script>

{#snippet flag()}
  {#if selected?.flag}
    <img class={classes.flag} src={selected.flag} alt="" />
  {/if}
{/snippet}

{#snippet leading()}
  {#if phone.canPick}
    <button
      type="button"
      class={classes.country}
      disabled={isDisabled}
      aria-haspopup="dialog"
      aria-label={`${countryLabel}: ${selected?.name ?? ''} ${selected?.dialCode ?? ''}`}
      data-testid={testID ? `${testID}-country` : undefined}
      onclick={phone.handlePickerClick}
    >
      {@render flag()}
      <Icon source={classes.chevron} {...classes.chevronIcon} />
    </button>
  {:else}
    <span class={classes.country}>{@render flag()}</span>
  {/if}
  {#if showDialCode}
    <span class={classes.dialCode}>{selected?.dialCode}</span>
  {/if}
{/snippet}

<TextInput
  type="tel"
  attach={phone.attach}
  bind:value
  {label}
  {placeholder}
  {isDisabled}
  {isRequired}
  {validationState}
  {helpText}
  {errorText}
  {successText}
  {autoFocus}
  {span}
  {name}
  format={phone.format}
  pattern={selected?.pattern}
  maxCharacters={selected?.maxLength}
  {leading}
  {accessibilityLabel}
  {testID}
  class={className}
  onChange={phone.handleNumber}
/>

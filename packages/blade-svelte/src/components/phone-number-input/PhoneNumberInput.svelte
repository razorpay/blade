<script lang="ts">
  import { useComponentDefaults } from '../defaults';
  import type { Snippet } from 'svelte';
  import type { HTMLInputAttributes } from 'svelte/elements';
  import { cx } from '../../cx';
  import { getAdapters } from '../../adapters';
  import type { PhoneCountry } from '../../runes/phone/parts';
  import { defaultPhoneCountries, examplePhoneNumber } from '../../runes/phone/countries';
  import { analyticsAttributes, type AnalyticsAttributes } from '../../runes/dom/analytics';
  import { createPhone } from '../../runes/phone/phone.svelte';
  import Icon from '../icon/Icon.svelte';
  import type { IconSource } from '../../runes/icon/source';
  import type { ComponentProps } from 'svelte';
  import type PhoneCountryList from './PhoneCountryList.svelte';
  import PhoneCountryDropdown from './PhoneCountryDropdown.svelte';
  import { createLocalOverlay } from '../../runes/modal/local.svelte';
  import { createNodeRef } from '../../runes/dom/node.svelte';
  import type { InputGroupSpan } from '../input-group/styles';
  import TextInput from '../text-input/TextInput.svelte';
  import { getInputGroup } from '../../runes/input-group/context';
  import type { TextInputValidationState } from '../text-input/styles';
  import {
    resolvePhoneNumberInput,
    type PhoneNumberChange,
    type PhoneNumberInputStyleProps,
  } from './styles';

  type ListProps = ComponentProps<typeof PhoneCountryList>;

  interface BehaviourProps {
    /**
     * The selectable countries, in display order.
     * @default every country i18nify knows (a peer dependency), named in English, by name
     */
    countries?: readonly PhoneCountry[];
    /** Narrows `countries` by ISO code; one country leaves nothing to pick. */
    allowedCountries?: readonly string[];
    /**
     * The whole number with its dial code (`+919876543210`), which is also
     * what a Form submits. A value without a plus is read as national to
     * `country`.
     */
    value?: string;
    /**
     * ISO code. A `value` with a plus names its own country and wins.
     * @default 'IN', as Blade React's; the first of `countries` when it holds no India
     */
    country?: string;
    onChange?: (change: PhoneNumberChange) => void;
    onCountryChange?: (change: { country: string }) => void;
    label?: string;
    /** After the label: `*` or `(optional)`. Required also marks the control required. @default 'none' */
    necessityIndicator?: 'required' | 'optional' | 'none';
    /** @default Blade's example number for the country, `1234 567890` for India */
    placeholder?: string;
    onFocus?: (event: FocusEvent) => void;
    onBlur?: (event: FocusEvent) => void;
    onClick?: (event: MouseEvent) => void;
    /** The clear button (shown while there is a number) was pressed. */
    onClearButtonClick?: () => void;
    /** The return key's label on a virtual keyboard. */
    enterKeyHint?: HTMLInputAttributes['enterkeyhint'];
    /** An HTML autofill token. @default 'tel' */
    autoComplete?: HTMLInputAttributes['autocomplete'];
    /** Hides the country button; the dial code still shows. @default true */
    showCountrySelector?: boolean;
    /**
     * After the country button, before the dial code: an icon (a glyph), or
     * a snippet.
     */
    leading?: IconSource | Snippet;
    /** After the number, last: an icon (a glyph), or a snippet (a Link, a button). */
    trailing?: IconSource | Snippet;
    isDisabled?: boolean;
    isRequired?: boolean;
    /** Shows the country as text only: no button, no picker. */
    isCountryFixed?: boolean;
    /** The dial code beside the flag; off for a field whose country is fixed and named elsewhere. */
    showDialCode?: boolean;
    validationState?: TextInputValidationState;
    helpText?: string | Snippet;
    errorText?: string | Snippet;
    successText?: string | Snippet;
    autoFocus?: boolean;
    span?: InputGroupSpan;
    name?: string;
    /**
     * Localized name of the country button and of the country list.
     * @default 'Country'
     */
    countryLabel?: string;
    /** Localized; handed to an app presenting the list (`adapters.presentDropdown`), for its close button. */
    closeLabel?: string;
    accessibilityLabel?: string;
    /** Lands on the number control; the button is `${testID}-country`. */
    testID?: string;
    class?: string;
  }

  type Props = BehaviourProps & PhoneNumberInputStyleProps & AnalyticsAttributes;

  let {
    countries,
    allowedCountries,
    value = $bindable(''),
    country = $bindable('IN'),
    onChange,
    onCountryChange,
    label,
    necessityIndicator = 'none',
    placeholder,
    onFocus,
    onBlur,
    onClick,
    onClearButtonClick,
    enterKeyHint,
    autoComplete = 'tel',
    showCountrySelector = true,
    leading,
    trailing,
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
    countryLabel = 'Country',
    closeLabel,
    accessibilityLabel,
    testID,
    class: className = '',
    ...styleProps
  }: Props = $props();

  const style = useComponentDefaults('PhoneNumberInput', () => styleProps);

  const classes = $derived(resolvePhoneNumberInput(style.current));
  // Blade puts them on the number control.
  const analytics = $derived(analyticsAttributes(styleProps));
  const adapters = getAdapters();
  // An enclosing disabled InputGroup disables the country picker too, as it
  // does the number field (TextInput reads the group itself).
  const group = getInputGroup();
  const disabled = $derived(isDisabled || Boolean(group?.isDisabled()));
  // The number field, which a country pick edits as typing does.
  let numberField: { change: (value: string) => boolean } | undefined;

  const phone = createPhone({
    countries: () => countries ?? defaultPhoneCountries(),
    allowedCountries: () => allowedCountries,
    value: () => value,
    country: () => country,
    onCountry: (next) => {
      country = next;
    },
    onChange: (change) => onChange?.(change),
    onCountryChange: (next) => onCountryChange?.({ country: next }),
    edit: (next) => numberField?.change(next) ?? false,
    isCountryFixed: () => isCountryFixed,
    // The list is its own chunk, loaded on the first tap. Blade shows it in
    // a dropdown under the field, as React; an app may present it its own
    // way (`adapters.presentDropdown('dial-code', …)`).
    openPicker: (selectable, picked, cancelled) => {
      const size = style.current.size ?? 'medium';
      const listTestID = testID ? `${testID}-countries` : undefined;
      const presented = adapters.presentDropdown?.('dial-code', {
        items: selectable,
        value: picked,
        itemKey: (country) => country.code,
        itemText: (country) => country.name,
        label: countryLabel,
        testID,
        closeLabel,
        cancelled,
      });
      return (
        presented ||
        dropdown.open({
          items: selectable,
          value: picked,
          size,
          label: countryLabel,
          testID: listTestID,
        })
      );
    },
  });
  const selected = $derived(phone.selected);

  // The field's frame, which the dropdown hangs from: the number control's
  // parent (TextInput's frame label).
  const frame = createNodeRef<HTMLElement>();
  const attachControl = (node: HTMLInputElement) => {
    const parent = node.parentElement;
    const leave = parent ? frame.attach(parent) : undefined;
    const undo = phone.attach(node);
    return () => {
      leave?.();
      undo?.();
    };
  };

  // Blade's own dropdown, open while a pick is pending.
  const uid = $props.id();
  const dropdownId = `${uid}-countries`;
  const dropdown = createLocalOverlay<Omit<ListProps, 'onPick'>, PhoneCountry>();

  function handleCountryClick(): void {
    if (disabled) return;
    if (dropdown.isOpen) {
      dropdown.close();
    } else {
      phone.handlePickerClick();
    }
  }

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

{#snippet countrySlot()}
  {#if !showCountrySelector}
    <!-- Blade: no selector, the dial code alone. -->
  {:else if phone.canPick}
    <button
      type="button"
      class={classes.country}
      {disabled}
      aria-haspopup="dialog"
      aria-expanded={dropdown.isOpen}
      aria-controls={dropdown.isOpen ? dropdownId : undefined}
      aria-label={`${countryLabel}: ${selected?.name ?? ''} ${selected?.dialCode ?? ''}`}
      data-testid={testID ? `${testID}-country` : undefined}
      onclick={handleCountryClick}
    >
      {@render flag()}
      <Icon source={classes.chevron} {...classes.chevronIcon} />
    </button>
  {:else}
    <span class={classes.country}>{@render flag()}</span>
  {/if}
  {#if typeof leading === 'function'}
    <span class={cx('flex shrink-0 items-center', classes.dialCode)}>{@render leading()}</span>
  {:else if leading}
    <span class={cx('flex shrink-0 items-center', classes.dialCode)}>
      <Icon source={leading} size={style.current.size === 'large' ? 'large' : 'medium'} />
    </span>
  {/if}
  {#if showDialCode}
    <span class={cx(classes.dialCode, !showCountrySelector && !leading && classes.dialCodeAlone)}>{selected?.dialCode}</span>
  {/if}
{/snippet}

<TextInput
  field={(handle) => {
    numberField = handle;
  }}
  type="tel"
  attach={attachControl}
  bind:value
  {label}
  {necessityIndicator}
  placeholder={placeholder ?? (selected ? examplePhoneNumber(selected.code) : undefined)}
  {onFocus}
  {onBlur}
  {onClick}
  {onClearButtonClick}
  {enterKeyHint}
  {autoComplete}
  {trailing}
  showClearButton
  size={style.current.size}
  {isDisabled}
  {isRequired}
  {validationState}
  {helpText}
  {errorText}
  {successText}
  {autoFocus}
  {span}
  {name}
  transform={phone.transform}
  pattern={selected?.pattern}
  maxCharacters={selected?.maxLength}
  leading={countrySlot}
  {accessibilityLabel}
  {testID}
  class={className}
  onChange={({ value: next }) => phone.handleNumber(next)}
  {...analytics}
/>

{#if frame.current}
  <PhoneCountryDropdown
    isOpen={dropdown.isOpen}
    id={dropdownId}
    anchor={frame.current}
    classes={classes.dropdown}
    accessibilityLabel={countryLabel}
    onDismiss={() => dropdown.close()}
    testID={testID ? `${testID}-picker` : undefined}
  >
    {#if dropdown.props}
      {#await import('./PhoneCountryList.svelte') then { default: List }}
        <List {...dropdown.props} onPick={dropdown.close} />
      {/await}
    {/if}
  </PhoneCountryDropdown>
{/if}

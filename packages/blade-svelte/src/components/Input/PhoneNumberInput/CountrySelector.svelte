<script module lang="ts">
  import type { BaseInputSize } from '../BaseInput/types';

  // Flag width in px, mirrors React's `flagSize` (global size tokens 16/16/20/24).
  const flagSize: Record<BaseInputSize, number> = {
    xsmall: 16,
    small: 16,
    medium: 20,
    large: 24,
  };
</script>

<script lang="ts">
  import { getDialCodeByCountryCode, getFlagOfCountry } from '@razorpay/i18nify-js';
  import {
    ActionList,
    ActionListItem,
    ActionListItemAsset,
    ActionListItemText,
  } from '../../ActionList';
  import { BottomSheet, BottomSheetHeader, BottomSheetBody } from '../../BottomSheet';
  import { ChevronDownIcon } from '../../Icons';
  import type { CountrySelectorProps } from './types';

  let {
    isDisabled = false,
    selectedCountry,
    countryData,
    onItemClick,
    flags,
    size,
  }: CountrySelectorProps = $props();

  let isOpen = $state(false);

  const countryNameFormatter = new Intl.DisplayNames(['en'], { type: 'region' });

  const flagSrc = $derived(getFlagOfCountry(selectedCountry)['4X3']);
  const triggerLabel = $derived(`${countryNameFormatter.of(selectedCountry)} - Select Country`);

  const handleSelect = ({ value }: { value: string }): void => {
    onItemClick({ name: value });
    isOpen = false;
  };
</script>

<button
  type="button"
  class="country-selector-trigger"
  disabled={isDisabled || undefined}
  aria-label={triggerLabel}
  aria-haspopup="dialog"
  aria-expanded={isOpen}
  onclick={() => (isOpen = true)}
>
  <img
    loading="lazy"
    role="presentation"
    width={flagSize[size]}
    src={flagSrc}
    alt=""
  />
  <span class="country-selector-chevron">
    <ChevronDownIcon size="small" color="surface.icon.gray.muted" />
  </span>
</button>

<BottomSheet {isOpen} onDismiss={() => (isOpen = false)}>
  <BottomSheetHeader title="Select A Country" />
  <BottomSheetBody hasActionList>
    <ActionList selectedValue={selectedCountry} onItemSelect={handleSelect}>
      {#each countryData as country (country.code)}
        <ActionListItem title={country.name} value={country.code}>
          {#snippet leading()}
            <ActionListItemAsset src={flags[country.code]?.['4X3'] ?? ''} alt={country.name} />
          {/snippet}
          {#snippet trailing()}
            <ActionListItemText>{getDialCodeByCountryCode(country.code)}</ActionListItemText>
          {/snippet}
        </ActionListItem>
      {/each}
    </ActionList>
  </BottomSheetBody>
</BottomSheet>

<style>
  .country-selector-trigger {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-2);
    padding: 0 var(--spacing-3);
    height: 100%;
    border: none;
    background: transparent;
    cursor: pointer;
    outline: none;
  }

  .country-selector-trigger[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .country-selector-trigger:focus-visible {
    box-shadow: 0 0 0 var(--border-width-thick) var(--surface-border-primary-muted);
    border-radius: var(--border-radius-small);
  }

  .country-selector-chevron {
    display: inline-flex;
    align-items: center;
  }
</style>

<script module lang="ts">
  import type { BaseInputSize } from '../BaseInput/types';

  // Flag width in px, mirrors React's `flagSize` (global size tokens 16/16/20/24).
  const flagSize: Record<BaseInputSize, number> = {
    xsmall: 16,
    small: 16,
    medium: 20,
    large: 24,
  };

  // Trigger "chip" height = React InputDropdownButton height:
  // baseInputHeight[size] - 2 × spacing[inputDropdownButtonPadding[size]].
  // xsmall 28-4=24, small 32-4=28, medium 36-8=28, large 48-8=40.
  const chipHeight: Record<BaseInputSize, number> = {
    xsmall: 24,
    small: 28,
    medium: 28,
    large: 40,
  };

  // Chip border-radius, mirrors React's `inputDropdownButtonBorderRadius` (6/6/6/8px).
  const chipRadius: Record<BaseInputSize, number> = {
    xsmall: 6,
    small: 6,
    medium: 6,
    large: 8,
  };

  // Horizontal inset per side = React outer button padding (spacing.2 = 4px) +
  // inner Box padding (inputDropdownButtonPadding[size]: xsmall/small spacing.1 = 2px,
  // medium/large spacing.2 = 4px). => 6/6/8/8px.
  const chipPadX: Record<BaseInputSize, number> = {
    xsmall: 6,
    small: 6,
    medium: 8,
    large: 8,
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
  import { ChevronUpDownIcon } from '../../Icons';
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
  style={`height: ${chipHeight[size]}px; border-radius: ${chipRadius[size]}px; padding: 0 ${chipPadX[size]}px;`}
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
    <ChevronUpDownIcon size="medium" color="interactive.icon.gray.muted" />
  </span>
</button>

<BottomSheet {isOpen} onDismiss={() => (isOpen = false)}>
  <BottomSheetHeader title="Select A Country" />
  <BottomSheetBody hasActionList>
    <ActionList selectedValue={[selectedCountry]} onItemSelect={handleSelect}>
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
  /* Mirrors React's InputDropdownButton chip: transparent at rest, gray-faded on
     hover/focus, compact centered box with 4px + 4px inset (8px total) and 4px gap. */
  .country-selector-trigger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-2);
    border: none;
    background-color: transparent;
    cursor: pointer;
    outline: none;
    transition: background-color 70ms ease;
  }

  .country-selector-trigger:hover:not([disabled]),
  .country-selector-trigger:focus-visible {
    background-color: var(--interactive-background-gray-faded);
  }

  .country-selector-trigger[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .country-selector-trigger:focus-visible {
    box-shadow: 0 0 0 var(--border-width-thick) var(--surface-border-primary-muted);
  }

  .country-selector-chevron {
    display: inline-flex;
    align-items: center;
  }
</style>

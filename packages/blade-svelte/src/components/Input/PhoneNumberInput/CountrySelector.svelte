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
  import { computePosition, autoUpdate, shift, flip, offset } from '@floating-ui/dom';
  import { getDialCodeByCountryCode } from '@razorpay/i18nify-js/phoneNumber';
  import { getFlagOfCountry } from '@razorpay/i18nify-js/geo';
  import {
    ActionList,
    ActionListItem,
    ActionListItemAsset,
    ActionListItemText,
  } from '../../ActionList';
  import { BottomSheet, BottomSheetHeader, BottomSheetBody } from '../../BottomSheet';
  import { ChevronUpDownIcon } from '../../Icons';
  import { portal } from '../../../utils/portal';
  import type { CountrySelectorProps } from './types';

  const DESKTOP_BREAKPOINT_QUERY = '(min-width: 768px)';
  const OVERLAY_GAP = 8; // React `OVERLAY_OFFSET` — size[8] = 8px
  const OVERLAY_PADDING = 12; // React `OVERLAY_PADDING` — size[12]; rough padding for flip/shift
  const POPOVER_Z_INDEX = 1002; // React `componentZIndices.dropdownOverlay`

  let {
    isDisabled = false,
    selectedCountry,
    countryData,
    onItemClick,
    flags,
    size,
    portalTarget,
  }: CountrySelectorProps = $props();

  let isOpen = $state(false);
  let isDesktop = $state(false);
  let isPopoverMounted = $state(false);
  let triggerEl = $state<HTMLButtonElement | null>(null);
  let floatingEl = $state<HTMLDivElement | null>(null);
  let floatingX = $state(0);
  let floatingY = $state(0);

  const countryNameFormatter = new Intl.DisplayNames(['en'], { type: 'region' });

  const flagSrc = $derived(getFlagOfCountry(selectedCountry)['4X3']);
  const triggerLabel = $derived(`${countryNameFormatter.of(selectedCountry)} - Select Country`);

  /* Desktop/mobile switch — mirrors React's `useIsMobile` (breakpoints base/xs/s =
     width < 768px ⇒ mobile), listening for runtime reseize. Falls back to mobile
     (BottomSheet) when matchMedia is unavailable (SSR/non-browser). */
  $effect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      isDesktop = false;
      return;
    }
    const mediaQuery = window.matchMedia(DESKTOP_BREAKPOINT_QUERY);
    const update = (): void => {
      isDesktop = mediaQuery.matches;
    };
    update();
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', update);
      return () => mediaQuery.removeEventListener('change', update);
    }
    return;
  });

  const closePopover = (): void => {
    isOpen = false;
  };

  const handleSelect = ({ value }: { value: string }): void => {
    onItemClick({ name: value });
    closePopover();
  };

  const handleTriggerClick = (): void => {
    isOpen = !isOpen;
  };

  /* Floating positioning for the desktop popover — anchored to the trigger,
     kept in sync on scroll/resize via autoUpdate. Effect re-runs once the
     floating node is bound (isPopoverMounted flips to true on the first pass). */
  $effect(() => {
    if (!isDesktop || !isOpen) {
      isPopoverMounted = false;
      return;
    }
    isPopoverMounted = true;
    const reference = triggerEl;
    const floating = floatingEl;
    if (!reference || !floating) return;

    const update = (): void => {
      computePosition(reference, floating, {
        strategy: 'fixed',
        placement: 'bottom-start',
        middleware: [
          offset(OVERLAY_GAP),
          flip({ padding: OVERLAY_GAP + OVERLAY_PADDING }),
          shift({ padding: OVERLAY_GAP }),
        ],
      }).then(({ x, y }) => {
        floatingX = x;
        floatingY = y;
      });
    };

    return autoUpdate(reference, floating, update);
  });

  /* Outside click + Escape close the desktop popover. */
  const handleGlobalPointerDown = (event: PointerEvent | MouseEvent): void => {
    const target = event.target as Node | null;
    if (!target) return;
    if (triggerEl?.contains(target) || floatingEl?.contains(target)) return;
    closePopover();
  };

  const handleGlobalKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      closePopover();
    }
  };

  $effect(() => {
    if (!isDesktop || !isOpen) return;
    document.addEventListener('pointerdown', handleGlobalPointerDown, true);
    document.addEventListener('keydown', handleGlobalKeyDown, true);
    return () => {
      document.removeEventListener('pointerdown', handleGlobalPointerDown, true);
      document.removeEventListener('keydown', handleGlobalKeyDown, true);
    };
  });

  const popoverStyle = $derived(
    [
      'position: fixed',
      'left: 0',
      'top: 0',
      `transform: translate3d(${Math.round(floatingX)}px, ${Math.round(floatingY)}px, 0)`,
      `z-index: ${POPOVER_Z_INDEX}`,
      'min-width: 240px',
      'max-width: 400px',
      // React `StyledDropdownOverlay`: popup bg, radius.medium, backdrop blur,
      // popup box shadow (border + midRaised elevation + top inner shadow).
      'background-color: var(--popup-background-gray-moderate)',
      'border-radius: var(--border-radius-medium)',
      'backdrop-filter: blur(8px)',
      'box-shadow: inset 0 0 0 1px var(--popup-border-gray-subtle), var(--elevation-mid-raised), inset 0 0 0 0 var(--popup-border-gray-moderate)',
    ].join(';'),
  );
</script>

<button
  bind:this={triggerEl}
  type="button"
  class="country-selector-trigger"
  style={`height: ${chipHeight[size]}px; border-radius: ${chipRadius[size]}px; padding: 0 ${chipPadX[size]}px;`}
  disabled={isDisabled || undefined}
  aria-label={triggerLabel}
  aria-haspopup={isDesktop ? 'listbox' : 'dialog'}
  aria-expanded={isOpen}
  onclick={handleTriggerClick}
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

{#if isDesktop}
  {#if isPopoverMounted}
    <div
      bind:this={floatingEl}
      class="country-selector-popover"
      style={popoverStyle}
      use:portal
    >
      <ActionList selectionType="single" selectedValue={selectedCountry} onAction={handleSelect}>
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
    </div>
  {/if}
{:else}
  <BottomSheet {isOpen} onDismiss={closePopover} {portalTarget}>
    <BottomSheetHeader title="Select A Country" />
    <BottomSheetBody hasActionList>
      <ActionList selectionType="single" selectedValue={selectedCountry} onAction={handleSelect}>
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
{/if}

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

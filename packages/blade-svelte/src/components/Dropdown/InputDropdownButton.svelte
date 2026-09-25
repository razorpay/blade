<script lang="ts">
  import { untrack } from 'svelte';
  import {
    metaAttribute,
    makeAccessible,
    makeAnalyticsAttribute,
    useId,
  } from '@razorpay/blade-core/utils';
  import {
    getInputDropdownButtonClasses,
    inputDropdownButtonContentClass,
    getDropdownTemplateClasses,
  } from '@razorpay/blade-core/styles';
  import Text from '../Typography/Text/Text.svelte';
  import { ChevronUpDownIcon } from '../Icons';
  import { getActionListContainerRole } from '../ActionList/getA11yRoles';
  import { getDropdownContext } from './dropdownContext';
  import type { InputDropdownButtonProps } from './types';

  // Prevent tree-shaking of template classes used in compound selectors.
  void getDropdownTemplateClasses();

  let {
    onClick,
    onBlur,
    onKeyDown,
    accessibilityLabel,
    _isInsideSearchInput = false,
    isDisabled = false,
    onChange,
    name,
    testID,
    value,
    defaultValue,
    icon,
    leading,
    showDisplayValue = true,
    size = 'medium',
    ...rest
  }: InputDropdownButtonProps = $props();

  const idBase = useId('input-drop-down-button');
  const dropdown = getDropdownContext();

  // Register as the (select-style) trigger so a11y roles resolve correctly.
  $effect(() => {
    dropdown?.setDropdownTriggerer('InputDropdownButton');
  });

  const isOpen = $derived(dropdown?.isOpen ?? false);
  const activeIndex = $derived(dropdown?.activeIndex ?? -1);
  const hasFooterAction = $derived(dropdown?.hasFooterAction ?? false);
  const dropdownBaseId = $derived(dropdown?.dropdownBaseId ?? idBase);
  const displayValue = $derived(dropdown?.displayValue ?? '');

  // Seed selection from `value` (controlled) / `defaultValue` (uncontrolled) once
  // the matching option has registered. Minimal port of
  // `useControlledDropdownInput`.
  let hasSeededDefault = $state(false);
  $effect(() => {
    const opts = dropdown?.options ?? [];
    if (value !== undefined) {
      if (opts.some((o) => o.value === value)) {
        dropdown?.setSelectedValues([value]);
      }
    } else if (!hasSeededDefault && defaultValue !== undefined) {
      if (opts.some((o) => o.value === defaultValue)) {
        dropdown?.setSelectedValues([defaultValue]);
        hasSeededDefault = true;
      }
    }
  });

  // Fire onChange only for user-initiated selections. Watching `dropdown.value`
  // directly would also fire for the `value`/`defaultValue` seeding above, so we
  // track the controller's selection counter instead (React parity:
  // `changeCallbackTriggerer` + skip-first-render).
  let hasSeenInitialTrigger = false;
  $effect(() => {
    // Tracked dependency — everything below is read untracked on purpose.
    void dropdown?.changeCallbackTriggerer;
    if (!hasSeenInitialTrigger) {
      hasSeenInitialTrigger = true;
      return;
    }
    untrack(() => {
      onChange?.({ name: name ?? idBase, value: dropdown?.value ?? '' });
    });
  });

  const iconColor = $derived(
    isDisabled ? 'surface.icon.gray.disabled' : 'surface.icon.gray.muted',
  );
  const displayColor = $derived(
    isDisabled ? 'surface.text.gray.disabled' : 'surface.text.gray.subtle',
  );

  const buttonClasses = $derived(getInputDropdownButtonClasses({ size }));

  const a11yAttrs = $derived(
    makeAccessible({
      label: accessibilityLabel ?? `change ${displayValue} filter`,
      hasPopup: getActionListContainerRole(hasFooterAction, 'InputDropdownButton', true),
      expanded: isOpen,
      controls: `${dropdownBaseId}-actionlist`,
      activeDescendant: activeIndex >= 0 ? `${dropdownBaseId}-${activeIndex}` : undefined,
    }),
  );

  const metaAttrs = $derived(metaAttribute({ name: 'InputDropdownButton', testID }));
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));

  function handleClick(event: MouseEvent): void {
    if (isDisabled) return;
    dropdown?.onTriggerClick();
    onClick?.(event);
    event.stopPropagation();
  }

  function handleBlur(event: FocusEvent): void {
    if (isDisabled) return;
    onBlur?.(event);
    event.stopPropagation();
  }

  function handleKeydown(event: KeyboardEvent): void {
    if (isDisabled) return;
    dropdown?.onTriggerKeydown({ event });
    onKeyDown?.(event);
    event.stopPropagation();
  }

  function setTriggerRef(node: HTMLButtonElement): { destroy: () => void } {
    dropdown?.setTriggererEl(node);
    return { destroy: () => dropdown?.setTriggererEl(null) };
  }
</script>

<button
  type="button"
  class={buttonClasses}
  disabled={isDisabled || undefined}
  onclick={handleClick}
  onblur={handleBlur}
  onkeydown={handleKeydown}
  use:setTriggerRef
  {...a11yAttrs}
  {...metaAttrs}
  {...analyticsAttrs}
>
  <span class={inputDropdownButtonContentClass}>
    {#if _isInsideSearchInput}
      <Text
        variant="body"
        size="medium"
        weight="regular"
        color={isDisabled ? 'surface.text.gray.disabled' : 'surface.text.gray.muted'}
      >
        in
      </Text>
    {/if}
    {#if leading}
      {@render leading()}
    {/if}
    {#if icon}
      {@const IconComp = icon}
      <IconComp size="medium" color={iconColor} />
    {/if}
    {#if showDisplayValue && displayValue}
      <Text variant="body" size="medium" weight="regular" color={displayColor}>
        {displayValue}
      </Text>
    {/if}
    <ChevronUpDownIcon color={iconColor} />
  </span>
</button>

<script lang="ts">
  import { untrack } from 'svelte';
  import { makeAnalyticsAttribute } from '@razorpay/blade-core/utils';
  import BaseInput from '../BaseInput/BaseInput.svelte';
  import IconButton from '../../Button/IconButton/IconButton.svelte';
  import Spinner from '../../Spinner/BaseSpinner/BaseSpinner.svelte';
  import { CloseIcon, SearchIcon } from '../../Icons';
  import type { SearchInputProps } from './types';

  let {
    label,
    accessibilityLabel,
    labelPosition = 'top',
    labelSuffix,
    labelTrailing,
    helpText,
    placeholder,
    defaultValue,
    value,
    name,
    onChange,
    onFocus,
    onBlur,
    onClick,
    onClearButtonClick,
    isLoading = false,
    showSearchIcon = true,
    trailing,
    isDisabled = false,
    autoFocus = false,
    autoCapitalize,
    size = 'medium',
    testID,
    ...rest
  }: SearchInputProps = $props();

  let baseInput = $state<{ focus: () => void; getInput: () => HTMLInputElement | null } | null>(
    null,
  );

  let shouldShowClearButton = $state(untrack(() => Boolean(defaultValue ?? value)));

  const handleChange = (payload: { name?: string; value?: string; rawValue?: string }) => {
    const v = payload.value;
    if (v?.length) {
      shouldShowClearButton = true;
    } else if (shouldShowClearButton && !v?.length) {
      shouldShowClearButton = false;
    }
    onChange?.(payload);
  };

  const clearInput = () => {
    const el = baseInput?.getInput();
    if (el) {
      el.value = '';
      el.focus();
    }
    onClearButtonClick?.();
    baseInput?.focus();
    shouldShowClearButton = false;
  };

  const showInteractionElement = $derived(isLoading || shouldShowClearButton);

  export function focus(): void {
    baseInput?.focus();
  }
  export function getInput(): HTMLInputElement | null {
    return baseInput?.getInput() ?? null;
  }

  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

{#snippet trailingInteraction()}
  {#if isLoading}
    <Spinner accessibilityLabel="Loading Content" color="primary" size="medium" />
  {:else if shouldShowClearButton}
    <IconButton icon={CloseIcon} size="medium" {isDisabled} accessibilityLabel="Clear Input Content" onClick={clearInput} />
  {/if}
{/snippet}

<BaseInput
  bind:this={baseInput}
  id="searchinput"
  componentName="searchinput"
  label={label ?? ''}
  hideLabelText={!label}
  {accessibilityLabel}
  {labelPosition}
  {labelSuffix}
  {labelTrailing}
  {placeholder}
  {defaultValue}
  {value}
  {name}
  type="search"
  onChange={handleChange}
  {onFocus}
  {onBlur}
  {onClick}
  {isDisabled}
  leadingIcon={showSearchIcon ? SearchIcon : undefined}
  trailingInteractionElement={showInteractionElement ? trailingInteraction : trailing}
  {helpText}
  {size}
  {autoFocus}
  {autoCapitalize}
  {testID}
  {...analyticsAttrs}
  {...rest}
/>

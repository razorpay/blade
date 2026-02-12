<script lang="ts">
  import type { Snippet } from 'svelte';
  import {
    metaAttribute,
    MetaConstants,
    getStyledPropsClasses,
    makeAnalyticsAttribute,
  } from '@razorpay/blade-core/utils';
  import {
    getChipTemplateClasses,
    getChipWrapperClasses,
    getChipAnimatedClasses,
    getChipTextColorClass,
    getChipTextSizeClass,
  } from '@razorpay/blade-core/styles';
  import type { ChipProps, ChipColor } from './types';
  import { getChipGroupContext } from './chipContext';

  // Prevent tree-shaking
  const cls = getChipTemplateClasses();

  let {
    children,
    icon: Icon,
    color,
    isDisabled,
    value,
    width,
    maxWidth,
    minWidth,
    testID,
    ...rest
  }: ChipProps = $props();

  // Read context from ChipGroup (returns a getter function for reactivity)
  const getGroupProps = getChipGroupContext();

  // Derive reactive group props by calling the getter inside $derived
  const groupProps = $derived(getGroupProps());

  const isInsideGroup = $derived(Object.keys(groupProps).length > 0);

  $effect(() => {
    if (!isInsideGroup && typeof window !== 'undefined') {
      console.error(
        '[Blade: Chip] <Chip /> component should only be used within the context of a <ChipGroup /> component',
      );
    }
  });

  // Derive effective props from group context
  const _isDisabled = $derived(isDisabled ?? groupProps?.isDisabled ?? false);
  const _size = $derived(groupProps?.size ?? 'small');
  const chipColor = $derived<ChipColor>((color ?? groupProps?.color ?? 'primary') as ChipColor);
  const _isChecked = $derived(groupProps?.state?.isChecked(value!) ?? false);
  const _name = $derived(groupProps?.name);
  const selectionType = $derived(groupProps?.selectionType ?? 'single');
  const _isRequired = $derived(
    groupProps?.isRequired || groupProps?.necessityIndicator === 'required',
  );
  const hasError = $derived(groupProps?.validationState === 'error');
  const hasIcon = $derived(Boolean(Icon));

  // Press animation state
  let isPressed = $state(false);

  // Handlers for press animation
  function handlePointerDown() {
    if (_isDisabled) return;
    isPressed = true;
  }

  function handlePointerUp() {
    if (_isDisabled) return;
    isPressed = false;
  }

  function handlePointerOut() {
    if (_isDisabled) return;
    isPressed = false;
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (_isDisabled) return;
    if (e.key === ' ') {
      isPressed = true;
    }
  }

  function handleKeyUp(e: KeyboardEvent) {
    if (_isDisabled) return;
    if (e.key === ' ') {
      isPressed = false;
    }
  }

  // Handle input change (native radio/checkbox behavior)
  function handleChange() {
    if (_isDisabled) return;
    const currentGroupProps = getGroupProps();
    if (_isChecked) {
      currentGroupProps?.state?.removeValue(value!);
    } else {
      currentGroupProps?.state?.addValue(value!);
    }
  }

  // Computed classes
  const wrapperClasses = $derived(
    getChipWrapperClasses({
      size: _size,
      hasIcon,
      isChecked: _isChecked,
      isDisabled: _isDisabled,
      chipColor,
    }),
  );

  const animatedClasses = $derived(
    getChipAnimatedClasses({
      size: _size,
      isPressed,
      isChecked: _isChecked,
      isDisabled: _isDisabled,
      chipColor,
    }),
  );

  const textColorClass = $derived(
    getChipTextColorClass({
      isChecked: _isChecked,
      isDisabled: _isDisabled,
      chipColor,
    }),
  );

  const textSizeClass = $derived(getChipTextSizeClass(_size));

  // Styled props
  const styledProps = $derived(getStyledPropsClasses(rest));
  const outerClasses = $derived(
    [cls.chipOuter, ...(styledProps.classes || [])].filter(Boolean).join(' '),
  );

  // Meta & analytics attributes
  const metaAttrs = metaAttribute({ name: MetaConstants.Chip, testID });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));

  // Input type based on selection type
  const inputType = $derived(selectionType === 'single' ? 'radio' : 'checkbox');

  // Children handling
  const isStringChildren = $derived(typeof children === 'string');
  const snippetChildren = $derived(
    !isStringChildren && children ? (children as Snippet) : undefined,
  );

  // Outer element style for width/maxWidth/minWidth
  const outerStyle = $derived.by(() => {
    const parts: string[] = [];
    if (width) parts.push(`width: ${width}`);
    if (maxWidth) parts.push(`max-width: ${maxWidth}`);
    if (minWidth) parts.push(`min-width: ${minWidth}`);
    return parts.length > 0 ? parts.join('; ') : undefined;
  });
</script>

<div
  class={outerClasses}
  style={outerStyle}
  {...metaAttrs}
  {...analyticsAttrs}
>
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <label
    class={cls.chipLabel}
    data-disabled={_isDisabled ? 'true' : undefined}
    {...metaAttribute({ name: MetaConstants.ChipLabel })}
    onmousedown={handlePointerDown}
    onmouseup={handlePointerUp}
    onmouseout={handlePointerOut}
    ontouchstart={handlePointerDown}
    ontouchend={handlePointerUp}
    onkeydown={handleKeyDown}
    onkeyup={handleKeyUp}
  >
    <div style="display: flex; flex-direction: column; width: 100%;">
      <div style="display: flex; align-items: center; flex-direction: row;">
        <input
          class={cls.hiddenInput}
          type={inputType}
          name={_name}
          {value}
          checked={_isChecked}
          disabled={_isDisabled || undefined}
          required={_isRequired || undefined}
          aria-invalid={hasError || undefined}
          onchange={handleChange}
        />
        <div class={animatedClasses}>
          <div class={wrapperClasses}>
            {#if Icon}
              <span class={cls.chipIconWrapper}>
                <!-- TODO: Render Icon component when Icons are migrated -->
              </span>
            {/if}
            {#if isStringChildren}
              <span class="{cls.chipText} {textColorClass} {textSizeClass}">
                {children}
              </span>
            {:else if snippetChildren}
              <span class="{cls.chipText} {textColorClass} {textSizeClass}">
                {@render snippetChildren()}
              </span>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </label>
</div>

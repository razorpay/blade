<script lang="ts">
  import { untrack, type Snippet } from 'svelte';
  import {
    metaAttribute,
    MetaConstants,
    makeAccessible,
    makeAnalyticsAttribute,
    getStyledPropsClasses,
  } from '@razorpay/blade-core/utils';
  import {
    getCheckboxTitleClasses,
    getCheckboxSupportClasses,
    getCheckboxSupportTextClasses,
    getCheckboxHintClasses,
    getCheckboxHintWrapperClasses,
    getCheckboxTemplateClasses,
  } from '@razorpay/blade-core/styles';
  import CheckboxIcon from './CheckboxIcon.svelte';
  import { InfoIcon } from '../Icons';
  import { getCheckboxGroupContext } from './checkboxContext';
  import type { CheckboxProps } from './types';

  const templateClasses = getCheckboxTemplateClasses();

  let {
    isChecked,
    defaultChecked,
    onChange,
    children,
    helpText,
    errorText,
    isIndeterminate = false,
    name,
    value,
    isDisabled,
    isRequired,
    validationState,
    size = 'medium',
    tabIndex,
    testID,
    ...rest
  }: CheckboxProps = $props();

  const groupProps = getCheckboxGroupContext();

  const isDev = typeof process === 'undefined' || process.env.NODE_ENV !== 'production';
  if (isDev) {
    const hasBannedProp =
      validationState !== undefined ||
      name !== undefined ||
      defaultChecked !== undefined ||
      isChecked !== undefined ||
      onChange !== undefined;
    if (hasBannedProp && groupProps) {
      const bannedProps = [
        validationState !== undefined ? 'validationState' : undefined,
        name !== undefined ? 'name' : undefined,
        defaultChecked !== undefined ? 'defaultChecked' : undefined,
        isChecked !== undefined ? 'isChecked' : undefined,
        onChange !== undefined ? 'onChange' : undefined,
      ]
        .filter(Boolean)
        .join(',');
      // eslint-disable-next-line no-console
      console.error(
        `[Blade Checkbox]: Cannot set \`${bannedProps}\` on <Checkbox /> when it's inside <CheckboxGroup />. Please set it on the <CheckboxGroup /> itself.`,
      );
    }
    if (!value && groupProps) {
      // eslint-disable-next-line no-console
      console.error(
        '[Blade Checkbox]: <CheckboxGroup /> requires that you pass a unique "value" prop to each <Checkbox />.',
      );
    }
  }

  // ── Group context merge (precedence mirrors React Checkbox.tsx) ──
  const _validationState = $derived(validationState ?? groupProps?.validationState);
  const _hasError = $derived(_validationState === 'error');
  const _isDisabled = $derived(isDisabled ?? groupProps?.isDisabled ?? false);
  const _isRequired = $derived(
    Boolean(isRequired || groupProps?.isRequired || groupProps?.necessityIndicator === 'required'),
  );
  const _name = $derived(name ?? groupProps?.name);
  const _size = $derived(groupProps?.size ?? size);

  // ── Controllable checked ──
  // Standalone: `isChecked` (controlled) | internal `$state` seeded by `defaultChecked`.
  // Inside group: group state is the source of truth.
  let internalChecked = $state(untrack(() => defaultChecked) ?? false);

  const isInGroup = $derived(Boolean(groupProps));
  const groupChecked = $derived(value ? groupProps?.state?.isChecked(value) ?? false : false);

  const isControlled = $derived(isInGroup || isChecked !== undefined);
  const isCheckedState = $derived(
    isInGroup ? groupChecked : isChecked !== undefined ? isChecked : internalChecked,
  );

  const showSupportingText = $derived(Boolean(helpText));

  let inputEl: HTMLInputElement | undefined = $state();

  export function focus(options?: FocusOptions): void {
    inputEl?.focus(options);
  }

  // indeterminate is an IDL prop, not an attribute — set it imperatively.
  $effect(() => {
    if (inputEl) {
      inputEl.indeterminate = Boolean(isIndeterminate);
    }
  });

  function handleChange(event: Event): void {
    if (_isDisabled) {
      event.stopPropagation();
      event.preventDefault();
      return;
    }
    const next = !isCheckedState;
    if (isInGroup && value) {
      if (next) {
        groupProps?.state?.addValue(value);
      } else {
        groupProps?.state?.removeValue(value);
      }
    } else if (!isControlled) {
      internalChecked = next;
    }
    onChange?.({ isChecked: next, value, event });
    // Reconcile the DOM checkbox with the source-of-truth after onChange runs,
    // in case a controlled consumer rejected the toggle (Switch pattern).
    if (inputEl && inputEl.checked !== isCheckedState) {
      inputEl.checked = isCheckedState;
    }
  }

  const isStringChildren = $derived(typeof children === 'string');
  const snippetChildren = $derived(!isStringChildren ? (children as Snippet | undefined) : undefined);
  const hasChildren = $derived(Boolean(children));

  // ── ids ──
  const idBase = `checkbox-${Math.random().toString(36).slice(2, 8)}`;
  const helpTextId = `${idBase}-help`;
  const errorTextId = `${idBase}-error`;

  const titleClasses = $derived(getCheckboxTitleClasses({ size: _size, isDisabled: _isDisabled }));
  const supportClasses = $derived(getCheckboxSupportClasses({ size: _size }));
  const supportTextClasses = $derived(getCheckboxSupportTextClasses({ size: _size }));
  const hintClasses = $derived(
    getCheckboxHintClasses({ size: _size, type: validationState === 'error' ? 'error' : 'help' }),
  );
  const hintWrapperClasses = $derived(getCheckboxHintWrapperClasses({ size: _size }));

  const styledProps = $derived(getStyledPropsClasses(rest));
  const wrapperClasses = $derived(
    [templateClasses.checkbox, ...(styledProps.classes || [])].filter(Boolean).join(' '),
  );
  const wrapperStyles = $derived(
    Object.entries(styledProps.inlineStyles || {})
      .map(([prop, val]) => `${prop}: ${val}`)
      .join('; ') || undefined,
  );

  const metaAttrs = $derived(metaAttribute({ name: MetaConstants.Checkbox, testID }));
  const labelMetaAttrs = metaAttribute({ name: MetaConstants.CheckboxLabel });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));

  const a11yAttrs = $derived(
    makeAccessible({
      role: 'checkbox',
      required: _isRequired,
      invalid: _hasError,
      disabled: _isDisabled,
      checked: isIndeterminate ? 'mixed' : isCheckedState,
      ...(_hasError ? { errorMessage: errorTextId } : {}),
      ...(showSupportingText ? { describedBy: helpTextId } : {}),
    }),
  );

  const showFormHint = $derived(Boolean(errorText));

  // React FormHint icon sizing: small/medium hint -> 'small', large -> 'medium'.
  const hintIconSize = $derived(_size === 'large' ? 'medium' : 'small');
</script>

<div class={wrapperClasses} style={wrapperStyles} {...metaAttrs}>
  <label class={templateClasses.label} data-disabled={_isDisabled || undefined} {...labelMetaAttrs}>
    <div class={templateClasses.field}>
      <div class={templateClasses.row}>
        <input
          bind:this={inputEl}
          class={templateClasses.input}
          type="checkbox"
          name={_name}
          {value}
          tabindex={tabIndex}
          checked={isCheckedState}
          disabled={_isDisabled || undefined}
          required={_isRequired || undefined}
          onchange={handleChange}
          {...a11yAttrs}
          {...analyticsAttrs}
        />
        <CheckboxIcon
          size={_size}
          isChecked={isCheckedState}
          {isIndeterminate}
          isDisabled={_isDisabled}
          isNegative={_hasError}
        />
        {#if hasChildren}
          <span class={titleClasses}>
            {#if isStringChildren}
              {children}
            {:else if snippetChildren}
              {@render snippetChildren()}
            {/if}
          </span>
        {/if}
      </div>
      {#if showSupportingText}
        <span class={supportClasses} id={helpTextId}>
          <span class={supportTextClasses}>{helpText}</span>
        </span>
      {/if}
    </div>
  </label>
  {#if showFormHint}
    <span class={hintWrapperClasses}>
      <span class={templateClasses.hintIcon}>
        <InfoIcon size={hintIconSize} color="feedback.icon.negative.intense" />
      </span>
      <span class={hintClasses} id={errorTextId}>{errorText}</span>
    </span>
  {/if}
</div>

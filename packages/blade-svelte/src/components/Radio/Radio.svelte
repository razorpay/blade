<script lang="ts">
  import type { Snippet } from 'svelte';
  import {
    metaAttribute,
    MetaConstants,
    makeAccessible,
    getStyledPropsClasses,
    makeAnalyticsAttribute,
  } from '@razorpay/blade-core/utils';
  import {
    getRadioTemplateClasses,
    getRadioTitleClasses,
    getRadioSupportTextWrapperClasses,
    getRadioSupportTextClasses,
  } from '@razorpay/blade-core/styles';
  import RadioIcon from './RadioIcon.svelte';
  import { getRadioGroupContext } from './radioContext';
  import type { RadioProps } from './types';

  const templateClasses = getRadioTemplateClasses();

  let {
    children,
    helpText,
    value,
    isDisabled,
    size = 'medium',
    testID,
    ...rest
  }: RadioProps = $props();

  const groupCtx = getRadioGroupContext();

  const _isDisabled = $derived(isDisabled ?? groupCtx?.isDisabled ?? false);
  const _size = $derived(groupCtx?.size ?? size);
  const _name = $derived(groupCtx?.name);
  const _isRequired = $derived(
    Boolean(groupCtx?.isRequired) || groupCtx?.necessityIndicator === 'required',
  );
  const hasError = $derived(groupCtx?.validationState === 'error');
  const _isChecked = $derived(groupCtx?.state?.isChecked(value) ?? false);

  const isStringChildren = $derived(typeof children === 'string');
  const snippetChildren = $derived(!isStringChildren ? (children as Snippet | undefined) : undefined);
  const stringChildren = $derived(isStringChildren ? (children as string) : undefined);
  const hasChildren = $derived(children !== undefined && children !== '');

  let inputEl: HTMLInputElement | undefined = $state();

  export function focus(): void {
    inputEl?.focus();
  }

  function handleChange(event: Event): void {
    if (_isDisabled) {
      event.stopPropagation();
      event.preventDefault();
      return;
    }
    // Radios cannot self-uncheck — only set the value when not already checked.
    if (!_isChecked) {
      groupCtx?.state?.setValue(value, event);
    }
  }

  let idCounter = 0;
  const idBase = `radio-${++idCounter}-${Math.random().toString(36).slice(2, 6)}`;
  const helpTextId = `${idBase}-helptext`;

  const titleClasses = $derived(getRadioTitleClasses({ size: _size }));
  const supportWrapperClasses = $derived(getRadioSupportTextWrapperClasses({ size: _size }));
  const supportTextClasses = $derived(getRadioSupportTextClasses({ size: _size }));

  const styledProps = $derived(getStyledPropsClasses(rest));
  const wrapperClasses = $derived(
    [templateClasses.radioWrapper, ...(styledProps.classes || [])].filter(Boolean).join(' '),
  );

  const metaAttrs = metaAttribute({ name: MetaConstants.Radio, testID });
  const labelMetaAttrs = metaAttribute({ name: MetaConstants.RadioLabel });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
  const a11yAttrs = $derived(
    makeAccessible({
      role: 'radio',
      required: _isRequired,
      invalid: hasError,
      disabled: _isDisabled,
      checked: _isChecked,
      describedBy: helpText ? helpTextId : undefined,
    }),
  );
</script>

<div class={wrapperClasses} {...metaAttrs} {...analyticsAttrs}>
  <label class={templateClasses.label} data-disabled={_isDisabled || undefined} {...labelMetaAttrs}>
    <span class={templateClasses.column}>
      <span class={templateClasses.row}>
        <input
          bind:this={inputEl}
          class={templateClasses.input}
          type="radio"
          name={_name}
          {value}
          checked={_isChecked}
          disabled={_isDisabled || undefined}
          required={_isRequired || undefined}
          onchange={handleChange}
          {...a11yAttrs}
        />
        <RadioIcon
          size={_size}
          isChecked={_isChecked}
          isDisabled={_isDisabled}
          isNegative={hasError}
        />
        {#if hasChildren}
          <span class={titleClasses} data-disabled={_isDisabled || undefined}>
            {#if isStringChildren}
              {stringChildren}
            {:else if snippetChildren}
              {@render snippetChildren()}
            {/if}
          </span>
        {/if}
      </span>
      {#if helpText}
        <span class={supportWrapperClasses}>
          <span id={helpTextId} class={supportTextClasses}>{helpText}</span>
        </span>
      {/if}
    </span>
  </label>
</div>

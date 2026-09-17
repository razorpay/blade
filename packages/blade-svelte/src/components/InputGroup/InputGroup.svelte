<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    makeAccessible,
    makeAnalyticsAttribute,
    getStyledPropsClasses,
  } from '@razorpay/blade-core/utils';
  import {
    getInputGroupFieldClasses,
    getInputGroupHintIndentClass,
    getInputGroupTemplateClasses,
  } from '@razorpay/blade-core/styles';
  import FormLabel from '../Input/_Form/FormLabel.svelte';
  import FormHint from '../Input/_Form/FormHint.svelte';
  import { useFormId } from '../Input/BaseInput/useFormId';
  import { getHintType } from '../Input/BaseInput/utils';
  import { setInputGroupContext } from './inputGroupContext';
  import type { InputGroupProps, InputGroupContextType } from './types';

  const templateClasses = getInputGroupTemplateClasses();

  let {
    label,
    labelPosition = 'top',
    size = 'medium',
    helpText,
    errorText,
    successText,
    validationState = 'none',
    isDisabled = false,
    children,
    testID,
    ...rest
  }: InputGroupProps = $props();

  // Reactive context — getters keep child inputs in sync with group prop changes.
  const contextValue: InputGroupContextType = {
    isInsideInputGroup: true,
    get size() {
      return size;
    },
    get isDisabled() {
      return isDisabled;
    },
  };
  setInputGroupContext(() => contextValue);

  const { labelId, helpTextId, errorTextId, successTextId } = useFormId('input-group');

  const willRenderHintText = $derived(
    Boolean(helpText) ||
      (validationState === 'success' && Boolean(successText)) ||
      (validationState === 'error' && Boolean(errorText)),
  );

  const hintType = $derived(getHintType({ validationState, hasHelpText: Boolean(helpText) }));

  const formSize = $derived(size);

  // Hint is indented under the input only when the label sits to the left.
  const applyHintIndent = $derived(labelPosition === 'left' && Boolean(label));

  const fieldBoxClasses = $derived(getInputGroupFieldClasses({ labelPosition }));
  const hintBoxClasses = $derived(
    [templateClasses.hintBox, applyHintIndent ? getInputGroupHintIndentClass(size) : '']
      .filter(Boolean)
      .join(' '),
  );

  const styledProps = $derived(getStyledPropsClasses(rest));
  const rootClasses = $derived(
    [templateClasses.inputGroup, ...(styledProps.classes || [])].filter(Boolean).join(' '),
  );
  const rootStyles = $derived(
    Object.entries(styledProps.inlineStyles || {})
      .map(([prop, val]) => `${prop}: ${val}`)
      .join('; ') || undefined,
  );

  const metaAttrs = $derived(metaAttribute({ name: MetaConstants.InputGroup, testID }));
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
  const groupA11yAttrs = $derived(makeAccessible({ role: 'group', labelledBy: label ? labelId : undefined }));
</script>

<div class={rootClasses} style={rootStyles} {...metaAttrs} {...analyticsAttrs}>
  <div class={templateClasses.group} data-testid={testID} {...groupA11yAttrs}>
    <div class={fieldBoxClasses}>
      {#if label}
        <FormLabel
          as="label"
          position={labelPosition}
          size={formSize}
          id={labelId}
        >
          {label}
        </FormLabel>
      {/if}

      <div class={templateClasses.inputsWrapper}>
        {@render children()}
      </div>
    </div>

    {#if willRenderHintText}
      <div class={hintBoxClasses}>
        <div class={templateClasses.hintInner}>
          <FormHint
            type={hintType}
            {helpText}
            {errorText}
            {successText}
            {helpTextId}
            {errorTextId}
            {successTextId}
            size={formSize}
          />
        </div>
      </div>
    {/if}
  </div>
</div>

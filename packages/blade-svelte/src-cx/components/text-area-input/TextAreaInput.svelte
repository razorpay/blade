<script lang="ts">
  import { cx } from '../../cx';
  import { visibleFieldError } from '../../runes/form/hint';
  import { createFieldLine } from '../../runes/form/field-line.svelte';
  import { createTextControl } from '../../runes/text-input/text-control.svelte';
  import {
    resolveTextAreaInput,
    type TextAreaInputStyleProps,
    type TextAreaInputValidationState,
  } from './styles';
  import TextAreaControl from './TextAreaControl.svelte';

  interface BehaviourProps {
    label?: string;
    value?: string;
    placeholder?: string;
    /** Visible rows; the control does not grow with its content. */
    numberOfLines?: number;
    onChange?: (value: string) => void;
    onBlur?: (event: FocusEvent) => void;
    onFocus?: (event: FocusEvent) => void;
    isDisabled?: boolean;
    isRequired?: boolean;
    isReadOnly?: boolean;
    /**
     * Omit inside a Form: the field mirrors its own form error once it is
     * touched or a submit was attempted. Pass it to own the state instead.
     */
    validationState?: TextAreaInputValidationState;
    /**
     * The line under the control while the state is `none`, and the stand-in
     * for the other two. Inside a Form a visible field error replaces the
     * line while it lasts.
     */
    helpText?: string;
    /** The line while `validationState` is `error`. */
    errorText?: string;
    /** The line while `validationState` is `success`. */
    successText?: string;
    autoFocus?: boolean;
    name?: string;
    maxCharacters?: number;
    /** Names the control when there is no visible `label`. */
    accessibilityLabel?: string;
    /** Lands on the control, the element tests type into. */
    testID?: string;
    class?: string;
  }

  // Closed prop set: behaviour props declared here, style props in
  // `./styles`; the typed rest is handed to the resolver opaquely.
  type Props = BehaviourProps & TextAreaInputStyleProps;

  let {
    label,
    value = $bindable(''),
    placeholder,
    numberOfLines = 2,
    onChange,
    onBlur,
    onFocus,
    isDisabled = false,
    isRequired = false,
    isReadOnly = false,
    validationState,
    helpText,
    errorText,
    successText,
    autoFocus = false,
    name,
    maxCharacters,
    accessibilityLabel,
    testID,
    class: className = '',
    ...styleProps
  }: Props = $props();

  const uid = $props.id();
  // Blade's three lines, one shown: the state's own, else the help text.
  const lineText = $derived(
    { none: undefined, error: errorText, success: successText }[
      validationState ?? 'none'
    ] ?? helpText
  );
  const controlId = `${uid}-control`;
  const hintId = `${uid}-hint`;

  const fieldProps = () => ({
    name,
    value,
    required: isRequired,
    disabled: isDisabled,
    readonly: isReadOnly,
  });

  const control = createTextControl({
    props: fieldProps,
    autoFocus: () => autoFocus,
    onValue: (next) => {
      value = next as string;
    },
    onChange: (next) => onChange?.(next as string),
    onFocus,
    onBlur,
  });
  const { field, form } = control;

  const classes = $derived(resolveTextAreaInput(styleProps));
  const line = createFieldLine(
    form,
    () => ({ validationState, hint: lineText }),
    (state) => visibleFieldError(field.record, state)
  );
  const hint = $derived(line.hint);
</script>

<div class={cx(classes.root, isDisabled && classes.disabled, className)}>
  {#if label}
    <label for={controlId} class={classes.label}>{label}</label>
  {/if}
  <TextAreaControl
    attach={control.attach}
    id={controlId}
    class={cx(
      classes.control,
      hint.validationState !== 'none' &&
        classes.validation[hint.validationState]
    )}
    value={control.display()}
    {name}
    {placeholder}
    {numberOfLines}
    {isRequired}
    {isDisabled}
    {isReadOnly}
    {maxCharacters}
    accessibilityLabel={label ? undefined : accessibilityLabel}
    isInvalid={hint.validationState === 'error'}
    describedBy={hint.text ? hintId : undefined}
    {testID}
    oninput={control.handleInput}
    onblur={control.handleBlur}
    onfocus={control.handleFocus}
  />
  {#if hint.text}
    <p
      id={hintId}
      class={cx(classes.hint, classes.hintTone[hint.validationState])}
    >
      {hint.text}
    </p>
  {/if}
</div>

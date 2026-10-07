<script lang="ts">
  import type { FieldChange } from '../shared/change';
  import { useComponentDefaults } from '../defaults';
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import FieldHint from '../shared/FieldHint.svelte';
  import FieldLabel from '../shared/FieldLabel.svelte';
  import FieldCounter from '../shared/FieldCounter.svelte';
  import Icon from '../icon/Icon.svelte';
  import { CloseIcon } from '../../icons';
  import { hintToneOf } from '../shared/field';
  import { pickHintText } from '../../runes/form/hint';
  import { createFieldLine } from '../../runes/form/field-line.svelte';
  import { createTextControl } from '../../runes/text-input/text-control.svelte';
  import {
    resolveTextArea,
    type TextAreaStyleProps,
    type TextAreaValidationState,
  } from './styles';
  import TextAreaControl from './TextAreaControl.svelte';

  interface BehaviourProps {
    label?: string;
    /** After the label: `*` or `(optional)`. Required also marks the control required. @default 'none' */
    necessityIndicator?: 'required' | 'optional' | 'none';
    /**
     * The label's area, to put content beside the label (Blade's
     * `labelSuffix` and `labelTrailing`): render the `label` snippet it
     * receives and anything else. Today the area is the row above the
     * control — items 4px apart, `ms-auto` pushes one to the end — and it
     * stays the place for the label wherever a future `labelPosition` puts
     * it. Only the label names the control.
     */
    labelArea?: Snippet<[{ label: Snippet }]>;
    value?: string;
    placeholder?: string;
    /** Visible rows; the control does not grow with its content. */
    numberOfLines?: number;
    onChange?: (change: FieldChange<string>) => void;
    onBlur?: (event: FocusEvent) => void;
    onFocus?: (event: FocusEvent) => void;
    isDisabled?: boolean;
    isRequired?: boolean;
    isReadOnly?: boolean;
    /**
     * Omit inside a Form: the field mirrors its own form error once it is
     * touched or a submit was attempted. Pass it to own the state instead.
     */
    validationState?: TextAreaValidationState;
    /**
     * The line under the control while the state is `none`, and the stand-in
     * for the other two. Inside a Form a visible field error replaces the
     * line while it lasts.
     */
    helpText?: string | Snippet;
    /** The line while `validationState` is `error`. */
    errorText?: string | Snippet;
    /** The line while `validationState` is `success`. */
    successText?: string | Snippet;
    autoFocus?: boolean;
    /** A clear button while the field holds text. @default false */
    showClearButton?: boolean;
    /** The clear button was pressed; the field is already empty. */
    onClearButtonClick?: () => void;
    onKeyDown?: (event: KeyboardEvent) => void;
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
  type Props = BehaviourProps & TextAreaStyleProps;

  let {
    label,
    necessityIndicator = 'none',
    labelArea,
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
    showClearButton = false,
    onClearButtonClick,
    onKeyDown,
    name,
    maxCharacters,
    accessibilityLabel,
    testID,
    class: className = '',
    ...styleProps
  }: Props = $props();

  const style = useComponentDefaults('TextArea', () => styleProps);

  const uid = $props.id();
  // Blade's three lines, one shown: the state's own, else the help text.
  const lineText = $derived(
    pickHintText({ validationState, helpText, errorText, successText })
  );
  const controlId = `${uid}-control`;
  const hintId = `${uid}-hint`;

  const fieldProps = () => ({
    name,
    value,
    required: isRequired || necessityIndicator === 'required',
    disabled: isDisabled,
    readonly: isReadOnly,
  });

  const control = createTextControl({
    props: fieldProps,
    autoFocus: () => autoFocus,
    onValue: (next) => {
      value = next as string;
    },
    onChange: (next) => onChange?.({ name, value: next as string }),
    onFocus,
    onBlur,
  });
  const { field, form } = control;

  const classes = $derived(resolveTextArea(style.current));
  const line = createFieldLine(
    form,
    () => ({ validationState, hint: lineText }),
    field.record
  );
  const hint = $derived(line.hint);
  const showClear = $derived(showClearButton && value.length > 0);

  function clearField() {
    control.clear();
    onClearButtonClick?.();
  }
</script>

<div class={cx(classes.root, isDisabled && classes.disabled, className)}>
  {#if label}
    <FieldLabel
      as="label"
      for={controlId}
      text={label}
      {necessityIndicator}
      area={labelArea}
      size={style.current.size}
    />
  {/if}
  <div class={classes.box}>
  <TextAreaControl
    attach={control.attach}
    id={controlId}
    class={cx(
      classes.control,
      hint.validationState !== 'none' &&
        classes.validation[hint.validationState],
      showClear && classes.clearRoom
    )}
    value={control.display()}
    {name}
    {placeholder}
    {numberOfLines}
    isRequired={isRequired || necessityIndicator === 'required'}
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
    onkeydown={onKeyDown}
  />
  {#if showClear}
    <button
      type="button"
      class={classes.clear}
      aria-label="Clear Input Content"
      disabled={isDisabled || undefined}
      onclick={clearField}
    >
      <Icon source={CloseIcon} size="medium" />
    </button>
  {/if}
  </div>
  {#if hint.text || maxCharacters}
    <div class={classes.footer}>
      {#if hint.text}
        <FieldHint
          id={hintId}
          text={hint.text}
          tone={hintToneOf(hint.validationState)}
          size={style.current.size}
        />
      {/if}
      {#if maxCharacters}
        <span class={classes.counter}>
          <FieldCounter
            current={value.length}
            max={maxCharacters}
            size={style.current.size}
          />
        </span>
      {/if}
    </div>
  {/if}
</div>

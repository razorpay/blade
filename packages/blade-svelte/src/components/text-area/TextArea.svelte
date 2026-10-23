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
  import { analyticsAttributes, type AnalyticsAttributes } from '../../runes/dom/analytics';
  import { getInputGroup } from '../../runes/input-group/context';
  import { createTextControl } from '../../runes/text-input/text-control.svelte';
  import type { InputGroupSpan } from '../input-group/styles';
  import {
    resolveTextArea,
    type TextAreaStyleProps,
    type TextAreaValidationState,
  } from './styles';

  interface BehaviourProps {
    label?: string;
    /** After the label: `*` or `(optional)`. Required also marks the control required. @default 'none' */
    necessityIndicator?: 'required' | 'optional' | 'none';
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
    /** Inside an InputGroup: this field's share of its row. @default 'full' */
    span?: InputGroupSpan;
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
  type Props = BehaviourProps & TextAreaStyleProps & AnalyticsAttributes;

  let {
    label,
    necessityIndicator = 'none',
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
    span = 'full',
    name,
    maxCharacters,
    accessibilityLabel,
    testID,
    class: className = '',
    ...styleProps
  }: Props = $props();

  const style = useComponentDefaults('TextArea', () => styleProps);
  // Blade puts them on the control.
  const analytics = $derived(analyticsAttributes(styleProps));

  const uid = $props.id();
  const controlId = `${uid}-control`;

  // Inside an InputGroup the group shows the label and the one hint line,
  // as for TextInput; this field keeps its label as the control's name.
  const group = getInputGroup();
  const frame = group ? 'grouped' : 'solo';
  const disabled = $derived(isDisabled || Boolean(group?.isDisabled()));
  const state = $derived(validationState ?? group?.validationState());
  // Blade's three lines, one shown: the state's own, else the help text.
  const lineText = $derived(
    pickHintText({ validationState: state, helpText, errorText, successText })
  );

  const fieldProps = () => ({
    name,
    value,
    required: isRequired || necessityIndicator === 'required',
    disabled,
    readonly: isReadOnly,
  });

  const control = createTextControl({
    id: uid,
    props: fieldProps,
    line: () => ({ validationState: state, hint: lineText }),
    autoFocus: () => autoFocus,
    onValue: (next) => {
      value = next as string;
    },
    onChange: (next) => onChange?.({ name, value: next as string }),
    onFocus: (event) => onFocus?.(event),
    onBlur: (event) => onBlur?.(event),
    group,
    span: () => span,
  });
  const { field, hintId } = control;

  // Inside an InputGroup the group's size wins, as in Blade.
  const classes = $derived(
    resolveTextArea({ ...style.current, size: group?.size() ?? style.current.size })
  );
  const hint = $derived(control.hint);
  const showClear = $derived(showClearButton && value.length > 0);

  function clearField() {
    control.clear();
    onClearButtonClick?.();
  }
</script>

<div
  class={cx(
    group ? classes.grouped : classes.root,
    group?.spanClass(span),
    group?.joinClass(),
    isDisabled && classes.disabled,
    className
  )}
>
  {#if label && !group}
    <FieldLabel
      as="label"
      for={controlId}
      text={label}
      {necessityIndicator}
      size={style.current.size}
    />
  {/if}
  <div class={classes.box}>
    <textarea
      id={controlId}
      class={cx(
        classes.control[frame],
        hint.validationState !== 'none' &&
          classes.validation[frame][hint.validationState],
        showClear && classes.clearRoom,
        group?.cornerClass(field.record)
      )}
      value={control.display()}
      {name}
      {placeholder}
      rows={numberOfLines}
      required={isRequired || necessityIndicator === 'required' || undefined}
      disabled={disabled || undefined}
      readonly={isReadOnly || undefined}
      maxlength={maxCharacters}
      spellcheck={false}
      aria-label={group ? (accessibilityLabel ?? label) : label ? undefined : accessibilityLabel}
      aria-invalid={hint.validationState === 'error' ? 'true' : undefined}
      aria-describedby={group ? group.hintId() : hint.text ? hintId : undefined}
      data-testid={testID}
      oninput={control.handleInput}
      onblur={control.handleBlur}
      onfocus={control.handleFocus}
      onkeydown={onKeyDown}
      {...analytics}
      {@attach control.attach}
    ></textarea>
    {#if showClear}
      <button
        type="button"
        class={classes.clear}
        aria-label="Clear Input Content"
        disabled={disabled || undefined}
        onclick={clearField}
      >
        <Icon source={CloseIcon} size="medium" />
      </button>
    {/if}
  </div>
  {#if !group && (hint.text || maxCharacters)}
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

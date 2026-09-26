<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { Attachment } from 'svelte/attachments';
  import { cx } from '../../cx';
  import { createFieldLine } from '../../runes/form/field-line.svelte';
  import { visibleFieldError } from '../../runes/form/hint';
  import {
    compileRules,
    isFormatRules,
    serializeSpec,
    type FormatSpec,
  } from '../../runes/text-input/format';
  import { maxLength } from '../../runes/dom/max-length';
  import { getInputGroup } from '../../runes/input-group/context';
  import { createTextControl } from '../../runes/text-input/text-control.svelte';
  import Icon from '../icon/Icon.svelte';
  import type { InputGroupSpan } from '../input-group/styles';
  import {
    resolveTextInput,
    type TextInputStyleProps,
    type TextInputValidationState,
  } from './styles';

  type Value = string | number | null | undefined;

  type TextInputFormat =
    | FormatSpec
    | { parse: (value: Value) => Value; format: (value: Value) => string };

  interface BehaviourProps {
    label?: string;
    value?: Value;
    placeholder?: string;
    /** `search`: a searchbox; `searchIcon` leads unless `leading` is set. */
    type?: 'text' | 'tel' | 'email' | 'number' | 'password' | 'search';
    onChange?: (value: Value) => void;
    onBlur?: (event: FocusEvent) => void;
    onFocus?: (event: FocusEvent) => void;
    isDisabled?: boolean;
    isRequired?: boolean;
    isReadOnly?: boolean;
    /**
     * Omit inside a Form: the field mirrors its own form error once it is
     * touched or a submit was attempted. Pass it to own the state instead.
     */
    validationState?: TextInputValidationState;
    /**
     * The line under the control while the state is `none`, and the
     * stand-in for the other two. Inside a Form a visible field error
     * replaces the line while it lasts.
     */
    helpText?: string;
    /** The line while `validationState` is `error`. */
    errorText?: string;
    /** The line while `validationState` is `success`. */
    successText?: string;
    /** Before the text: a string (₹, +91) or a snippet (an icon, both). */
    leading?: string | Snippet;
    /** After the text: a string (@okaxis) or a snippet (an icon, a button). */
    trailing?: string | Snippet;
    autoFocus?: boolean;
    /** Inside an InputGroup: this field's share of its row. */
    span?: InputGroupSpan;
    name?: string;
    maxCharacters?: number;
    pattern?: string | RegExp;
    /**
     * How the stored value and the displayed text relate — one prop,
     * because the two halves only mean something together. Prefer the
     * declarative rule lists: the native platform then formats in its own
     * text pass instead of a bridge round-trip per keystroke; on web they
     * compile to the same functions.
     */
    format?: TextInputFormat;
    /** Names the control when there is no visible `label`. */
    accessibilityLabel?: string;
    /** Lands on the control, the element tests type into. */
    testID?: string;
    class?: string;
    /** A composition's handle on the control (PhoneNumberInput's). */
    attach?: Attachment<HTMLInputElement>;
  }

  // Closed prop set: behaviour props declared here, style props in
  // `./styles`; the typed rest is handed to the resolver opaquely.
  type Props = BehaviourProps & TextInputStyleProps;

  let {
    label,
    value = $bindable(''),
    placeholder,
    type = 'text',
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
    leading,
    trailing,
    autoFocus = false,
    span = 'full',
    name,
    maxCharacters,
    pattern,
    format,
    accessibilityLabel,
    testID,
    class: className = '',
    attach,
    ...styleProps
  }: Props = $props();

  const uid = $props.id();
  const controlId = `${uid}-control`;
  const labelId = `${uid}-label`;
  const hintId = `${uid}-hint`;

  // Inside an InputGroup the group shows the label and the one hint line
  // and draws the frame; this field keeps its label as the control's name.
  const group = getInputGroup();
  const frame = group ? 'grouped' : 'solo';
  const disabled = $derived(isDisabled || Boolean(group?.isDisabled()));

  const parseFn = $derived(
    format && isFormatRules(format.parse)
      ? compileRules(format.parse)
      : format?.parse
  );
  const formatFn = $derived(
    format && isFormatRules(format.format)
      ? compileRules(format.format)
      : format?.format
  );
  // Native-only attributes ride on the shared markup instead of a fork:
  // `format` (the serialized spec) and the `maxLength` attachment.
  const formatSpec = $derived(
    format && isFormatRules(format.parse) && isFormatRules(format.format)
      ? serializeSpec({ parse: format.parse, format: format.format })
      : undefined
  );

  const fieldProps = () => ({
    name,
    value,
    parse: parseFn,
    format: formatFn,
    required: isRequired,
    pattern,
    type,
    disabled,
    readonly: isReadOnly,
  });

  const control = createTextControl({
    props: fieldProps,
    autoFocus: () => autoFocus,
    onValue: (next) => {
      value = next as Exclude<Value, undefined>;
    },
    onChange: (next) => onChange?.(next as Value),
    onFocus,
    onBlur,
    group,
    span: () => span,
  });
  const { field, form } = control;

  const classes = $derived(resolveTextInput(styleProps));
  const state = $derived(validationState ?? group?.validationState());
  // Blade's three lines, one shown: the state's own, else the help text.
  const lineText = $derived(
    { none: undefined, error: errorText, success: successText }[
      state ?? 'none'
    ] ?? helpText
  );
  const line = createFieldLine(
    form,
    () => ({ validationState: state, hint: lineText }),
    (state) => visibleFieldError(field.record, state)
  );
  const hint = $derived(line.hint);

  /** For a host that moves focus itself (an error, a step change). */
  export function focus() {
    control.focus();
  }
</script>

{#snippet affix(content: string | Snippet)}
  <span class={cx(classes.affix, disabled && classes.disabled.affix)}>
    {#if typeof content === 'string'}{content}{:else}{@render content()}{/if}
  </span>
{/snippet}

<div
  class={cx(
    group ? classes.grouped : classes.root,
    group?.spanClass(span),
    group?.joinClass(),
    isDisabled && classes.disabled.root,
    className
  )}
>
  {#if label && !group}
    <label id={labelId} for={controlId} class={classes.label}>{label}</label>
  {/if}
  <!--
    A label, so a click on an affix or the padding lands in the control.
    `for` is explicit: an affix may hold a button, and an implicit label
    would hand its clicks to that first labelable descendant.
  -->
  <label
    class={cx(
      classes.box,
      classes.frame[frame],
      classes.focus[frame][control.isFocused ? 'focused' : 'blurred'],
      hint.validationState !== 'none' &&
        classes.validation[frame][hint.validationState],
      disabled && classes.disabled.box,
      group?.cornerClass(field.record)
    )}
    for={controlId}
  >
    {#if leading}
      {@render affix(leading)}
    {:else if type === 'search'}
      <span class={cx(classes.affix, disabled && classes.disabled.affix)}>
        <Icon source={classes.searchIcon} />
      </span>
    {/if}
    <input
      id={controlId}
      class={classes.control}
      value={control.display()}
      {name}
      {placeholder}
      {type}
      required={isRequired || undefined}
      disabled={disabled || undefined}
      readonly={isReadOnly || undefined}
      format={formatSpec}
      enterkeyhint={type === 'search' ? 'search' : undefined}
      spellcheck={false}
      aria-label={group
        ? (accessibilityLabel ?? label)
        : label
          ? undefined
          : accessibilityLabel}
      aria-labelledby={label && !group ? labelId : undefined}
      aria-invalid={hint.validationState === 'error' ? 'true' : undefined}
      aria-describedby={group ? group.hintId() : hint.text ? hintId : undefined}
      data-testid={testID}
      oninput={control.handleInput}
      onblur={control.handleBlur}
      onfocus={control.handleFocus}
      {@attach maxLength(() => maxCharacters)}
      {@attach control.attach}
      {@attach attach}
    />
    {#if trailing}
      {@render affix(trailing)}
    {/if}
  </label>
  {#if hint.text && !group}
    <p
      id={hintId}
      class={cx(classes.hint, classes.hintTone[hint.validationState])}
    >
      {hint.text}
    </p>
  {/if}
</div>

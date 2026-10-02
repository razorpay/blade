<script lang="ts">
  import type { FieldChange } from '../shared/change';
  import { useComponentDefaults } from '../defaults';
  import type { Snippet } from 'svelte';
  import type { Attachment } from 'svelte/attachments';
  import type { HTMLInputAttributes } from 'svelte/elements';
  import { cx } from '../../cx';
  import FieldHint from '../shared/FieldHint.svelte';
  import FieldLabel from '../shared/FieldLabel.svelte';
  import FieldCounter from '../shared/FieldCounter.svelte';
  import { hintToneOf } from '../shared/field';
  import { createFieldLine } from '../../runes/form/field-line.svelte';
  import { pickHintText } from '../../runes/form/hint';
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
  import { close } from '../icons';
  import type { InputGroupSpan } from '../input-group/styles';
  import { resolveKeyboard, type TextInputType } from './keyboard';
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
    value?: Value;
    placeholder?: string;
    /**
     * The HTML input type, which brings its keyboard, return key and
     * autofill (`tel` → `autocomplete="tel"`, `url` → the Go key, …; any
     * given attribute wins). `number` renders as `text` with the decimal
     * keypad, as Blade. For a password or a search field use PasswordInput
     * or SearchInput, which draw their own buttons; `password` here is the
     * bare masked control they build on.
     * @default 'text'
     */
    type?: TextInputType;
    /**
     * The control's role, for a composition that is one (SearchInput's
     * `searchbox`). A plain text field has none.
     */
    role?: 'searchbox';
    /**
     * The virtual keyboard, when it should differ from the one `type`
     * brings — `numeric` for digits in a `text` field (a card number).
     */
    inputMode?: HTMLInputAttributes['inputmode'];
    /** A user edit: the field's `name` and its new value (parsed, with `format`). */
    onChange?: (change: FieldChange<Value>) => void;
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
     * replaces the line while it lasts. A snippet for a line with more than
     * text in it (a Link).
     */
    helpText?: string | Snippet;
    /** The line while `validationState` is `error`. */
    errorText?: string | Snippet;
    /** The line while `validationState` is `success`. */
    successText?: string | Snippet;
    /** Before the text: a string (₹, +91) or a snippet (an icon, both). */
    leading?: string | Snippet;
    /** After the text: a string (@okaxis) or a snippet (an icon, a button). */
    trailing?: string | Snippet;
    autoFocus?: boolean;
    /** A clear button while the field holds text. @default false */
    showClearButton?: boolean;
    /** The clear button was pressed; the field is already empty. */
    onClearButtonClick?: () => void;
    /** The return key's label on a virtual keyboard. */
    enterKeyHint?: HTMLInputAttributes['enterkeyhint'];
    autoCapitalize?: HTMLInputAttributes['autocapitalize'];
    /** An HTML autofill token: `name`, `tel`, `one-time-code`, `off`, … */
    autoComplete?: HTMLInputAttributes['autocomplete'];
    onClick?: (event: MouseEvent) => void;
    onKeyDown?: (event: KeyboardEvent) => void;
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
    necessityIndicator = 'none',
    labelArea,
    value = $bindable(''),
    placeholder,
    type = 'text',
    role,
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
    showClearButton = false,
    onClearButtonClick,
    inputMode,
    enterKeyHint,
    autoCapitalize,
    autoComplete,
    onClick,
    onKeyDown,
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

  const style = useComponentDefaults('TextInput', () => styleProps);

  const keyboard = $derived(
    resolveKeyboard(type, { inputMode, enterKeyHint, autoComplete, autoCapitalize })
  );

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
    required: isRequired || necessityIndicator === 'required',
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
    onChange: (next) => onChange?.({ name, value: next as Value }),
    onFocus,
    onBlur,
    group,
    span: () => span,
  });
  const { field, form } = control;

  // Inside an InputGroup the group's size wins, as in Blade.
  const classes = $derived(
    resolveTextInput({ ...style.current, size: group?.size() ?? style.current.size })
  );
  const state = $derived(validationState ?? group?.validationState());
  // Blade's three lines, one shown: the state's own, else the help text.
  const lineText = $derived(
    pickHintText({ validationState: state, helpText, errorText, successText })
  );
  const line = createFieldLine(
    form,
    () => ({ validationState: state, hint: lineText }),
    field.record
  );
  const hint = $derived(line.hint);

  const hasText = $derived(String(value ?? '').length > 0);
  // Blade shows the count under a field with a limit, unless it is formatted.
  const counterMax = $derived(format ? undefined : maxCharacters);

  function clearField() {
    control.clear();
    onClearButtonClick?.();
  }

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
    <FieldLabel
      as="label"
      id={labelId}
      for={controlId}
      text={label}
      {necessityIndicator}
      area={labelArea}
      size={style.current.size}
    />
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
    {/if}
    <input
      id={controlId}
      class={classes.control}
      value={control.display()}
      {name}
      {placeholder}
      type={keyboard.type}
      {role}
      inputmode={keyboard.inputMode}
      autocomplete={keyboard.autoComplete}
      autocapitalize={keyboard.autoCapitalize}
      required={isRequired || necessityIndicator === 'required' || undefined}
      disabled={disabled || undefined}
      readonly={isReadOnly || undefined}
      format={formatSpec}
      enterkeyhint={keyboard.enterKeyHint}
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
      onclick={onClick}
      onkeydown={onKeyDown}
      {@attach maxLength(() => maxCharacters)}
      {@attach control.attach}
      {@attach attach}
    />
    {#if showClearButton && hasText}
      <button
        type="button"
        class={classes.clear}
        aria-label="Clear Input Content"
        disabled={disabled || undefined}
        onclick={clearField}
      >
        <Icon source={close} size="medium" />
      </button>
    {/if}
    {#if trailing}
      {@render affix(trailing)}
    {/if}
  </label>
  {#if !group && (hint.text || counterMax)}
    <div class={classes.footer}>
      {#if hint.text}
        <FieldHint
          id={hintId}
          text={hint.text}
          tone={hintToneOf(hint.validationState)}
          size={style.current.size}
        />
      {/if}
      {#if counterMax}
        <span class={classes.counter}>
          <FieldCounter
            current={String(value ?? '').length}
            max={counterMax}
            size={style.current.size}
          />
        </span>
      {/if}
    </div>
  {/if}
</div>

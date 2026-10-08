<script lang="ts">
  import { pickHintText } from '../../runes/form/hint';
  import type { FieldChange } from '../shared/change';
  import { useComponentDefaults } from '../defaults';
  import type { Snippet } from 'svelte';
  import type { HTMLInputAttributes } from 'svelte/elements';
  import { cx } from '../../cx';
  import FieldHint from '../shared/FieldHint.svelte';
  import FieldLabel from '../shared/FieldLabel.svelte';
  import { hintToneOf } from '../shared/field';
  import { createOTP } from '../../runes/otp/otp.svelte';
  import {
    resolveOTPInput,
    type OTPInputStyleProps,
    type OTPInputValidationState,
  } from './styles';

  interface BehaviourProps {
    label?: string;
    /**
     * The label's row, to put content beside the label (Blade's
     * `labelSuffix` and `labelTrailing`): render the `label` snippet it
     * receives and anything else. The row sits above the control, items 4px
     * apart, `ms-auto` pushing one to the end; a future `labelPosition`
     * moves it whole. Only the label names the control.
     */
    labelRow?: Snippet<[{ label: Snippet }]>;
    value?: string;
    /** Number of cells; fixed at mount. */
    otpLength?: number;
    /** A user edit changed the value; outside `value` changes do not fire it. */
    onChange?: (change: FieldChange<string>) => void;
    /** Every cell holds a character — by typing, paste, autofill or `value`. */
    onOTPFilled?: (change: FieldChange<string>) => void;
    /** A cell was clicked, e.g. to take over from an auto-read. */
    onClick?: (event: MouseEvent) => void;
    /** Per-character sanitizer: return '' to reject. Default: a single digit. */
    accept?: (char: string) => string;
    /** The virtual keyboard. @default 'numeric' */
    inputMode?: HTMLInputAttributes['inputmode'];
    /** The return key's label on a virtual keyboard. */
    enterKeyHint?: HTMLInputAttributes['enterkeyhint'];
    /** One character per cell: the cell's placeholder. */
    placeholder?: string;
    /** A cell took focus. */
    onFocus?: (event: FocusEvent, index: number) => void;
    /** A cell lost focus. */
    onBlur?: (event: FocusEvent, index: number) => void;
    isMasked?: boolean;
    isDisabled?: boolean;
    isRequired?: boolean;
    isReadOnly?: boolean;
    /**
     * Omit inside a Form: the field mirrors its own form error once focus
     * left it or a submit was attempted. Pass it to own the state instead.
     */
    validationState?: OTPInputValidationState;
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
    /** An HTML autofill token; `one-time-code` lets the platform offer a code it received. @default 'one-time-code' */
    autoComplete?: HTMLInputAttributes['autocomplete'];
    name?: string;
    /** Names the group when there is no visible `label`. */
    accessibilityLabel?: string;
    /**
     * Names one cell for screen readers (the library ships no copy).
     * Default: the group's name followed by the cell's position.
     */
    cellAccessibilityLabel?: (index: number, total: number) => string;
    /** Each cell carries `${testID}-${index}`, the elements tests type into. */
    testID?: string;
    class?: string;
  }

  // Closed prop set: behaviour props declared here, style props in
  // `./styles`; the typed rest is handed to the resolver opaquely.
  type Props = BehaviourProps & OTPInputStyleProps;

  let {
    label,
    labelRow,
    value = $bindable(''),
    otpLength = 6,
    onChange,
    onOTPFilled,
    onClick,
    accept,
    inputMode = 'numeric',
    enterKeyHint,
    placeholder,
    onFocus,
    onBlur,
    isMasked = false,
    isDisabled = false,
    isRequired = false,
    isReadOnly = false,
    validationState,
    helpText,
    errorText,
    successText,
    autoFocus = false,
    autoComplete = 'one-time-code',
    name,
    accessibilityLabel,
    cellAccessibilityLabel,
    testID,
    class: className = '',
    ...styleProps
  }: Props = $props();

  const style = useComponentDefaults('OTPInput', () => styleProps);

  const uid = $props.id();
  // Blade's three lines, one shown: the state's own, else the help text.
  const lineText = $derived(
    pickHintText({ validationState, helpText, errorText, successText })
  );
  // svelte-ignore state_referenced_locally
  const otp = createOTP({
    id: uid,
    value: () => value,
    onValue: (next) => {
      value = next;
    },
    onChange: (next) => onChange?.({ name, value: next }),
    onFilled: (next) => onOTPFilled?.({ name, value: next }),
    length: otpLength,
    accept,
    autoFocus: () => autoFocus,
    name: () => name,
    isDisabled: () => isDisabled,
    isRequired: () => isRequired,
    isReadOnly: () => isReadOnly,
    validationState: () => validationState,
    hint: () => lineText,
  });

  const classes = $derived(resolveOTPInput(style.current));
  const hint = $derived(otp.hint);
  const groupName = $derived(accessibilityLabel ?? label);

  function cellName(index: number): string | undefined {
    if (cellAccessibilityLabel) {
      return cellAccessibilityLabel(index, otpLength);
    }
    return groupName ? `${groupName} ${index + 1}` : undefined;
  }
</script>

<div
  class={cx(classes.root, isDisabled && classes.disabled, className)}
  {@attach otp.attachRoot}
>
  {#if label}
    <FieldLabel
      id={otp.labelId}
      text={label}
      row={labelRow}
      size={style.current.size}
    />
  {/if}
  <div
    role="group"
    class={classes.cells}
    aria-labelledby={label ? otp.labelId : undefined}
    aria-label={label ? undefined : accessibilityLabel}
    aria-describedby={hint.text ? otp.hintId : undefined}
    onfocusout={otp.handleFocusOut}
  >
    {#each otp.cells as cell, index (index)}
      <input
        type={isMasked ? 'password' : 'text'}
        inputmode={inputMode}
        enterkeyhint={enterKeyHint}
        placeholder={Array.from(placeholder ?? '')[index] ?? ''}
        class={cx(
          classes.cell,
          classes.cellFill[cell ? 'filled' : 'empty'],
          hint.validationState !== 'none' &&
            classes.validation[hint.validationState]
        )}
        value={cell}
        autocomplete={autoComplete}
        advance="next"
        disabled={isDisabled}
        readonly={isReadOnly}
        aria-label={cellName(index)}
        aria-required={isRequired ? 'true' : undefined}
        aria-invalid={hint.validationState === 'error' ? 'true' : undefined}
        data-testid={testID ? `${testID}-${index}` : undefined}
        onclick={onClick}
        onfocus={(event) => onFocus?.(event, index)}
        onblur={(event) => onBlur?.(event, index)}
        oninput={(event) => otp.handleInput(event, index)}
        onkeydown={(event) => otp.handleKeyDown(event, index)}
        onpaste={(event) => otp.handlePaste(event, index)}
        {@attach otp.cell(index)}
      />
    {/each}
  </div>
  {#if hint.text}
    <FieldHint
      id={otp.hintId}
      text={hint.text}
      tone={hintToneOf(hint.validationState)}
      size={style.current.size}
    />
  {/if}
</div>

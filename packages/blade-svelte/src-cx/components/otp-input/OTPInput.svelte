<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  import { cx } from '../../cx';
  import { createOTP } from '../../runes/otp/otp.svelte';
  import {
    resolveOTPInput,
    type OTPInputStyleProps,
    type OTPInputValidationState,
  } from './styles';

  interface BehaviourProps {
    label?: string;
    value?: string;
    /** Number of cells; fixed at mount. */
    otpLength?: number;
    /** A user edit changed the value; outside `value` changes do not fire it. */
    onChange?: (value: string) => void;
    /** Every cell holds a character — by typing, paste, autofill or `value`. */
    onFilled?: (value: string) => void;
    /** A cell was clicked, e.g. to take over from an auto-read. */
    onClick?: (event: MouseEvent) => void;
    /** Per-character sanitizer: return '' to reject. Default: a single digit. */
    accept?: (char: string) => string;
    keyboardType?: 'numeric' | 'text';
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
    helpText?: string;
    /** The line while `validationState` is `error`. */
    errorText?: string;
    /** The line while `validationState` is `success`. */
    successText?: string;
    autoFocus?: boolean;
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
    value = $bindable(''),
    otpLength = 6,
    onChange,
    onFilled,
    onClick,
    accept,
    keyboardType = 'numeric',
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

  const uid = $props.id();
  // Blade's three lines, one shown: the state's own, else the help text.
  const lineText = $derived(
    { none: undefined, error: errorText, success: successText }[
      validationState ?? 'none'
    ] ?? helpText
  );
  // svelte-ignore state_referenced_locally
  const otp = createOTP({
    id: uid,
    value: () => value,
    onValue: (next) => {
      value = next;
    },
    onChange: (next) => onChange?.(next),
    onFilled: (next) => onFilled?.(next),
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

  const classes = $derived(resolveOTPInput(styleProps));
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
    <span id={otp.labelId} class={classes.label}>{label}</span>
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
        inputmode={keyboardType === 'numeric' ? 'numeric' : 'text'}
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
        oninput={(event) => otp.handleInput(event, index)}
        onkeydown={(event) => otp.handleKeyDown(event, index)}
        onpaste={(event) => otp.handlePaste(event, index)}
        {@attach otp.cell(index)}
      />
    {/each}
  </div>
  {#if hint.text}
    <p
      id={otp.hintId}
      class={cx(classes.hint, classes.hintTone[hint.validationState])}
    >
      {hint.text}
    </p>
  {/if}
</div>

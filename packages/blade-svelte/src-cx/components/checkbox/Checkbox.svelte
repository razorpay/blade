<script lang="ts">
  import { pickHintText } from '../../runes/form/hint';
  import { useComponentDefaults } from '../defaults';
  import type { Snippet } from 'svelte';
  import type { ControlState } from '../shared/control-state';
  import { cx } from '../../cx';
  import { createToggle } from '../../runes/toggle/toggle.svelte';
  import FieldHint from '../shared/FieldHint.svelte';
  import {
    checkboxSizeParts,
    resolveCheckbox,
    type CheckboxStyleProps,
    type CheckboxValidationState,
  } from './styles';

  interface BehaviourProps {
    /**
     * The initial state, a `bind:isChecked`, or a value the host keeps
     * driving — a Svelte prop is all three, so there is no `defaultChecked`.
     */
    isChecked?: boolean;
    /** A user toggle: the new state, and the input's `value`. */
    onChange?: (change: { isChecked: boolean; value: string | undefined }) => void;
    /**
     * Some but not all of what the checkbox stands for is on (a parent over
     * a list): draws a dash and reads as mixed, whatever `isChecked` is.
     * @default false
     */
    isIndeterminate?: boolean;
    isDisabled?: boolean;
    isRequired?: boolean;
    /**
     * Omit inside a Form: the field mirrors its own form error once it is
     * toggled or a submit was attempted. Pass it to own the state instead.
     */
    validationState?: CheckboxValidationState;
    /** Under the title, lined up with it; shown in every state. Text, or a snippet (a Link in it). */
    helpText?: string | Snippet;
    /**
     * The line under the whole control while `validationState` is `error`.
     * Inside a Form a visible field error takes its place while it lasts.
     */
    errorText?: string | Snippet;
    name?: string;
    /** The input's `value` attribute. */
    value?: string;
    tabIndex?: number;
    /** Maps the checked state to the value the form collects. */
    parse?: (isChecked: boolean) => unknown;
    /** Names the control when there are no `children`. */
    accessibilityLabel?: string;
    /** Lands on the control, the element tests click. */
    testID?: string;
    class?: string;
    /** The label; it receives the checkbox's state. */
    children?: Snippet<[ControlState]>;
  }

  // Closed prop set: behaviour props declared here, style props in
  // `./styles`; the typed rest is handed to the resolver opaquely.
  type Props = BehaviourProps & CheckboxStyleProps;

  let {
    isChecked = $bindable(false),
    onChange,
    isIndeterminate = false,
    isDisabled = false,
    isRequired = false,
    validationState,
    helpText,
    errorText,
    name,
    value,
    tabIndex,
    parse,
    accessibilityLabel,
    testID,
    class: className = '',
    children,
    ...styleProps
  }: Props = $props();

  const style = useComponentDefaults('Checkbox', () => styleProps);

  const uid = $props.id();
  // Blade's two lines: the help text under the title always, and the error
  // line under the control while the state is an error.
  const errorLine = $derived(
    pickHintText({ validationState, errorText })
  );
  const helpId = `${uid}-help`;
  // The title alone names the control: the help text inside the label
  // describes it instead.
  const titleId = `${uid}-title`;
  const toggle = createToggle({
    id: uid,
    name: () => name,
    isChecked: () => isChecked,
    onValue: (next) => {
      isChecked = next;
    },
    onChange: (next) => onChange?.({ isChecked: next, value }),
    parse: () => parse,
    isDisabled: () => isDisabled,
    isRequired: () => isRequired,
    validationState: () => validationState,
    hint: () => errorLine,
  });

  const classes = $derived(resolveCheckbox(style.current));
  const sizeParts = $derived(checkboxSizeParts(style.current.size));
  const hint = $derived(toggle.hint);
  const controlState: ControlState = $derived({
    isChecked: toggle.isChecked,
    isDisabled,
  });
  const isError = $derived(hint.validationState === 'error' && Boolean(hint.text));
  // Blade draws the checked box for a dash too.
  const look = $derived(
    toggle.isChecked || isIndeterminate ? 'checked' : 'unchecked'
  );
  const describedBy = $derived(
    [helpText && helpId, isError && toggle.hintId].filter(Boolean).join(' ') ||
      undefined
  );
  // The dash is a DOM property, not an attribute.
  const mixed = (node: HTMLInputElement) => {
    node.indeterminate = isIndeterminate;
  };
</script>

<!-- Blade's CheckedIcon and IndeterminateIcon (CheckboxIcon.tsx), as drawn. -->
{#snippet checkMark()}
  <svg viewBox="0 0 8 8" fill="none" class="w-full h-full">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M6.90237 1.76413C7.03254 1.89431 7.03254 2.10536 6.90237 2.23554L3.2357 5.90221C3.10553 6.03238 2.89447 6.03238 2.7643 5.90221L1.09763 4.23554C0.967456 4.10536 0.967456 3.89431 1.09763 3.76414C1.22781 3.63396 1.43886 3.63396 1.56904 3.76414L3 5.1951L6.43096 1.76413C6.56114 1.63396 6.77219 1.63396 6.90237 1.76413Z"
      fill="currentColor"
      stroke="currentColor"
      stroke-width="0.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
{/snippet}

{#snippet dashMark()}
  <svg viewBox="0 0 8 8" fill="none" class="w-full h-full">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M1.3335 3.99984C1.3335 3.81574 1.48273 3.6665 1.66683 3.6665H6.3335C6.51759 3.6665 6.66683 3.81574 6.66683 3.99984C6.66683 4.18393 6.51759 4.33317 6.3335 4.33317H1.66683C1.48273 4.33317 1.3335 4.18393 1.3335 3.99984Z"
      fill="currentColor"
      stroke="currentColor"
      stroke-width="0.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
{/snippet}

<div class={cx(classes.root, isDisabled && classes.disabled, className)}>
  <label class={cx(classes.label, isDisabled && classes.labelDisabled)}>
    <span class={classes.row}>
      <input
        type="checkbox"
        class={classes.control}
        checked={toggle.isChecked}
        {name}
        {value}
        tabindex={tabIndex}
        required={isRequired}
        disabled={isDisabled}
        aria-label={children ? undefined : accessibilityLabel}
        aria-labelledby={children && helpText ? titleId : undefined}
        aria-invalid={toggle.tone === 'invalid' ? 'true' : undefined}
        aria-describedby={describedBy}
        data-testid={testID}
        onchange={toggle.handleChange}
        {@attach toggle.sync}
        {@attach mixed}
      />
      <span
        class={cx(
          classes.indicator.root,
          classes.indicator.look[toggle.tone][look],
          !isIndeterminate && sizeParts.tickNudge
        )}
        aria-hidden="true"
      >
        <span
          class={cx(
            classes.indicator.mark[
              toggle.isChecked && !isIndeterminate ? 'shown' : 'hidden'
            ],
            sizeParts.mark
          )}
        >
          {@render checkMark()}
        </span>
        <span
          class={cx(
            classes.indicator.mark[isIndeterminate ? 'shown' : 'hidden'],
            sizeParts.mark
          )}
        >
          {@render dashMark()}
        </span>
      </span>
      {#if children}
        <span id={titleId} class={classes.title}>{@render children(controlState)}</span>
      {/if}
    </span>
    {#if helpText}
      <span class={classes.support}>
        <span id={helpId} class={classes.supportText}>
          {#if typeof helpText === 'string'}{helpText}{:else}{@render helpText()}{/if}
        </span>
      </span>
    {/if}
  </label>
  {#if isError}
    <FieldHint
      id={toggle.hintId}
      text={hint.text ?? ''}
      tone="error"
      size={style.current.size}
    />
  {/if}
</div>

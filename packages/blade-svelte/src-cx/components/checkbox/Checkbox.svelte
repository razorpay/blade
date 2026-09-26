<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import { createToggle } from '../../runes/toggle/toggle.svelte';
  import {
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
    onChange?: (isChecked: boolean) => void;
    isDisabled?: boolean;
    isRequired?: boolean;
    /**
     * Omit inside a Form: the field mirrors its own form error once it is
     * toggled or a submit was attempted. Pass it to own the state instead.
     */
    validationState?: CheckboxValidationState;
    /**
     * The line under the control while the state is `none`, and the stand-in
     * for `errorText`. Inside a Form a visible field error replaces the line
     * while it lasts.
     */
    helpText?: string;
    /** The line while `validationState` is `error`. */
    errorText?: string;
    name?: string;
    /** Maps the checked state to the value the form collects. */
    parse?: (isChecked: boolean) => unknown;
    /** Names the control when there are no `children`. */
    accessibilityLabel?: string;
    /** Lands on the control, the element tests click. */
    testID?: string;
    class?: string;
    /** The label. */
    children?: Snippet;
  }

  // Closed prop set: behaviour props declared here, style props in
  // `./styles`; the typed rest is handed to the resolver opaquely.
  type Props = BehaviourProps & CheckboxStyleProps;

  let {
    isChecked = $bindable(false),
    onChange,
    isDisabled = false,
    isRequired = false,
    validationState,
    helpText,
    errorText,
    name,
    parse,
    accessibilityLabel,
    testID,
    class: className = '',
    children,
    ...styleProps
  }: Props = $props();

  const uid = $props.id();
  // Blade's two lines, one shown: the state's own, else the help text.
  const lineText = $derived(
    validationState === 'error' ? (errorText ?? helpText) : helpText
  );
  const toggle = createToggle({
    id: uid,
    name: () => name,
    isChecked: () => isChecked,
    onValue: (next) => {
      isChecked = next;
    },
    onChange: (next) => onChange?.(next),
    parse: () => parse,
    isDisabled: () => isDisabled,
    isRequired: () => isRequired,
    validationState: () => validationState,
    hint: () => lineText,
  });

  const classes = $derived(resolveCheckbox(styleProps));
  const hint = $derived(toggle.hint);
  const mark = $derived(toggle.isChecked ? 'checked' : 'unchecked');
</script>

<!--
  Blade's CheckedIcon as one stroked polyline: its filled outline plus a
  0.5 stroke is a 1.17-wide round-capped line (pixel-checked).
-->
{#snippet checkboxMark()}
  <svg viewBox="0 0 8 8" class="w-full h-full">
    <path
      d="m1.33 4 1.67 1.67L6.67 2"
      fill="none"
      stroke="currentColor"
      stroke-width="1.17"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
{/snippet}

<div class={cx(classes.root, isDisabled && classes.disabled, className)}>
  <label class={classes.row}>
    <input
      type="checkbox"
      class={classes.control}
      checked={toggle.isChecked}
      {name}
      required={isRequired}
      disabled={isDisabled}
      aria-label={children ? undefined : accessibilityLabel}
      aria-invalid={toggle.tone === 'invalid' ? 'true' : undefined}
      aria-describedby={hint.text ? toggle.hintId : undefined}
      data-testid={testID}
      onchange={toggle.handleChange}
      {@attach toggle.sync}
    />
    <span
      class={cx(
        classes.indicator.root,
        classes.indicator.look[toggle.tone][mark]
      )}
      aria-hidden="true"
    >
      <span class={classes.indicator.mark[mark]}>
        {@render checkboxMark()}
      </span>
    </span>
    {#if children}
      <span class={classes.label}>{@render children()}</span>
    {/if}
  </label>
  {#if hint.text}
    <p
      id={toggle.hintId}
      class={cx(
        classes.hint,
        classes.hintTone[hint.validationState === 'error' ? 'error' : 'none']
      )}
    >
      {hint.text}
    </p>
  {/if}
</div>

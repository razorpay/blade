<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import { provideRadioGroup } from '../../runes/radio/context';
  import { createRadioGroup } from '../../runes/radio/group.svelte';
  import {
    resolveRadioGroup,
    type RadioClasses,
    type RadioGroupLookProp,
    type RadioGroupStyleProps,
    type RadioGroupValidationState,
  } from './styles';

  interface BehaviourProps {
    label?: string;
    /**
     * The picked Radio's `value`: the initial one, a `bind:value`, or a
     * value the host keeps driving — so there is no `defaultValue`.
     */
    value?: string;
    onChange?: (value: string) => void;
    /** Registers the group with the enclosing Form under this key. */
    name?: string;
    isDisabled?: boolean;
    isRequired?: boolean;
    /**
     * Omit inside a Form: the group mirrors its own form error once a radio
     * was picked or a submit was attempted. Pass it to own the state.
     */
    validationState?: RadioGroupValidationState;
    /**
     * The line under the options while the state is `none`, and the stand-in
     * for `errorText`. Inside a Form a visible field error replaces the line
     * while it lasts.
     */
    helpText?: string;
    /** The line while `validationState` is `error`. */
    errorText?: string;
    /** Names the group when there is no visible `label`. */
    accessibilityLabel?: string;
    testID?: string;
    class?: string;
    /** The Radios. */
    children: Snippet;
  }

  // Closed prop set: behaviour props declared here, style props in
  // `./styles`; the typed rest is handed to the resolver opaquely — the
  // group's own, or the look a spelling passes in its place.
  type Props = BehaviourProps & RadioGroupLookProp & RadioGroupStyleProps;

  let {
    label,
    value = $bindable(),
    onChange,
    name,
    isDisabled = false,
    isRequired = false,
    validationState,
    helpText,
    errorText,
    accessibilityLabel,
    testID,
    class: className = '',
    children,
    look,
    ...styleProps
  }: Props = $props();

  const uid = $props.id();
  // Blade's two lines, one shown: the state's own, else the help text.
  const lineText = $derived(
    validationState === 'error' ? (errorText ?? helpText) : helpText
  );
  const classes = $derived((look ?? resolveRadioGroup)(styleProps));

  const group = createRadioGroup<RadioClasses>({
    id: uid,
    name: () => name,
    value: () => value,
    onValue: (next) => {
      value = next;
    },
    onChange: (next) => onChange?.(next),
    isDisabled: () => isDisabled,
    isRequired: () => isRequired,
    validationState: () => validationState,
    hint: () => lineText,
    shared: () => classes.radio,
  });
  provideRadioGroup(group);
  const hint = $derived(group.hint);
</script>

<!--
  A look's thumb (SegmentedControl's): one shape that slides to the pick,
  drawn only while the look has one and something is picked. It needs no
  measuring — the look sizes and moves it from `--segment-index` and
  `--segment-count` — and it is born in place, never slid in.
-->
{#snippet options()}
  {#if classes.thumb && group.pick.index >= 0}
    <span
      class={classes.thumb}
      style:--segment-index={group.pick.index}
      style:--segment-count={group.pick.count}
      aria-hidden="true"
    ></span>
  {/if}
  {@render children()}
{/snippet}

<div
  class={cx(classes.root, isDisabled && classes.disabled, className)}
  role="radiogroup"
  aria-label={label ? undefined : accessibilityLabel}
  aria-labelledby={label ? group.labelId : undefined}
  aria-required={isRequired ? 'true' : undefined}
  aria-invalid={hint.validationState === 'error' ? 'true' : undefined}
  aria-describedby={hint.text ? group.hintId : undefined}
  data-testid={testID}
>
  {#if label}
    <span id={group.labelId} class={classes.label}>{label}</span>
  {/if}
  <div class={classes.options}>
    {@render options()}
  </div>
  {#if hint.text}
    <p
      id={group.hintId}
      class={cx(
        classes.hint,
        classes.hintTone[hint.validationState === 'error' ? 'error' : 'none']
      )}
    >
      {hint.text}
    </p>
  {/if}
</div>

<script lang="ts">
  import { pickHintText } from '../../runes/form/hint';
  import type { FieldChange } from '../shared/change';
  import { useComponentDefaults } from '../defaults';
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import FieldHint from '../shared/FieldHint.svelte';
  import FieldLabel from '../shared/FieldLabel.svelte';
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
     * The label's area, to put content beside the label: render the
     * `label` snippet it receives and anything else. Today a row above the
     * options, items 4px apart, `ms-auto` pushing one to the end. Only the
     * label names the group.
     */
    labelArea?: Snippet<[{ label: Snippet }]>;
    /** After the label: `*` or `(optional)`. Required also marks the control required. @default 'none' */
    necessityIndicator?: 'required' | 'optional' | 'none';
    /**
     * The picked Radio's `value`: the initial one, a `bind:value`, or a
     * value the host keeps driving — so there is no `defaultValue`.
     */
    value?: string;
    onChange?: (change: FieldChange<string>) => void;
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
    helpText?: string | Snippet;
    /** The line while `validationState` is `error`. */
    errorText?: string | Snippet;
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
    labelArea,
    necessityIndicator = 'none',
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

  const style = useComponentDefaults('RadioGroup', () => styleProps);

  const uid = $props.id();
  // Blade's two lines, one shown: the state's own, else the help text.
  const lineText = $derived(
    pickHintText({ validationState, helpText, errorText })
  );
  const classes = $derived((look ?? resolveRadioGroup)(style.current));

  const group = createRadioGroup<RadioClasses>({
    id: uid,
    name: () => name,
    value: () => value,
    onValue: (next) => {
      value = next;
    },
    onChange: (next) => onChange?.({ name, value: next }),
    isDisabled: () => isDisabled,
    isRequired: () => isRequired || necessityIndicator === 'required',
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
  aria-required={isRequired || necessityIndicator === 'required' ? 'true' : undefined}
  aria-invalid={hint.validationState === 'error' ? 'true' : undefined}
  aria-describedby={hint.text ? group.hintId : undefined}
  data-testid={testID}
>
  {#if label}
    <FieldLabel
      id={group.labelId}
      text={label}
      {necessityIndicator}
      size={classes.fieldSize}
      area={labelArea}
    />
  {/if}
  <div class={classes.options}>
    {@render options()}
  </div>
  {#if hint.text}
    <FieldHint
      id={group.hintId}
      text={hint.text}
      tone={hint.validationState === 'error' ? 'error' : 'help'}
      size={classes.fieldSize}
    />
  {/if}
</div>

<script lang="ts">
  import { pickHintText } from '../../runes/form/hint';
  import { useComponentDefaults } from '../defaults';
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import { analyticsAttributes, type AnalyticsAttributes } from '../../runes/dom/analytics';
  import { provideChipGroup } from '../../runes/chip/context';
  import { createChipGroup } from '../../runes/chip/group.svelte';
  import FieldHint from '../shared/FieldHint.svelte';
  import FieldLabel from '../shared/FieldLabel.svelte';
  import {
    resolveChipGroup,
    type ChipGroupStyleProps,
    type ChipGroupValidationState,
    type ChipShared,
  } from './styles';

  interface BehaviourProps {
    label?: string;
    /** Names the group when there is no visible `label`. */
    accessibilityLabel?: string;
    /**
     * `single`: picking a chip unpicks the others (radios). `multiple`: each
     * chip toggles (checkboxes) and the value is an array.
     * @default 'single'
     */
    selectionType?: 'single' | 'multiple';
    /**
     * The picked chip's value, or an array of them with `multiple`: the
     * initial one, a `bind:value`, or a value the host keeps driving — so
     * there is no `defaultValue`.
     */
    value?: string | readonly string[] | null;
    /**
     * A user pick: the field's `name` and its `value`, shaped as
     * `bind:value` (an array with `multiple`).
     */
    onChange?: (change: { name: string | undefined; value: string | null | string[] }) => void;
    /** Registers the group with the enclosing Form under this key. */
    name?: string;
    isDisabled?: boolean;
    isRequired?: boolean;
    /** After the label: `*` or `(optional)`. @default 'none' */
    necessityIndicator?: 'required' | 'optional' | 'none';
    /**
     * Omit inside a Form: the group mirrors its own form error once a chip
     * was picked or a submit was attempted. Pass it to own the state.
     */
    validationState?: ChipGroupValidationState;
    /**
     * The line under the chips while the state is `none`, and the stand-in
     * for `errorText`. Inside a Form a visible field error replaces the line
     * while it lasts.
     */
    helpText?: string | Snippet;
    /** The line while `validationState` is `error`. */
    errorText?: string | Snippet;
    /**
     * Lands on the root; each Chip without a test id of its own gets
     * `${testID}-${index}`.
     */
    testID?: string;
    class?: string;
    /** The Chips, and anything else between them. */
    children: Snippet;
  }

  type Props = BehaviourProps & ChipGroupStyleProps & AnalyticsAttributes;

  let {
    label,
    accessibilityLabel,
    selectionType = 'single',
    value = $bindable(),
    onChange,
    name,
    isDisabled = false,
    isRequired = false,
    necessityIndicator = 'none',
    validationState,
    helpText,
    errorText,
    testID,
    class: className = '',
    children,
    ...rest
  }: Props = $props();

  // The rest is the style props, and the analytics attributes.
  const style = useComponentDefaults('ChipGroup', () => rest);

  const uid = $props.id();
  // Blade's two lines, one shown: the state's own, else the help text.
  const lineText = $derived(pickHintText({ validationState, helpText, errorText }));
  const classes = $derived(resolveChipGroup(style.current));
  // svelte-ignore state_referenced_locally
  const group = createChipGroup<ChipShared>({
    id: uid,
    value: () => value,
    onValue: (next) => {
      value = next;
    },
    onChange: (next) =>
      onChange?.({
        name,
        value:
          selectionType === 'multiple'
            ? next == null ? [] : typeof next === 'string' ? [next] : [...next]
            : typeof next === 'string' ? next : (next?.[0] ?? null),
      }),
    isMultiple: () => selectionType === 'multiple',
    name: () => name,
    isRequired: () => isRequired || necessityIndicator === 'required',
    isDisabled: () => isDisabled,
    validationState: () => validationState,
    hint: () => lineText,
    shared: () => ({
      size: style.current.size ?? 'small',
      color: style.current.color ?? 'primary',
    }),
    testID: () => testID,
  });
  provideChipGroup(group);

  const hint = $derived(group.hint);
  const isRadioGroup = $derived(selectionType === 'single');
</script>

<!-- Required and invalid are the group's to say (a radiogroup), as
     RadioGroup's: `required` on each checkbox would require every one. -->
<div
  class={cx(classes.root, className)}
  role={isRadioGroup ? 'radiogroup' : 'group'}
  aria-label={label ? undefined : accessibilityLabel}
  aria-labelledby={label ? group.labelId : undefined}
  aria-required={group.isRequired && isRadioGroup ? 'true' : undefined}
  aria-invalid={group.isInvalid && isRadioGroup ? 'true' : undefined}
  aria-describedby={hint.text ? group.hintId : undefined}
  data-testid={testID}
  {...analyticsAttributes(rest)}
>
  {#if label}
    <FieldLabel
      id={group.labelId}
      text={label}
      size={classes.fieldSize}
      {necessityIndicator}
    />
  {/if}
  <div>
    <div class={classes.chips}>
      {@render children()}
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
</div>

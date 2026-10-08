<script lang="ts">
  import { pickHintText } from '../../runes/form/hint';
  import { useComponentDefaults } from '../defaults';
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
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
    /**
     * The label's row, to put content beside the label: render the
     * `label` snippet it receives and anything else. A row above the
     * options, items 4px apart, `ms-auto` pushing one to the end. Only the
     * label names the group.
     */
    labelRow?: Snippet<[{ label: Snippet }]>;
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
    /** A user pick: the field's `name` and the picked values, as a list either way (Blade's). */
    onChange?: (change: { name: string | undefined; values: string[] }) => void;
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
    /** The line under the chips while there is no error. */
    helpText?: string | Snippet;
    /** The line while `validationState` is `error`. */
    errorText?: string | Snippet;
    testID?: string;
    class?: string;
    /** The Chips, and anything else between them. */
    children: Snippet;
  }

  type Props = BehaviourProps & ChipGroupStyleProps;

  let {
    label,
    labelRow,
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
    ...styleProps
  }: Props = $props();

  const style = useComponentDefaults('ChipGroup', () => styleProps);

  const uid = $props.id();
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
        values: next == null ? [] : typeof next === 'string' ? [next] : [...next],
      }),
    isMultiple: () => selectionType === 'multiple',
    name: () => name,
    isRequired: () => isRequired || necessityIndicator === 'required',
    isDisabled: () => isDisabled,
    validationState: () => validationState,
    hint: () => pickHintText({ validationState, errorText }),
    shared: () => ({
      size: style.current.size ?? 'small',
      color: style.current.color ?? 'primary',
    }),
  });
  provideChipGroup(group);

  const hint = $derived(group.hint);
  // Blade's FormHint: the error while there is one, else the help text.
  const line = $derived(
    hint.validationState === 'error' && hint.text
      ? { text: hint.text, tone: 'error' as const }
      : helpText
        ? { text: helpText, tone: 'help' as const }
        : undefined
  );
</script>

<div
  class={cx(classes.root, className)}
  role={selectionType === 'single' ? 'radiogroup' : 'group'}
  aria-label={label ? undefined : accessibilityLabel}
  aria-labelledby={label ? group.labelId : undefined}
  aria-describedby={line ? group.hintId : undefined}
  data-testid={testID}
>
  {#if label}
    <FieldLabel
      id={group.labelId}
      text={label}
      size={classes.fieldSize}
      {necessityIndicator}
      row={labelRow}
    />
  {/if}
  <div>
    <div class={classes.chips}>
      {@render children()}
    </div>
    {#if line}
      <FieldHint
        id={group.hintId}
        text={line.text}
        tone={line.tone}
        size={classes.fieldSize}
      />
    {/if}
  </div>
</div>

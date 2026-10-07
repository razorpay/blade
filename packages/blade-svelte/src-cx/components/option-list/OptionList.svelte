<script lang="ts" generics="T">
  import { pickHintText } from '../../runes/form/hint';
  import type { FieldChange } from '../shared/change';
  import { useComponentDefaults } from '../defaults';
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import FieldHint from '../shared/FieldHint.svelte';
  import FieldLabel from '../shared/FieldLabel.svelte';
  import { provideOptionList } from '../../runes/option-list/context';
  import { createOptionList } from '../../runes/option-list/list.svelte';
  import {
    resolveOptionList,
    type OptionListClasses,
    type OptionListShared,
    type OptionListStyleProps,
    type OptionListValidationState,
  } from './styles';

  interface BehaviourProps {
    /**
     * The pick — an array of picks with `isMultiple`: the initial one, a
     * `bind:value`, or a value the host keeps driving.
     */
    value?: T | readonly T[] | null;
    /** Checkboxes instead of radios; the value is an array. */
    isMultiple?: boolean;
    onChange?: (change: FieldChange<T | readonly T[] | null>) => void;
    /** Defaults to identity; pass it when options are rebuilt objects. */
    compare?: (a: T, b: T) => boolean;
    /** Single choice: picking the picked option clears it. */
    isDeselectable?: boolean;
    /**
     * The list's look as a whole class map (`OptionListClasses`), in place of
     * the built-in look: how a library brings its own
     * rows (ActionList does). The anatomy and behaviour stay OptionList's.
     */
    classes?: OptionListClasses;
    /** Registers the list with the enclosing Form under this key. */
    name?: string;
    isRequired?: boolean;
    isDisabled?: boolean;
    /**
     * Omit inside a Form: the list mirrors its own form error once an option
     * was picked or a submit was attempted. Pass it to own the state.
     */
    validationState?: OptionListValidationState;
    /**
     * The line under the options while the state is `none`, and the stand-in
     * for `errorText`. Inside a Form a visible field error replaces the line
     * while it lasts.
     */
    helpText?: string;
    /** The line while `validationState` is `error`. */
    errorText?: string;
    label?: string;
    /** Names the list when there is no visible `label`. */
    accessibilityLabel?: string;
    /** Lands on the root; each item's control gets `${testID}-${index}`. */
    testID?: string;
    class?: string;
    /**
     * The OptionItems, in order, and anything else between them — a
     * heading, a note, a "show all" button. Only OptionItems are options:
     * the rest is outside the value and the keyboard.
     */
    children: Snippet;
  }

  // Closed prop set: behaviour props declared here, style props in
  // `styles.ts`. The typed rest is handed to the resolver opaquely.
  type Props = BehaviourProps & OptionListStyleProps;

  let {
    value = $bindable(),
    isMultiple = false,
    onChange,
    compare,
    isDeselectable = false,
    classes: customClasses,
    name,
    isRequired = false,
    isDisabled = false,
    validationState,
    helpText,
    errorText,
    label,
    accessibilityLabel,
    testID,
    class: className = '',
    children,
    ...styleProps
  }: Props = $props();

  const style = useComponentDefaults('OptionList', () => styleProps);

  const uid = $props.id();
  // Blade's two lines, one shown: the state's own, else the help text.
  const lineText = $derived(
    pickHintText({ validationState, helpText, errorText })
  );
  const classes = $derived(customClasses ?? resolveOptionList(style.current));
  // svelte-ignore state_referenced_locally
  const list = createOptionList<T, OptionListShared>({
    id: uid,
    value: () => value,
    onValue: (next) => {
      value = next;
    },
    onChange: (next) => onChange?.({ name, value: next }),
    isMultiple: () => isMultiple,
    compare,
    isDeselectable: () => isDeselectable,
    name: () => name,
    isRequired: () => isRequired,
    isDisabled: () => isDisabled,
    validationState: () => validationState,
    hint: () => lineText,
    shared: () => ({ classes, testID }),
  });
  provideOptionList(list);

  const hint = $derived(list.hint);
</script>

<!-- A pointer press anywhere hides the keyboard ring until the next key. -->
<div
  class={cx(classes.root, isDisabled && classes.disabled, className)}
  role={isMultiple ? 'group' : 'radiogroup'}
  aria-label={label ? undefined : accessibilityLabel}
  aria-labelledby={label ? list.labelId : undefined}
  aria-required={isRequired && !isMultiple ? 'true' : undefined}
  aria-invalid={list.isInvalid && !isMultiple ? 'true' : undefined}
  aria-describedby={hint.text ? list.hintId : undefined}
  data-testid={testID}
  onpointerdown={list.handlePointerDown}
>
  {#if label}
    <FieldLabel
      id={list.labelId}
      text={label}
    />
  {/if}
  <div class={classes.options}>
    {@render children()}
  </div>
  {#if hint.text}
    <FieldHint
      id={list.hintId}
      text={hint.text}
      tone={hint.validationState === 'error' ? 'error' : 'help'}
    />
  {/if}
</div>

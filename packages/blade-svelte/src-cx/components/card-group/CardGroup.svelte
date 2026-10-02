<script lang="ts">
  import { pickHintText } from '../../runes/form/hint';
  import type { FieldChange } from '../shared/change';
  import { useComponentDefaults } from '../defaults';
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import FieldHint from '../shared/FieldHint.svelte';
  import FieldLabel from '../shared/FieldLabel.svelte';
  import {
    createCardGroup,
    type CardGroupValue,
  } from '../../runes/card-group/card-group.svelte';
  import { provideCardGroup } from '../../runes/card-group/context';
  import {
    resolveCardGroup,
    type CardGroupShared,
    type CardGroupStyleProps,
    type CardGroupValidationState,
  } from './styles';

  interface BehaviourProps {
    /**
     * The open item's `value` (its index when it has none); `null` for none.
     * One at a time, and pressing the open item closes it. `bind:value`, or
     * a value the host keeps driving. Inside a Form it is what `name`
     * submits, so "one must be open" is `isRequired`.
     * @default null
     */
    value?: CardGroupValue | null;
    onChange?: (change: FieldChange<CardGroupValue | null>) => void;
    /**
     * Numbers the items (`1.`, `2.`, …) ahead of each header, in place of
     * their `leading`.
     * @default false
     */
    showNumberPrefix?: boolean;
    /** Scrolls a panel into view once it has opened. @default true */
    scrollOnExpand?: boolean;
    name?: string;
    /** @default false */
    isRequired?: boolean;
    /** @default false */
    isDisabled?: boolean;
    validationState?: CardGroupValidationState;
    /**
     * The line under the items while the state is `none`, and the stand-in
     * for `errorText`. Inside a Form a visible field error replaces the line
     * while it lasts.
     */
    helpText?: string | Snippet;
    /** The line while `validationState` is `error`. */
    errorText?: string | Snippet;
    label?: string;
    /**
     * The label's area, to put content beside the label: render the
     * `label` snippet it receives and anything else. Today a row above the
     * items, items 4px apart, `ms-auto` pushing one to the end. Only the
     * label names the group.
     */
    labelArea?: Snippet<[{ label: Snippet }]>;
    accessibilityLabel?: string;
    /** Lands on the root; each header gets `${testID}-${index}`. */
    testID?: string;
    class?: string;
    /** The CardGroupItems. */
    children: Snippet;
  }

  type Props = BehaviourProps & CardGroupStyleProps;

  let {
    value = $bindable(null),
    onChange,
    showNumberPrefix = false,
    scrollOnExpand = true,
    name,
    isRequired = false,
    isDisabled = false,
    validationState,
    helpText,
    errorText,
    label,
    labelArea,
    accessibilityLabel,
    testID,
    class: className = '',
    children,
    ...styleProps
  }: Props = $props();

  const style = useComponentDefaults('CardGroup', () => styleProps);

  const uid = $props.id();
  // Blade's two lines, one shown: the state's own, else the help text.
  const lineText = $derived(
    pickHintText({ validationState, helpText, errorText })
  );
  const classes = $derived(resolveCardGroup(style.current));
  const cardGroup = createCardGroup<CardGroupShared>({
    id: uid,
    value: () => value,
    onValue: (next) => {
      value = next;
    },
    onChange: (next) => onChange?.({ name, value: next }),
    name: () => name,
    isRequired: () => isRequired,
    isDisabled: () => isDisabled,
    validationState: () => validationState,
    hint: () => lineText,
    shared: () => ({
      classes,
      size: style.current.size ?? 'large',
      showNumberPrefix,
      scrollOnExpand,
      testID,
    }),
  });
  provideCardGroup(cardGroup);

  const hint = $derived(cardGroup.hint);
</script>

<div
  class={cx(classes.root, className)}
  role={label || accessibilityLabel ? 'group' : undefined}
  aria-label={label ? undefined : accessibilityLabel}
  aria-labelledby={label ? cardGroup.labelId : undefined}
  aria-describedby={hint.text ? cardGroup.hintId : undefined}
  data-testid={testID}
>
  {#if label}
    <FieldLabel id={cardGroup.labelId} text={label} area={labelArea} />
  {/if}
  <div
    class={cx(
      classes.items,
      hint.validationState === 'error' && classes.invalid
    )}
  >
    {@render children()}
  </div>
  {#if hint.text}
    <FieldHint
      id={cardGroup.hintId}
      text={hint.text}
      tone={hint.validationState === 'error' ? 'error' : 'help'}
    />
  {/if}
</div>

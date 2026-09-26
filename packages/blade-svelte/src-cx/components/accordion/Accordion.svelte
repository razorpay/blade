<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import {
    createAccordion,
    type AccordionValue,
  } from '../../runes/accordion/accordion.svelte';
  import { provideAccordion } from '../../runes/accordion/context';
  import {
    resolveAccordion,
    type AccordionShared,
    type AccordionStyleProps,
    type AccordionValidationState,
  } from './styles';

  interface BehaviourProps {
    /**
     * The open item's `value` (its index when it has none); `null` for none.
     * One at a time, and pressing the open item closes it. `bind:value`, or
     * a value the host keeps driving. Inside a Form it is what `name`
     * submits, so "one must be open" is `isRequired`.
     * @default null
     */
    value?: AccordionValue | null;
    onChange?: (value: AccordionValue | null) => void;
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
    validationState?: AccordionValidationState;
    /**
     * The line under the items while the state is `none`, and the stand-in
     * for `errorText`. Inside a Form a visible field error replaces the line
     * while it lasts.
     */
    helpText?: string;
    /** The line while `validationState` is `error`. */
    errorText?: string;
    label?: string;
    accessibilityLabel?: string;
    /** Lands on the root; each header gets `${testID}-${index}`. */
    testID?: string;
    class?: string;
    /** The AccordionItems. */
    children: Snippet;
  }

  type Props = BehaviourProps & AccordionStyleProps;

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
  const classes = $derived(resolveAccordion(styleProps));
  const accordion = createAccordion<AccordionShared>({
    id: uid,
    value: () => value,
    onValue: (next) => {
      value = next;
    },
    onChange: (next) => onChange?.(next),
    name: () => name,
    isRequired: () => isRequired,
    isDisabled: () => isDisabled,
    validationState: () => validationState,
    hint: () => lineText,
    shared: () => ({
      classes,
      size: styleProps.size ?? 'large',
      showNumberPrefix,
      scrollOnExpand,
      testID,
    }),
  });
  provideAccordion(accordion);

  const hint = $derived(accordion.hint);
</script>

<div
  class={cx(classes.root, className)}
  role={label || accessibilityLabel ? 'group' : undefined}
  aria-label={label ? undefined : accessibilityLabel}
  aria-labelledby={label ? accordion.labelId : undefined}
  aria-describedby={hint.text ? accordion.hintId : undefined}
  data-testid={testID}
>
  {#if label}
    <span id={accordion.labelId} class={classes.label}>{label}</span>
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
    <p
      id={accordion.hintId}
      class={cx(
        classes.hint,
        classes.hintTone[hint.validationState === 'error' ? 'error' : 'none']
      )}
    >
      {hint.text}
    </p>
  {/if}
</div>

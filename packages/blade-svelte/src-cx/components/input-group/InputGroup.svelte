<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import { provideInputGroup } from '../../runes/input-group/context';
  import { createInputGroup } from '../../runes/input-group/group.svelte';
  import {
    resolveInputGroup,
    type InputGroupStyleProps,
    type InputGroupValidationState,
  } from './styles';

  interface BehaviourProps {
    label?: string;
    /**
     * Omit inside a Form: the group mirrors its members' form errors.
     * Pass it to own the state of the frame and of every member.
     */
    validationState?: InputGroupValidationState;
    /**
     * The line under the box while the state is `none`, and the stand-in
     * for the other two. Inside a Form a visible field error replaces the
     * line while it lasts.
     */
    helpText?: string;
    /** The line while `validationState` is `error`. */
    errorText?: string;
    /** The line while `validationState` is `success`. */
    successText?: string;
    isDisabled?: boolean;
    /** Names the group when there is no visible `label`. */
    accessibilityLabel?: string;
    testID?: string;
    class?: string;
    /** The fields; each takes its `span` of a row. */
    children?: Snippet;
  }

  // Closed prop set: behaviour props declared here, style props in
  // `./styles`; the typed rest is handed to the resolver opaquely.
  type Props = BehaviourProps & InputGroupStyleProps;

  let {
    label,
    validationState,
    helpText,
    errorText,
    successText,
    isDisabled = false,
    accessibilityLabel,
    testID,
    class: className = '',
    children,
    ...styleProps
  }: Props = $props();

  const uid = $props.id();
  // Blade's three lines, one shown: the state's own, else the help text.
  const lineText = $derived(
    { none: undefined, error: errorText, success: successText }[
      validationState ?? 'none'
    ] ?? helpText
  );
  const group = createInputGroup({
    id: uid,
    validationState: () => validationState,
    hint: () => lineText,
  });

  const classes = $derived(resolveInputGroup(styleProps));
  const hint = $derived(group.hint);

  provideInputGroup({
    hintId: () => (hint.text ? group.hintId : undefined),
    isDisabled: () => isDisabled,
    validationState: () => validationState,
    spanClass: (span) => classes.span[span],
    joinClass: () => classes.member,
    cornerClass: (field) => {
      const held = group.cornersOf(field);
      return held
        ? cx(
            held.tl && classes.corner.tl,
            held.tr && classes.corner.tr,
            held.bl && classes.corner.bl,
            held.br && classes.corner.br
          )
        : '';
    },
    register: group.register,
  });
</script>

<div
  class={cx(classes.root, isDisabled && classes.disabled, className)}
  role="group"
  aria-label={label ? undefined : accessibilityLabel}
  aria-labelledby={label ? group.labelId : undefined}
  data-testid={testID}
>
  {#if label}
    <span id={group.labelId} class={classes.label}>{label}</span>
  {/if}
  <div class={classes.box}>
    {@render children?.()}
  </div>
  {#if hint.text}
    <p
      id={group.hintId}
      class={cx(classes.hint, classes.hintTone[hint.validationState])}
    >
      {hint.text}
    </p>
  {/if}
</div>

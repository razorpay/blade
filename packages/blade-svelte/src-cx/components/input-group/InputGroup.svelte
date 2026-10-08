<script lang="ts">
  import { pickHintText } from '../../runes/form/hint';
  import { useComponentDefaults } from '../defaults';
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import FieldHint from '../shared/FieldHint.svelte';
  import FieldLabel from '../shared/FieldLabel.svelte';
  import { hintToneOf } from '../shared/field';
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
     * The label's row, to put content beside the label (Blade's
     * `labelSuffix` and `labelTrailing`): render the `label` snippet it
     * receives and anything else. The row sits above the control, items 4px
     * apart, `ms-auto` pushing one to the end; a future `labelPosition`
     * moves it whole. Only the label names the group.
     */
    labelRow?: Snippet<[{ label: Snippet }]>;
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
    helpText?: string | Snippet;
    /** The line while `validationState` is `error`. */
    errorText?: string | Snippet;
    /** The line while `validationState` is `success`. */
    successText?: string | Snippet;
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
    labelRow,
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

  const style = useComponentDefaults('InputGroup', () => styleProps);

  const uid = $props.id();
  // Blade's three lines, one shown: the state's own, else the help text.
  const lineText = $derived(
    pickHintText({ validationState, helpText, errorText, successText })
  );
  const group = createInputGroup({
    id: uid,
    validationState: () => validationState,
    hint: () => lineText,
  });

  const classes = $derived(resolveInputGroup(style.current));
  const hint = $derived(group.hint);

  provideInputGroup({
    hintId: () => (hint.text ? group.hintId : undefined),
    isDisabled: () => isDisabled,
    size: () => style.current.size,
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
    reorder: group.reorder,
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
    <FieldLabel
      id={group.labelId}
      text={label}
      size={style.current.size}
      row={labelRow}
    />
  {/if}
  <div class={classes.box}>
    {@render children?.()}
  </div>
  {#if hint.text}
    <FieldHint
      id={group.hintId}
      text={hint.text}
      tone={hintToneOf(hint.validationState)}
      size={style.current.size}
    />
  {/if}
</div>

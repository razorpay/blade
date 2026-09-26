<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import { createToggle } from '../../runes/toggle/toggle.svelte';
  import Icon from '../icon/Icon.svelte';
  import { resolveSwitch, type SwitchStyleProps } from './styles';
  // Blade's Switch check (ThumbIcon.tsx), not in `icons`: its viewBox and
  // weight are drawn for the thumb.
  import switchCheck from './switch-check.svg?raw';

  interface BehaviourProps {
    /** The initial state, a `bind:isChecked`, or a value the host keeps driving. */
    isChecked?: boolean;
    onChange?: (isChecked: boolean) => void;
    isDisabled?: boolean;
    /**
     * A change is in flight (the setting is being saved): the switch shows
     * it and refuses toggles, but keeps its place in the tab order.
     */
    isLoading?: boolean;
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

  type Props = BehaviourProps & SwitchStyleProps;

  let {
    isChecked = $bindable(false),
    onChange,
    isDisabled = false,
    isLoading = false,
    name,
    parse,
    accessibilityLabel,
    testID,
    class: className = '',
    children,
    ...styleProps
  }: Props = $props();

  // A switch is a checkbox to the form: same behaviour, another role and look.
  const uid = $props.id();
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
    isBusy: () => isLoading,
  });

  const classes = $derived(resolveSwitch(styleProps));
  const track = $derived(toggle.state);
</script>

<label
  class={cx(
    classes.root,
    classes.row,
    isDisabled && classes.disabled,
    className
  )}
  data-disabled={isDisabled || undefined}
>
  <input
    type="checkbox"
    role="switch"
    class={classes.control}
    checked={toggle.isChecked}
    {name}
    disabled={isDisabled}
    aria-busy={isLoading || undefined}
    aria-label={children ? undefined : accessibilityLabel}
    data-testid={testID}
    onchange={toggle.handleChange}
    {@attach toggle.sync}
  />
  <span class={classes.track[track]} aria-hidden="true">
    <span class={classes.thumb[track]}>
      {#if isLoading}
        <span class={classes.loading}></span>
      {:else}
        <Icon
          source={switchCheck}
          size={classes.iconSize}
          class={classes.icon[track]}
        />
      {/if}
    </span>
  </span>
  {#if children}
    <span class={classes.label}>{@render children()}</span>
  {/if}
</label>

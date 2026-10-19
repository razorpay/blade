<script lang="ts">
  import { useComponentDefaults } from '../defaults';
  import type { Snippet } from 'svelte';
  import type { ControlState } from '../shared/control-state';
  import { cx } from '../../cx';
  import { analyticsAttributes, type AnalyticsAttributes } from '../../runes/dom/analytics';
  import { createToggle } from '../../runes/toggle/toggle.svelte';
  import { resolveSwitch, type SwitchStyleProps } from './styles';

  interface BehaviourProps {
    /** The initial state, a `bind:isChecked`, or a value the host keeps driving. */
    isChecked?: boolean;
    /** A user toggle: the new state, and the input's `value`. */
    onChange?: (change: { isChecked: boolean; value: string | undefined }) => void;
    isDisabled?: boolean;
    /**
     * A change is in flight (the setting is being saved): the switch shows
     * it and refuses toggles, but keeps its place in the tab order.
     */
    isLoading?: boolean;
    name?: string;
    /**
     * The input's `value` attribute: what a native form submits while the
     * switch is on, as React's.
     */
    value?: string;
    /** Maps the checked state to the value the form collects. */
    parse?: (isChecked: boolean) => unknown;
    /** Names the control when there are no `children`. */
    accessibilityLabel?: string;
    /** Lands on the control, the element tests click. */
    testID?: string;
    class?: string;
    /** The label; it receives the switch's state. */
    children?: Snippet<[ControlState]>;
  }

  type Props = BehaviourProps & SwitchStyleProps & AnalyticsAttributes;

  let {
    isChecked = $bindable(false),
    onChange,
    isDisabled = false,
    isLoading = false,
    name,
    value,
    parse,
    accessibilityLabel,
    testID,
    class: className = '',
    children,
    ...rest
  }: Props = $props();

  // The rest is the style props, and the analytics attributes.
  const style = useComponentDefaults('Switch', () => rest);

  // A switch is a checkbox to the form: same behaviour, another role and look.
  const uid = $props.id();
  const toggle = createToggle({
    id: uid,
    name: () => name,
    isChecked: () => isChecked,
    onValue: (next) => {
      isChecked = next;
    },
    onChange: (next) => onChange?.({ isChecked: next, value }),
    parse: () => parse,
    isDisabled: () => isDisabled,
    isBusy: () => isLoading,
  });

  const classes = $derived(resolveSwitch(style.current));
  const track = $derived(toggle.state);
  const controlState: ControlState = $derived({
    isChecked: toggle.isChecked,
    isDisabled,
  });
</script>

<label
  class={cx(
    classes.root,
    classes.row,
    isDisabled && classes.disabled,
    className
  )}
  data-disabled={isDisabled || undefined}
  {...analyticsAttributes(rest)}
>
  <input
    type="checkbox"
    role="switch"
    class={classes.control}
    checked={toggle.isChecked}
    {name}
    {value}
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
        <!-- Blade's Switch check (ThumbIcon.tsx), drawn for the thumb: not a
             font glyph, so the Switch needs nothing enabled in the app's font. -->
        <svg
          class={cx('inline-flex shrink-0', classes.icon[track])}
          viewBox="0 0 11 8"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M8.81891 0.546661C9.12722 0.238352 9.62709 0.238353 9.9354 0.546661C10.2437 0.85497 10.2437 1.35484 9.9354 1.66315L4.14592 7.45262C3.83761 7.76093 3.33775 7.76093 3.02944 7.45262L0.397858 4.82104C0.0895488 4.51273 0.0895488 4.01286 0.397857 3.70456C0.706166 3.39625 1.20603 3.39625 1.51434 3.70456L3.58768 5.77789L8.81891 0.546661Z"
          />
        </svg>
      {/if}
    </span>
  </span>
  {#if children}
    <span class={classes.label}>{@render children(controlState)}</span>
  {/if}
</label>

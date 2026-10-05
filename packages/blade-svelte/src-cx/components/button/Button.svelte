<script lang="ts">
  import { useComponentDefaults } from '../defaults';
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import {
    createPress,
    type ButtonType,
  } from '../../runes/button/press.svelte';
  import { getButtonGroup } from '../../runes/button/group';
  import { resolveButton, type ButtonStyleProps } from './styles';

  interface BehaviourProps {
    /**
     * Shows Blade's DotLoader over the label and the disabled look; the
     * label stays, so the width holds, and so does keyboard focus.
     * @default false
     */
    isLoading?: boolean;
    /** Ignored with `href`, as in Blade. @default false */
    isDisabled?: boolean;
    /**
     * The HTML type. `submit` presses the enclosing Form: an invalid form
     * shakes the button and reports to the Form's `onValidationFailed`.
     * @default 'button'
     */
    type?: ButtonType;
    /**
     * A `button` that validates the Form before it acts, shaking and
     * reporting as a submit would, without submitting.
     */
    validateForm?: boolean;
    onClick?: (event: MouseEvent) => void;
    /** Renders an anchor that looks like the button. */
    href?: string;
    target?: string;
    rel?: string;
    /**
     * Seconds after which the button presses itself, its fill showing the
     * time run. A press by hand ends the wait; a disabled or busy button
     * does not count. Fixed at mount.
     */
    autoPressAfter?: number;
    /**
     * Localized text announced by the live region while a press settles
     * (`aria-busy` state changes alone are not announced by most screen
     * readers). The library ships no copy — pass the consumer's `$t(...)`.
     */
    loadingAnnouncement?: string;
    accessibilityLabel?: string;
    testID?: string;
    class?: string;
    /** The label, with any icons: the content lays out whatever is passed. */
    children: Snippet;
  }

  // Closed prop set: behaviour props declared here, style props by styles.ts.
  // The typed rest is handed to the resolver opaquely.
  type Props = BehaviourProps & ButtonStyleProps;

  let {
    isLoading = false,
    isDisabled = false,
    type = 'button',
    validateForm = false,
    onClick,
    href,
    target,
    rel,
    autoPressAfter = 0,
    loadingAnnouncement,
    accessibilityLabel,
    testID,
    class: className = '',
    children,
    ...styleProps
  }: Props = $props();

  const style = useComponentDefaults('Button', () => styleProps);

  // Inside a ButtonGroup the group's look wins, as in Blade, and its
  // disabled state joins the button's own.
  const group = getButtonGroup<Required<ButtonStyleProps>>();
  const disabled = $derived(isDisabled || Boolean(group?.isDisabled));

  const press = createPress({
    type: () => type,
    validateForm: () => validateForm,
    isLoading: () => isLoading,
    isDisabled: () => disabled,
    onClick: (event) => onClick?.(event),
    autoPressAfter: () => autoPressAfter,
  });

  const classes = $derived(resolveButton(group?.shared ?? style.current));
</script>

<!--
  Blade's DotLoader draws in a layer over the children, which stay rendered
  but hidden: the button keeps its width and its accessible name while busy.
-->
{#snippet loader()}
  <span class={classes.loader} aria-hidden="true">
    {#each classes.dotStep as step, index (index)}
      <span class={cx(classes.dot, step)}></span>
    {/each}
  </span>
{/snippet}

{#if href}
  <a
    {href}
    {target}
    {rel}
    class={cx(classes.root, className)}
    aria-label={accessibilityLabel}
    data-testid={testID}
    onclick={(event) => onClick?.(event)}
  >
    <span class={classes.content}>{@render children()}</span>
  </a>
{:else}
  <button
    type={press.type}
    class={cx(
      classes.root,
      press.shake && classes.shake,
      press.busy && classes.busy,
      className
    )}
    {disabled}
    aria-disabled={press.busy ? 'true' : undefined}
    aria-busy={press.busy ? 'true' : undefined}
    aria-label={accessibilityLabel}
    data-testid={testID}
    onclick={press.handleClick}
    {@attach press.attach}
  >
    {#if press.elapsed !== undefined}
      <span
        class={classes.autoFill}
        style:--progress={press.elapsed}
        aria-hidden="true"
      ></span>
    {/if}
    <span
      class={cx(classes.content, press.busyCause && classes.busyContent)}
      data-part="content"
    >
      {@render children()}
    </span>
    {#if press.busyCause}
      {@render loader()}
    {/if}
    <span role="status" class={classes.status}>
      {press.busy && loadingAnnouncement ? loadingAnnouncement : ''}
    </span>
  </button>
{/if}

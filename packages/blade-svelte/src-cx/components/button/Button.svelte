<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import {
    createPress,
    type ButtonType,
  } from '../../runes/button/press.svelte';
  import {
    buttonLoaderLook,
    resolveButton,
    type ButtonStyleProps,
  } from './styles';

  interface BehaviourProps {
    isLoading?: boolean;
    isDisabled?: boolean;
    /**
     * The HTML type: `submit` (the default, as HTML's) presses the enclosing
     * Form, `button` leaves it alone. An invalid form shakes a submit and
     * reports to the Form's `onValidationFailed`. Outside a Form it changes
     * nothing.
     */
    type?: ButtonType;
    /**
     * A `button` that validates the Form before it acts, shaking and
     * reporting as a submit would, without submitting.
     */
    validateForm?: boolean;
    onClick?: (event: MouseEvent) => void;
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
    /** Icons and label alike — the flex content lays out whatever is passed. */
    children: Snippet;
  }

  // Closed prop set: behaviour props declared here, style props by styles.ts.
  // The typed rest is handed to the resolver opaquely.
  type Props = BehaviourProps & ButtonStyleProps;

  let {
    isLoading = false,
    isDisabled = false,
    type = 'submit',
    validateForm = false,
    onClick,
    autoPressAfter = 0,
    loadingAnnouncement,
    accessibilityLabel,
    testID,
    class: className = '',
    children,
    ...styleProps
  }: Props = $props();

  const press = createPress({
    type: () => type,
    validateForm: () => validateForm,
    isLoading: () => isLoading,
    isDisabled: () => isDisabled,
    onClick: (event) => onClick?.(event),
    autoPressAfter: () => autoPressAfter,
  });

  const classes = $derived(resolveButton(styleProps));
</script>

<!--
  The busy dots (ported from app/v2/components/loader/Dot.svelte) draw in a
  layer over the children, which stay rendered but faded: the button keeps
  its width and its accessible name through the busy state. The dots are
  keyed to the style taxonomy, in the text colour of whatever look is on.
-->
{#snippet loader()}
  {@const look = buttonLoaderLook(styleProps)}
  {@const bounce = 'animate-bounce motion-reduce:animate-none'}
  <span class={`${classes.loader} ${look.scale}`} aria-hidden="true">
    <span class={`${look.dot} ${bounce} [animation-delay:-0.3s]`}></span>
    <span class={`${look.dot} ${bounce} [animation-delay:-0.15s]`}></span>
    <span class={`${look.dot} ${bounce}`}></span>
  </span>
{/snippet}

<button
  type={press.type}
  class={cx(
    classes.root,
    press.shake && classes.shake,
    press.busy && classes.loading,
    className
  )}
  disabled={isDisabled}
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

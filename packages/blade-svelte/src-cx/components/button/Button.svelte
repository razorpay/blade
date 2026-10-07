<script lang="ts">
  import { useComponentDefaults } from '../defaults';
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import {
    createPress,
    type ButtonType,
  } from '../../runes/button/press.svelte';
  import { getButtonGroup } from '../../runes/button/group';
  import type { IconSource } from '../../runes/icon/source';
  import Icon from '../icon/Icon.svelte';
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
    /** Names the button; required when it is an `icon` and no label. */
    accessibilityLabel?: string;
    testID?: string;
    class?: string;
    /**
     * Before the label (Figma's leading icon). Alone, with no `children`, the
     * button is icon-only: a square of its height, which `accessibilityLabel`
     * names.
     */
    icon?: IconSource;
    /** After the label (Figma's trailing icon). */
    trailingIcon?: IconSource;
    /** The label. Optional when `icon` stands alone. */
    children?: Snippet;
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
    icon,
    trailingIcon,
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

  const isIconOnly = $derived(Boolean(icon) && !children && !trailingIcon);
  const classes = $derived(resolveButton(group?.shared ?? style.current, isIconOnly));
</script>

<!-- Figma's row: the leading icon, the label in its 4px, the trailing icon. -->
{#snippet content()}
  {#if icon}<Icon source={icon} size={classes.iconSize} />{/if}
  {#if children}<span class={classes.label}>{@render children()}</span>{/if}
  {#if trailingIcon}<Icon source={trailingIcon} size={classes.iconSize} />{/if}
{/snippet}

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
    <span class={classes.content}>{@render content()}</span>
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
      {@render content()}
    </span>
    {#if press.busyCause}
      {@render loader()}
    {/if}
    <span role="status" class={classes.status}>
      {press.busy && loadingAnnouncement ? loadingAnnouncement : ''}
    </span>
  </button>
{/if}

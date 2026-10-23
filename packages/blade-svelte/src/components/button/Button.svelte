<script lang="ts">
  import { useComponentDefaults } from '../defaults';
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import {
    createPress,
    type ButtonType,
  } from '../../runes/button/press.svelte';
  import { getButtonGroup } from '../../runes/button/group';
  import { analyticsAttributes, type AnalyticsAttributes } from '../../runes/dom/analytics';
  import { createLink } from '../../runes/link/link';
  import type { IconSource } from '../../runes/icon/source';
  import Icon from '../icon/Icon.svelte';
  import DotLoader from '../dot-loader/DotLoader.svelte';
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
     * The HTML type. `submit` presses the app's form (`adapters.form`): an
     * invalid form shakes the button, reports to the form's `invalid`, and
     * skips `onClick`.
     * @default 'button'
     */
    type?: ButtonType;
    /**
     * A `button` that validates the Form before it acts, shaking and
     * reporting as a submit would, without submitting. An invalid form
     * stops the press: `onClick` does not run.
     */
    validateForm?: boolean;
    onClick?: (event: MouseEvent) => void;
    /**
     * Renders an anchor that looks like the button. A plain click on an
     * internal href goes to `adapters.navigate`, as Link's does.
     */
    href?: string;
    target?: string;
    /** Kept, with `noopener noreferrer` added for `target="_blank"`. */
    rel?: string;
    /**
     * Localized; said to a screen reader when the button turns busy
     * (`aria-busy` alone is not announced by most screen readers).
     * @default 'Started loading'
     */
    loadingAnnouncement?: string;
    /**
     * Localized; said when it is no longer busy.
     * @default 'Stopped loading'
     */
    loadedAnnouncement?: string;
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
  type Props = BehaviourProps & ButtonStyleProps & AnalyticsAttributes;

  let {
    isLoading = false,
    isDisabled = false,
    type = 'button',
    validateForm = false,
    onClick,
    href,
    target,
    rel,
    loadingAnnouncement = 'Started loading',
    loadedAnnouncement = 'Stopped loading',
    accessibilityLabel,
    testID,
    class: className = '',
    icon,
    trailingIcon,
    children,
    ...styleProps
  }: Props = $props();

  const style = useComponentDefaults('Button', () => styleProps);
  // The rest is style props and `data-analytics-*`, which land on the element.
  const analytics = $derived(analyticsAttributes(styleProps));

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
    loadingAnnouncement: () => loadingAnnouncement,
    loadedAnnouncement: () => loadedAnnouncement,
  });
  // A link button refuses the press while its group is disabled or it is
  // busy, as Blade's BaseButton; its own `isDisabled` stays ignored with
  // `href`. Group-disabled, it drops its href, as Link does.
  const isLinkDisabled = $derived(Boolean(group?.isDisabled) || press.busy);
  const link = createLink(() => ({ href, target, rel, isDisabled: isLinkDisabled }));

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
    <DotLoader size={classes.loaderSize} color="inherit" />
  </span>
{/snippet}

{#if href}
  <a
    href={group?.isDisabled ? undefined : href}
    {target}
    rel={link.rel}
    class={cx(classes.root, press.busy && classes.busy, className)}
    aria-disabled={isLinkDisabled ? 'true' : undefined}
    aria-busy={press.busy ? 'true' : undefined}
    aria-label={accessibilityLabel}
    data-testid={testID}
    {...analytics}
    onclick={(event) => link.click(event, onClick)}
  >
    <span
      class={cx(classes.content, press.busyCause && classes.busyContent)}
      data-part="content"
    >
      {@render content()}
    </span>
    {#if press.busyCause}
      {@render loader()}
    {/if}
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
    {...analytics}
    onclick={press.handleClick}
  >
    <span
      class={cx(classes.content, press.busyCause && classes.busyContent)}
      data-part="content"
    >
      {@render content()}
    </span>
    {#if press.busyCause}
      {@render loader()}
    {/if}
  </button>
{/if}

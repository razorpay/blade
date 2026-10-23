<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import { analyticsAttributes, type AnalyticsAttributes } from '../../runes/dom/analytics';
  import Button from '../button/Button.svelte';
  import { resolveCardFooter, type CardFooterAction, type FooterClasses } from './styles';

  // Blade's CardFooter: CardFooterLeading (`title`, `subtitle`) and
  // CardFooterTrailing (`actions`) as props, or `children` laid out by the
  // caller.
  interface Props extends Partial<AnalyticsAttributes> {
    /** CardFooterLeading's title. */
    title?: string;
    /** CardFooterLeading's subtitle. */
    subtitle?: string;
    /** CardFooterTrailing's actions: a primary and a secondary Button. */
    actions?: { primary?: CardFooterAction; secondary?: CardFooterAction };
    /** A hairline above the footer. @default true */
    showDivider?: boolean;
    /** The whole look, in place of Card's. @default resolveCardFooter({ showDivider }) */
    classes?: FooterClasses;
    testID?: string;
    class?: string;
    /** In place of the leading text and the actions. */
    children?: Snippet;
  }

  let {
    title,
    subtitle,
    actions,
    showDivider = true,
    classes: given,
    testID,
    class: className = '',
    children,
    ...rest
  }: Props = $props();

  const classes = $derived(given ?? resolveCardFooter({ showDivider }));
  const analytics = $derived(analyticsAttributes(rest));
</script>

{#snippet action(item: CardFooterAction, variant: 'primary' | 'secondary')}
  <Button
    {variant}
    size="medium"
    type={item.type ?? 'button'}
    onClick={item.onClick}
    isLoading={item.isLoading}
    isDisabled={item.isDisabled}
    icon={item.iconPosition === 'right' ? undefined : item.icon}
    trailingIcon={item.iconPosition === 'right' ? item.icon : undefined}
    accessibilityLabel={item.accessibilityLabel}
  >
    {item.text}
  </Button>
{/snippet}

<div class={cx(classes.root, className)} data-testid={testID} {...analytics}>
  {#if children}
    {@render children()}
  {:else}
    <div class={classes.row}>
      {#if title || subtitle}
        <div class={classes.leading}>
          {#if title}<p class={classes.title}>{title}</p>{/if}
          {#if subtitle}<p class={classes.subtitle}>{subtitle}</p>{/if}
        </div>
      {/if}
      {#if actions?.primary || actions?.secondary}
        <div class={classes.actions}>
          {#if actions.secondary}{@render action(actions.secondary, 'secondary')}{/if}
          {#if actions.primary}{@render action(actions.primary, 'primary')}{/if}
        </div>
      {/if}
    </div>
  {/if}
</div>

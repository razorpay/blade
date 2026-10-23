<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import { analyticsAttributes, type AnalyticsAttributes } from '../../runes/dom/analytics';
  import { getCardGroup } from '../../runes/card-group/context';
  import { createCollapsible } from '../../runes/collapsible/collapsible.svelte';
  import { createLink } from '../../runes/link/link';
  import Icon from '../icon/Icon.svelte';
  import CardGroupBody from './CardGroupBody.svelte';
  import { ChevronDownIcon, ChevronRightIcon } from '../../icons';
  import {
    resolveCardGroup,
    resolveCardGroupItem,
    type CardGroupItemClick,
    type CardGroupItemContentProps,
    type CardGroupItemState,
    type CardGroupShared,
  } from './styles';

  // A row that holds no value: a link that navigates, a disclosure (it has
  // `content`), or plain content. None is one of the list's choices: links and
  // disclosures are tab stops of their own.
  interface Props extends CardGroupItemContentProps {
    /** What the row's `onClick` reports as its `name` (a link row's ignored value). */
    value?: T;
    href?: string;
    target?: string;
    rel?: string;
    isDisabled: boolean;
    /** `negative`: the look may draw the row red (`data-intent`). @default 'none' */
    intent?: 'none' | 'negative';
    accessibilityLabel?: string;
    testID?: string;
    /** Never selected: a link or a disclosure holds no value. */
    onClick?: (click: CardGroupItemClick<T | undefined>) => void;
    class?: string;
    children?: Snippet<[CardGroupItemState]>;
    /** Makes the row a disclosure: what it reveals under it. */
    content?: Snippet;
    isExpanded?: boolean;
    onExpandChange?: (change: { isExpanded: boolean }) => void;
  }

  let {
    value,
    href,
    target,
    rel,
    title,
    description,
    leading,
    trailing,
    isDisabled,
    intent = 'none',
    accessibilityLabel,
    testID,
    onClick,
    class: className = '',
    children,
    content,
    // No fallback: CardGroupItem binds its own, unset until a toggle.
    isExpanded = $bindable(),
    onExpandChange,
    ...rest
  }: Props & AnalyticsAttributes = $props();

  const list = getCardGroup<unknown, CardGroupShared>();
  const kind = $derived(href ? 'link' : content ? 'trigger' : 'static');
  const uid = $props.id();
  const disclosure = createCollapsible({
    id: uid,
    isExpanded: () => Boolean(isExpanded),
    onValue: (next) => {
      isExpanded = next;
    },
    onExpandChange: (next) => onExpandChange?.({ isExpanded: next }),
    direction: () => 'bottom',
  });
  const classes = $derived(list?.shared.classes ?? resolveCardGroup({}));
  const parts = $derived(classes.collapsible ?? resolveCardGroup({}).collapsible!);
  const layout = resolveCardGroupItem();
  const interactive = $derived(
    cx(
      classes.row,
      classes.rowState.unpicked,
      classes.rowFocusVisible,
      isDisabled && classes.rowDisabled
    )
  );

  const chevron = $derived(
    cx(isDisabled ? layout.chevronDisabled : layout.chevron, classes.chevron)
  );

  const analytics = $derived(analyticsAttributes(rest));
  // As Link: the app's router may take a plain click on an internal href.
  // A disabled link has no href, but a click still reaches it (a look with
  // no `pointer-events-none`, a programmatic click): it does nothing.
  const link = createLink(() => ({ href, target, rel, isDisabled }));

  function follow(event: MouseEvent): void {
    link.click(event, (click) => onClick?.({ name: value, value: false, event: click }));
  }

  function toggle(event: MouseEvent): void {
    if (isDisabled) return;
    disclosure.toggle();
    onClick?.({ name: value, value: false, event });
  }
</script>

{#snippet edge(part: string | Snippet)}
  {#if typeof part === 'string'}{part}{:else}{@render part()}{/if}
{/snippet}

{#snippet rowContent()}
  {#if children}
    {@render children({ index: -1, isSelected: false, isDisabled })}
  {:else}
    <span class={cx(layout.root, className)}>
      {#if leading}<span class={layout.leading}>{@render edge(leading)}</span>{/if}
      <span class={layout.text}>
        <span class={layout.title}>{title}</span>
        {#if description}<span class={isDisabled ? layout.descriptionDisabled : layout.description}>{description}</span>{/if}
      </span>
      {#if trailing}<span class={layout.trailing}>{@render edge(trailing)}</span>{/if}
    </span>
  {/if}
{/snippet}

<!-- After the content, in the row (a flex row): the content grows, the
     chevron keeps its size at the end. -->
{#snippet indicator()}
  {#if kind === 'link'}
    <span class={chevron} aria-hidden="true">
      <Icon source={ChevronRightIcon} size="large" />
    </span>
  {:else if kind === 'trigger'}
    <span class={cx(chevron, Boolean(isExpanded) && layout.chevronExpanded)} aria-hidden="true">
      <Icon source={ChevronDownIcon} size="large" />
    </span>
  {/if}
{/snippet}

{#if kind === 'link'}
  <a
    class={cx('no-underline', interactive)}
    href={isDisabled ? undefined : href}
    target={isDisabled ? undefined : target}
    rel={isDisabled ? undefined : link.rel}
    role={isDisabled ? 'link' : undefined}
    aria-disabled={isDisabled ? 'true' : undefined}
    aria-label={accessibilityLabel}
    tabindex={isDisabled ? -1 : undefined}
    data-intent={intent === 'none' ? undefined : intent}
    data-testid={testID}
    {...analytics}
    onclick={follow}
  >
    <span class={classes.content}>{@render rowContent()}</span>
    {@render indicator()}
  </a>
{:else if kind === 'trigger'}
  <!-- The trigger and what it reveals are one row of the group. -->
  <div class={parts.root}>
  <button
    type="button"
    class={cx(classes.button ?? 'w-full text-start', interactive)}
    disabled={isDisabled}
    aria-expanded={Boolean(isExpanded)}
    aria-controls={isExpanded ? disclosure.bodyId : undefined}
    aria-label={accessibilityLabel}
    data-testid={testID}
    {...analytics}
    onclick={toggle}
  >
    <span class={classes.content}>{@render rowContent()}</span>
    {@render indicator()}
  </button>
  {#if content}
    <CardGroupBody id={disclosure.bodyId} isOpen={Boolean(isExpanded)} class={parts.body}>
      {@render content()}
    </CardGroupBody>
  {/if}
  </div>
{:else}
  <div
    class={cx(classes.row, isDisabled && classes.rowDisabled)}
    aria-label={accessibilityLabel}
    data-testid={testID}
    {...analytics}
  >
    <span class={classes.content}>{@render rowContent()}</span>
  </div>
{/if}

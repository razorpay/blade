<script lang="ts" generics="T">
  import type { ComponentProps, Snippet } from 'svelte';
  import { analyticsAttributes, type AnalyticsAttributes } from '../../runes/dom/analytics';
  import CardGroupItemRow from './CardGroupItemRow.svelte';
  import CardGroupPlainRow from './CardGroupPlainRow.svelte';
  import type { CardGroupItemClick } from './styles';

  // One row of a CardGroup. With a `value` it is one of the list's choices.
  // Without one it navigates (`href`), discloses its `content`, or is plain
  // content.
  type RowProps = Omit<
    ComponentProps<typeof CardGroupItemRow<T>>,
    'value' | 'content' | 'isExpanded' | 'onClick'
  > & {
    /** Names a row that holds no value, when its content does not. */
    accessibilityLabel?: string;
  } & AnalyticsAttributes;

  type Choice = {
    /** The option this row picks: what the list's value holds. */
    value: T;
    href?: never;
    target?: never;
    rel?: never;
    /**
     * What the row reveals under it — a field the pick needs, say. It shows
     * while the row is picked.
     */
    content?: Snippet;
    /**
     * With `content`: whether it shows, in place of following the pick.
     * @default undefined (the pick decides)
     */
    isExpanded?: boolean;
    onExpandChange?: never;
    /**
     * The row was pressed — by pointer, or Enter or Space — after the pick:
     * `name` is its value, `value` whether it was selected when pressed.
     */
    onClick?: (click: CardGroupItemClick<T>) => void;
  };

  type Link = {
    /** Ignored: a link row navigates and holds no value. */
    value?: T;
    /** A link row: it navigates, with a chevron, instead of holding a value. */
    href: string;
    target?: string;
    rel?: string;
    content?: never;
    isExpanded?: never;
    onExpandChange?: never;
    /** Before the navigation: `name` is the `value` given, `value` false. */
    onClick?: (click: CardGroupItemClick<T | undefined>) => void;
  };

  type Disclosure = {
    value?: undefined;
    href?: undefined;
    target?: never;
    rel?: never;
    /**
     * Makes the row a disclosure: a button with a chevron that flips,
     * revealing this under it. Without it the row is plain content.
     */
    content?: Snippet;
    /**
     * Whether the content shows: the initial state, a `bind:isExpanded`, or a
     * value the host keeps driving.
     * @default false
     */
    isExpanded?: boolean;
    /** The row toggled its content. */
    onExpandChange?: (change: { isExpanded: boolean }) => void;
    /** The row was pressed. */
    onClick?: (click: CardGroupItemClick<undefined>) => void;
  };

  type Props = RowProps & (Choice | Link | Disclosure);

  let {
    href,
    target,
    rel,
    accessibilityLabel,
    content,
    isExpanded = $bindable(),
    onExpandChange,
    onClick,
    ...props
  }: Props = $props();

  const isOption = $derived(props.value !== undefined && !href);
</script>

{#if !isOption}
  <CardGroupPlainRow
    value={props.value}
    intent={props.intent}
    {href}
    {target}
    {rel}
    {accessibilityLabel}
    {content}
    bind:isExpanded
    {onExpandChange}
    title={props.title}
    description={props.description}
    leading={props.leading}
    trailing={props.trailing}
    isDisabled={props.isDisabled ?? false}
    testID={props.testID}
    onClick={onClick as (click: CardGroupItemClick<T | undefined>) => void}
    class={props.class}
    children={props.children}
    {...analyticsAttributes(props)}
  />
{:else}
  <CardGroupItemRow
    {...props}
    value={props.value as T}
    {content}
    {isExpanded}
    onClick={onClick as (click: CardGroupItemClick<T>) => void}
  />
{/if}

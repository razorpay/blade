<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import { CheckIcon } from '../../icons';
  import type { IconSource } from '../../runes/icon/source';
  import Icon from '../icon/Icon.svelte';
  import { POPUP_CHECK, type PopupItemClasses, type PopupItemIntent } from './popup-list';

  // The inside of an ActionList row — the checkbox for a multiple choice, the
  // leading item, the title with its suffix and description, the trailing
  // item — wherever the row lives: a Dropdown's option, a standalone list's
  // native radio or checkbox row, or a link. A view only: the host owns the
  // element, the semantics and the pick.
  interface Props {
    classes: PopupItemClasses;
    title: string;
    description?: string;
    /** An icon draws as a glyph; a snippet sits in the leading box. */
    leading?: IconSource | Snippet;
    titleSuffix?: Snippet;
    trailing?: Snippet;
    /** A multiple choice: lead with the checkbox, showing `isSelected`. */
    hasCheck?: boolean;
    isSelected?: boolean;
    /** Colours the glyph (Figma's item icon); the host colours the row. @default 'none' */
    intent?: PopupItemIntent;
    /** Draws the title, description, glyph and checkbox disabled. @default false */
    isDisabled?: boolean;
  }

  let {
    classes,
    title,
    description,
    leading,
    titleSuffix,
    trailing,
    hasCheck = false,
    isSelected = false,
    intent = 'none',
    isDisabled = false,
  }: Props = $props();

  const checkLook = $derived(isDisabled ? POPUP_CHECK.lookDisabled : POPUP_CHECK.look);
</script>

{#if hasCheck}
  <span class={classes.itemLeading} aria-hidden="true">
    <span class={cx(POPUP_CHECK.box, checkLook[isSelected ? 'checked' : 'unchecked'])}>
      <span class={POPUP_CHECK.mark[isSelected ? 'shown' : 'hidden']}>
        <Icon source={CheckIcon} size="small" />
      </span>
    </span>
  </span>
{/if}
{#if typeof leading === 'function'}
  <span class={classes.itemLeading}>{@render leading()}</span>
{:else if leading}
  <span class={cx(classes.itemIcon, classes.itemIconTone[isDisabled ? 'disabled' : intent])}>
    <Icon source={leading} />
  </span>
{/if}
<span class={cx(classes.itemBody, isDisabled && classes.itemBodyDisabled)}>
  {#if titleSuffix}
    <span class={classes.itemTitleRow}>
      <span class={classes.itemTitle}>{title}</span>
      <span class={classes.itemTitleSuffix}>{@render titleSuffix()}</span>
    </span>
  {:else}
    <span class={classes.itemTitle}>{title}</span>
  {/if}
  {#if description}
    <span class={classes.itemDescription[isDisabled ? 'disabled' : 'enabled']}>{description}</span>
  {/if}
</span>
{#if trailing}
  <span class={classes.itemTrailing}>{@render trailing()}</span>
{/if}

<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    makeAccessible,
    makeAnalyticsAttribute,
  } from '@razorpay/blade-core/utils';
  import { getActionListItemClasses, getActionListTemplateClasses } from '@razorpay/blade-core/styles';
  import Text from '../Typography/Text/Text.svelte';
  import { getActionListContext, setActionListItemContext } from './actionListContext';
  import { getActionListItemRole } from './getA11yRoles';
  import type { ActionListItemContextValue, ActionListItemProps } from './types';

  // Call template getter so CVA classes used in compound selectors aren't tree-shaken.
  const templateClasses = getActionListTemplateClasses();

  let {
    title,
    description,
    value,
    href,
    target,
    leading,
    trailing,
    onClick,
    isDisabled = false,
    isSelected,
    intent,
    testID,
    ...rest
  }: ActionListItemProps = $props();

  const ctx = getActionListContext();

  // Selection: explicit prop wins, else derive from ActionList `selectedValue`.
  const isItemSelected = $derived(isSelected ?? ctx?.selectedValue === value);

  // Provide row-local disabled/intent to ActionListItemText (React `useBaseMenuItem`).
  const itemContext: ActionListItemContextValue = {
    get isDisabled() {
      return isDisabled;
    },
    get intent() {
      return intent;
    },
  };
  setActionListItemContext(() => itemContext);

  const role = $derived(getActionListItemRole(href));

  // Title/description colors mirror React BaseMenuItem `menuItemTitleColor` / `menuItemDescriptionColor`.
  const titleColor = $derived(
    isDisabled
      ? 'interactive.text.gray.disabled'
      : intent === 'negative'
        ? 'feedback.text.negative.intense'
        : 'interactive.text.gray.normal',
  );
  const descriptionColor = $derived(
    isDisabled ? 'interactive.text.gray.disabled' : 'interactive.text.gray.muted',
  );

  const rowClasses = $derived(getActionListItemClasses({ intent: intent === 'negative' ? 'negative' : 'default' }));

  function handleClick(event: MouseEvent): void {
    if (isDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClick?.({ value, isSelected: isItemSelected, event });
    ctx?.onAction?.({ value });
  }

  const metaAttrs = metaAttribute({ name: MetaConstants.ActionListItem, testID });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
  const a11yAttrs = $derived(
    makeAccessible({
      role,
      selected: isItemSelected,
      disabled: isDisabled,
    }),
  );
</script>

{#snippet rowInner()}
  <span class={templateClasses.itemInner}>
    {#if leading}
      <span class={templateClasses.itemLeading}>{@render leading()}</span>
    {/if}
    <span
      class={[templateClasses.itemContent, leading ? templateClasses.itemContentWithLeading : '']
        .filter(Boolean)
        .join(' ')}
    >
      <span class={templateClasses.itemTitleRow}>
        <Text
          as="span"
          size="medium"
          weight="regular"
          color={titleColor}
          truncateAfterLines={1}
          wordBreak="break-all"
        >
          {title}
        </Text>
      </span>
      {#if description}
        <span>
          <Text size="small" color={descriptionColor}>{description}</Text>
        </span>
      {/if}
    </span>
    {#if trailing}
      <span class={templateClasses.itemTrailing}>{@render trailing()}</span>
    {/if}
  </span>
{/snippet}

{#if href}
  <a
    class={rowClasses}
    {href}
    {target}
    data-value={value}
    onclick={handleClick}
    {...a11yAttrs}
    {...metaAttrs}
    {...analyticsAttrs}
  >
    {@render rowInner()}
  </a>
{:else}
  <button
    class={rowClasses}
    type="button"
    data-value={value}
    disabled={isDisabled || undefined}
    onclick={handleClick}
    {...a11yAttrs}
    {...metaAttrs}
    {...analyticsAttrs}
  >
    {@render rowInner()}
  </button>
{/if}

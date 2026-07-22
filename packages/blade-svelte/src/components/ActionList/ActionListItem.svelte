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
    titleSuffix,
    onClick,
    isDisabled = false,
    isSelected,
    intent,
    testID,
    ...rest
  }: ActionListItemProps = $props();

  const ctx = getActionListContext();

  const isMultiSelect = $derived(ctx?.selectionType === 'multiple');

  // Lazy-load the Checkbox: it's only rendered as the selection indicator for
  // multi-select lists, so single-select usage never pulls it into the bundle.
  // The $effect preloads on mount when isMultiSelect is already true, minimizing
  // the render gap for the common case where the list starts in multi-select mode.
  let Checkbox = $state<typeof import('../Checkbox/Checkbox.svelte').default | null>(null);
  let checkboxLoadPromise: Promise<void> | null = null;

  $effect(() => {
    if (isMultiSelect && !Checkbox && !checkboxLoadPromise) {
      checkboxLoadPromise = import('../Checkbox/Checkbox.svelte')
        .then((module) => {
          Checkbox = module.default;
        })
        .catch(() => {
          // Chunk load failure — leave Checkbox null so the selector span renders empty.
        })
        .finally(() => {
          checkboxLoadPromise = null;
        });
    }
  });

  // Selection: explicit prop wins, else derive from ActionList `selectedValue`.
  // In multiple mode `selectedValue` is an array → membership check; in single
  // mode it's a scalar → equality (mirrors React's array vs scalar handling).
  const isItemSelected = $derived(
    isSelected ??
      (Array.isArray(ctx?.selectedValue)
        ? ctx.selectedValue.includes(value)
        : ctx?.selectedValue === value),
  );

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

  const metaAttrs = $derived(metaAttribute({ name: MetaConstants.ActionListItem, testID }));
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
  {@const hasLeading = isMultiSelect || Boolean(leading)}
  <span class={templateClasses.itemInner}>
    {#if isMultiSelect}
      <!-- Multi-select indicator overrides `leading` (mirrors React
           `BaseMenuLeadingItem`): checkbox is visual only, so it's aria-hidden,
           non-interactive (`tabindex=-1`, pointer-events none via .itemSelector)
           and the row itself carries `aria-selected`. -->
      <span class={templateClasses.itemSelector} aria-hidden="true">
        {#if Checkbox}
          <Checkbox isChecked={isItemSelected} isDisabled={isDisabled} tabIndex={-1} />
        {/if}
      </span>
    {:else if leading}
      <span class={templateClasses.itemLeading}>{@render leading()}</span>
    {/if}
    <span
      class={[templateClasses.itemContent, hasLeading ? templateClasses.itemContentWithLeading : '']
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
        {#if titleSuffix}
          {@render titleSuffix()}
        {/if}
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
    onclick={handleClick}
    {...a11yAttrs}
    {...metaAttrs}
    {...analyticsAttrs}
  >
    {@render rowInner()}
  </button>
{/if}

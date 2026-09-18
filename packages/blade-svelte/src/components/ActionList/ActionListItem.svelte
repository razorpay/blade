<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    makeAccessible,
    makeAnalyticsAttribute,
  } from '@razorpay/blade-core/utils';
  import { getActionListItemClasses, getActionListTemplateClasses } from '@razorpay/blade-core/styles';
  import { useId } from '@razorpay/blade-core/utils';
  import Text from '../Typography/Text/Text.svelte';
  import { getDropdownContext } from '../Dropdown/dropdownContext';
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

  // Optional Dropdown bridge — undefined for standalone / BottomSheet usage
  // (no-op), so that path is unchanged. When present, the item registers into
  // the Dropdown option registry and adopts index-based selection / keyboard nav.
  const dd = getDropdownContext();
  const itemId = useId('action-list-item');

  $effect(() => {
    if (!dd) return;
    dd.registerOption({ id: itemId, title, value, href });
    return () => dd.unregisterOption(itemId);
  });

  const dropdownIndex = $derived(dd ? dd.getOptionIndex(itemId) : -1);
  const isActiveFocus = $derived(dd ? dd.activeIndex === dropdownIndex : false);
  const dropdownItemId = $derived(dd ? `${dd.dropdownBaseId}-${dropdownIndex}` : undefined);

  const isMultiSelect = $derived(ctx?.selectionType === 'multiple');

  // Lazy-load the Checkbox: it's only rendered as the selection indicator for
  // multi-select lists, so single-select usage never pulls it into the bundle.
  let Checkbox = $state<typeof import('../Checkbox/Checkbox.svelte').default | null>(null);

  $effect(() => {
    if (isMultiSelect && !Checkbox) {
      void import('../Checkbox/Checkbox.svelte').then((module) => {
        Checkbox = module.default;
      });
    }
  });

  // Selection: explicit prop wins, else derive from ActionList `selectedValue`.
  // In multiple mode `selectedValue` is an array → membership check; in single
  // mode it's a scalar → equality (mirrors React's array vs scalar handling).
  const isItemSelected = $derived(
    dd
      ? dd.selectedIndices.includes(dropdownIndex)
      : isSelected ??
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

  const role = $derived(
    dd
      ? getActionListItemRole(dd.dropdownTriggerer, href, dd.selectionType, true)
      : getActionListItemRole(undefined, href),
  );

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
    if (dd) {
      dd.onOptionClick(event, dropdownIndex);
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
    id={dropdownItemId}
    class={rowClasses}
    {href}
    {target}
    data-value={value}
    data-active-focus={isActiveFocus ? 'true' : undefined}
    onclick={handleClick}
    {...a11yAttrs}
    {...metaAttrs}
    {...analyticsAttrs}
  >
    {@render rowInner()}
  </a>
{:else}
  <button
    id={dropdownItemId}
    class={rowClasses}
    type="button"
    data-value={value}
    data-active-focus={isActiveFocus ? 'true' : undefined}
    onclick={handleClick}
    {...a11yAttrs}
    {...metaAttrs}
    {...analyticsAttrs}
  >
    {@render rowInner()}
  </button>
{/if}

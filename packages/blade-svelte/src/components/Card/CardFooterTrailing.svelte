<script lang="ts">
  import { makeAnalyticsAttribute, MAKE_ANALYTICS_CONSTANTS } from '@razorpay/blade-core/utils';
  import { getCardTemplateClasses } from '@razorpay/blade-core/styles';
  import Button from '../Button/Button.svelte';
  import { useCardContext } from './CardContext';
  import type { CardFooterTrailingProps } from './types';

  // Prevent tree-shaking
  const templateClasses = getCardTemplateClasses();

  // Verify inside Card
  useCardContext('CardFooterTrailing');

  let {
    actions,
    ...rest
  }: CardFooterTrailingProps = $props();

  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

<div class={templateClasses.cardFooterTrailing} {...analyticsAttrs}>
  <div class={templateClasses.cardFooterActionWrapper}>
    {#if actions?.secondary}
      <Button
        isFullWidth
        size="medium"
        variant="secondary"
        icon={actions.secondary.icon}
        iconPosition={actions.secondary.iconPosition}
        isDisabled={actions.secondary.isDisabled}
        isLoading={actions.secondary.isLoading}
        onClick={actions.secondary.onClick}
        accessibilityLabel={actions.secondary.accessibilityLabel}
        type={actions.secondary.type}
        data-analytics-name={MAKE_ANALYTICS_CONSTANTS.CARD.FOOTER_SECONDARY_ACTION_BUTTON}
      >
        {actions.secondary.text ?? ''}
      </Button>
    {/if}
  </div>
  <div class={templateClasses.cardFooterActionSpacer}></div>
  <div class={templateClasses.cardFooterActionWrapper}>
    {#if actions?.primary}
      <Button
        isFullWidth
        size="medium"
        icon={actions.primary.icon}
        iconPosition={actions.primary.iconPosition}
        isDisabled={actions.primary.isDisabled}
        isLoading={actions.primary.isLoading}
        onClick={actions.primary.onClick}
        accessibilityLabel={actions.primary.accessibilityLabel}
        type={actions.primary.type}
        data-analytics-name={MAKE_ANALYTICS_CONSTANTS.CARD.FOOTER_PRIMARY_ACTION_BUTTON}
      >
        {actions.primary.text ?? ''}
      </Button>
    {/if}
  </div>
</div>

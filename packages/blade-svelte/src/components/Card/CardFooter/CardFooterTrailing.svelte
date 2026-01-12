<script lang="ts">
  import type { CardFooterTrailingProps } from '../types';
  import { useVerifyInsideCard } from '../CardContext';
  import Button from '../../Button/Button.svelte';
  import { makeAnalyticsAttribute } from '@razorpay/blade-core/utils';
  import styles from '@razorpay/blade-core/styles/Card/cardFooter.module.css';

  let { actions, ...rest }: CardFooterTrailingProps = $props();

  useVerifyInsideCard('CardFooterTrailing');

  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

<div class={styles['footer-trailing']} {...analyticsAttrs}>
  {#if actions?.secondary}
    <div style="flex-grow: 1;">
      <Button
        isFullWidth
        size="medium"
        variant="secondary"
        type={actions.secondary.type}
        accessibilityLabel={actions.secondary.accessibilityLabel}
        isLoading={actions.secondary.isLoading}
        isDisabled={actions.secondary.isDisabled}
        onClick={actions.secondary.onClick}
        data-analytics-name="card-footer-secondary-action-button"
      >
        {actions.secondary.text}
      </Button>
    </div>
  {/if}
  {#if actions?.secondary && actions?.primary}
    <div style="width: var(--spacing-5);"></div>
  {/if}
  {#if actions?.primary}
    <div style="flex-grow: 1;">
      <Button
        isFullWidth
        size="medium"
        variant="primary"
        type={actions.primary.type}
        accessibilityLabel={actions.primary.accessibilityLabel}
        isLoading={actions.primary.isLoading}
        isDisabled={actions.primary.isDisabled}
        onClick={actions.primary.onClick}
        data-analytics-name="card-footer-primary-action-button"
      >
        {actions.primary.text}
      </Button>
    </div>
  {/if}
</div>

<style>
  @media screen and (max-width: 767px) {
    .footer-trailing {
      flex-direction: column;
      width: 100%;
      margin-top: var(--spacing-5);
      margin-left: 0;
    }
  }
</style>

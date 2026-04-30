<script lang="ts">
  import Button from '../Button/Button.svelte';
  import { getCardTemplateClasses } from '@razorpay/blade-core/styles';
  import { useCardContext } from './CardContext';
  import type { CardHeaderIconButtonProps } from './types';

  // Prevent tree-shaking
  const templateClasses = getCardTemplateClasses();

  // Verify inside Card
  useCardContext('CardHeaderIconButton');

  let {
    icon,
    isDisabled,
    isLoading,
    onClick,
    accessibilityLabel,
    type,
    testID,
  }: CardHeaderIconButtonProps = $props();
</script>

<div class={templateClasses.cardHeaderIconButtonWrapper}>
  <Button
    {icon}
    {isDisabled}
    {isLoading}
    {onClick}
    {accessibilityLabel}
    {type}
    {testID}
    variant="tertiary"
    size="xsmall"
    iconPosition="left"
    isFullWidth
  />
</div>

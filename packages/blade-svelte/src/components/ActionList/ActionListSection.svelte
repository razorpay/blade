<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    makeAccessible,
    makeAnalyticsAttribute,
  } from '@razorpay/blade-core/utils';
  import { getActionListTemplateClasses } from '@razorpay/blade-core/styles';
  import Text from '../Typography/Text/Text.svelte';
  import Divider from '../Divider/Divider.svelte';
  import { getActionListSectionRole } from './getA11yRoles';
  import type { ActionListSectionProps } from './types';

  const templateClasses = getActionListTemplateClasses();

  let { title, children, testID, ...rest }: ActionListSectionProps = $props();

  const metaAttrs = metaAttribute({ name: MetaConstants.ActionListSection, testID });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
  const a11yAttrs = $derived(makeAccessible({ role: getActionListSectionRole(), label: title }));
</script>

<div class={templateClasses.section} {...a11yAttrs} {...metaAttrs} {...analyticsAttrs}>
  <div class={templateClasses.sectionTitle}>
    <Text color="surface.text.gray.muted" size="small" weight="semibold">{title}</Text>
  </div>
  <div class={templateClasses.sectionItems}>
    {@render children()}
  </div>
  <Divider marginX="spacing.3" marginY="spacing.1" />
</div>

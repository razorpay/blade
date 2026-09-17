<script lang="ts">
  import type { Snippet } from 'svelte';
  import { metaAttribute, MetaConstants } from '@razorpay/blade-core/utils';
  import { INFO_CARD_CONTEXT_KEY, getSectionedCardContext } from './sectionedCardContext';

  let {
    children,
    testID,
  }: {
    children: Snippet;
    testID?: string;
  } = $props();

  const ctx = getSectionedCardContext(INFO_CARD_CONTEXT_KEY);

  $effect(() => {
    ctx?.setFooter(children);
  });

  void metaAttribute({ name: MetaConstants.InfoCardFooter, testID });
</script>

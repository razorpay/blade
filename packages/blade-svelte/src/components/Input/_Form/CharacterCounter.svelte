<script lang="ts">
  import { hintTextSize } from '@razorpay/blade-core/styles';
  import Text from '../../Typography/Text/Text.svelte';
  import type { CharacterCounterProps } from './types';

  let { currentCount, maxCount, size = 'medium' }: CharacterCounterProps = $props();

  const textSize = $derived(hintTextSize[size]);
</script>

<Text variant="caption" size={textSize} weight="regular" color="surface.text.gray.muted">
  {currentCount}/{maxCount}
</Text>

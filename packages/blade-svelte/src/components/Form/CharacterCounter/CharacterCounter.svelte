<script lang="ts">
  import type { CharacterCounterProps } from './types';
  import Text from '../../Typography/Text/Text.svelte';
  import { hintTextSize } from '@razorpay/blade-core/styles';

  let {
    currentCount,
    maxCount,
    size = 'medium',
  }: CharacterCounterProps = $props();

  const textSize = $derived(hintTextSize[size] as 'small' | 'medium');
</script>

<Text
  variant="caption"
  size={textSize}
  weight="regular"
  color="surface.text.gray.muted"
>
  {currentCount}/{maxCount}
</Text>


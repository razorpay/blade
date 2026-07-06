<script lang="ts">
  import { getInputGroupTemplateClasses } from '@razorpay/blade-core/styles';
  import type { InputRowProps } from './types';

  const templateClasses = getInputGroupTemplateClasses();

  let { gridTemplateColumns = '1fr', children, testID }: InputRowProps = $props();

  // `__blade-input-row` is the stable global hook the InputGroup corner-rounding
  // rules target. `grid-template-columns` is an arbitrary value → set inline.
  const rowClasses = `${templateClasses.inputRow} __blade-input-row`;
</script>

<div class={rowClasses} style={`grid-template-columns: ${gridTemplateColumns}`} data-testid={testID}>
  {@render children()}
</div>

<script lang="ts">
  import { getInputGroupTemplateClasses } from '@razorpay/blade-core/styles';
  import { getStyledProps } from '../../utils/getStyledProps';
  import type { InputRowProps } from './types';

  const templateClasses = getInputGroupTemplateClasses();

  let { gridTemplateColumns = '1fr', children, testID }: InputRowProps = $props();

  // `__blade-input-row` is the stable global hook the InputGroup corner-rounding
  // rules target. The arbitrary `gridTemplateColumns` value is fed as the
  // --input-row-grid-template-columns custom property consumed by the input-row
  // class in inputGroup.module.css.
  const rowClasses = `${templateClasses.inputRow} __blade-input-row`;
  const { inputRowStyles } = $derived(getStyledProps('inputRow', { gridTemplateColumns }));
</script>

<div class={rowClasses} style={inputRowStyles} data-testid={testID}>
  {@render children()}
</div>

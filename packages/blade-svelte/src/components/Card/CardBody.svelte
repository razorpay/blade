<script lang="ts">
  import type { CardBodyProps } from './types';
  import { useVerifyInsideCard } from './CardContext';
  import { metaAttribute } from '@razorpay/blade-core/utils';
  import { makeAnalyticsAttribute } from '@razorpay/blade-core/utils';

  let { children, height, testID, ...rest }: CardBodyProps = $props();

  useVerifyInsideCard('CardBody');

  const metaAttrs = $derived(metaAttribute({ name: 'CardBody', testID }));
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));

  const styles = $derived(() => {
    const styleObj: Record<string, string> = {};
    if (height) styleObj.height = height;
    return styleObj;
  });
</script>

<div
  class="card-body"
  style={Object.entries(styles()).map(([k, v]) => `${k}: ${v}`).join('; ')}
  {...metaAttrs}
  {...analyticsAttrs}
>
  {@render children()}
</div>

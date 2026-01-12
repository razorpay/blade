<script lang="ts">
  import type { CardHeaderTrailingProps } from '../types';
  import { useVerifyInsideCard } from '../CardContext';
  import styles from '@razorpay/blade-core/styles/Card/cardHeader.module.css';

  let { visual }: CardHeaderTrailingProps = $props();

  useVerifyInsideCard('CardHeaderTrailing');
</script>

<div class={styles['header-trailing']}>
  {#if visual}
    {@render visual()}
  {/if}
</div>

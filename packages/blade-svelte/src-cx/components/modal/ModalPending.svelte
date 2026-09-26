<script lang="ts">
  import { Skeleton } from '../skeleton';
  import type { ModalStyleProps } from './styles';

  // A few text-shaped skeleton lines: the content is on its way.
  const _props: ModalStyleProps = $props();
</script>

<div class="flex flex-col gap-3 py-2">
  <Skeleton class="h-5 w-2/3" />
  <Skeleton class="h-4 w-full" />
  <Skeleton class="h-4 w-5/6" />
  <Skeleton class="h-10 w-full" />
</div>

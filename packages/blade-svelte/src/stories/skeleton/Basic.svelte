<script lang="ts">
  import { Skeleton } from '../../index';
</script>

<div class="flex max-w-96 items-center gap-3">
  <Skeleton class="w-10 h-10 rounded-max" />
  <div class="grid flex-1 gap-2">
    <Skeleton class="h-4 w-2/3 rounded-xsmall" />
    <Skeleton class="h-3 w-full rounded-xsmall" />
  </div>
</div>

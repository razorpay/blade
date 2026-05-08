<script lang="ts">
  import { useCardContext } from './CardContext';
  import type { IconComponent } from './types';

  // Verify inside Card
  useCardContext('CardHeaderIcon');

  let {
    icon: Icon,
  }: {
    /** Icon component to render */
    icon: IconComponent;
  } = $props();
</script>

<Icon color="surface.icon.gray.normal" size="large" />

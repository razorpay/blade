<script lang="ts">
  import Link from '../Link/Link.svelte';
  import { useCardContext } from './CardContext';
  import type { CardHeaderLinkProps } from './types';

  useCardContext('CardHeaderLink');

  let { ...props }: CardHeaderLinkProps = $props();
</script>

<Link {...props} />

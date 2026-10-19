<script lang="ts">
  import Breadcrumb from '../../components/breadcrumb/Breadcrumb.svelte';
  import BreadcrumbItem from '../../components/breadcrumb/BreadcrumbItem.svelte';
  import type { BreadcrumbStyleProps } from '../../components/breadcrumb/styles';
  import { HomeIcon } from '../../icons';

  interface Props extends BreadcrumbStyleProps {
    showLastSeparator?: boolean;
    onClick?: (event: MouseEvent) => void;
  }

  let { showLastSeparator = false, onClick, ...style }: Props = $props();
</script>

<Breadcrumb {...style} {showLastSeparator} testID="trail">
  <BreadcrumbItem href="/" icon={HomeIcon} accessibilityLabel="Home" testID="home" />
  <BreadcrumbItem href="/payments" {onClick} testID="payments">Payments</BreadcrumbItem>
  <BreadcrumbItem href="/payments/123" isCurrentPage testID="current">Payment 123</BreadcrumbItem>
</Breadcrumb>

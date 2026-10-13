<script lang="ts">
  import { Breadcrumb, BreadcrumbItem, type BreadcrumbStyleProps } from '../../index';
  import { HomeIcon } from '../../icons';

  interface Props {
    args: BreadcrumbStyleProps & { showLastSeparator?: boolean };
  }

  let { args }: Props = $props();
</script>

<div class={args.color === 'white' ? 'rounded-medium p-4 bg-interactive-primary-default' : ''}>
  <Breadcrumb
    size={args.size}
    color={args.color}
    emphasis={args.emphasis}
    showLastSeparator={args.showLastSeparator}
  >
    <BreadcrumbItem href="#home" icon={HomeIcon} accessibilityLabel="Home" />
    <BreadcrumbItem href="#payments">Payments</BreadcrumbItem>
    <BreadcrumbItem href="#settlements">Settlements</BreadcrumbItem>
    <BreadcrumbItem href="#current" isCurrentPage>Settlement 4521</BreadcrumbItem>
  </Breadcrumb>
</div>

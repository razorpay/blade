<script lang="ts">
  import { Breadcrumb, BreadcrumbItem, BREADCRUMB_AXES } from '../../index';
  import { HomeIcon } from '../../icons';
</script>

{#snippet trail()}
  <BreadcrumbItem href="#home" icon={HomeIcon} accessibilityLabel="Home" />
  <BreadcrumbItem href="#item">Item</BreadcrumbItem>
  <BreadcrumbItem href="#current" isCurrentPage>Current Item</BreadcrumbItem>
{/snippet}

<div class="grid gap-6">
  {#each BREADCRUMB_AXES.size as size (size)}
    <div class="flex flex-wrap items-center gap-8">
      <Breadcrumb {size} color="neutral">{@render trail()}</Breadcrumb>
      <Breadcrumb {size} color="primary">{@render trail()}</Breadcrumb>
      <div class="rounded-small p-2 bg-interactive-primary-default">
        <Breadcrumb {size} color="white">{@render trail()}</Breadcrumb>
      </div>
    </div>
  {/each}
  <div class="flex flex-wrap items-center gap-8">
    <Breadcrumb emphasis="intense">
      <BreadcrumbItem href="#contact" isCurrentPage>Contact</BreadcrumbItem>
      <BreadcrumbItem href="#address">Address</BreadcrumbItem>
      <BreadcrumbItem href="#payment">Payment</BreadcrumbItem>
    </Breadcrumb>
    <div class="rounded-small p-2 bg-interactive-primary-default">
      <Breadcrumb emphasis="intense" color="white">
        <BreadcrumbItem href="#contact" isCurrentPage>Contact</BreadcrumbItem>
        <BreadcrumbItem href="#address">Address</BreadcrumbItem>
        <BreadcrumbItem href="#payment">Payment</BreadcrumbItem>
      </Breadcrumb>
    </div>
  </div>
</div>

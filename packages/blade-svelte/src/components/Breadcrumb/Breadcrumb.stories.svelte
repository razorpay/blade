<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Breadcrumb from './Breadcrumb.svelte';

  const { Story } = defineMeta({
    title: 'Components/Breadcrumb',
    component: Breadcrumb,
    tags: ['autodocs'],
    argTypes: {
      size: {
        control: 'select',
        options: ['small', 'medium', 'large'],
      },
      color: {
        control: 'select',
        options: ['neutral', 'primary', 'white'],
      },
      showLastSeparator: {
        control: 'boolean',
      },
    },
    args: {
      size: 'medium',
      color: 'primary',
      showLastSeparator: false,
    },
  });
</script>

<script lang="ts">
  import BreadcrumbItem from './BreadcrumbItem.svelte';
  import { HomeIcon } from '../Icons/HomeIcon';

  // For ReactRouterUsage story
  const urls = {
    home: '/home',
    products: '/products',
    payments: '/payments',
    intPayments: '/international-payments',
    acceptIntPayments: '/accepts-international-payments',
  };

  let currentPath = $state('/home');

  function navigateTo(path: string) {
    return (event: MouseEvent) => {
      event.preventDefault();
      currentPath = path;
    };
  }

  // Build breadcrumb items based on current path
  const pathSegments = $derived.by(() => {
    const segments = [
      { path: urls.home, label: '', icon: true },
      { path: urls.products, label: 'Products', icon: false },
      { path: urls.payments, label: 'Payments', icon: false },
      { path: urls.intPayments, label: 'International Payments', icon: false },
      { path: urls.acceptIntPayments, label: 'Accept International Payments', icon: false },
    ];
    const currentIndex = segments.findIndex((s) => s.path === currentPath);
    return currentIndex >= 0 ? segments.slice(0, currentIndex + 1) : [segments[0]];
  });
</script>

<!-- Story 1: Basic -->
<Story name="Basic" asChild>
  <div style:padding="var(--spacing-4)">
    <Breadcrumb>
      {#snippet children()}
        <BreadcrumbItem accessibilityLabel="Home" icon={HomeIcon} href="/home" />
        <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage href="/settlements">
          Settlements
        </BreadcrumbItem>
      {/snippet}
    </Breadcrumb>
  </div>
</Story>

<!-- Story 2: Sizes -->
<Story name="Sizes" asChild>
  <div style="display: flex; flex-direction: column; gap: var(--spacing-5);">
    <Breadcrumb size="small">
      {#snippet children()}
        <BreadcrumbItem accessibilityLabel="Home" icon={HomeIcon} href="/home" />
        <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage href="/settlements">Settlements</BreadcrumbItem>
      {/snippet}
    </Breadcrumb>
    <Breadcrumb size="medium">
      {#snippet children()}
        <BreadcrumbItem icon={HomeIcon} href="/home" />
        <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage href="/settlements">Settlements</BreadcrumbItem>
      {/snippet}
    </Breadcrumb>
    <Breadcrumb size="large">
      {#snippet children()}
        <BreadcrumbItem icon={HomeIcon} href="/home" />
        <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage href="/settlements">Settlements</BreadcrumbItem>
      {/snippet}
    </Breadcrumb>
  </div>
</Story>

<!-- Story 3: Colors -->
<Story name="Colors" asChild>
  <div style="display: flex; flex-direction: column; gap: var(--spacing-5);">
    <div style:padding="var(--spacing-4)">
      <Breadcrumb size="medium" color="primary">
        {#snippet children()}
          <BreadcrumbItem accessibilityLabel="Home" icon={HomeIcon} href="/home" />
          <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
          <BreadcrumbItem isCurrentPage href="/settlements">Settlements</BreadcrumbItem>
        {/snippet}
      </Breadcrumb>
    </div>
    <div style:padding="var(--spacing-4)">
      <Breadcrumb size="medium" color="neutral">
        {#snippet children()}
          <BreadcrumbItem icon={HomeIcon} href="/home" />
          <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
          <BreadcrumbItem isCurrentPage href="/settlements">Settlements</BreadcrumbItem>
        {/snippet}
      </Breadcrumb>
    </div>
    <div
      style:padding="var(--spacing-4)"
      style:background-color="var(--surface-background-cloud-intense)"
    >
      <Breadcrumb size="medium" color="white">
        {#snippet children()}
          <BreadcrumbItem icon={HomeIcon} href="/home" />
          <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
          <BreadcrumbItem isCurrentPage href="/settlements">Settlements</BreadcrumbItem>
        {/snippet}
      </Breadcrumb>
    </div>
  </div>
</Story>

<!-- Story 4: BreadcrumbWrapMultiline -->
<Story name="BreadcrumbWrapMultiline" asChild>
  <div style="display: flex; flex-direction: column; gap: var(--spacing-5);">
    <div
      style:padding="var(--spacing-6)"
      style:width="350px"
      style:background-color="var(--surface-background-gray-intense)"
    >
      <Breadcrumb size="medium" color="primary">
        {#snippet children()}
          <BreadcrumbItem accessibilityLabel="Home" icon={HomeIcon} href="/home" />
          <BreadcrumbItem href="/item1">Item 1</BreadcrumbItem>
          <BreadcrumbItem href="/item2">Item 2</BreadcrumbItem>
          <BreadcrumbItem href="/item3">Item 3</BreadcrumbItem>
          <BreadcrumbItem href="/item4">Item 4</BreadcrumbItem>
          <BreadcrumbItem href="/item5">Item 5</BreadcrumbItem>
          <BreadcrumbItem href="/item6">Item 6</BreadcrumbItem>
          <BreadcrumbItem href="/item7">Item 7</BreadcrumbItem>
        {/snippet}
      </Breadcrumb>
    </div>
  </div>
</Story>

<!-- Story 5: ReactRouterUsage -->
<Story name="ReactRouterUsage" asChild>
  <div>
    <Breadcrumb size="medium" color="primary">
      {#snippet children()}
        {#each pathSegments as segment, i}
          {#if segment.icon}
            <BreadcrumbItem
              icon={HomeIcon}
              href={segment.path}
              accessibilityLabel="Home"
              isCurrentPage={i === pathSegments.length - 1}
              onClick={navigateTo(segment.path)}
            />
          {:else}
            <BreadcrumbItem
              href={segment.path}
              isCurrentPage={i === pathSegments.length - 1}
              onClick={navigateTo(segment.path)}
            >
              {segment.label}
            </BreadcrumbItem>
          {/if}
        {/each}
      {/snippet}
    </Breadcrumb>

    <div
      style:margin-top="var(--spacing-5)"
      style:padding="var(--spacing-4)"
      style:border="1px solid var(--surface-border-gray-muted)"
      style:border-radius="var(--border-radius-medium)"
    >
      <p style:margin="0 0 var(--spacing-4) 0">
        <strong>Current path:</strong> {currentPath}
      </p>
      <p style:margin="0 0 var(--spacing-2) 0">
        You can use Breadcrumbs with your router to create a breadcrumb trail for your app.
      </p>
      <p style:margin="var(--spacing-4) 0 var(--spacing-3) 0">
        <strong>Trigger URL Change:</strong>
      </p>
      <div style="display: flex; flex-direction: column; gap: var(--spacing-2);">
        <a href={urls.home} onclick={navigateTo(urls.home)}>Home</a>
        <a href={urls.products} onclick={navigateTo(urls.products)}>Products</a>
        <a href={urls.payments} onclick={navigateTo(urls.payments)}>Payments</a>
        <a href={urls.intPayments} onclick={navigateTo(urls.intPayments)}>International Payments</a>
        <a
          href={urls.acceptIntPayments}
          onclick={navigateTo(urls.acceptIntPayments)}
        >
          Accept International Payments
        </a>
      </div>
    </div>
  </div>
</Story>

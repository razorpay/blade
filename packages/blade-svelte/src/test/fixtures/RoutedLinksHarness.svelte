<script lang="ts">
  import { provideAdapters } from '../../adapters';
  import Avatar from '../../components/avatar/Avatar.svelte';
  import Breadcrumb from '../../components/breadcrumb/Breadcrumb.svelte';
  import BreadcrumbItem from '../../components/breadcrumb/BreadcrumbItem.svelte';
  import Card from '../../components/card/Card.svelte';
  import TabItem from '../../components/tabs/TabItem.svelte';
  import Tabs from '../../components/tabs/Tabs.svelte';

  interface Props {
    navigate?: (href: string, event: MouseEvent) => boolean;
  }

  let { navigate }: Props = $props();

  // svelte-ignore state_referenced_locally
  provideAdapters({ navigate });
</script>

<!-- jsdom cannot navigate: the form of the click is what the tests read. -->
<div
  role="presentation"
  onclick={(event) => {
    document.body.dataset.prevented = String(event.defaultPrevented);
    event.preventDefault();
  }}
>
  <Tabs accessibilityLabel="Sections">
    {#snippet tabList()}
      <TabItem value="orders" href="/orders">Orders</TabItem>
    {/snippet}
  </Tabs>
  <Card href="/bank" accessibilityLabel="HDFC">HDFC Bank</Card>
  <Card href="https://razorpay.com" target="_blank" accessibilityLabel="Razorpay">Razorpay</Card>
  <Avatar name="Ann Lee" href="/profile" />
  <Avatar name="Bo Ray" href="https://razorpay.com/bo" target="_blank" rel="nofollow" />
  <Breadcrumb emphasis="intense">
    <BreadcrumbItem href="/home">Home</BreadcrumbItem>
  </Breadcrumb>
</div>

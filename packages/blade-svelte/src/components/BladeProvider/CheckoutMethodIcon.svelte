<script lang="ts">
  // Exact SVGs from checkout home L0: app/v2/modules/{method}/assets/*-method.svg
  let {
    name,
    size = 20,
  }: {
    name: 'upi' | 'card' | 'netbanking' | 'emi' | 'paylater';
    size?: number;
  } = $props();
</script>

{#if name === 'upi'}
  <svg
    class="checkout-method-icon"
    width={size}
    height={size}
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M8.50456 6.38966L9.73877 0.749513L10.5481 0.749512L15.0772 8.80381L7.63598 15.2552L6.745 15.2581L7.73515 10.2652"
      stroke="currentColor"
      stroke-width="1.5"
    />
    <path
      d="M2.34272 15.2554L9.73967 8.35946L4.79963 0.750094L4.14249 0.74707L1.11604 15.2516L2.34272 15.2554Z"
      fill="currentColor"
      fill-opacity="0.09"
      stroke="currentColor"
      stroke-width="1.5"
    />
  </svg>
{:else if name === 'card'}
  <svg
    class="checkout-method-icon"
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      fill-opacity=".1"
      fill-rule="evenodd"
      d="M1.5 3.5h13v2h-13v-2Zm13 3.5v5.5h-13V7h13Z"
      clip-rule="evenodd"
    />
    <path
      fill="currentColor"
      fill-rule="evenodd"
      d="M0 2h16v12H0V2Zm1.5 1.5h13v2h-13v-2Zm13 3.5v5.5h-13V7h13Z"
      clip-rule="evenodd"
    />
  </svg>
{:else if name === 'netbanking'}
  <svg
    class="checkout-method-icon"
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M0 5.5V3L8 0L16 2.5V5.5H0ZM14.5 4V3.60279L8.04431 1.58538L1.60534 4H14.5Z"
      fill="currentColor"
    />
    <path
      d="M1.5 13.5V4.5H3V13.5H5.25V4.5H6.75V13.5H9.25V4.5H10.75V13.5H13V4.5H14.5V13.5H16V15H0V13.5H1.5Z"
      fill="currentColor"
    />
  </svg>
{:else if name === 'emi'}
  <svg
    class="checkout-method-icon"
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M2.5 7.5H13.5V13.5H2.5V7.5Z" fill="currentColor" fill-opacity="0.09" />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M5 2V0H3.5V2H1V15H15V2H12.5V0H11V2H5ZM13.5 3.5H2.5V6H13.5V3.5ZM2.5 13.5V7.5H13.5V13.5H2.5Z"
      fill="currentColor"
    />
  </svg>
{:else}
  <svg
    class="checkout-method-icon"
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      fill-opacity=".1"
      fill-rule="evenodd"
      d="M8 14.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13ZM7 3h1.5v4.7l3 2.7-1 1.2L7 8.3V3Z"
      clip-rule="evenodd"
    />
    <path fill="currentColor" d="M7 3v5.3l3.5 3.3 1-1.2-3-2.7V3H7Z" />
    <path
      fill="currentColor"
      fill-rule="evenodd"
      d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0Zm-1.5 0a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
      clip-rule="evenodd"
    />
  </svg>
{/if}

<style>
  .checkout-method-icon {
    display: block;
    flex-shrink: 0;
    color: var(--surface-icon-gray-normal);
  }
</style>

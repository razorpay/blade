<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Skeleton from './Skeleton.svelte';
  import Divider from '../Divider/Divider.svelte';

  const { Story } = defineMeta({
    title: 'Components/Skeleton',
    component: Skeleton,
    tags: ['autodocs'],
    args: {
      width: '100%',
      height: '50px',
      borderRadius: 'medium',
    },
    argTypes: {
      width: { control: 'text', description: 'CSS width value' },
      height: { control: 'text', description: 'CSS height value' },
      borderRadius: {
        control: 'text',
        description: 'Border radius token or CSS value',
      },
    },
  });
</script>

<script>
  let isLoadingComplex = $state(true);
  let isLoadingCard = $state(true);
  let isLoadingA11y = $state(true);
</script>

<!-- Story 1: Default -->
<Story name="Default" />

<!-- Story 2: Basic — Avatar + text line composition (3 cards) -->
<Story name="Basic" asChild>
  <div class="display-flex gap-spacing-3 padding-spacing-3 flex-wrap">
    {#each [1, 2, 3] as _}
      <div style="flex:1; display:flex; flex-direction:column; width:100%; padding:var(--spacing-5); border-radius:var(--border-radius-medium); background-color:var(--surface-background-gray-intense)">
        <div style="display:flex; flex-direction:row; align-items:center">
          <Skeleton
            width="60px"
            height="60px"
            borderRadius="max"
            flexShrink={0}
            marginRight="spacing.3"
          />
          <div style="width:100%; display:flex; flex-direction:column">
            <Skeleton
              borderRadius="medium"
              width="50%"
              height="30px"
              marginBottom="spacing.3"
            />
            <Skeleton borderRadius="medium" width="70%" height="20px" />
          </div>
        </div>
        <div style="margin-top:var(--spacing-4); display:flex; flex-direction:column">
          <Skeleton borderRadius="medium" width="100%" height="20px" marginBottom="spacing.3" />
          <Skeleton borderRadius="medium" width="100%" height="20px" marginBottom="spacing.3" />
          <Skeleton borderRadius="medium" width="90%" height="20px" />
        </div>
      </div>
    {/each}
  </div>
</Story>

<!-- Story 3: Complex — Two-card layout with loading toggle -->
<Story name="Complex" asChild>
  <div>
    <button onclick={() => (isLoadingComplex = !isLoadingComplex)} style="margin-bottom:var(--spacing-4); padding:var(--spacing-3) var(--spacing-5); border:1px solid var(--interactive-border-gray-default); border-radius:var(--border-radius-medium); background:var(--interactive-background-primary-default); color:var(--interactive-text-primary-normal); cursor:pointer">
      Toggle Loading
    </button>
    <p style="margin:var(--spacing-4) 0; color:var(--surface-text-gray-subtle)">
      Skeleton supports subset of Box properties like margin, padding, flex to help you position
      it as per your needs to compose more complex skeleton layouts.
    </p>
    <div style="margin:var(--spacing-4) 0; display:flex; flex-wrap:wrap; flex-direction:row; gap:var(--spacing-4)">
      {#each [1, 2] as _}
        <div style="flex:1; padding:var(--spacing-7); background:var(--surface-background-gray-intense); border-radius:var(--border-radius-medium); border:1px solid var(--surface-border-gray-muted)">
          {#if isLoadingComplex}
            <div style="display:flex; flex-direction:column">
              <div style="display:flex; flex-direction:column; margin-bottom:var(--spacing-3)">
                <Skeleton height="24px" width="50%" borderRadius="medium" marginBottom="spacing.3" />
                <Skeleton height="40px" width="30%" borderRadius="medium" marginBottom="spacing.3" />
                <Skeleton height="20px" width="50%" borderRadius="medium" />
              </div>
              <Skeleton height="65px" borderRadius="medium" marginBottom="spacing.3" />
              <div style="margin:var(--spacing-3) 0"></div>
              <Divider />
              <div style="margin-bottom:var(--spacing-4); margin-top:var(--spacing-3)"></div>
              <Skeleton height="20px" width="100%" borderRadius="medium" marginBottom="spacing.2" />
              <Skeleton height="20px" width="100%" borderRadius="medium" />
            </div>
          {:else}
            <div style="display:flex; flex-direction:column; gap:var(--spacing-3)">
              <h3 style="margin:0; color:var(--surface-text-gray-normal)">Total Repayable Amount</h3>
              <span style="font-size:1.5rem; font-weight:600; color:var(--surface-text-gray-normal)">$1,600.00</span>
              <p style="margin:0; color:var(--surface-text-gray-subtle)">
                Principal: <strong>$160.00</strong> Interest: <strong>$4.50</strong>
              </p>
              <div style="padding:var(--spacing-3); background:var(--feedback-background-information-subtle); border-radius:var(--border-radius-medium); color:var(--feedback-text-information-intense)">
                The interest charged will be deposited back to your bank account within a day of payment
              </div>
              <div style="margin-top:var(--spacing-3)"></div>
              <Divider />
              <div style="margin-bottom:var(--spacing-3)"></div>
              <p style="margin:0; color:var(--surface-text-gray-subtle)">
                The amount will be deducted in 3 installments from your settlement balance between Feb 18-20 on daily basis
              </p>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</Story>

<!-- Story 4: CardExample — Single card skeleton→content toggle -->
<Story name="CardExample" asChild>
  <div>
    <button onclick={() => (isLoadingCard = !isLoadingCard)} style="margin-bottom:var(--spacing-4); padding:var(--spacing-3) var(--spacing-5); border:1px solid var(--interactive-border-gray-default); border-radius:var(--border-radius-medium); background:var(--interactive-background-primary-default); color:var(--interactive-text-primary-normal); cursor:pointer">
      Toggle Loading
    </button>
    <p style="margin:var(--spacing-4) 0; color:var(--surface-text-gray-subtle)">
      You can also use Skeleton to show loading states for existing blade components by composing
      multiple Skeletons and laying them out via layout props.
    </p>
    <div style="width:400px; margin-top:var(--spacing-4)">
      {#if isLoadingCard}
        <div style="padding:var(--spacing-7); display:flex; gap:var(--spacing-2); flex-direction:column; background:var(--surface-background-gray-intense); box-shadow:var(--elevation-lowRaised); border-radius:var(--border-radius-medium)">
          <div style="margin-bottom:var(--spacing-4); display:flex; flex-direction:column; gap:var(--spacing-2)">
            <Skeleton width="100%" height="24px" borderRadius="medium" />
            <Skeleton width="50%" height="20px" borderRadius="medium" />
          </div>
          <Divider />
          <Skeleton marginTop="spacing.5" width="100%" height="100px" borderRadius="medium" />
        </div>
      {:else}
        <div style="padding:var(--spacing-7); background:var(--surface-background-gray-intense); border-radius:var(--border-radius-medium); border:1px solid var(--surface-border-gray-muted)">
          <div style="margin-bottom:var(--spacing-4)">
            <h3 style="margin:0 0 var(--spacing-2); color:var(--surface-text-gray-normal)">Payment Pages</h3>
            <p style="margin:0; font-size:0.875rem; color:var(--surface-text-gray-subtle)">Automated Receipts Enabled</p>
          </div>
          <Divider />
          <p style="margin:var(--spacing-4) 0 0; color:var(--surface-text-gray-subtle)">
            Razorpay Payment Pages is the easiest way to accept payments with a custom-branded
            online store. Accept international and domestic payments with automated payment
            receipts. Take your store online instantly with zero coding.
          </p>
        </div>
      {/if}
    </div>
  </div>
</Story>

<!-- Story 5: SkeletonAccessibility — aria-busy pattern demonstration -->
<Story name="SkeletonAccessibility" asChild>
  <div>
    <p style="margin-bottom:var(--spacing-4); color:var(--surface-text-gray-subtle)">
      To make Skeleton loader accessible and let consumers know that some content on the page is
      loading, you can wrap the section in a container with <code>aria-busy</code>.
    </p>

    <h3 style="margin:var(--spacing-5) 0; color:var(--surface-text-gray-normal)">
      Example: <code>aria-busy</code> pattern
    </h3>

    <button onclick={() => (isLoadingA11y = !isLoadingA11y)} style="margin-bottom:var(--spacing-4); padding:var(--spacing-3) var(--spacing-5); border:1px solid var(--interactive-border-gray-default); border-radius:var(--border-radius-medium); background:var(--interactive-background-primary-default); color:var(--interactive-text-primary-normal); cursor:pointer">
      Toggle Loading
    </button>

    <section aria-busy={isLoadingA11y}>
      <div style="width:50%; display:flex; gap:var(--spacing-3); flex-wrap:wrap">
        {#if isLoadingA11y}
          {#each [1, 2, 3] as _}
            <div style="flex:1; display:flex; flex-direction:column; width:100%; padding:var(--spacing-5); border-radius:var(--border-radius-medium); background-color:var(--surface-background-gray-intense)">
              <div style="display:flex; flex-direction:row; align-items:center">
                <Skeleton
                  width="60px"
                  height="60px"
                  borderRadius="max"
                  flexShrink={0}
                  marginRight="spacing.3"
                />
                <div style="width:100%; display:flex; flex-direction:column">
                  <Skeleton borderRadius="medium" width="50%" height="30px" marginBottom="spacing.3" />
                  <Skeleton borderRadius="medium" width="70%" height="20px" />
                </div>
              </div>
              <div style="margin-top:var(--spacing-4); display:flex; flex-direction:column">
                <Skeleton borderRadius="medium" width="100%" height="20px" marginBottom="spacing.3" />
                <Skeleton borderRadius="medium" width="100%" height="20px" marginBottom="spacing.3" />
                <Skeleton borderRadius="medium" width="90%" height="20px" />
              </div>
            </div>
          {/each}
        {:else}
          <p style="color:var(--surface-text-gray-normal)">Content loaded</p>
        {/if}
      </div>
    </section>
  </div>
</Story>

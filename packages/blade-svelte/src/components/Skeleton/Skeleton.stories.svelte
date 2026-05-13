<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Skeleton from './Skeleton.svelte';

  const STYLED_PROP_CATEGORY = 'StyledProps';

  const styledPropNames = [
    'width',
    'height',
    'minWidth',
    'minHeight',
    'maxWidth',
    'maxHeight',
    'margin',
    'marginTop',
    'marginBottom',
    'marginLeft',
    'marginRight',
    'marginX',
    'marginY',
    'top',
    'left',
    'bottom',
    'right',
  ];

  const styledPropArgTypes = Object.fromEntries(
    styledPropNames.map((name) => [
      name,
      {
        control: 'text',
        table: { category: STYLED_PROP_CATEGORY },
        name,
      },
    ]),
  );

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
      ...styledPropArgTypes,
      borderRadius: {
        control: 'select',
        options: [
          'none',
          '2xsmall',
          'xsmall',
          'small',
          'medium',
          'large',
          'xlarge',
          '2xlarge',
          'max',
          'round',
        ],
        table: { category: STYLED_PROP_CATEGORY },
      },
      testID: {
        control: 'text',
        description: 'Test ID for the skeleton element',
      },
    },
    parameters: {
      chromatic: { delay: 960 },
    },
  });
</script>

<script lang="ts">
  import Heading from '../Typography/Heading/Heading.svelte';
  import Text from '../Typography/Text/Text.svelte';
  import Code from '../Typography/Code/Code.svelte';
  import Button from '../Button/Button.svelte';
  import Amount from '../Amount/Amount.svelte';
  import Divider from '../Divider/Divider.svelte';

  let isComplexLoading = $state(true);
  let isCardLoading = $state(true);
  let isAccessibilityLoading = $state(true);
</script>

<Story
  name="Default"
  args={{ width: '100%', height: '50px', borderRadius: 'medium' }}
>
  {#snippet template(args)}
    <div
      class="display-flex gap-spacing-3 flex-wrap-wrap"
      style="padding: var(--spacing-3);"
    >
      <Skeleton {...args} />
    </div>
  {/snippet}
</Story>

<Story name="Basic" asChild>
  <div
    class="display-flex gap-spacing-3 flex-wrap-wrap"
    style="padding: var(--spacing-3);"
  >
    {#each [0, 1, 2] as _}
      <div
        class="display-flex flex-col"
        style="flex: 1; width: 100%; padding: var(--spacing-5); border-radius: var(--border-radius-medium); background-color: var(--surface-background-gray-intense);"
      >
        <div class="display-flex items-center">
          <Skeleton
            width="60px"
            height="60px"
            borderRadius="max"
            flexShrink={0}
            marginRight="spacing.3"
          />
          <div class="display-flex flex-col" style="width: 100%;">
            <Skeleton
              borderRadius="medium"
              width="50%"
              height="30px"
              marginBottom="spacing.3"
            />
            <Skeleton borderRadius="medium" width="70%" height="20px" />
          </div>
        </div>

        <div
          class="display-flex flex-col"
          style="margin-top: var(--spacing-4);"
        >
          <Skeleton
            borderRadius="medium"
            width="100%"
            height="20px"
            marginBottom="spacing.3"
          />
          <Skeleton
            borderRadius="medium"
            width="100%"
            height="20px"
            marginBottom="spacing.3"
          />
          <Skeleton borderRadius="medium" width="90%" height="20px" />
        </div>
      </div>
    {/each}
  </div>
</Story>

<Story name="Complex" asChild>
  <div>
    <Button onClick={() => (isComplexLoading = !isComplexLoading)}>
      Toggle Loading
    </Button>

    <Text marginY="spacing.4">
      Skeleton supports subset of Box properties like margin, padding, flex to help you position
      it as per your needs to compose more complex skeleton layouts.
    </Text>

    <div
      class="display-flex flex-wrap-wrap"
      style="margin-top: var(--spacing-4); margin-bottom: var(--spacing-4);"
    >
      <div style="flex: 1; margin-bottom: var(--spacing-4); margin-right: var(--spacing-4);">
        <div
          style="padding: var(--spacing-7); border-radius: var(--border-radius-medium); background-color: var(--surface-background-gray-intense); box-shadow: var(--elevation-low-raised);"
        >
          {#if isComplexLoading}
            <div
              class="display-flex flex-col"
              style="background-color: var(--surface-background-gray-intense);"
            >
              <div
                class="display-flex flex-col"
                style="margin-bottom: var(--spacing-3);"
              >
                <Skeleton
                  height="24px"
                  width="50%"
                  borderRadius="medium"
                  marginBottom="spacing.3"
                />
                <Skeleton
                  height="40px"
                  width="30%"
                  borderRadius="medium"
                  marginBottom="spacing.3"
                />
                <Skeleton height="20px" width="50%" borderRadius="medium" />
              </div>
              <Skeleton
                height="65px"
                borderRadius="medium"
                marginBottom="spacing.3"
              />
              <div style="margin-top: var(--spacing-3); margin-bottom: var(--spacing-3);"></div>
              <Divider />
              <div
                style="margin-top: var(--spacing-3); margin-bottom: var(--spacing-4);"
              ></div>
              <Skeleton
                height="20px"
                width="100%"
                borderRadius="medium"
                marginBottom="spacing.2"
              />
              <Skeleton height="20px" width="100%" borderRadius="medium" />
            </div>
          {:else}
            <div
              class="display-flex flex-col gap-spacing-3"
              style="background-color: var(--surface-background-gray-intense);"
            >
              <div class="display-flex flex-col gap-spacing-3">
                <Heading size="medium">Total Repayable Amount</Heading>
                <Amount size="large" value={160000} />
                <Text>
                  Principal:&nbsp;<Text as="span" weight="semibold"
                    >₹16000</Text
                  >&nbsp;Interest:&nbsp;<Text as="span" weight="semibold"
                    >₹450</Text
                  >
                </Text>
              </div>
              <div
                style="padding: var(--spacing-4); border-radius: var(--border-radius-medium); background-color: var(--feedback-background-information-subtle); border: 1px solid var(--feedback-border-information-subtle);"
              >
                <Text>
                  The interest charged will be deposited back to your bank account within a day of
                  payment
                </Text>
              </div>
              <div style="margin-top: var(--spacing-3);"></div>
              <Divider />
              <div style="margin-bottom: var(--spacing-3);"></div>
              <Text>
                The amount will be deducted in 3 installments from your settlement balance between
                Feb 18-20 on daily basis
              </Text>
            </div>
          {/if}
        </div>
      </div>
      <div style="flex: 1;">
        <div
          style="padding: var(--spacing-7); border-radius: var(--border-radius-medium); background-color: var(--surface-background-gray-intense); box-shadow: var(--elevation-low-raised);"
        >
          {#if isComplexLoading}
            <div
              class="display-flex flex-col"
              style="background-color: var(--surface-background-gray-intense);"
            >
              <div
                class="display-flex flex-col"
                style="margin-bottom: var(--spacing-3);"
              >
                <Skeleton
                  height="24px"
                  width="50%"
                  borderRadius="medium"
                  marginBottom="spacing.3"
                />
                <Skeleton
                  height="40px"
                  width="30%"
                  borderRadius="medium"
                  marginBottom="spacing.3"
                />
                <Skeleton height="20px" width="50%" borderRadius="medium" />
              </div>
              <Skeleton
                height="65px"
                borderRadius="medium"
                marginBottom="spacing.3"
              />
              <div style="margin-top: var(--spacing-3); margin-bottom: var(--spacing-3);"></div>
              <Divider />
              <div
                style="margin-top: var(--spacing-3); margin-bottom: var(--spacing-4);"
              ></div>
              <Skeleton
                height="20px"
                width="100%"
                borderRadius="medium"
                marginBottom="spacing.2"
              />
              <Skeleton height="20px" width="100%" borderRadius="medium" />
            </div>
          {:else}
            <div
              class="display-flex flex-col gap-spacing-3"
              style="background-color: var(--surface-background-gray-intense);"
            >
              <div class="display-flex flex-col gap-spacing-3">
                <Heading size="medium">Total Repayable Amount</Heading>
                <Amount size="large" value={160000} />
                <Text>
                  Principal:&nbsp;<Text as="span" weight="semibold"
                    >₹16000</Text
                  >&nbsp;Interest:&nbsp;<Text as="span" weight="semibold"
                    >₹450</Text
                  >
                </Text>
              </div>
              <div
                style="padding: var(--spacing-4); border-radius: var(--border-radius-medium); background-color: var(--feedback-background-information-subtle); border: 1px solid var(--feedback-border-information-subtle);"
              >
                <Text>
                  The interest charged will be deposited back to your bank account within a day of
                  payment
                </Text>
              </div>
              <div style="margin-top: var(--spacing-3);"></div>
              <Divider />
              <div style="margin-bottom: var(--spacing-3);"></div>
              <Text>
                The amount will be deducted in 3 installments from your settlement balance between
                Feb 18-20 on daily basis
              </Text>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</Story>

<Story name="CardExample" asChild>
  <div>
    <Button onClick={() => (isCardLoading = !isCardLoading)}>
      Toggle Loading
    </Button>
    <Text marginY="spacing.4">
      You can also use Skeleton to show loading states for existing blade components by composing
      multiple Skeletons and laying them out via layout props.
    </Text>
    <div style="width: 400px; margin-top: var(--spacing-4);">
      {#if isCardLoading}
        <div
          class="display-flex flex-col gap-spacing-2"
          style="padding: var(--spacing-7); background-color: var(--surface-background-gray-intense); border-radius: var(--border-radius-medium); box-shadow: var(--elevation-low-raised);"
        >
          <div
            class="display-flex flex-col gap-spacing-2"
            style="margin-bottom: var(--spacing-4);"
          >
            <Skeleton width="100%" height="24px" borderRadius="medium" />
            <Skeleton width="50%" height="20px" borderRadius="medium" />
          </div>
          <Divider />
          <Skeleton
            marginTop="spacing.5"
            width="100%"
            height="100px"
            borderRadius="medium"
          />
        </div>
      {:else}
        <div
          style="padding: var(--spacing-5); background-color: var(--surface-background-gray-intense); border-radius: var(--border-radius-medium); box-shadow: var(--elevation-low-raised);"
        >
          <div
            class="display-flex items-start justify-between"
            style="margin-bottom: var(--spacing-4); gap: var(--spacing-3);"
          >
            <div class="display-flex flex-col">
              <Heading size="medium">Payment Pages</Heading>
              <Text size="small" color="surface.text.gray.muted">
                Automated Receipts Enabled
              </Text>
            </div>
            <span
              style="display: inline-flex; align-items: center; padding: 0 var(--spacing-2); border-radius: var(--border-radius-medium); background-color: var(--interactive-background-gray-faded); color: var(--interactive-text-gray-normal); font-size: 12px; height: 20px;"
            >
              UPI
            </span>
          </div>
          <Text>
            Razorpay Payment Pages is the easiest way to accept payments with a custom-branded
            online store. Accept international and domestic payments with automated payment
            receipts. Take your store online instantly with zero coding.
          </Text>
        </div>
      {/if}
    </div>
  </div>
</Story>

<Story name="SkeletonAccessibility" asChild>
  <div>
    <Text marginBottom="spacing.4">
      To make Skeleton loader accessible and let consumers know that some content on the page is
      loading there are few options:
    </Text>
    <ul style="margin: 0; padding-left: var(--spacing-5);">
      <li>
        <Text as="span">
          If you have a section of the page which is loading you can wrap the whole section in a
          div and set
        </Text>
        <Code size="medium">aria-busy</Code>
        <Text as="span">to indicate the content is loading</Text>
      </li>
      <li>
        <Text as="span">
          If you are using a button which triggers a loading state and you've set
        </Text>
        <Code size="medium">&lt;Button isLoading /&gt;</Code>
        <Text as="span">
          , you do not need to do anything because button already announces the loading state
        </Text>
      </li>
      <li>
        <Text as="span">
          Finally, if you want to announce a page level loading state you can utilize the
        </Text>
        <Code size="medium">announce()</Code>
        <Text as="span">method exposed by blade to convey the loading state to the user.</Text>
      </li>
    </ul>

    <Heading marginY="spacing.5">
      Example 1:&nbsp;<Code size="medium">announce()</Code>&nbsp;method
    </Heading>
    <Button onClick={() => (isAccessibilityLoading = !isAccessibilityLoading)}>
      Toggle Loading
    </Button>
    <div style="width: 400px; margin-top: var(--spacing-4);">
      {#if isAccessibilityLoading}
        <div
          class="display-flex flex-col gap-spacing-2"
          style="padding: var(--spacing-7); background-color: var(--surface-background-gray-intense); border-radius: var(--border-radius-medium); box-shadow: var(--elevation-low-raised);"
        >
          <div
            class="display-flex flex-col gap-spacing-2"
            style="margin-bottom: var(--spacing-4);"
          >
            <Skeleton width="100%" height="24px" borderRadius="medium" />
            <Skeleton width="50%" height="20px" borderRadius="medium" />
          </div>
          <Divider />
          <Skeleton
            marginTop="spacing.5"
            width="100%"
            height="100px"
            borderRadius="medium"
          />
        </div>
      {:else}
        <div
          style="padding: var(--spacing-5); background-color: var(--surface-background-gray-intense); border-radius: var(--border-radius-medium); box-shadow: var(--elevation-low-raised);"
        >
          <div
            class="display-flex items-start justify-between"
            style="margin-bottom: var(--spacing-4); gap: var(--spacing-3);"
          >
            <div class="display-flex flex-col">
              <Heading size="medium">Payment Pages</Heading>
              <Text size="small" color="surface.text.gray.muted">
                Automated Receipts Enabled
              </Text>
            </div>
            <span
              style="display: inline-flex; align-items: center; padding: 0 var(--spacing-2); border-radius: var(--border-radius-medium); background-color: var(--interactive-background-gray-faded); color: var(--interactive-text-gray-normal); font-size: 12px; height: 20px;"
            >
              UPI
            </span>
          </div>
          <Text>
            Razorpay Payment Pages is the easiest way to accept payments with a custom-branded
            online store. Accept international and domestic payments with automated payment
            receipts. Take your store online instantly with zero coding.
          </Text>
        </div>
      {/if}
    </div>

    <Heading marginY="spacing.5">Example 2: aria-busy method</Heading>

    <section aria-busy={isAccessibilityLoading}>
      <div
        class="display-flex gap-spacing-3 flex-wrap-wrap"
        style="width: 50%;"
      >
        {#if isAccessibilityLoading}
          {#each [0, 1, 2] as _}
            <div
              class="display-flex flex-col"
              style="flex: 1; width: 100%; padding: var(--spacing-5); border-radius: var(--border-radius-medium); background-color: var(--surface-background-gray-intense);"
            >
              <div class="display-flex items-center">
                <Skeleton
                  width="60px"
                  height="60px"
                  borderRadius="max"
                  flexShrink={0}
                  marginRight="spacing.3"
                />
                <div class="display-flex flex-col" style="width: 100%;">
                  <Skeleton
                    borderRadius="medium"
                    width="50%"
                    height="30px"
                    marginBottom="spacing.3"
                  />
                  <Skeleton borderRadius="medium" width="70%" height="20px" />
                </div>
              </div>
              <div
                class="display-flex flex-col"
                style="margin-top: var(--spacing-4);"
              >
                <Skeleton
                  borderRadius="medium"
                  width="100%"
                  height="20px"
                  marginBottom="spacing.3"
                />
                <Skeleton
                  borderRadius="medium"
                  width="100%"
                  height="20px"
                  marginBottom="spacing.3"
                />
                <Skeleton borderRadius="medium" width="90%" height="20px" />
              </div>
            </div>
          {/each}
        {:else}
          <Text>Content loaded</Text>
        {/if}
      </div>
    </section>
  </div>
</Story>

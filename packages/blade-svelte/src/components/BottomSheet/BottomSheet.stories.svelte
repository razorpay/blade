<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import BottomSheet from './BottomSheet.svelte';
  import type { BottomSheetProps } from './types';

  /* Storybook title MUST match the React export verbatim:
   *   blade/src/components/BottomSheet/BottomSheet.stories.tsx → 'Components/BottomSheet'. */
  const { Story } = defineMeta({
    title: 'Components/BottomSheet',
    component: BottomSheet,
    tags: ['autodocs'],
    args: {
      isOpen: undefined,
      snapPoints: undefined,
      isDismissible: true,
      title: 'Address Details',
      subtitle: 'Saving addresses will improve your checkout experience',
      showBackButton: false,
    },
    argTypes: {
      isOpen: { table: { disable: true } },
      children: { table: { disable: true } },
      onDismiss: { table: { disable: true } },
      initialFocusRef: { table: { disable: true } },
      isDismissible: { control: 'boolean' },
      zIndex: { control: 'number' },
      title: {
        control: 'text',
        table: { category: 'Header Props' },
      },
      subtitle: {
        control: 'text',
        table: { category: 'Header Props' },
      },
      showBackButton: {
        control: 'boolean',
        table: { category: 'Header Props' },
      },
    },
  } as Parameters<typeof defineMeta>[0] & { argTypes: Record<string, unknown> });
</script>

<script lang="ts">
  import BottomSheetHeader from './BottomSheetHeader.svelte';
  import BottomSheetBody from './BottomSheetBody.svelte';
  import BottomSheetFooter from './BottomSheetFooter.svelte';
  import Button from '../Button/Button.svelte';
  import Text from '../Typography/Text/Text.svelte';
  import Heading from '../Typography/Heading/Heading.svelte';
  import Badge from '../Badge/Badge.svelte';
  import Counter from '../Counter/Counter.svelte';
  import Link from '../Link/Link.svelte';

  /* Playground story state — separate from product-demo stories. */
  let isPlaygroundOpen = $state(false);

  /* Default story state (one bucket per story to keep them independent). */
  let isDefaultOpen = $state(false);
  let isHeaderFooterOpen = $state(false);
  let isSingleSelectOpen = $state(false);
  let isDropdownButtonOpen = $state(false);
  let dropdownButtonStatus = $state('approve');
  let isMultiSelectOpen = $state(false);
  let isSectionsSelectOpen = $state(false);
  let multiSelectChosen = $state<Set<string>>(new Set());
  let stackingFirstOpen = $state(false);
  let stackingSecondOpen = $state(false);
  let stackingThirdOpen = $state(false);
  let isInitialFocusOpen = $state(false);
  let isZeroPaddingOpen = $state(false);
  let isCustomSnapOpen = $state(false);
  let isOTPOpen = $state(false);
  let isOTPLoading = $state(false);
  let isProductOpen = $state(false);
  let productSelectedSim = $state<string | undefined>();
  let productSimError = $state<string | undefined>();
  let isNonDismissibleOpen = $state(false);

  let initialFocusInputEl: HTMLInputElement | null = $state(null);

  function toggleMulti(item: string): void {
    const next = new Set(multiSelectChosen);
    if (next.has(item)) next.delete(item);
    else next.add(item);
    multiSelectChosen = next;
  }

  const cuisines = [
    'Chinese',
    'Italian',
    'Mexican',
    'Indian',
    'Thai',
    'French',
    'Japanese',
    'Spanish',
    'Middle Eastern',
    'Korean',
    'Greek',
    'Vietnamese',
    'Brazilian',
    'Moroccan',
    'Caribbean',
    'Turkish',
    'Lebanese',
    'Malaysian',
    'Indonesian',
    'Peruvian',
    'Ethiopian',
    'Filipino',
    'Cuban',
    'German',
    'Nigerian',
  ];

  const cuisineSections = [
    {
      title: 'Asia',
      items: ['Chinese', 'Indian', 'Thai', 'Japanese', 'Korean', 'Vietnamese', 'Malaysian', 'Indonesian'],
    },
    { title: 'Europe', items: ['Italian', 'French', 'Spanish', 'Greek', 'German'] },
    { title: 'North America', items: ['Mexican', 'Caribbean'] },
    { title: 'South America', items: ['Brazilian', 'Peruvian'] },
    { title: 'Africa', items: ['Middle Eastern', 'Moroccan', 'Ethiopian', 'Nigerian'] },
  ];

  const fruits = [
    'Apple', 'Apricot', 'Avocado', 'Banana', 'Blackberry', 'Blueberry', 'Cherry', 'Coconut',
    'Cucumber', 'Durian', 'Dragonfruit', 'Fig', 'Gooseberry', 'Grape', 'Guava', 'Jackfruit',
    'Plum', 'Kiwifruit', 'Kumquat', 'Lemon', 'Lime', 'Mango', 'Watermelon', 'Mulberry',
    'Orange', 'Papaya', 'Passionfruit', 'Peach', 'Pear', 'Persimmon', 'Pineapple', 'Pineberry',
    'Quince', 'Raspberry', 'Soursop', 'Star fruit', 'Strawberry', 'Tamarind', 'Yuzu',
  ];

  const phoneNumbers = ['1234567890', '0987654321'];

  function submitOTP(): void {
    isOTPLoading = true;
    setTimeout(() => {
      isOTPLoading = false;
      isOTPOpen = false;
    }, 2000);
  }

  function selectSim(value: string): void {
    productSelectedSim = value;
    productSimError = undefined;
  }

  function verifySim(): void {
    if (!productSelectedSim) {
      productSimError = 'Please select a SIM to verify mobile number';
      return;
    }
    productSimError = undefined;
  }
</script>

{#snippet actionListSubstitute(items: string[], selectionType: 'none' | 'single' | 'multi')}
  <ul style="list-style: none; padding: 0; margin: 0;" role="listbox">
    {#each items as item}
      <li role="presentation">
        <button
          type="button"
          role={selectionType === 'multi' ? 'option' : undefined}
          aria-selected={selectionType === 'multi' ? multiSelectChosen.has(item) : undefined}
          onclick={() => selectionType === 'multi' && toggleMulti(item)}
          style="display: flex; align-items: center; gap: var(--spacing-3); padding: var(--spacing-3) var(--spacing-4); width: 100%; text-align: left; background: transparent; border: none; cursor: pointer; border-radius: var(--border-radius-medium); font-family: var(--font-family-text); font-size: var(--font-size-100);"
        >
          {item}
          {#if selectionType === 'multi' && multiSelectChosen.has(item)}
            <span style="margin-left: auto;">✓</span>
          {/if}
        </button>
      </li>
    {/each}
  </ul>
{/snippet}

<!-- Playground — controls drive BottomSheet + header props. -->
<Story name="Playground">
  {#snippet template(args: BottomSheetProps & { title?: string; subtitle?: string; showBackButton?: boolean })}
    <div>
      <Button onClick={() => (isPlaygroundOpen = true)}>Open</Button>
      <BottomSheet
        {...args}
        isOpen={isPlaygroundOpen}
        onDismiss={() => (isPlaygroundOpen = false)}
      >
        {#snippet children()}
          <BottomSheetHeader
            title={args.title ?? 'Address Details'}
            subtitle={args.subtitle ?? 'Saving addresses will improve your checkout experience'}
            showBackButton={args.showBackButton}
          />
          <BottomSheetBody>
            {#snippet children()}
              <Text>Use controls to tweak header props, isDismissible, and zIndex.</Text>
            {/snippet}
          </BottomSheetBody>
        {/snippet}
      </BottomSheet>
    </div>
  {/snippet}
</Story>

<!-- Story 1: Default — long Lorem Ipsum content + checkbox + Continue button. -->
<Story name="Default">
  {#snippet template()}
    <div>
      <Button onClick={() => (isDefaultOpen = true)}>{isDefaultOpen ? 'close' : 'open'}</Button>
      <Text marginY="spacing.11">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
        been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
        galley of type and scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
        It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
        passages, and more recently with desktop publishing software like Aldus PageMaker including
        versions of Lorem Ipsum.
      </Text>
      <Text marginY="spacing.11">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
        been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
        galley of type and scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
        It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
        passages, and more recently with desktop publishing software like Aldus PageMaker including
        versions of Lorem Ipsum.
      </Text>
      <Text marginY="spacing.11">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
        been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
        galley of type and scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
        It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
        passages, and more recently with desktop publishing software like Aldus PageMaker including
        versions of Lorem Ipsum.
      </Text>
      <Text marginY="spacing.11">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
        been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
        galley of type and scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
        It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
        passages, and more recently with desktop publishing software like Aldus PageMaker including
        versions of Lorem Ipsum.
      </Text>
      <Text marginY="spacing.11">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
        been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
        galley of type and scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
        It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
        passages, and more recently with desktop publishing software like Aldus PageMaker including
        versions of Lorem Ipsum.
      </Text>
      <BottomSheet isOpen={isDefaultOpen} onDismiss={() => (isDefaultOpen = false)}>
        {#snippet children()}
          <BottomSheetHeader title="Terms & Conditions" subtitle="Read carefully before accepting." />
          <BottomSheetBody>
            {#snippet children()}
              <ul>
                <li>
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                  Ipsum has been the industry's standard dummy text ever since the 1500s, when an
                  unknown printer took a galley of type and scrambled it to make a type specimen book.
                </li>
                <li>
                  It is a long established fact that a reader will be distracted by the readable
                  content of a page when looking at its layout.
                </li>
                <li>
                  Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in
                  a piece of classical Latin literature from 45 BC, making it over 2000 years old.
                </li>
                <li>
                  The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for
                  those interested.
                </li>
              </ul>
            {/snippet}
          </BottomSheetBody>
          <BottomSheetFooter>
            {#snippet children()}
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <label style="display: flex; align-items: center; gap: var(--spacing-2);">
                  <input type="checkbox" />
                  I accept terms and condition
                </label>
                <Button>Continue</Button>
              </div>
            {/snippet}
          </BottomSheetFooter>
        {/snippet}
      </BottomSheet>
    </div>
  {/snippet}
</Story>

<!-- Story 2: With Header Footer — controls drive the header props. -->
<Story name="With Header Footer" args={{ ...({} as Partial<BottomSheetProps>) }}>
  {#snippet template(args: BottomSheetProps & { title?: string; subtitle?: string; showBackButton?: boolean })}
    <div>
      <Text marginBottom="spacing.4">Play around with the Header props in the storybook controls panel</Text>
      <Button onClick={() => (isHeaderFooterOpen = true)}>Open</Button>
      <BottomSheet
        {...args}
        isOpen={isHeaderFooterOpen}
        onDismiss={() => (isHeaderFooterOpen = false)}
      >
        {#snippet children()}
          <BottomSheetHeader
            title={args.title ?? 'Address Details'}
            subtitle={args.subtitle ?? 'Saving addresses will improve your checkout experience'}
            showBackButton={args.showBackButton}
          >
            {#snippet trailing()}
              <Badge color="positive">Action Needed</Badge>
            {/snippet}
            {#snippet titleSuffix()}
              <Counter value={12} color="positive" />
            {/snippet}
          </BottomSheetHeader>
          <BottomSheetBody>
            {#snippet children()}
              <fieldset style="border: none; padding: 0; margin: 0;">
                <legend style="font-weight: 600; margin-bottom: var(--spacing-3);">Addresses</legend>
                <label style="display: flex; gap: var(--spacing-3); padding: var(--spacing-3) 0;">
                  <input type="radio" name="story2-addr" value="home" />
                  Home - 11850 Florida 24, Cedar Key, Florida
                </label>
                <label style="display: flex; gap: var(--spacing-3); padding: var(--spacing-3) 0;">
                  <input type="radio" name="story2-addr" value="office-1" />
                  Office - 2033 Florida 21, Cedar Key, Florida
                </label>
                <label style="display: flex; gap: var(--spacing-3); padding: var(--spacing-3) 0;">
                  <input type="radio" name="story2-addr" value="office-2" />
                  Work - 5938 New York, Main Street
                </label>
              </fieldset>
            {/snippet}
          </BottomSheetBody>
          <BottomSheetFooter>
            {#snippet children()}
              <Button variant="tertiary" isFullWidth>Remove address</Button>
              <div style="height: var(--spacing-5);"></div>
              <Button isFullWidth>Add address</Button>
            {/snippet}
          </BottomSheetFooter>
        {/snippet}
      </BottomSheet>
    </div>
  {/snippet}
</Story>

<!-- Story 3: With Dropdown Single Select — substituted (Dropdown not migrated). -->
<Story name="With Dropdown Single Select">
  {#snippet template()}
    <div>
      <Button onClick={() => (isSingleSelectOpen = true)}>Sort Dishes</Button>
      <BottomSheet isOpen={isSingleSelectOpen} onDismiss={() => (isSingleSelectOpen = false)}>
        {#snippet children()}
          <BottomSheetHeader title="Sort By" />
          <BottomSheetBody hasActionList>
            {#snippet children()}
              {@render actionListSubstitute(
                ['Relevance (Default)', 'Delivery Time', 'Rating', 'Cost: Low to High', 'Cost: High to Low'],
                'none',
              )}
            {/snippet}
          </BottomSheetBody>
        {/snippet}
      </BottomSheet>
    </div>
  {/snippet}
</Story>

<!-- Story 4: With Dropdown Button — substituted. -->
<Story name="With Dropdown Button">
  {#snippet template()}
    <div style="min-height: 200px;">
      <Button variant="tertiary" onClick={() => (isDropdownButtonOpen = true)}>
        Status: {dropdownButtonStatus}
      </Button>
      <BottomSheet isOpen={isDropdownButtonOpen} onDismiss={() => (isDropdownButtonOpen = false)}>
        {#snippet children()}
          <BottomSheetHeader />
          <BottomSheetBody hasActionList>
            {#snippet children()}
              <ul style="list-style: none; padding: 0; margin: 0;" role="listbox">
                {#each ['approve', 'in-progress', 'reject'] as status}
                  <li role="presentation">
                    <button
                      type="button"
                      role="option"
                      aria-selected={dropdownButtonStatus === status}
                      onclick={() => {
                        dropdownButtonStatus = status;
                        isDropdownButtonOpen = false;
                      }}
                      style="display: flex; align-items: center; gap: var(--spacing-3); padding: var(--spacing-3) var(--spacing-4); width: 100%; text-align: left; background: transparent; border: none; cursor: pointer; border-radius: var(--border-radius-medium); font-family: var(--font-family-text); font-size: var(--font-size-100);"
                    >
                      {status === 'approve' ? 'Approve' : status === 'in-progress' ? 'In Progress' : 'Reject'}
                    </button>
                  </li>
                {/each}
              </ul>
            {/snippet}
          </BottomSheetBody>
        {/snippet}
      </BottomSheet>
    </div>
  {/snippet}
</Story>

<!-- Story 5: With Dropdown Multi Select — substituted. -->
<Story name="With Dropdown Multi Select">
  {#snippet template()}
    <div>
      <Button onClick={() => (isMultiSelectOpen = true)}>Cuisines Filter</Button>
      <BottomSheet isOpen={isMultiSelectOpen} onDismiss={() => (isMultiSelectOpen = false)}>
        {#snippet children()}
          <BottomSheetHeader title="Filter By Cuisines" />
          <BottomSheetBody hasActionList>
            {#snippet children()}
              {@render actionListSubstitute(cuisines, 'multi')}
            {/snippet}
          </BottomSheetBody>
        {/snippet}
      </BottomSheet>
    </div>
  {/snippet}
</Story>

<!-- Story 6: With Dropdown Sections Select — substituted. -->
<Story name="With Dropdown Sections Select">
  {#snippet template()}
    <div>
      <Button onClick={() => (isSectionsSelectOpen = true)}>Cuisines Filter</Button>
      <BottomSheet isOpen={isSectionsSelectOpen} onDismiss={() => (isSectionsSelectOpen = false)}>
        {#snippet children()}
          <BottomSheetHeader title="Filter By Cuisines" />
          <BottomSheetBody hasActionList>
            {#snippet children()}
              {#each cuisineSections as section}
                <div style="margin-bottom: var(--spacing-4);">
                  <h6 style="margin: 0 0 var(--spacing-2) 0; padding: 0 var(--spacing-4); font-size: var(--font-size-75); color: var(--surface-text-gray-muted); text-transform: uppercase; letter-spacing: 0.05em;">
                    {section.title}
                  </h6>
                  {@render actionListSubstitute(section.items, 'multi')}
                </div>
              {/each}
            {/snippet}
          </BottomSheetBody>
        {/snippet}
      </BottomSheet>
    </div>
  {/snippet}
</Story>

<!-- Story 7: Bottom Sheet Stacking — three independent sheets. -->
<Story name="Bottom Sheet Stacking">
  {#snippet template()}
    <div>
      <div style="display: flex; gap: var(--spacing-2); flex-wrap: wrap;">
        <Button onClick={() => (stackingFirstOpen = true)}>Open 1st BottomSheet</Button>
        <Button onClick={() => (stackingSecondOpen = true)}>Open 2nd BottomSheet</Button>
        <Button onClick={() => (stackingThirdOpen = true)}>Open 3rd BottomSheet</Button>
      </div>

      <BottomSheet isOpen={stackingFirstOpen} onDismiss={() => (stackingFirstOpen = false)}>
        {#snippet children()}
          <BottomSheetHeader title="1. Saved Address" />
          <BottomSheetBody>
            {#snippet children()}
              <fieldset style="border: none; padding: 0; margin: 0;">
                <legend style="font-weight: 600; margin-bottom: var(--spacing-3);">Addresses</legend>
                <label style="display: block; padding: var(--spacing-2) 0;">
                  <input type="radio" name="stack1-addr" value="home" />
                  Home - 11850 Florida 24, Cedar Key, Florida
                </label>
                <label style="display: block; padding: var(--spacing-2) 0;">
                  <input type="radio" name="stack1-addr" value="office" />
                  Office - 2033 Florida 21, Cedar Key, Florida
                </label>
              </fieldset>
            {/snippet}
          </BottomSheetBody>
          <BottomSheetFooter>
            {#snippet children()}
              <Button
                variant="tertiary"
                isDisabled={stackingSecondOpen}
                onClick={() => (stackingSecondOpen = true)}
              >
                Open 2nd BottomSheet
              </Button>
              <div style="height: var(--spacing-5);"></div>
              <Button isDisabled={stackingThirdOpen} onClick={() => (stackingThirdOpen = true)}>
                Open third BottomSheet
              </Button>
            {/snippet}
          </BottomSheetFooter>
        {/snippet}
      </BottomSheet>

      <BottomSheet isOpen={stackingSecondOpen} onDismiss={() => (stackingSecondOpen = false)}>
        {#snippet children()}
          <BottomSheetHeader title="2. Sort By" />
          <BottomSheetBody hasActionList>
            {#snippet children()}
              {@render actionListSubstitute(cuisines, 'none')}
            {/snippet}
          </BottomSheetBody>
          <BottomSheetFooter>
            {#snippet children()}
              <Button
                variant="tertiary"
                isDisabled={stackingFirstOpen}
                onClick={() => (stackingFirstOpen = true)}
              >
                Open 1st BottomSheet
              </Button>
              <div style="height: var(--spacing-5);"></div>
              <Button isDisabled={stackingThirdOpen} onClick={() => (stackingThirdOpen = true)}>
                Open 3rd BottomSheet
              </Button>
            {/snippet}
          </BottomSheetFooter>
        {/snippet}
      </BottomSheet>

      <BottomSheet isOpen={stackingThirdOpen} onDismiss={() => (stackingThirdOpen = false)}>
        {#snippet children()}
          <BottomSheetHeader title="3. Sort By" />
          <BottomSheetBody hasActionList>
            {#snippet children()}
              {#each cuisineSections as section}
                <div style="margin-bottom: var(--spacing-4);">
                  <h6 style="margin: 0 0 var(--spacing-2) 0; padding: 0 var(--spacing-4); font-size: var(--font-size-75); color: var(--surface-text-gray-muted); text-transform: uppercase;">
                    {section.title}
                  </h6>
                  {@render actionListSubstitute(section.items, 'none')}
                </div>
              {/each}
            {/snippet}
          </BottomSheetBody>
          <BottomSheetFooter>
            {#snippet children()}
              <Button
                variant="tertiary"
                isDisabled={stackingFirstOpen}
                onClick={() => (stackingFirstOpen = true)}
              >
                Open 1st BottomSheet
              </Button>
              <div style="height: var(--spacing-5);"></div>
              <Button isDisabled={stackingSecondOpen} onClick={() => (stackingSecondOpen = true)}>
                Open 2nd BottomSheet
              </Button>
            {/snippet}
          </BottomSheetFooter>
        {/snippet}
      </BottomSheet>
    </div>
  {/snippet}
</Story>

<!-- Story 8: Initial Focus — focuses an input via initialFocusElement. -->
<Story name="Initial Focus">
  {#snippet template()}
    <div>
      <Button onClick={() => (isInitialFocusOpen = true)}>Add address</Button>
      <BottomSheet
        isOpen={isInitialFocusOpen}
        onDismiss={() => (isInitialFocusOpen = false)}
        initialFocusRef={initialFocusInputEl}
      >
        {#snippet children()}
          <BottomSheetHeader title="Users" />
          <BottomSheetBody>
            {#snippet children()}
              <label style="display: block; margin-bottom: var(--spacing-3);">
                Search Users
                <input
                  bind:this={initialFocusInputEl}
                  type="text"
                  placeholder="Type a name…"
                  style="width: 100%; padding: var(--spacing-3); border: 1px solid var(--surface-border-gray-muted); border-radius: var(--border-radius-medium); margin-top: var(--spacing-2);"
                />
              </label>
              <Button>Search Users</Button>
              <Text marginTop="spacing.5">
                By default the initial focus is set to the close button, but you can modify it by passing the
                `initialFocusElement` prop
              </Text>
              <ul>
                <li>Anurag Hazra</li>
                <li>Kamlesh Chandnani</li>
                <li>Divyanshu Maithani</li>
              </ul>
            {/snippet}
          </BottomSheetBody>
        {/snippet}
      </BottomSheet>
    </div>
  {/snippet}
</Story>

<!-- Story 9: Zero Padding — body padding=spacing.0 with a banner + inner padded copy. -->
<Story name="Zero Padding">
  {#snippet template()}
    <div>
      <Button onClick={() => (isZeroPaddingOpen = true)}>Open</Button>
      <BottomSheet isOpen={isZeroPaddingOpen} onDismiss={() => (isZeroPaddingOpen = false)}>
        {#snippet children()}
          <BottomSheetHeader />
          <BottomSheetBody padding="spacing.0">
            {#snippet children()}
              <div style="display: flex; flex-direction: column;">
                <div style="position: relative; height: 250px; overflow: hidden; background: var(--surface-background-cloud-subtle);">
                  <div style="position: absolute; bottom: var(--spacing-4); left: var(--spacing-5);">
                    <Heading color="surface.text.gray.normal">All-in-one Escrow management platform</Heading>
                  </div>
                </div>
                <div style="padding: var(--spacing-5); display: flex; flex-direction: column;">
                  <Text>
                    We bring together Escrow account, Banks, Trusteeship services & Automation - all
                    in ONE place to deliver a seamless user experience for you. Work with our experts
                    to ensure your escrow money transfers are always compliant, safe & effortless.
                  </Text>
                  <Text marginTop="spacing.3" color="surface.text.gray.muted">
                    100% secure | Instant payouts | Unbeatable pricing
                  </Text>
                </div>
              </div>
            {/snippet}
          </BottomSheetBody>
          <BottomSheetFooter>
            {#snippet children()}
              <Button>Talk To Our Escrow Experts</Button>
            {/snippet}
          </BottomSheetFooter>
        {/snippet}
      </BottomSheet>
    </div>
  {/snippet}
</Story>

<!-- Story 10: Custom Snap Points — [0.5, 0.8, 1] + docs section. -->
<Story name="Custom Snap Points">
  {#snippet template()}
    <div>
      <div style="margin-bottom: var(--spacing-5);">
        <Text marginBottom="spacing.4">Example of Custom SnapPoints at [50%, 80%, 100%]</Text>
        <Button onClick={() => (isCustomSnapOpen = true)}>Cuisines Filter</Button>
        <BottomSheet
          isOpen={isCustomSnapOpen}
          onDismiss={() => (isCustomSnapOpen = false)}
          snapPoints={[0.5, 0.8, 1]}
        >
          {#snippet children()}
            <BottomSheetHeader title="Fruits" />
            <BottomSheetBody hasActionList>
              {#snippet children()}
                {@render actionListSubstitute(fruits, 'none')}
              {/snippet}
            </BottomSheetBody>
          {/snippet}
        </BottomSheet>
      </div>
      <Heading marginBottom="spacing.3">SnapPoint Behaviour</Heading>
      <div style="display: flex; gap: var(--spacing-2); flex-wrap: wrap;">
        <Text>By default BottomSheet's SnapPoints are</Text>
        <Text weight="semibold">[35%, 50%, 85%]</Text>
      </div>
      <Text>
        Below is the behaviour BottomSheet follows to inteligently open the content at the optimal
        SnapPoint initially
      </Text>

      <div style="margin-top: var(--spacing-3);">
        <Text weight="semibold">At SnapPoint 1: 35% Screen Height</Text>
        <ul>
          <li>If content height is less than 35% of screen height - then bottom sheet takes the height of the content.</li>
          <li>
            If content height is &gt;35% screen height (and &lt;50% of screen's height) - then
            bottom sheet's initial snap point should be 35%.
            <ul>
              <li>Bottom sheet will extend till the height of the content on upwards drag.</li>
            </ul>
          </li>
        </ul>

        <Text weight="semibold">At SnapPoint 2: 50% Screen Height</Text>
        <ul>
          <li>If content height &gt;35% but &lt;50% screen height - the bottom sheet extends till the height of the content.</li>
          <li>
            If content height &gt;50% (but &lt;85% screen height) then bottom sheet's initial snap
            point should be at 50% screen height.
            <ul>
              <li>The bottom sheet extends till the height of the content on upwards drag.</li>
            </ul>
          </li>
        </ul>

        <Text weight="semibold">At SnapPoint 3: 85% Screen Height</Text>
        <ul>
          <li>If content height &gt;50% but &lt;85% screen height - the bottom sheet extends till the height of the content.</li>
          <li>Bottom Sheet's height can extend maximum until 85% screen size.</li>
          <li>
            If content height &gt;85% of screen height then bottom sheet's initial snap point should
            be at 85% of screen height.
            <ul>
              <li>On further scroll or drag, contents scrolls internally.</li>
            </ul>
          </li>
        </ul>

        <Text>
          Checkout the
          <Link href="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=76785-1455819">design guideline</Link>
          here for more details
        </Text>
      </div>
    </div>
  {/snippet}
</Story>

<!-- Story 11: With OTP Input — substituted with native inputs. -->
<Story name="With OTP Input">
  {#snippet template()}
    <div>
      <Button onClick={() => (isOTPOpen = true)}>Open</Button>
      <BottomSheet isOpen={isOTPOpen} onDismiss={() => (isOTPOpen = false)}>
        {#snippet children()}
          <BottomSheetHeader title="1. Saved Address" />
          <BottomSheetBody>
            {#snippet children()}
              <div style="display: flex; flex-direction: column; align-items: center;">
                <div style="display: flex; gap: var(--spacing-2); margin-bottom: var(--spacing-5);">
                  {#each Array(6) as _, i}
                    <input
                      type="tel"
                      maxlength="1"
                      aria-label={`OTP digit ${i + 1}`}
                      style="width: 36px; height: 44px; text-align: center; font-size: var(--font-size-200); border: 1px solid var(--surface-border-gray-muted); border-radius: var(--border-radius-medium);"
                    />
                  {/each}
                </div>
                <Text>
                  By clicking "Submit OTP", I agree to <Link href="#">Terms and Conditions</Link>,
                  <Link href="#">Privacy Policy</Link>, and <Link href="#">Service Agreement</Link>.
                </Text>
              </div>
            {/snippet}
          </BottomSheetBody>
          <BottomSheetFooter>
            {#snippet children()}
              <Button variant="tertiary">Cancel</Button>
              <div style="height: var(--spacing-5);"></div>
              <Button isLoading={isOTPLoading} onClick={submitOTP}>Submit</Button>
            {/snippet}
          </BottomSheetFooter>
        {/snippet}
      </BottomSheet>
    </div>
  {/snippet}
</Story>

<!-- Story 12: Product Use Case 1 — SIM selection with validation. -->
<Story name="Product Use Case 1">
  {#snippet template()}
    <div>
      <Button onClick={() => (isProductOpen = true)}>{isProductOpen ? 'close' : 'open'}</Button>
      <BottomSheet
        isOpen={isProductOpen}
        onDismiss={() => {
          isProductOpen = false;
          productSelectedSim = undefined;
          productSimError = undefined;
        }}
      >
        {#snippet children()}
          <BottomSheetHeader
            title="Select SIM"
            showBackButton
            onBackButtonClick={() => (isProductOpen = false)}
          />
          <BottomSheetBody>
            {#snippet children()}
              <fieldset style="border: none; padding: 0; margin: 0;">
                <legend style="font-weight: 600; margin-bottom: var(--spacing-3);">
                  Please select a SIM to verify your mobile number
                </legend>
                {#each phoneNumbers as number}
                  <label
                    style="display: flex; gap: var(--spacing-3); padding: var(--spacing-3) 0; align-items: center;"
                  >
                    <input
                      type="radio"
                      name="product-sim"
                      value={number}
                      checked={productSelectedSim === number}
                      onchange={() => selectSim(number)}
                    />
                    {number}
                  </label>
                {/each}
                {#if productSimError}
                  <Text color="feedback.text.negative.intense">{productSimError}</Text>
                {/if}
              </fieldset>
            {/snippet}
          </BottomSheetBody>
          <BottomSheetFooter>
            {#snippet children()}
              <div style="display: flex; flex-direction: column; align-items: center; gap: var(--spacing-4);">
                <Button isDisabled={!productSelectedSim} onClick={verifySim}>Verify</Button>
                <Button variant="tertiary" onClick={() => (isProductOpen = false)}>Close</Button>
              </div>
            {/snippet}
          </BottomSheetFooter>
        {/snippet}
      </BottomSheet>
    </div>
  {/snippet}
</Story>

<!-- Story 13: Non-Dismissible BottomSheet — locked open, must use footer buttons.
     The exported storyName in React is verbatim "Non-Dismissible BottomSheet" — DO NOT change. -->
<Story name="Non-Dismissible BottomSheet">
  {#snippet template()}
    <div>
      <Button onClick={() => (isNonDismissibleOpen = true)}>Open Non-Dismissible BottomSheet</Button>
      <BottomSheet
        isOpen={isNonDismissibleOpen}
        isDismissible={false}
        snapPoints={[0.85, 0.85, 0.85]}
      >
        {#snippet children()}
          <BottomSheetHeader
            title="Important Action Required"
            subtitle="This action requires explicit confirmation"
          />
          <BottomSheetBody>
            {#snippet children()}
              <div style="margin-bottom: var(--spacing-4);">
                <Badge color="notice">Notice</Badge>
              </div>
              <Text marginBottom="spacing.4">
                This is a non-dismissible bottom sheet. Notice there's no close button (X) in the
                header. Try swiping down, tapping outside, or pressing the escape key - it won't
                close.
              </Text>
              <Text color="surface.text.gray.subtle">
                You must click one of the buttons below to proceed. This pattern is useful for
                critical actions that require explicit user confirmation.
              </Text>
            {/snippet}
          </BottomSheetBody>
          <BottomSheetFooter>
            {#snippet children()}
              <div style="display: flex; gap: var(--spacing-3); justify-content: flex-end; width: 100%;">
                <Button variant="secondary" onClick={() => (isNonDismissibleOpen = false)}>Cancel</Button>
                <Button onClick={() => (isNonDismissibleOpen = false)}>Confirm Action</Button>
              </div>
            {/snippet}
          </BottomSheetFooter>
        {/snippet}
      </BottomSheet>
    </div>
  {/snippet}
</Story>

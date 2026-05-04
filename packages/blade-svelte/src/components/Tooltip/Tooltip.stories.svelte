<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Tooltip from './Tooltip.svelte';

  const { Story } = defineMeta({
    title: 'Components/Tooltip',
    component: Tooltip,
    tags: ['autodocs'],
    args: {
      placement: 'bottom',
      content: 'Amount reversed to customer bank account',
    },
    argTypes: {
      content: {
        description: 'Body text rendered inside the tooltip bubble.',
        control: { type: 'text' },
        table: { category: 'Tooltip Props', type: { summary: 'string' } },
      },
      title: {
        description: 'Bold heading rendered above the content.',
        control: { type: 'text' },
        table: { category: 'Tooltip Props', type: { summary: 'string' } },
      },
      placement: {
        description: 'Position of the tooltip relative to its trigger.',
        options: [
          'top',
          'top-start',
          'top-end',
          'right',
          'bottom',
          'bottom-start',
          'bottom-end',
          'left',
        ],
        control: { type: 'select' },
        table: { category: 'Tooltip Props' },
      },
      zIndex: {
        description: 'z-index of the portal element hosting the bubble.',
        control: { type: 'number' },
        table: { category: 'Tooltip Props', type: { summary: 'number' } },
      },
      onOpenChange: {
        action: 'openChange',
        table: { category: 'Tooltip Props' },
      },
    },
  });
</script>

<script lang="ts">
  import Button from '../Button/Button.svelte';
  import Link from '../Link/Link.svelte';
  import Text from '../Typography/Text/Text.svelte';
  import Code from '../Typography/Code/Code.svelte';
  import { InfoIcon, BuildingIcon } from '../Icons';
  import TooltipInteractiveWrapper from './TooltipInteractiveWrapper.svelte';
</script>

<!-- Story 1: Default
     Uses `min-height: 100vh` (minus the iframe body padding) to mirror React's
     `<Center>` wrapper, which fills the storybook iframe height via
     `<Box width="100%" height="100%">` so the trigger is vertically centered. -->
<Story name="Default">
  {#snippet template(args)}
    <div class="tooltip-story-center">
      <Tooltip {...args}>
        {#snippet children()}
          <Button>Hover over me</Button>
        {/snippet}
      </Tooltip>
    </div>
  {/snippet}
</Story>

<!-- Story 2: With Title -->
<Story name="With Title" args={{ title: 'Refund successful' }}>
  {#snippet template(args)}
    <div class="tooltip-story-center">
      <Tooltip {...args}>
        {#snippet children()}
          <Button>Hover over me</Button>
        {/snippet}
      </Tooltip>
    </div>
  {/snippet}
</Story>

<!-- Story 3: Placement (mirrors React's 3-column placement layout)
     Notes:
     - Each column uses `align-items: stretch` so the Tooltip's inline-block
       trigger span stretches to the column's natural width. This makes all
       boxes in a column share the same width (matching React's PlacementBox
       with `flex={1}` + `width="100%"` under React's wrapper-less Tooltip).
     - The trigger span gets `flex:1` (via the `:global` rule in the <style>
       block at the bottom of this file) so columns with fewer boxes
       (top/bottom) still stretch boxes vertically to match the tallest column. -->
<Story name="Placement" asChild>
  <div class="tooltip-story-center">
    <div
      class="tooltip-placement-grid"
      style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:var(--spacing-4)"
    >
      <div
        class="tooltip-placement-column"
        style="display:flex;flex-direction:column;align-items:stretch;gap:var(--spacing-4)"
      >
        <Tooltip placement="top-start" content="Hello world">
          {#snippet children()}
            <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
            <div
              tabindex="0"
              style="display:flex;justify-content:center;align-items:center;height:100%;padding:var(--spacing-5);background:var(--surface-background-gray-moderate)"
            >
              <Text>top-start</Text>
            </div>
          {/snippet}
        </Tooltip>
        <Tooltip placement="left" content="Hello world">
          {#snippet children()}
            <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
            <div
              tabindex="0"
              style="display:flex;justify-content:center;align-items:center;height:100%;padding:var(--spacing-5);background:var(--surface-background-gray-moderate)"
            >
              <Text>left</Text>
            </div>
          {/snippet}
        </Tooltip>
        <Tooltip placement="bottom-start" content="Hello world">
          {#snippet children()}
            <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
            <div
              tabindex="0"
              style="display:flex;justify-content:center;align-items:center;height:100%;padding:var(--spacing-5);background:var(--surface-background-gray-moderate)"
            >
              <Text>bottom-start</Text>
            </div>
          {/snippet}
        </Tooltip>
      </div>
      <div
        class="tooltip-placement-column"
        style="display:flex;flex-direction:column;align-items:stretch;gap:var(--spacing-4)"
      >
        <Tooltip placement="top" content="Hello world">
          {#snippet children()}
            <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
            <div
              tabindex="0"
              style="display:flex;justify-content:center;align-items:center;height:100%;padding:var(--spacing-5);background:var(--surface-background-gray-moderate)"
            >
              <Text>top</Text>
            </div>
          {/snippet}
        </Tooltip>
        <Tooltip placement="bottom" content="Hello world">
          {#snippet children()}
            <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
            <div
              tabindex="0"
              style="display:flex;justify-content:center;align-items:center;height:100%;padding:var(--spacing-5);background:var(--surface-background-gray-moderate)"
            >
              <Text>bottom</Text>
            </div>
          {/snippet}
        </Tooltip>
      </div>
      <div
        class="tooltip-placement-column"
        style="display:flex;flex-direction:column;align-items:stretch;gap:var(--spacing-4)"
      >
        <Tooltip placement="top-end" content="Hello world">
          {#snippet children()}
            <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
            <div
              tabindex="0"
              style="display:flex;justify-content:center;align-items:center;height:100%;padding:var(--spacing-5);background:var(--surface-background-gray-moderate)"
            >
              <Text>top-end</Text>
            </div>
          {/snippet}
        </Tooltip>
        <Tooltip placement="right" content="Hello world">
          {#snippet children()}
            <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
            <div
              tabindex="0"
              style="display:flex;justify-content:center;align-items:center;height:100%;padding:var(--spacing-5);background:var(--surface-background-gray-moderate)"
            >
              <Text>right</Text>
            </div>
          {/snippet}
        </Tooltip>
        <Tooltip placement="bottom-end" content="Hello world">
          {#snippet children()}
            <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
            <div
              tabindex="0"
              style="display:flex;justify-content:center;align-items:center;height:100%;padding:var(--spacing-5);background:var(--surface-background-gray-moderate)"
            >
              <Text>bottom-end</Text>
            </div>
          {/snippet}
        </Tooltip>
      </div>
    </div>
  </div>
</Story>

<!-- Story 4: Non Interactive Trigger -->
<Story name="Non Interactive Trigger">
  {#snippet template(args)}
    <div>
      <Text>
        When using non-interactive elements as Tooltip triggers, like Icons, Badges, Counters
      </Text>
      <Text>You can wrap the element in TooltipInteractiveWrapper component provided by blade</Text>
      <div
        style="margin-top:var(--spacing-5);display:flex;align-items:center;gap:var(--spacing-2)"
      >
        <Text>Refunds</Text>
        <Tooltip {...args} placement="bottom-start">
          {#snippet children()}
            <TooltipInteractiveWrapper>
              {#snippet children()}
                <span style="margin-top:var(--spacing-2);display:inline-flex">
                  <InfoIcon size="medium" />
                </span>
              {/snippet}
            </TooltipInteractiveWrapper>
          {/snippet}
        </Tooltip>
      </div>
    </div>
  {/snippet}
</Story>

<!-- Story 5: Tooltip Triggers -->
<Story name="Tooltip Triggers">
  {#snippet template(args)}
    <div class="tooltip-story-center">
      <div
        style="display:flex;gap:var(--spacing-11);align-items:center;flex-wrap:wrap"
      >
        <Tooltip {...args} placement="top">
          {#snippet children()}
            <Button>button</Button>
          {/snippet}
        </Tooltip>
        <div style="margin-top:var(--spacing-8)"></div>
        <Tooltip {...args} placement="top">
          {#snippet children()}
            <Link href="#" onClick={() => console.log(1)}>Link</Link>
          {/snippet}
        </Tooltip>
        <div style="margin-top:var(--spacing-8)"></div>
        <Tooltip {...args} content="With IconButton" placement="top-end">
          {#snippet children()}
            <button
              type="button"
              aria-label="IconButton"
              style="background:transparent;border:none;cursor:pointer;padding:0;display:inline-flex;align-items:center;justify-content:center"
              onclick={() => console.log(1)}
            >
              <BuildingIcon size="large" />
            </button>
          {/snippet}
        </Tooltip>
        <div style="margin-top:var(--spacing-8)"></div>
        <Tooltip {...args} content="With non-interactive icon" placement="bottom">
          {#snippet children()}
            <TooltipInteractiveWrapper>
              {#snippet children()}
                <InfoIcon size="large" />
              {/snippet}
            </TooltipInteractiveWrapper>
          {/snippet}
        </Tooltip>
      </div>
    </div>
  {/snippet}
</Story>

<!-- Story 6: With Custom Trigger -->
<Story name="With Custom Trigger" asChild>
  <div>
    <Text>
      To create a custom trigger, the tooltip component expects the trigger component to expose:
    </Text>
    <ul>
      <li>
        Make sure to expose ref from the custom component via
        <Code size="medium">bind:this</Code>
      </li>
      <li>
        Make sure that your component can receive focus
        <span style="color:var(--surface-text-gray-muted)"> (eg: have tabIndex:0)</span>
      </li>
      <li>
        Forward event handlers to the custom trigger
        <span style="color:var(--surface-text-gray-muted)">
          (you can import the BladeCommonEvents type from blade when using TypeScript)
        </span>
        <ul>
          <li>onBlur</li>
          <li>onFocus</li>
          <li>onMouseLeave</li>
          <li>onMouseMove</li>
          <li>onPointerDown</li>
          <li>onPointerEnter</li>
        </ul>
      </li>
    </ul>
    <div style="margin-bottom:var(--spacing-4)">
      <Text>
        Alternatively you can just spread the props to the trigger, instead of adding them 1 by 1
      </Text>
    </div>
    <div style="margin-bottom:var(--spacing-4)">
      <Text>
        If you are using TypeScript you can import the types for these events from blade as
        <Code size="medium">BladeCommonEvents</Code>
      </Text>
    </div>
    <Tooltip placement="bottom" content="A custom trigger">
      {#snippet children()}
        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
        <div
          tabindex="0"
          style="display:inline-block;align-self:flex-start;padding:var(--spacing-4);border-radius:var(--border-radius-medium);background:var(--surface-background-gray-intense)"
        >
          <Text color="surface.text.gray.normal">Hover over me</Text>
        </div>
      {/snippet}
    </Tooltip>
  </div>
</Story>

<style>
  /* Center the trigger vertically inside the storybook iframe to mirror
     React's `<Center>` wrapper (`<Box width="100%" height="100%">`). Storybook's
     iframe body has ~16px padding on each side, so we subtract `var(--spacing-7)`
     (32px) from 100vh to keep the wrapper inside the visible area. */
  :global(.tooltip-story-center) {
    width: 100%;
    min-height: calc(100vh - var(--spacing-7));
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Stretch the Tooltip's inline-block trigger wrapper inside the placement
     story so each PlacementBox fills the column's main axis. Needed because
     Svelte's Tooltip wraps the trigger in a `<span style="display:inline-block">`
     while React's Tooltip uses cloneElement with no wrapper. The vite CSS
     module class is hashed (e.g. `_trigger_2qh6h_20`), so we target it via an
     attribute selector. */
  :global(.tooltip-placement-column > [class*='_trigger_']) {
    flex: 1;
    display: block;
  }
</style>

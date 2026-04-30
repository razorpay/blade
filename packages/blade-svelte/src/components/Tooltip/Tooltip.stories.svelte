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

<!-- Story 1: Default -->
<Story name="Default">
  {#snippet template(args)}
    <div
      style="width:100%;min-height:240px;display:flex;align-items:center;justify-content:center"
    >
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
    <div
      style="width:100%;min-height:240px;display:flex;align-items:center;justify-content:center"
    >
      <Tooltip {...args}>
        {#snippet children()}
          <Button>Hover over me</Button>
        {/snippet}
      </Tooltip>
    </div>
  {/snippet}
</Story>

<!-- Story 3: Placement (8 placements in a 3-column grid) -->
<Story name="Placement" asChild>
  <div
    style="width:100%;min-height:480px;display:flex;align-items:center;justify-content:center"
  >
    <div
      style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;width:100%"
    >
      <div style="display:flex;flex-direction:column;align-items:center;gap:12px">
        <Tooltip placement="top-start" content="Hello world">
          {#snippet children()}
            <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
            <div
              tabindex="0"
              style="display:flex;justify-content:center;align-items:center;width:100%;padding:16px;background:var(--surface-background-gray-moderate);border-radius:4px"
            >
              top-start
            </div>
          {/snippet}
        </Tooltip>
        <Tooltip placement="left" content="Hello world">
          {#snippet children()}
            <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
            <div
              tabindex="0"
              style="display:flex;justify-content:center;align-items:center;width:100%;padding:16px;background:var(--surface-background-gray-moderate);border-radius:4px"
            >
              left
            </div>
          {/snippet}
        </Tooltip>
        <Tooltip placement="bottom-start" content="Hello world">
          {#snippet children()}
            <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
            <div
              tabindex="0"
              style="display:flex;justify-content:center;align-items:center;width:100%;padding:16px;background:var(--surface-background-gray-moderate);border-radius:4px"
            >
              bottom-start
            </div>
          {/snippet}
        </Tooltip>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:12px">
        <Tooltip placement="top" content="Hello world">
          {#snippet children()}
            <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
            <div
              tabindex="0"
              style="display:flex;justify-content:center;align-items:center;width:100%;padding:16px;background:var(--surface-background-gray-moderate);border-radius:4px"
            >
              top
            </div>
          {/snippet}
        </Tooltip>
        <Tooltip placement="bottom" content="Hello world">
          {#snippet children()}
            <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
            <div
              tabindex="0"
              style="display:flex;justify-content:center;align-items:center;width:100%;padding:16px;background:var(--surface-background-gray-moderate);border-radius:4px"
            >
              bottom
            </div>
          {/snippet}
        </Tooltip>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:12px">
        <Tooltip placement="top-end" content="Hello world">
          {#snippet children()}
            <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
            <div
              tabindex="0"
              style="display:flex;justify-content:center;align-items:center;width:100%;padding:16px;background:var(--surface-background-gray-moderate);border-radius:4px"
            >
              top-end
            </div>
          {/snippet}
        </Tooltip>
        <Tooltip placement="right" content="Hello world">
          {#snippet children()}
            <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
            <div
              tabindex="0"
              style="display:flex;justify-content:center;align-items:center;width:100%;padding:16px;background:var(--surface-background-gray-moderate);border-radius:4px"
            >
              right
            </div>
          {/snippet}
        </Tooltip>
        <Tooltip placement="bottom-end" content="Hello world">
          {#snippet children()}
            <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
            <div
              tabindex="0"
              style="display:flex;justify-content:center;align-items:center;width:100%;padding:16px;background:var(--surface-background-gray-moderate);border-radius:4px"
            >
              bottom-end
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
      <div style="margin-top:16px;display:flex;align-items:center;gap:4px">
        <Text>Refunds</Text>
        <Tooltip {...args} placement="bottom-start">
          {#snippet children()}
            <TooltipInteractiveWrapper>
              {#snippet children()}
                <span style="margin-top:4px;display:inline-flex">
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
    <div
      style="width:100%;min-height:240px;display:flex;align-items:center;justify-content:center"
    >
      <div style="display:flex;gap:56px;align-items:center;flex-wrap:wrap">
        <Tooltip {...args} placement="top">
          {#snippet children()}
            <Button>button</Button>
          {/snippet}
        </Tooltip>

        <Tooltip {...args} placement="top">
          {#snippet children()}
            <Link href="#" onClick={() => console.log(1)}>Link</Link>
          {/snippet}
        </Tooltip>

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
        Make sure to forward the DOM ref from your custom component (Svelte:
        <Code size="medium">bind:this</Code>)
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
    <div style="margin-bottom:12px">
      <Text>
        Alternatively you can just spread the props to the trigger, instead of adding them 1 by 1
      </Text>
    </div>
    <div style="margin-bottom:12px">
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
          style="display:inline-block;align-self:flex-start;padding:12px;border-radius:12px;background:var(--surface-background-gray-intense);color:var(--surface-text-static-white-normal)"
        >
          Hover over me
        </div>
      {/snippet}
    </Tooltip>
  </div>
</Story>

<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import { exampleSource, hasNoControls, storyArgTypes } from '../helpers';
  import BasicStory from './Basic.svelte';
  import BasicSource from './Basic.svelte?raw';
  import MultipleStory from './Multiple.svelte';
  import MultipleSource from './Multiple.svelte?raw';
  import LinksAndActionsStory from './LinksAndActions.svelte';
  import LinksAndActionsSource from './LinksAndActions.svelte?raw';
  import BankPickerStory from './BankPicker.svelte';
  import BankPickerSource from './BankPicker.svelte?raw';
  import VirtualBankPickerStory from './VirtualBankPicker.svelte';
  import VirtualBankPickerSource from './VirtualBankPicker.svelte?raw';
  import InADropdownStory from './InADropdown.svelte';
  import InADropdownSource from './InADropdown.svelte?raw';

  const { Story } = defineMeta({
    title: "Components/Dropdown/ActionList",
    tags: ['autodocs'],
    argTypes: meta.argTypes,
    parameters: {
      docs: { description: { component: readme } },
    },
  });
</script>

<Story
  name="Basic"
  args={meta.stories.Basic.args}
  argTypes={storyArgTypes(meta, 'Basic') as never}
  parameters={{ docs: { description: { story: meta.stories.Basic.description }, source: exampleSource(BasicSource) }, controls: { disable: hasNoControls(meta, 'Basic') } }}
>
  {#snippet template(args)}
    <BasicStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Multiple"
  args={meta.stories.Multiple.args}
  argTypes={storyArgTypes(meta, 'Multiple') as never}
  parameters={{ docs: { description: { story: meta.stories.Multiple.description }, source: exampleSource(MultipleSource) }, controls: { disable: hasNoControls(meta, 'Multiple') } }}
>
  {#snippet template()}
    <MultipleStory />
  {/snippet}
</Story>

<Story
  name="LinksAndActions"
  args={meta.stories.LinksAndActions.args}
  argTypes={storyArgTypes(meta, 'LinksAndActions') as never}
  parameters={{ docs: { description: { story: meta.stories.LinksAndActions.description }, source: exampleSource(LinksAndActionsSource) }, controls: { disable: hasNoControls(meta, 'LinksAndActions') } }}
>
  {#snippet template()}
    <LinksAndActionsStory />
  {/snippet}
</Story>

<Story
  name="InADropdown"
  args={meta.stories.InADropdown.args}
  argTypes={storyArgTypes(meta, 'InADropdown') as never}
  parameters={{ docs: { description: { story: meta.stories.InADropdown.description }, source: exampleSource(InADropdownSource) }, controls: { disable: hasNoControls(meta, 'InADropdown') } }}
>
  {#snippet template()}
    <InADropdownStory />
  {/snippet}
</Story>

<Story
  name="BankPicker"
  args={meta.stories.BankPicker.args}
  argTypes={storyArgTypes(meta, 'BankPicker') as never}
  parameters={{ docs: { description: { story: meta.stories.BankPicker.description }, source: exampleSource(BankPickerSource) }, controls: { disable: hasNoControls(meta, 'BankPicker') } }}
>
  {#snippet template()}
    <BankPickerStory />
  {/snippet}
</Story>

<Story
  name="VirtualBankPicker"
  args={meta.stories.VirtualBankPicker.args}
  argTypes={storyArgTypes(meta, 'VirtualBankPicker') as never}
  parameters={{ docs: { description: { story: meta.stories.VirtualBankPicker.description }, source: exampleSource(VirtualBankPickerSource) }, controls: { disable: hasNoControls(meta, 'VirtualBankPicker') } }}
>
  {#snippet template()}
    <VirtualBankPickerStory />
  {/snippet}
</Story>

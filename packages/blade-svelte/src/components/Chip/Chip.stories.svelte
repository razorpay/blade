<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Chip from './Chip.svelte';
  import ChipGroup from './ChipGroup.svelte';

  const { Story } = defineMeta({
    title: 'Components/Chip/Chip',
    component: Chip,
    tags: ['autodocs'],
    args: {
      isDisabled: false,
    },
    argTypes: {
      isDisabled: {
        description: 'Disables or enables `Chip`',
        control: { type: 'boolean' },
        table: {
          category: 'Chip Props',
          type: { summary: 'boolean' },
        },
      },
      value: {
        description: 'The value to be used in the Chip input.',
        table: {
          category: 'Chip Props',
          type: { summary: 'string' },
        },
      },
      color: {
        description: 'Sets the color of the Chip.',
        options: ['primary', 'positive', 'negative'],
        control: { type: 'radio' },
        table: {
          category: 'Chip Props',
          type: { summary: '"primary" | "positive" | "negative"' },
        },
      },
    },
  });
</script>

<Story name="Default" asChild>
  <div>
    <ChipGroup
      selectionType="multiple"
      defaultValue={['Automated Payment Links']}
      accessibilityLabel="Select other capabilities you are looking for from the options below"
    >
      <Chip value="Automated Payment Links" color="primary">
        Automated Payment Links
      </Chip>
    </ChipGroup>
  </div>
</Story>

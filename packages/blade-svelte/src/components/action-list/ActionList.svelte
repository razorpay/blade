<script lang="ts" generics="T">
  import type { ComponentProps } from 'svelte';
  import BaseCardGroup from '../card-group/BaseCardGroup.svelte';
  import { useComponentDefaults } from '../defaults';
  import { actionListClasses, type ActionListInset, type ActionListVariant } from './styles';

  // ActionList is a look: CardGroup's anatomy and behaviour — the value, the
  // form field, sections, virtualization — drawn as Menu's rows. Its rows
  // are ActionListItems, its sections ActionListSections. The keys are a
  // listbox's, as React's: the arrows move and pick nothing, Enter and
  // Space pick — a pick may submit (`onPick`).
  type Props = Omit<ComponentProps<typeof BaseCardGroup<T>>, 'classes' | 'selectsOnMove'> & {
    /**
     * `plain`: Menu's rows, in no box. `card`: rows divided by hairlines in
     * a bordered box — each ActionListSection its own box, its heading
     * above it.
     * @default 'plain'
     */
    variant?: ActionListVariant;
    /**
     * A gutter inside the box that scrolls the rows: on a Modal's bare body
     * (`padding="none"`) the list keeps the body's padding while its
     * scrollbar meets the panel's edge. `medium` 16px, `large` 20px,
     * `overlay` the overlay's own (`--overlay-gutter`: 20px on a modal or a
     * drawer, 16px on a sheet, a popover or a menu, none outside one).
     * @default 'none'
     */
    inset?: ActionListInset;
  };

  let { value = $bindable(null), variant, inset, ...props }: Props = $props();

  const style = useComponentDefaults('ActionList', () => ({ variant, inset }));
</script>

<BaseCardGroup
  bind:value
  classes={actionListClasses(style.current.variant ?? 'plain', style.current.inset ?? 'none')}
  selectsOnMove={false}
  {...props}
/>

<script lang="ts" generics="T">
  import type { ComponentProps } from 'svelte';
  import { useComponentDefaults } from '../defaults';
  import BaseCardGroup from './BaseCardGroup.svelte';
  import { resolveCardGroup, type CardGroupLookState, type CardGroupStyleProps } from './styles';

  // Blade DSL's Card Group: BaseCardGroup in its own look. A single choice
  // is a radio group: the arrows pick as they move.
  type Props = Omit<ComponentProps<typeof BaseCardGroup<T>>, 'classes' | 'selectsOnMove'> &
    CardGroupStyleProps;

  let { value = $bindable(), ...props }: Props = $props();

  const style = useComponentDefaults('CardGroup', () => ({}));
  const look = (state: CardGroupLookState) => resolveCardGroup(style.current, state);
</script>

<BaseCardGroup bind:value classes={look} selectsOnMove {...props} />

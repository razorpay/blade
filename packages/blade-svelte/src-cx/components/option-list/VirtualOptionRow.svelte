<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';
  import { provideOptionRow } from '../../runes/option-list/context';

  // One mounted row of a VirtualOptionList: hands the OptionItem inside it
  // its option and place, as the list owns its options as data.
  interface Props {
    option: T;
    index: number;
    isTabStop: boolean;
    children: Snippet;
  }

  let { option, index, isTabStop, children }: Props = $props();

  provideOptionRow<T>({
    get option() {
      return option;
    },
    get index() {
      return index;
    },
    get isTabStop() {
      return isTabStop;
    },
  });
</script>

{@render children()}

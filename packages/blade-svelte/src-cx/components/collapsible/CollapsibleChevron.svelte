<script lang="ts">
  import { getCollapsible } from '../../runes/collapsible/context';
  import Icon from '../icon/Icon.svelte';
  import { chevronDown } from '../icons';
  import { resolveCollapsibleChevron } from './styles';

  // Blade's CollapsibleChevronIcon: points down while collapsed, flips while
  // expanded, turning with the body. Reads the Collapsible it sits in.
  interface Props {
    /** @default 'medium' */
    size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  }

  let { size = 'medium' }: Props = $props();

  const collapsible = getCollapsible();
  const turn = $derived(resolveCollapsibleChevron(Boolean(collapsible?.isExpanded)));
</script>

<span class={turn} aria-hidden="true">
  <Icon source={chevronDown} {size} />
</span>

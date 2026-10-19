<script lang="ts">
  import Button from '../../components/button/Button.svelte';
  import ButtonGroup from '../../components/button-group/ButtonGroup.svelte';
  import type { ButtonGroupStyleProps } from '../../components/button-group';
  import Menu from '../../components/menu/Menu.svelte';
  import Popover from '../../components/popover/Popover.svelte';

  interface Props extends ButtonGroupStyleProps {
    isDisabled?: boolean;
    onClick?: () => void;
    /** An open overlay whose trigger sits in the group, with a Button inside. */
    overlay?: 'popover' | 'menu';
  }

  let { isDisabled, onClick, overlay, ...style }: Props = $props();
</script>

{#snippet trigger()}
  <Button testID="more">More</Button>
{/snippet}

{#snippet inner()}
  <Button variant="secondary" color="negative" testID="inner">Inner</Button>
{/snippet}

<ButtonGroup {...style} {isDisabled} testID="group">
  <!-- The children's own look is overridden by the group's. -->
  <Button variant="secondary" color="negative" size="large" testID="one" {onClick}>One</Button>
  <Button testID="two">Two</Button>
  <Button isDisabled testID="three">Three</Button>
  {#if overlay === 'popover'}
    <Popover isOpen children={trigger} accessibilityLabel="More" content={inner} />
  {:else if overlay === 'menu'}
    <Menu isOpen children={trigger} accessibilityLabel="More" content={inner} />
  {/if}
</ButtonGroup>

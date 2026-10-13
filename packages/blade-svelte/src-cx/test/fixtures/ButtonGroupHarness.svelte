<script lang="ts">
  import Button from '../../components/button/Button.svelte';
  import ButtonGroup from '../../components/button-group/ButtonGroup.svelte';
  import type { ButtonGroupStyleProps } from '../../components/button-group';

  interface Props extends ButtonGroupStyleProps {
    isDisabled?: boolean;
    onClick?: () => void;
  }

  let { isDisabled, onClick, ...style }: Props = $props();
</script>

<ButtonGroup {...style} {isDisabled} testID="group">
  <!-- The children's own look is overridden by the group's. -->
  <Button variant="secondary" color="negative" size="large" testID="one" {onClick}>One</Button>
  <Button testID="two">Two</Button>
  <Button isDisabled testID="three">Three</Button>
</ButtonGroup>

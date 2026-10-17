<script lang="ts">
  import { useComponentDefaults } from '../defaults';
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import { provideButtonGroup } from '../../runes/button/group';
  import type { ButtonStyleProps } from '../button/styles';
  import { resolveButtonGroup, type ButtonGroupStyleProps } from './styles';

  type Props = ButtonGroupStyleProps & {
    /** Disables every button, on top of each one's own. @default false */
    isDisabled?: boolean;
    testID?: string;
    class?: string;
    /** The Buttons: their variant, size and colour are the group's. */
    children: Snippet;
  };

  let {
    isDisabled = false,
    testID,
    class: className = '',
    children,
    ...styleProps
  }: Props = $props();

  const style = useComponentDefaults('ButtonGroup', () => styleProps);

  const classes = $derived(resolveButtonGroup(style.current));

  provideButtonGroup<Required<ButtonStyleProps>>({
    get shared() {
      return classes.button;
    },
    get isDisabled() {
      return isDisabled;
    },
  });
</script>

<!-- Not a toolbar, as in Blade: each button is its own Tab stop. -->
<div class={cx(classes.root, className)} role="group" data-testid={testID}>
  {@render children()}
</div>

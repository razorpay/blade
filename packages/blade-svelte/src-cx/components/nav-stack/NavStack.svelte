<script lang="ts">
  import { cx } from '../../cx';
  import {
    getNav,
    type NavDirection,
    type NavEntry,
  } from '../../runes/nav-stack/nav';
  import { createNavStack } from '../../runes/nav-stack/stack.svelte';
  import NavScreen from './NavScreen.svelte';
  import { resolveNavStack, type NavStackStyleProps } from './styles';

  // Renders the screens `nav.push` asked for, one at a time: the topmost
  // screen whose component has loaded. A promised screen joins the stack at
  // once but shows only when it can, so there is one slide and no blank.
  type Props = NavStackStyleProps & {
    accessibilityLabel?: string;
    /** The screen on show changed. */
    onChange?: (entry: NavEntry | undefined, direction: NavDirection) => void;
    testID?: string;
    class?: string;
  };

  let {
    accessibilityLabel,
    onChange,
    testID,
    class: className = '',
    ...styleProps
  }: Props = $props();

  const nav = getNav();
  const classes = $derived(resolveNavStack(styleProps));
  const stack = createNavStack({
    nav,
    onChange: (entry, direction) => onChange?.(entry, direction),
  });
</script>

<div
  class={cx(classes.root, className)}
  aria-label={accessibilityLabel}
  aria-busy={stack.isBusy}
  data-testid={testID}
>
  <!-- An each, not a key block: the leaving screen keeps its own content. -->
  {#each stack.shown ? [stack.shown] : [] as { layer, content, Content } (layer.id)}
    <NavScreen
      name={content.name}
      {nav}
      isFirst={stack.isFirst(layer.id)}
      {classes}
    >
      <Content {...content.props} screen={content.control} />
    </NavScreen>
  {/each}
</div>

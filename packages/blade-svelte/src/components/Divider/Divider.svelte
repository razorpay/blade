<script lang="ts">
  import BaseDivider from './BaseDivider/BaseDivider.svelte';
  import type { DividerProps } from './types';

  let {
    orientation = 'horizontal',
    dividerStyle = 'solid',
    variant = 'muted',
    thickness = 'thin',
    height,
    width,
    testID,
    ...rest
  }: DividerProps = $props();
</script>

<BaseDivider
  {orientation}
  {dividerStyle}
  {variant}
  {thickness}
  {height}
  {width}
  {testID}
  {...rest}
/>

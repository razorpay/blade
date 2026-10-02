<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HintContent } from '../../runes/form/hint';
  import { check, info } from '../icons';
  import Icon from '../icon/Icon.svelte';
  import {
    resolveFieldHint,
    type FieldHintSize,
    type FieldHintTone,
  } from './field';

  // Blade's FormHint: one line under a field — help, or an error or success
  // led by its icon.
  interface Props {
    id?: string;
    /** Text, or a snippet (a line with a Link in it). */
    text: HintContent;
    tone: FieldHintTone;
    /** @default 'medium' */
    size?: FieldHintSize;
  }

  let { id, text, tone, size = 'medium' }: Props = $props();

  const classes = $derived(resolveFieldHint(size, tone));
  const iconSize = $derived(size === 'large' ? 'medium' : 'small');
</script>

<span class={classes.root} {id}>
  {#if tone === 'error'}
    <span class={classes.icon}>
      <Icon source={info} size={iconSize} color="danger" />
    </span>
  {:else if tone === 'success'}
    <span class={classes.icon}>
      <Icon source={check} size={iconSize} color="success" />
    </span>
  {/if}
  <span class={classes.text}>
    {#if typeof text === 'string'}{text}{:else}{@render (text as Snippet)()}{/if}
  </span>
</span>

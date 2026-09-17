<script lang="ts">
  import SegmentedControl from '../../../SegmentedControl/SegmentedControl.svelte';
  import SegmentedControlItem from '../../../SegmentedControl/SegmentedControlItem.svelte';
  import Text from '../../../Typography/Text/Text.svelte';
  import {
    buildSnippet,
    type SlotClassesByComponent,
    type SnippetForm,
    type StyleOverrideComponent,
  } from './styleOverrideEngine';

  let {
    component,
    components,
    slotClassesByComponent,
    cssVarValues,
    availableForms,
  }: {
    /** Component the `Instance` form is written for. */
    component: StyleOverrideComponent;
    /** Components the `App-wide` and `CSS` forms cover. */
    components: readonly StyleOverrideComponent[];
    slotClassesByComponent: SlotClassesByComponent;
    cssVarValues: Record<string, string>;
    /** Restrict which snippet forms are shown. Defaults to all. */
    availableForms?: readonly SnippetForm[];
  } = $props();

  const ALL_FORMS: readonly { value: SnippetForm; label: string; hint: string }[] = [
    { value: 'instance', label: 'Instance', hint: 'Overrides this one component.' },
    { value: 'provider', label: 'App-wide', hint: 'Overrides every instance under the provider.' },
    { value: 'css', label: 'CSS', hint: 'Add these rules to your own stylesheet.' },
  ];

  const FORMS = $derived(
    availableForms
      ? ALL_FORMS.filter((entry) => availableForms.includes(entry.value))
      : ALL_FORMS,
  );

  let form = $state<SnippetForm>('instance');
  let copyState = $state<'idle' | 'copied' | 'failed'>('idle');
  let copyResetTimer: ReturnType<typeof setTimeout> | undefined;

  const snippet = $derived(
    buildSnippet(form, { component, components, slotClassesByComponent, cssVarValues }),
  );
  const activeForm = $derived(FORMS.find((entry) => entry.value === form) ?? FORMS[0]);
  const copyLabel = $derived(
    copyState === 'copied' ? 'Copied' : copyState === 'failed' ? 'Copy failed' : 'Copy',
  );

  function setForm(payload: { name?: string; value: string }): void {
    form = payload.value as SnippetForm;
  }

  function flagCopyState(next: 'copied' | 'failed'): void {
    copyState = next;
    clearTimeout(copyResetTimer);
    copyResetTimer = setTimeout(() => {
      copyState = 'idle';
    }, 1600);
  }

  async function copySnippet(): Promise<void> {
    try {
      await navigator.clipboard.writeText(snippet);
      flagCopyState('copied');
    } catch {
      flagCopyState('failed');
    }
  }

  $effect(() => () => clearTimeout(copyResetTimer));
</script>

<div class="snippet">
  {#if FORMS.length > 1}
    <div class="snippet-toolbar">
      <SegmentedControl
        accessibilityLabel="Snippet form"
        size="small"
        value={form}
        onChange={setForm}
      >
        {#each FORMS as entry (entry.value)}
          <SegmentedControlItem value={entry.value}>{entry.label}</SegmentedControlItem>
        {/each}
      </SegmentedControl>
    </div>
  {/if}
  <Text size="xsmall" color="surface.text.gray.muted">{activeForm.hint}</Text>
  <div class="snippet-code-wrap">
    <button type="button" class="snippet-copy" onclick={copySnippet}>{copyLabel}</button>
    <pre class="snippet-code"><code>{snippet}</code></pre>
  </div>
</div>

<style>
  .snippet {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
    width: 100%;
    min-width: 0;
  }

  .snippet-toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--spacing-3);
  }

  .snippet-code-wrap {
    position: relative;
    width: 100%;
    min-width: 0;
  }

  .snippet-copy {
    position: absolute;
    top: var(--spacing-2);
    right: var(--spacing-2);
    z-index: 1;
    padding: var(--spacing-1) var(--spacing-3);
    border: 1px solid var(--surface-border-gray-subtle);
    border-radius: var(--border-radius-medium);
    background-color: var(--surface-background-gray-intense);
    color: var(--surface-text-gray-subtle);
    font-family: var(--font-family-text);
    font-size: var(--font-size-25);
    line-height: var(--line-height-75);
    cursor: pointer;
  }

  .snippet-copy:hover {
    background-color: var(--surface-background-gray-subtle);
  }

  .snippet-code {
    margin: 0;
    padding: var(--spacing-4);
    padding-right: var(--spacing-10);
    overflow-x: auto;
    border: 1px solid var(--surface-border-gray-subtle);
    border-radius: var(--border-radius-medium);
    background-color: var(--surface-background-gray-subtle);
    color: var(--surface-text-gray-subtle);
    font-family: var(--font-family-code);
    font-size: var(--font-size-25);
    line-height: var(--line-height-75);
    white-space: pre;
  }

  .snippet-code code {
    font-family: inherit;
    font-size: inherit;
  }
</style>

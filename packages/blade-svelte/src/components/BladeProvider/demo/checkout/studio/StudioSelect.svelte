<script lang="ts">
  import { ChevronDownIcon } from '../../../../Icons';

  let {
    id,
    value,
    options,
    onChange,
    accessibilityLabel,
  }: {
    id?: string;
    value: string;
    options: readonly { label: string; value: string }[];
    onChange: (value: string) => void;
    accessibilityLabel?: string;
  } = $props();
</script>

<div class="studio-select">
  <select
    {id}
    {value}
    aria-label={accessibilityLabel}
    onchange={(event) => onChange(event.currentTarget.value)}
  >
    {#each options as option (option.value)}
      <option value={option.value}>{option.label}</option>
    {/each}
  </select>
  <span class="studio-select-chevron" aria-hidden="true">
    <ChevronDownIcon size="small" color="surface.icon.gray.subtle" />
  </span>
</div>

<style>
  .studio-select {
    position: relative;
    display: flex;
    flex: 1;
    min-width: 0;
  }

  select {
    width: 100%;
    height: 32px;
    padding: 0 28px 0 var(--spacing-3);
    border: 1px solid var(--surface-border-gray-subtle);
    border-radius: var(--border-radius-small);
    background-color: var(--surface-background-gray-intense);
    color: var(--surface-text-gray-normal);
    font-family: var(--font-family-text);
    font-size: var(--font-size-75);
    line-height: var(--line-height-75);
    appearance: none;
    cursor: pointer;
    text-overflow: ellipsis;
  }

  select:hover {
    border-color: var(--surface-border-gray-muted);
  }

  select:focus-visible {
    outline: 2px solid var(--surface-border-primary-normal);
    outline-offset: 1px;
  }

  .studio-select-chevron {
    position: absolute;
    top: 50%;
    right: var(--spacing-3);
    display: inline-flex;
    transform: translateY(-50%);
    pointer-events: none;
  }
</style>

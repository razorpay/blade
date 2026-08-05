<script lang="ts">
  import { bladeTheme } from '@razorpay/blade-core/tokens';
  import { useTheme } from './useTheme';
  import Heading from '../Typography/Heading/Heading.svelte';
  import Text from '../Typography/Text/Text.svelte';
  import Code from '../Typography/Code/Code.svelte';
  import Badge from '../Badge/Badge.svelte';
  import Button from '../Button/Button.svelte';
  import SearchInput from '../Input/SearchInput/SearchInput.svelte';
  import Switch from '../Switch/Switch.svelte';

  type DiffNode = {
    value: unknown;
    defaultValue: unknown;
    children?: Record<string, DiffNode>;
    changedCount: number;
  };

  const ctx = $derived(useTheme());
  const theme = $derived(ctx.theme as unknown as Record<string, unknown>);
  let query = $state('');
  let expansion = $state<'default' | 'all' | 'none'>('default');
  let changedOnly = $state(false);

  function isColor(value: unknown): value is string {
    return typeof value === 'string' && /^(#|rgb|hsl)/i.test(value.trim());
  }

  function isBranch(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  function countLeaves(value: unknown): number {
    if (!isBranch(value)) return 1;
    return Object.values(value).reduce<number>(
      (count, child) => count + countLeaves(child),
      0,
    );
  }

  function valuesMatch(value: unknown, defaultValue: unknown): boolean {
    if (Object.is(value, defaultValue)) return true;
    return JSON.stringify(value) === JSON.stringify(defaultValue);
  }

  function countDiffLeaves(node: DiffNode): number {
    if (!node.children) return 1;
    return Object.values(node.children).reduce(
      (count, child) => count + countDiffLeaves(child),
      0,
    );
  }

  function buildDiffNode(
    value: unknown,
    defaultValue: unknown,
    path: string,
  ): DiffNode {
    if (isBranch(value)) {
      const defaultBranch = isBranch(defaultValue) ? defaultValue : {};
      const children = Object.fromEntries(
        Object.entries(value).map(([key, childValue]) => [
          key,
          buildDiffNode(childValue, defaultBranch[key], path ? `${path}.${key}` : key),
        ]),
      );

      return {
        value,
        defaultValue,
        children,
        changedCount: Object.values(children).reduce(
          (count, child) => count + child.changedCount,
          0,
        ),
      };
    }

    return {
      value,
      defaultValue,
      changedCount: path === 'name' || valuesMatch(value, defaultValue) ? 0 : 1,
    };
  }

  function filterDiffNode(
    node: DiffNode,
    label: string,
    searchTerm: string,
  ): DiffNode | undefined {
    if (changedOnly && node.changedCount === 0) return undefined;

    const matchesSearch =
      !searchTerm ||
      label.toLowerCase().includes(searchTerm) ||
      String(node.value).toLowerCase().includes(searchTerm) ||
      String(node.defaultValue).toLowerCase().includes(searchTerm);

    if (!node.children) return matchesSearch ? node : undefined;

    if (matchesSearch && searchTerm) {
      if (!changedOnly) return node;
      const changedChildren = Object.fromEntries(
        Object.entries(node.children).filter(([, child]) => child.changedCount > 0),
      );
      return Object.keys(changedChildren).length > 0
        ? { ...node, children: changedChildren }
        : undefined;
    }

    const children = Object.fromEntries(
      Object.entries(node.children)
        .map(([childLabel, child]) => [
          childLabel,
          filterDiffNode(child, childLabel, searchTerm),
        ] as const)
        .filter((entry): entry is readonly [string, DiffNode] => entry[1] !== undefined),
    );

    return Object.keys(children).length > 0 ? { ...node, children } : undefined;
  }

  const baselineTheme = $derived({
    name: bladeTheme.name,
    border: bladeTheme.border,
    backdropBlur: bladeTheme.backdropBlur,
    breakpoints: bladeTheme.breakpoints,
    spacing: bladeTheme.spacing,
    motion: bladeTheme.motion,
    colors: ctx.colorScheme === 'dark' ? bladeTheme.colors.onDark : bladeTheme.colors.onLight,
    elevation:
      ctx.colorScheme === 'dark' ? bladeTheme.elevation.onDark : bladeTheme.elevation.onLight,
    typography: bladeTheme.typography[ctx.platform],
  } as unknown as Record<string, unknown>);
  const diffTree = $derived(
    Object.fromEntries(
      Object.entries(theme).map(([key, value]) => [
        key,
        buildDiffNode(value, baselineTheme[key], key),
      ]),
    ),
  );
  const changedTokens = $derived(
    Object.values(diffTree).reduce((count, node) => count + node.changedCount, 0),
  );
  const filteredTree = $derived.by(() => {
    const searchTerm = query.trim().toLowerCase();

    return Object.fromEntries(
      Object.entries(diffTree)
        .map(([key, node]) => [key, filterDiffNode(node, key, searchTerm)] as const)
        .filter((entry): entry is readonly [string, DiffNode] => entry[1] !== undefined),
    );
  });
  const totalTokens = $derived(countLeaves(theme));
  const visibleTokens = $derived(
    Object.values(filteredTree).reduce(
      (count, node) => count + countDiffLeaves(node),
      0,
    ),
  );
  const hasResults = $derived(Object.keys(filteredTree).length > 0);

  function onSearch(payload: { value?: string }): void {
    query = payload.value ?? '';
  }

  function onSearchInput(event: Event): void {
    query = (event.target as HTMLInputElement).value;
  }

  function onChangedOnlyToggle(payload: { isChecked: boolean }): void {
    changedOnly = payload.isChecked;
    expansion = payload.isChecked ? 'all' : 'default';
  }
</script>

{#snippet node(label: string, diffNode: DiffNode, depth: number)}
  {#if diffNode.children}
    <details
      class="node"
      open={query || changedOnly ? true : expansion === 'all' ? true : expansion === 'none' ? false : depth < 1}
    >
      <summary class="summary">
        <span class="disclosure" aria-hidden="true"></span>
        <span class="key">{label}</span>
        {#if diffNode.changedCount > 0}
          <span class="changed-count">{diffNode.changedCount} changed</span>
        {/if}
        <span class="count">{Object.keys(diffNode.children).length} keys</span>
      </summary>
      <div class="children">
        {#each Object.entries(diffNode.children) as [childKey, childNode] (childKey)}
          {@render node(childKey, childNode, depth + 1)}
        {/each}
      </div>
    </details>
  {:else}
    {@const isChanged = diffNode.changedCount > 0}
    <div class:leaf--changed={isChanged} class="leaf">
      <span class="key">{label}</span>
      {#if isChanged}
        <span class="value-comparison">
          <span class="comparison-value comparison-value--default" title={`Default: ${String(diffNode.defaultValue)}`}>
            {#if isColor(diffNode.defaultValue)}
              <span class="swatch-frame" aria-hidden="true">
                <span class="swatch" style:background-color={diffNode.defaultValue}></span>
              </span>
            {/if}
            <span class="comparison-copy">
              <span class="comparison-label">Default</span>
              <span class="value-text">{String(diffNode.defaultValue)}</span>
            </span>
          </span>
          <span class="comparison-arrow" aria-hidden="true">→</span>
          <span class="comparison-value comparison-value--active" title={`Active: ${String(diffNode.value)}`}>
            {#if isColor(diffNode.value)}
              <span class="swatch-frame" aria-hidden="true">
                <span class="swatch" style:background-color={diffNode.value}></span>
              </span>
            {/if}
            <span class="comparison-copy">
              <span class="comparison-label">Active</span>
              <span class="value-text">{String(diffNode.value)}</span>
            </span>
          </span>
        </span>
      {:else}
        <span class="value" title={String(diffNode.value)}>
          {#if isColor(diffNode.value)}
            <span class="swatch-frame" aria-hidden="true">
              <span class="swatch" style:background-color={diffNode.value}></span>
            </span>
          {/if}
          <span class="value-text">{String(diffNode.value)}</span>
        </span>
      {/if}
    </div>
  {/if}
{/snippet}

<main class="explorer">
  <header class="header">
    <div class="eyebrow">
      <Badge color="primary" emphasis="subtle" size="small">Live token reference</Badge>
      <Text as="span" size="small" color="surface.text.gray.muted">{totalTokens} resolved tokens</Text>
    </div>
    <div class="title-block">
      <Heading as="h1" size="xlarge" weight="semibold">Theme explorer</Heading>
      <Text size="medium" color="surface.text.gray.muted">
        Inspect resolved <Code size="small">useTheme().theme</Code> tokens for the active brand and
        color scheme. Switch either from the Storybook toolbar to compare live output.
      </Text>
    </div>
    <div class="meta" aria-label="Active theme context">
      <Badge color="neutral" emphasis="subtle">Scheme · {ctx.colorScheme}</Badge>
      <Badge color="information" emphasis="subtle">Platform · {ctx.platform}</Badge>
      <Badge color="primary" emphasis="subtle">Theme · {ctx.theme.name}</Badge>
      <Badge color={changedTokens > 0 ? 'notice' : 'neutral'} emphasis="subtle">
        Changed · {changedTokens}
      </Badge>
    </div>
  </header>

  <section class="token-panel" aria-labelledby="token-tree-title">
    <div class="panel-heading">
      <div class="panel-title">
        <div id="token-tree-title">
          <Heading as="h2" size="medium" weight="semibold">Resolved tokens</Heading>
        </div>
        <Text as="span" size="small" color="surface.text.gray.muted">
          {query
            ? `${visibleTokens} matching tokens`
            : `${changedTokens} tokens differ from default bladeTheme`}
        </Text>
      </div>
      <div class="search" oninput={onSearchInput}>
        <SearchInput
          accessibilityLabel="Search theme tokens"
          placeholder="Search token names or values"
          value={query}
          onChange={onSearch}
          onClearButtonClick={() => (query = '')}
          size="medium"
        />
      </div>
    </div>

    <div class="tree-toolbar">
      <div class="diff-toggle">
        <Switch
          accessibilityLabel="Show changed tokens only"
          size="small"
          isChecked={changedOnly}
          onChange={onChangedOnlyToggle}
        />
        <Text as="span" size="small" weight="medium">Changed only</Text>
        <Text as="span" size="small" color="surface.text.gray.muted">
          Compare against default Blade theme
        </Text>
      </div>
      <div class="tree-actions">
        <Button variant="tertiary" size="xsmall" onClick={() => (expansion = 'all')}>
          Expand all
        </Button>
        <Button variant="tertiary" size="xsmall" onClick={() => (expansion = 'none')}>
          Collapse all
        </Button>
      </div>
    </div>

    <div class="tree">
      {#if hasResults}
        {#each Object.entries(filteredTree) as [key, diffNode] (key)}
          {@render node(key, diffNode, 0)}
        {/each}
      {:else}
        <div class="empty-state">
          {#if changedOnly && changedTokens === 0}
            <Heading as="h3" size="small" weight="semibold">Theme matches default Blade</Heading>
            <Text size="small" color="surface.text.gray.muted">
              No resolved tokens differ for this color scheme and platform.
            </Text>
            <Button variant="tertiary" size="small" onClick={() => (changedOnly = false)}>
              Show all tokens
            </Button>
          {:else}
            <Heading as="h3" size="small" weight="semibold">
              {changedOnly ? 'No changed tokens match' : 'No matching tokens'}
            </Heading>
            <Text size="small" color="surface.text.gray.muted">
              Try a category like “colors” or a value like “16”.
            </Text>
            <Button variant="tertiary" size="small" onClick={() => (query = '')}>Clear search</Button>
          {/if}
        </div>
      {/if}
    </div>
  </section>
</main>

<style>
  .explorer {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-8);
    width: min(100%, 1040px);
    box-sizing: border-box;
    padding: var(--spacing-10);
    background-color: var(--surface-background-gray-moderate);
    border-radius: var(--border-radius-large);
    border: 1px solid var(--surface-border-gray-muted);
    box-shadow: var(--elevation-low-raised);
  }

  .header {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-5);
  }

  .eyebrow,
  .meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--spacing-3);
  }

  .title-block {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
    max-width: 720px;
  }

  .token-panel {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: var(--surface-background-gray-subtle);
    border: 1px solid var(--surface-border-gray-muted);
    border-radius: var(--border-radius-large);
  }

  .panel-heading {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--spacing-6);
    padding: var(--spacing-6);
    border-bottom: 1px solid var(--surface-border-gray-muted);
  }

  .panel-title {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2);
  }

  .search {
    width: min(100%, 360px);
  }

  .tree-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-4);
    padding: var(--spacing-3) var(--spacing-5);
    background-color: var(--surface-background-gray-moderate);
    border-bottom: 1px solid var(--surface-border-gray-muted);
  }

  .tree-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
  }

  .diff-toggle {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--spacing-3);
  }

  .tree {
    font-family: var(--font-family-code);
    font-size: var(--font-size-75);
    line-height: var(--line-height-200);
    max-height: min(64vh, 680px);
    overflow: auto;
    padding: var(--spacing-4) var(--spacing-5) var(--spacing-6);
  }

  .node {
    margin-left: 0;
  }

  .summary {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    cursor: pointer;
    min-height: 32px;
    padding: var(--spacing-2) var(--spacing-3);
    border-radius: var(--border-radius-medium);
    user-select: none;
    list-style: none;
  }

  .summary::-webkit-details-marker {
    display: none;
  }

  .summary:hover,
  .summary:focus-visible {
    background-color: var(--surface-background-gray-moderate);
    outline: none;
  }

  .summary:focus-visible {
    box-shadow: 0 0 0 2px var(--interactive-border-primary-default);
  }

  .disclosure {
    width: 7px;
    height: 7px;
    flex: none;
    border-right: 1.5px solid var(--surface-icon-gray-muted);
    border-bottom: 1.5px solid var(--surface-icon-gray-muted);
    transform: rotate(-45deg);
    transition: transform 120ms ease;
  }

  details[open] > .summary .disclosure {
    transform: rotate(45deg) translate(-1px, -1px);
  }

  .children {
    padding-left: var(--spacing-4);
    margin-left: var(--spacing-4);
    border-left: 1px solid var(--surface-border-gray-muted);
  }

  .leaf {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    min-height: 30px;
    padding: var(--spacing-1) var(--spacing-3);
    min-width: 0;
    border-radius: var(--border-radius-small);
  }

  .leaf:hover {
    background-color: var(--surface-background-gray-moderate);
  }

  .leaf--changed {
    margin: var(--spacing-1) 0;
    padding: var(--spacing-2) var(--spacing-3);
    background-color: var(--surface-background-primary-subtle);
    border: 1px solid var(--surface-border-primary-muted);
  }

  .leaf--changed:hover {
    background-color: var(--surface-background-primary-subtle);
  }

  .swatch-frame {
    display: grid;
    place-items: center;
    flex: none;
    width: 20px;
    height: 20px;
    border-radius: var(--border-radius-small);
    background-image:
      linear-gradient(45deg, var(--surface-background-gray-moderate) 25%, transparent 25%),
      linear-gradient(-45deg, var(--surface-background-gray-moderate) 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, var(--surface-background-gray-moderate) 75%),
      linear-gradient(-45deg, transparent 75%, var(--surface-background-gray-moderate) 75%);
    background-position:
      0 0,
      0 5px,
      5px -5px,
      -5px 0;
    background-size: 10px 10px;
  }

  .swatch {
    width: 100%;
    height: 100%;
    border-radius: var(--border-radius-small);
    border: 1px solid var(--surface-border-gray-muted);
  }

  .key {
    color: var(--surface-text-gray-normal);
    font-weight: 600;
  }

  .count {
    margin-left: auto;
    color: var(--surface-text-gray-muted);
    font-size: var(--font-size-50);
  }

  .changed-count {
    margin-left: auto;
    padding: 0 var(--spacing-2);
    color: var(--surface-text-primary-normal);
    background-color: var(--surface-background-primary-subtle);
    border-radius: var(--border-radius-small);
    font-size: var(--font-size-50);
    font-weight: 600;
  }

  .changed-count + .count {
    margin-left: 0;
  }

  .value {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    margin-left: auto;
    max-width: 62%;
    color: var(--surface-text-gray-muted);
    min-width: 0;
  }

  .value-text {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .value-comparison {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    align-items: center;
    gap: var(--spacing-3);
    width: min(68%, 560px);
    margin-left: auto;
  }

  .comparison-value {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    min-width: 0;
    padding: var(--spacing-2) var(--spacing-3);
    border-radius: var(--border-radius-small);
  }

  .comparison-value--default {
    color: var(--surface-text-gray-muted);
    background-color: var(--surface-background-gray-moderate);
  }

  .comparison-value--active {
    color: var(--surface-text-gray-normal);
    background-color: var(--surface-background-gray-subtle);
    box-shadow: inset 0 0 0 1px var(--surface-border-primary-normal);
  }

  .comparison-copy {
    display: flex;
    flex-direction: column;
    min-width: 0;
    text-align: left;
  }

  .comparison-label {
    color: var(--surface-text-gray-muted);
    font-family: var(--font-family-text);
    font-size: var(--font-size-50);
    line-height: var(--line-height-100);
  }

  .comparison-arrow {
    color: var(--surface-icon-gray-muted);
  }

  .comparison-value .swatch-frame {
    width: 24px;
    height: 24px;
  }

  .empty-state {
    display: flex;
    min-height: 240px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-3);
    text-align: center;
  }

  @media (max-width: 768px) {
    .explorer {
      padding: var(--spacing-5);
      gap: var(--spacing-6);
    }

    .panel-heading {
      align-items: stretch;
      flex-direction: column;
      gap: var(--spacing-4);
      padding: var(--spacing-5);
    }

    .search {
      width: 100%;
    }

    .tree-toolbar {
      align-items: flex-start;
      flex-direction: column;
    }

    .diff-toggle {
      align-items: flex-start;
    }

    .leaf {
      align-items: flex-start;
      flex-direction: column;
    }

    .value,
    .value-comparison {
      width: 100%;
      max-width: none;
      margin-left: 0;
    }

    .value {
      justify-content: flex-start;
    }

    .value-comparison {
      grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    }
  }
</style>

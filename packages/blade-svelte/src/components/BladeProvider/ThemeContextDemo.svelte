<script lang="ts">
  import { useTheme } from './useTheme';
  import Button from '../Button/Button.svelte';
  import Text from '../Typography/Text/Text.svelte';
  import Heading from '../Typography/Heading/Heading.svelte';
  import Badge from '../Badge/Badge.svelte';
  import Code from '../Typography/Code/Code.svelte';
  import Card from '../Card/Card.svelte';
  import CardBody from '../Card/CardBody.svelte';

  const ctx = $derived(useTheme());

  function toggleScheme(): void {
    ctx.setColorScheme(ctx.colorScheme === 'dark' ? 'light' : 'dark');
  }

  function setSystem(): void {
    ctx.setColorScheme('system');
  }

  const radiusLabel = $derived(
    `sm ${ctx.theme.border.radius.small} · md ${ctx.theme.border.radius.medium} · lg ${ctx.theme.border.radius.large}`,
  );
</script>

<div class="demo">
  <Heading size="large" weight="semibold">BladeProvider</Heading>
  <Text size="medium" color="surface.text.gray.muted">
    Storybook Controls (or parent) drive <Code size="small">colorScheme</Code>,
    brand, and <Code size="small">borderRadius</Code> via
    <Code size="small">createTheme</Code>. Toggle below uses
    <Code size="small">useTheme().setColorScheme</Code>.
  </Text>

  <div class="meta">
    <Badge color="primary" emphasis="subtle">scheme: {ctx.colorScheme}</Badge>
    <Badge color="neutral" emphasis="subtle">platform: {ctx.platform}</Badge>
    <Badge color="information" emphasis="subtle">theme: {ctx.theme.name}</Badge>
    <Badge color="notice" emphasis="subtle">radius: {radiusLabel}</Badge>
  </div>

  <div class="actions">
    <Button variant="primary" size="medium" onClick={toggleScheme}>
      {ctx.colorScheme === 'dark' ? 'Switch to light' : 'Switch to dark'}
    </Button>
    <Button variant="secondary" size="medium" onClick={setSystem}>Use system</Button>
  </div>

  <div class="swatch-row">
    <div class="swatch primary"></div>
    <div class="swatch surface"></div>
    <div class="swatch gray"></div>
  </div>

  <Card variant="theme" backgroundColor="surface.background.primary.subtle" borderRadius="medium">
    <CardBody>
      <Heading size="small" weight="semibold">Border radius preview</Heading>
      <Text size="small" color="surface.text.gray.muted">
        Card uses <Code size="small">medium</Code>, buttons use
        <Code size="small">small</Code>, panel shell uses
        <Code size="small">large</Code>. Drag radius Controls to see corners change.
      </Text>
    </CardBody>
  </Card>
</div>

<style>
  .demo {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-5);
    padding: var(--spacing-8);
    background-color: var(--surface-background-gray-moderate);
    border-radius: var(--border-radius-large);
    border: 1px solid var(--surface-border-gray-muted);
    max-width: 480px;
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-3);
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-3);
  }

  .swatch-row {
    display: flex;
    gap: var(--spacing-3);
  }

  .swatch {
    width: 48px;
    height: 48px;
    border-radius: var(--border-radius-medium);
    border: 1px solid var(--surface-border-gray-muted);
  }

  .primary {
    background-color: var(--surface-background-primary-intense);
  }

  .surface {
    background-color: var(--surface-background-gray-intense);
  }

  .gray {
    background-color: var(--surface-background-gray-subtle);
  }
</style>

<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { bladeTheme, createTheme } from '@razorpay/blade-core/tokens';
  import BladeProvider from './BladeProvider.svelte';
  import Text from '../Typography/Text/Text.svelte';
  import Heading from '../Typography/Heading/Heading.svelte';
  import Code from '../Typography/Code/Code.svelte';
  import Badge from '../Badge/Badge.svelte';
  import Button from '../Button/Button.svelte';
  import ThemeTokensPlayground from './ThemeTokensPlayground.svelte';
  import ThemeExplorer from './ThemeExplorer.svelte';
  import CreateThemeFlowExplorer from './CreateThemeFlowExplorer.svelte';

  const popPayTheme = createTheme({
    brandColor: '#F56651',
  }).theme;

  const { Story } = defineMeta({
    title: 'Guides/Theming/BladeProvider',
    component: BladeProvider,
    tags: ['autodocs'],
    argTypes: {
      themeTokens: {
        control: false,
        table: { disable: true },
      },
      children: {
        control: false,
        table: { disable: true },
      },
    },
    parameters: {
      docs: {
        description: {
          component:
            'Theme scope for Blade Svelte. Pass `themeTokens` (`bladeTheme` or `createTheme(...).theme`) and optional `colorScheme`. Nested providers scope scheme via `data-blade-color-scheme`. Use `useTheme()` for runtime scheme changes.',
        },
      },
    },
  });
</script>

<!-- Playground — in-UI chips / segments drive createTheme (not Controls panel) -->
<Story
  name="Playground"
  asChild
  parameters={{ controls: { disable: true } }}
>
  <ThemeTokensPlayground />
</Story>

<!-- Nested brand scopes — each provider owns brand, scheme, and radius tokens. -->
<Story
  name="Nested Color Schemes"
  asChild
  parameters={{ controls: { disable: true } }}
>
  <div class="nested-layout">
    <BladeProvider themeTokens={bladeTheme} colorScheme="light">
      <section class="brand-scope">
        <div class="scope-header">
          <div class="scope-heading">
            <Badge color="primary" emphasis="subtle" size="small">Parent provider</Badge>
            <Heading as="h2" size="large" weight="semibold">Default Blade checkout</Heading>
            <Text size="small" color="surface.text.gray.muted">
              Default Blade theme on light scheme.
            </Text>
          </div>
          <Code size="small">bladeTheme · light</Code>
        </div>
        <div class="scope-preview">
          <div class="scope-copy">
            <Text size="small" color="surface.text.gray.muted">Order total</Text>
            <Heading as="h3" size="medium" weight="semibold">₹12,480</Heading>
          </div>
          <div class="scope-actions">
            <Button variant="primary" size="small">Pay securely</Button>
            <Button variant="secondary" size="small">View details</Button>
          </div>
        </div>

        <div class="nest-connector" aria-hidden="true">
          <span></span>
          Nested provider overrides brand tokens
        </div>

        <BladeProvider themeTokens={popPayTheme} colorScheme="dark">
          <section class="brand-scope nested">
            <div class="scope-header">
              <div class="scope-heading">
                <Badge color="primary" emphasis="subtle" size="small">Nested provider</Badge>
                <Heading as="h3" size="large" weight="semibold">POP Pay rewards</Heading>
                <Text size="small" color="surface.text.gray.muted">
                  POP Pay coral brand on dark scheme.
                </Text>
              </div>
              <Code size="small">#F56651 · dark</Code>
            </div>
            <div class="scope-preview">
              <div class="scope-copy">
                <Text size="small" color="surface.text.gray.muted">Points available</Text>
                <Heading as="h4" size="medium" weight="semibold">2,840 points</Heading>
              </div>
              <div class="scope-actions">
                <Button variant="primary" size="small">Redeem points</Button>
                <Button variant="secondary" size="small">How it works</Button>
              </div>
            </div>
          </section>
        </BladeProvider>
      </section>
    </BladeProvider>
  </div>
</Story>

<!-- Theme Explorer — resolved token tree (mirrors React "Tokens/Theme"). Toolbar brand/scheme drive it. -->
<Story name="Theme Explorer" asChild parameters={{ controls: { disable: true } }}>
  <div class="explorer-story">
    <ThemeExplorer />
  </div>
</Story>

<!-- createTheme flow — palette generation, shade usage, semantic token mapping (design review) -->
<Story
  name="createTheme Flow"
  asChild
  parameters={{ controls: { disable: true } }}
>
  <div class="explorer-story">
    <CreateThemeFlowExplorer />
  </div>
</Story>

<style>
  .nested-layout {
    display: flex;
    justify-content: center;
    padding: var(--spacing-8);
    background-color: var(--surface-background-gray-moderate);
  }

  .brand-scope {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-6);
    width: min(100%, 760px);
    box-sizing: border-box;
    padding: var(--spacing-8);
    background-color: var(--surface-background-gray-subtle);
    border-radius: var(--border-radius-large);
    border: 1px solid var(--surface-border-gray-muted);
    box-shadow: var(--elevation-low-raised);
  }

  .scope-header,
  .scope-preview,
  .scope-actions {
    display: flex;
    align-items: center;
  }

  .scope-header {
    justify-content: space-between;
    gap: var(--spacing-5);
  }

  .scope-heading,
  .scope-copy {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-2);
  }

  .scope-preview {
    justify-content: space-between;
    gap: var(--spacing-5);
    padding: var(--spacing-5);
    background-color: var(--surface-background-primary-subtle);
    border: 1px solid var(--surface-border-primary-muted);
    border-radius: var(--border-radius-medium);
  }

  .scope-actions {
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: var(--spacing-3);
  }

  .nest-connector {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    color: var(--surface-text-gray-muted);
    font-family: var(--font-family-code);
    font-size: var(--font-size-75);
  }

  .nest-connector span {
    width: 28px;
    height: 18px;
    border-left: 1px solid var(--surface-border-gray-muted);
    border-bottom: 1px solid var(--surface-border-gray-muted);
    border-bottom-left-radius: var(--border-radius-small);
  }

  .brand-scope.nested {
    width: 100%;
    box-shadow: none;
  }

  .explorer-story {
    display: flex;
    justify-content: center;
    padding: var(--spacing-8);
    background-color: var(--surface-background-gray-subtle);
  }

  @media (max-width: 768px) {
    .nested-layout,
    .explorer-story {
      padding: var(--spacing-3);
    }

    .brand-scope {
      padding: var(--spacing-5);
    }

    .scope-header,
    .scope-preview {
      align-items: flex-start;
      flex-direction: column;
    }

    .scope-actions {
      justify-content: flex-start;
    }
  }
</style>

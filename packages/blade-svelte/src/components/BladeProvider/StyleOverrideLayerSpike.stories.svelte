<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import BladeProvider from '../BladeProvider/BladeProvider.svelte';
  import Button from '../Button/Button.svelte';
  import Text from '../Typography/Text/Text.svelte';
  import { bladeTheme } from '@razorpay/blade-core/tokens';
  import { getPrimaryBrandCssVars } from '@razorpay/blade-core/styles';
  import { cssVariablesToInlineStyle } from '@razorpay/blade-core/utils';

  const { Story } = defineMeta({
    title: 'Guides/Style Override Layer Spike',
    tags: ['!autodocs'],
    parameters: {
      docs: {
        description: {
          component:
            'Phase 1 proof: `styleOverride` on Button merges provider + instance classes; unlayered consumer classes beat `@layer blade` internals without `!important`. Includes unsafe painted override (layer proof) and safe token bundle counterpart.',
        },
      },
    },
  });

  const safeCtaTokens = getPrimaryBrandCssVars({ bg: '#6c5ce7' });
  const safeCtaTokenStyle = cssVariablesToInlineStyle(safeCtaTokens);
</script>

<style>
  .checkout-cta-unsafe {
    background-color: #6c5ce7;
    border-radius: 4px;
  }

  .checkout-cta-label {
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .provider-cta {
    --interactive-background-primary-default: #2d3436;
  }

  .checkout-cta-safe-shell {
    background-image: none;
  }
</style>

<Story
  name="Unsafe — painted background breaks hover"
  parameters={{
    docs: {
      description: {
        story:
          'Intentionally unsafe: unlayered `background-color` beats `@layer blade` `:hover`. Use for cascade proof only — not for checkout CTAs.',
      },
    },
  }}
>
  <Button
    styleOverride={{
      root: 'checkout-cta-unsafe',
      text: 'checkout-cta-label',
    }}
  >
    Pay Now
  </Button>
</Story>

<Story
  name="Safe — getPrimaryBrandCssVars preserves states"
  parameters={{
    docs: {
      description: {
        story:
          'Token bundle from `getPrimaryBrandCssVars` on an ancestor plus `background-image: none` on root. Hover, focus, and disabled fills still follow Blade pseudo-rules.',
      },
    },
  }}
  asChild
>
  <div class="display-flex flex-col gap-spacing-4 items-start">
    <div style={safeCtaTokenStyle}>
      <Button styleOverride={{ root: 'checkout-cta-safe-shell', text: 'checkout-cta-label' }}>
        Pay Now — hover me
      </Button>
    </div>
    <div style={safeCtaTokenStyle}>
      <Button
        isDisabled
        styleOverride={{ root: 'checkout-cta-safe-shell', text: 'checkout-cta-label' }}
      >
        Pay Now — disabled
      </Button>
    </div>
    <Text size="xsmall" color="surface.text.gray.muted">
      Filled primary stroke is inset box-shadow, not border — use secondary variant for outlined
      CTAs.
    </Text>
  </div>
</Story>

<Story name="Provider componentConfig with instance override" asChild>
  <BladeProvider
    themeTokens={bladeTheme}
    componentConfig={{
      Button: {
        styleOverride: {
          root: 'provider-cta',
          text: 'checkout-cta-label',
        },
      },
    }}
  >
    <div class="display-flex flex-col gap-spacing-4 items-start">
      <Button>Provider only</Button>
      <Button styleOverride={{ root: 'checkout-cta-unsafe' }}>Instance root wins</Button>
    </div>
  </BladeProvider>
</Story>

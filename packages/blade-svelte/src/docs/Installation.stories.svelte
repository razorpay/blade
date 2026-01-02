<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: 'Guides/Installation',
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component: 'Installation guide and quick start examples for Blade Svelte. See the README.md for full documentation.',
        },
      },
    },
  });
</script>

<script>
  import { Button, Text, Heading, Code } from '../components';
</script>

<Story name="Quick Start">
  <div style="max-width: 800px; padding: 24px; font-family: system-ui, sans-serif;">
    <Heading size="xlarge">Installation Guide</Heading>
    
    <div style="margin-top: 24px;">
      <Heading size="large">Step 1: Install Packages</Heading>
      <Text size="medium" color="surface.text.gray.muted">Install the required packages:</Text>
      <pre style="background: #f4f4f5; padding: 16px; border-radius: 8px; margin: 12px 0; overflow-x: auto;"><code>yarn add @razorpay/blade-svelte @razorpay/blade-core</code></pre>
      <div style="margin-top: 12px; padding: 12px; background: #fafafa; border-radius: 8px; border-left: 3px solid #3b82f6;">
        <Text size="small" weight="semibold">Package Overview:</Text>
        <ul style="margin: 8px 0 0 0; padding-left: 20px;">
          <li><Text size="small"><strong>@razorpay/blade-svelte</strong> - Svelte components (Button, Text, Heading, etc.)</Text></li>
          <li><Text size="small"><strong>@razorpay/blade-core</strong> - Design tokens, CSS styles, and fonts</Text></li>
        </ul>
      </div>
    </div>

    <div style="margin-top: 24px;">
      <Heading size="large">Step 2: Import Theme CSS</Heading>
      <Text size="medium" color="surface.text.gray.muted">Add to your entry file or layout:</Text>
      <pre style="background: #f4f4f5; padding: 16px; border-radius: 8px; margin: 12px 0; overflow-x: auto;"><code>import '@razorpay/blade-core/tokens/theme.css';</code></pre>
    </div>

    <div style="margin-top: 24px;">
      <Heading size="large">Step 3: Import Fonts</Heading>
      <Text size="medium" color="surface.text.gray.muted">Add Blade fonts:</Text>
      <pre style="background: #f4f4f5; padding: 16px; border-radius: 8px; margin: 12px 0; overflow-x: auto;"><code>import '@razorpay/blade-core/fonts.css';</code></pre>
    </div>

    <div style="margin-top: 24px;">
      <Heading size="large">Step 4: Use Components</Heading>
      <Text size="medium" color="surface.text.gray.muted">Import and use Blade components:</Text>
      <pre style="background: #f4f4f5; padding: 16px; border-radius: 8px; margin: 12px 0; overflow-x: auto;"><code>{`import { Button, Text, Heading } from '@razorpay/blade-svelte/components';`}</code></pre>
    </div>
  </div>
</Story>

<Story name="Dark Mode">
  <div style="padding: 24px; max-width: 600px;">
    <Heading size="large">Theme Switching</Heading>
    <Text size="medium" color="surface.text.gray.muted">
      To enable dark mode, add data-theme="dark" to your body element:
    </Text>
    <pre style="background: #f4f4f5; padding: 16px; border-radius: 8px; margin: 12px 0; overflow-x: auto;"><code>{`<body data-theme="dark">
  <!-- Your app -->
</body>`}</code></pre>
    <Text size="small" color="surface.text.gray.muted">
      Use the theme switcher in the Storybook toolbar to preview dark mode.
    </Text>
  </div>
</Story>

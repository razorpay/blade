<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: 'Guides/Browser Compatibility',
  });
</script>

<script>
  import { Heading, Text } from '../components';
</script>

<Story name="Matrix">
  <div style="max-width: 800px; padding: 24px; font-family: system-ui, sans-serif;">
    <Text size="medium" color="surface.text.gray.muted">
      Blade Svelte components are tested on BrowserStack against the following browser/OS matrix,
      defined in
      <a
        href="https://github.com/razorpay/blade/blob/master/packages/blade-svelte/tests/browserstack/playwright.config.cts"
        >playwright.config.cts</a
      >
      (desktop) and
      <a
        href="https://github.com/razorpay/blade/blob/master/packages/blade-svelte/browserstack.yml"
        >browserstack.yml</a
      >
      (mobile). It uses the same configuration as the one used in checkout.
    </Text>

    <div style="margin-top: 24px;">
      <Heading size="large">Desktop</Heading>
      <div class="bc-table-wrapper">
        <table class="bc-table">
          <thead>
            <tr>
              <th>OS</th>
              <th>Version</th>
              <th>Browser</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Windows</td>
              <td>11</td>
              <td>Chrome (latest)</td>
            </tr>
            <tr>
              <td>OS X</td>
              <td>Ventura</td>
              <td>Playwright-WebKit (latest)</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Text size="small" color="surface.text.gray.muted" style="margin-top: 12px; display: block;">
        Minimum supported Chrome version: components work down to <strong>Chrome 83</strong>, the
        floor of BrowserStack's Windows 11 + Chrome matrix (BrowserStack rejects Chrome ≤82 on
        Windows 11 as an invalid OS/browser combination, independent of Blade's code).
      </Text>
    </div>

    <div style="margin-top: 24px;">
      <Heading size="large">Mobile</Heading>
      <div class="bc-table-wrapper">
        <table class="bc-table">
          <thead>
            <tr>
              <th>OS</th>
              <th>Version</th>
              <th>Browser / Device</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Android</td>
              <td>13.0</td>
              <td>Chrome — Google Pixel 7</td>
            </tr>
            <tr>
              <td>iOS</td>
              <td>latest</td>
              <td>Safari — iPhone 15 Pro</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</Story>

<style>
  .bc-table-wrapper {
    margin-top: 12px;
    border: var(--border-width-thin) solid var(--surface-border-gray-muted);
    border-radius: var(--border-radius-medium);
    overflow: hidden;
    margin-bottom: 12px;
  }

  .bc-table {
    width: 100%;
    border-collapse: collapse;
  }

  .bc-table thead th {
    text-align: left;
    padding: var(--spacing-4) var(--spacing-4);
    background-color: var(--surface-background-gray-moderate);
    border-bottom: var(--border-width-thin) solid var(--surface-border-gray-muted);
    font-size: var(--font-size-75);
    font-weight: var(--font-weight-medium);
    color: var(--surface-text-gray-muted);
  }

  .bc-table tbody td {
    padding: var(--spacing-4) var(--spacing-4);
    border-bottom: var(--border-width-thin) solid var(--surface-border-gray-muted);
    font-size: var(--font-size-100);
    color: var(--surface-text-gray-subtle);
  }

  .bc-table tbody tr:last-child td {
    border-bottom: none;
  }

</style>

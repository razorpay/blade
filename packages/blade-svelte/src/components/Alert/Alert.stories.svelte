<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Alert from './Alert.svelte';
  
  const { Story } = defineMeta({
    title: 'Components/Alert',
    component: Alert,
    tags: ['autodocs'],
    args: {
      description: 'This is a basic alert message',
      color: 'neutral',
      emphasis: 'subtle',
      isDismissible: true,
    },
    argTypes: {
      title: {
        control: 'text',
        description: 'Alert title',
      },
      description: {
        control: 'text',
        description: 'Alert description text',
      },
      color: {
        control: 'select',
        options: ['information', 'negative', 'neutral', 'notice', 'positive'],
        description: 'Color of the alert',
        table: {
          defaultValue: { summary: 'information' },
        },
      },
      emphasis: {
        control: 'select',
        options: ['subtle', 'intense'],
        description: 'Visual emphasis level',
        table: {
          defaultValue: { summary: 'subtle' },
        },
      },
      isDismissible: {
        control: 'boolean',
        description: 'Whether the alert can be dismissed',
        table: {
          defaultValue: { summary: 'false' },
        },
      },
      isFullWidth: {
        control: 'boolean',
        description: 'Whether the alert takes full width',
      },
      icon: {
        control: 'text',
        description: 'Custom icon name',
      },
      testID: {
        control: 'text',
        description: 'Test ID for testing',
      },
    },
  });
</script>

<script>
  // Alert is already imported in the module context
</script>

<!-- Playground story - auto-renders Alert with args -->
<Story name="Playground" />

<!-- ============ BASIC ALERTS ============ -->

<Story name="Default">
  <Alert description="This is a basic alert message with default configuration." />
</Story>

<Story name="With Title">
  <Alert title="Alert Title" description="This alert includes both a title and description for more context." />
</Story>

<!-- ============ COLOR VARIANTS ============ -->

<Story name="Information Subtle">
  <Alert 
    color="information" 
    emphasis="subtle"
    title="Information Alert"
    description="This is an informational message to keep you updated." 
  />
</Story>

<Story name="Information Intense">
  <Alert 
    color="information" 
    emphasis="intense"
    title="Information Alert"
    description="This is an informational message with intense emphasis." 
  />
</Story>

<Story name="Positive Subtle">
  <Alert 
    color="positive" 
    emphasis="subtle"
    title="Success"
    description="Your action was completed successfully!" 
  />
</Story>

<Story name="Positive Intense">
  <Alert 
    color="positive" 
    emphasis="intense"
    title="Success"
    description="Your action was completed successfully with intense emphasis!" 
  />
</Story>

<Story name="Negative Subtle">
  <Alert 
    color="negative" 
    emphasis="subtle"
    title="Error"
    description="Something went wrong. Please try again." 
  />
</Story>

<Story name="Negative Intense">
  <Alert 
    color="negative" 
    emphasis="intense"
    title="Error"
    description="Something went wrong with intense emphasis." 
  />
</Story>

<Story name="Notice Subtle">
  <Alert 
    color="notice" 
    emphasis="subtle"
    title="Warning"
    description="Please review this information carefully." 
  />
</Story>

<Story name="Notice Intense">
  <Alert 
    color="notice" 
    emphasis="intense"
    title="Warning"
    description="Please review this information carefully with intense emphasis." 
  />
</Story>

<Story name="Neutral Subtle">
  <Alert 
    color="neutral" 
    emphasis="subtle"
    title="Note"
    description="This is a neutral informational message." 
  />
</Story>

<Story name="Neutral Intense">
  <Alert 
    color="neutral" 
    emphasis="intense"
    title="Note"
    description="This is a neutral informational message with intense emphasis." 
  />
</Story>

<!-- ============ DISMISSIBLE ALERTS ============ -->

<Story name="Dismissible">
  <Alert 
    title="Dismissible Alert"
    description="This alert can be dismissed by clicking the close button."
    isDismissible={true}
  />
</Story>

<Story name="Dismissible with Custom Action">
  <Alert 
    title="Action Alert"
    description="This alert has a custom dismiss action."
    isDismissible={true}
    onDismiss={() => console.log('Alert dismissed')}
  />
</Story>

<!-- ============ LAYOUT VARIANTS ============ -->

<Story name="Full Width">
  <div style="width: 100%;">
    <Alert 
      title="Full Width Alert"
      description="This alert takes the full width of its container."
      isFullWidth={true}
    />
  </div>
</Story>

<Story name="Constrained Width">
  <div style="max-width: 600px;">
    <Alert 
      title="Constrained Alert"
      description="This alert is constrained by its parent container width."
    />
  </div>
</Story>

<!-- ============ CUSTOM ICONS ============ -->

<Story name="Custom Icon">
  <Alert 
    icon="AlertCircleIcon"
    title="Custom Icon"
    description="This alert uses a custom icon instead of the default." 
  />
</Story>

<!-- ============ CONTENT VARIANTS ============ -->

<Story name="Long Title">
  <Alert 
    title="This is a very long alert title that might wrap to multiple lines depending on the container width"
    description="Short description."
  />
</Story>

<Story name="Long Description">
  <Alert 
    title="Alert Title"
    description="This is a very long description that provides detailed information about the alert. It might span multiple lines and should handle text wrapping gracefully. The alert component should accommodate longer text content while maintaining readability and visual hierarchy."
  />
</Story>

<Story name="Description Only">
  <Alert description="This alert only has a description without a title." />
</Story>

<Story name="No Description">
  <Alert title="Title Only Alert" />
</Story>

<!-- ============ SHOWCASE - ALL COLORS SUBTLE ============ -->

<Story name="All Colors Subtle">
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <Alert 
      color="information" 
      emphasis="subtle"
      title="Information"
      description="Informational message" 
    />
    <Alert 
      color="positive" 
      emphasis="subtle"
      title="Success"
      description="Success message" 
    />
    <Alert 
      color="negative" 
      emphasis="subtle"
      title="Error"
      description="Error message" 
    />
    <Alert 
      color="notice" 
      emphasis="subtle"
      title="Warning"
      description="Warning message" 
    />
    <Alert 
      color="neutral" 
      emphasis="subtle"
      title="Note"
      description="Neutral message" 
    />
  </div>
</Story>

<!-- ============ SHOWCASE - ALL COLORS INTENSE ============ -->

<Story name="All Colors Intense">
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <Alert 
      color="information" 
      emphasis="intense"
      title="Information"
      description="Informational message" 
    />
    <Alert 
      color="positive" 
      emphasis="intense"
      title="Success"
      description="Success message" 
    />
    <Alert 
      color="negative" 
      emphasis="intense"
      title="Error"
      description="Error message" 
    />
    <Alert 
      color="notice" 
      emphasis="intense"
      title="Warning"
      description="Warning message" 
    />
    <Alert 
      color="neutral" 
      emphasis="intense"
      title="Note"
      description="Neutral message" 
    />
  </div>
</Story>

<!-- ============ INTERACTIVE EXAMPLES ============ -->

<Story name="With Actions">
  <Alert 
    title="Interactive Alert"
    description="Click the button to perform an action."
    isDismissible={true}
    onDismiss={() => {
      console.log('Alert dismissed');
      alert('Alert was dismissed!');
    }}
  />
</Story>

<!-- ============ SPACING AND LAYOUT ============ -->

<Story name="Multiple Alerts">
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <Alert 
      color="information" 
      title="First Alert"
      description="This is the first alert in a series." 
    />
    <Alert 
      color="positive" 
      title="Second Alert"
      description="This is the second alert." 
    />
    <Alert 
      color="notice" 
      title="Third Alert"
      description="This is the third alert." 
      isDismissible={true}
    />
  </div>
</Story>

<Story name="With Margin">
  <div style="padding: 20px; background: #f5f5f5;">
    <Alert 
      title="Alert with Margin"
      description="This alert has margin applied."
      margin="spacing.4"
    />
  </div>
</Story>

<!-- ============ ACCESSIBILITY ============ -->

<Story name="With Test ID">
  <Alert 
    title="Test Alert"
    description="This alert has a test ID for automated testing."
    testID="alert-test-id"
  />
</Story>

<Story name="With Aria Label">
  <Alert 
    title="Accessible Alert"
    description="This alert has proper ARIA attributes for screen readers."
    aria-label="Important notification"
  />
</Story>

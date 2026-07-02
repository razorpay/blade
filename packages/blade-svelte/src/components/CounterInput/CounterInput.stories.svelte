<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CounterInput from './CounterInput.svelte';

  const { Story } = defineMeta({
    title: 'Components/Input/CounterInput',
    component: CounterInput,
    tags: ['autodocs'],
    args: {
      label: 'Quantity',
      defaultValue: 5,
      min: 0,
      max: 100,
      emphasis: 'subtle',
      size: 'medium',
      isLoading: false,
      isDisabled: false,
    },
    argTypes: {
      onChange: { action: 'onChange' },
      onFocus: { action: 'onFocus' },
      onBlur: { action: 'onBlur' },
      emphasis: {
        control: { type: 'select' },
        options: ['subtle', 'intense'],
      },
      size: {
        control: { type: 'select' },
        options: ['xsmall', 'medium', 'large'],
      },
      value: {
        control: { disable: true },
        table: { category: 'State Management' },
      },
      defaultValue: {
        control: { type: 'number' },
        table: { category: 'State Management' },
      },
      labelPosition: {
        control: { type: 'select' },
        options: ['top', 'left'],
      },
      label: {
        description: 'Label for the `CounterInput`.',
        control: { type: 'text' },
      },
      accessibilityLabel: {
        description: 'Accessibility label for the `CounterInput`.',
        control: { type: 'text' },
      },
    },
  });
</script>

<script lang="ts">
  import Text from '../Typography/Text/Text.svelte';
  import ToastContainer from '../Toast/ToastContainer.svelte';
  import { useToast } from '../Toast/useToast';

  const toast = useToast();

  const columnGap4 = 'display: flex; flex-direction: column; gap: var(--spacing-4);';
  const columnGap6 = 'display: flex; flex-direction: column; gap: var(--spacing-6);';
  const columnGap3 = 'display: flex; flex-direction: column; gap: var(--spacing-3);';
  const columnGap2 = 'display: flex; flex-direction: column; gap: var(--spacing-2);';
  const infoBoxStyle =
    'padding: var(--spacing-4); background-color: var(--surface-background-gray-intense); border-radius: var(--border-radius-medium);';

  // Basic Usage
  let basicValue = $state(5);

  // Size Variants
  let xsmallValue = $state(1);
  let mediumValue = $state(2);
  let largeValue = $state(3);

  // Emphasis Variants
  let subtleValue = $state(5);
  let intenseValue = $state(5);

  // Min Max Constraints
  let minMaxValue = $state(5);

  // Loading State
  let loadingCounters = $state({
    cartQuantity: { value: 5, isLoading: false },
    subscriptionSeats: { value: 3, isLoading: false },
  });

  function handleLoadingChange(
    key: keyof typeof loadingCounters,
    loadingDuration: number,
  ): (payload: { value: number }) => void {
    return ({ value }) => {
      loadingCounters[key] = { value, isLoading: true };
      setTimeout(() => {
        loadingCounters[key] = { ...loadingCounters[key], isLoading: false };
      }, loadingDuration);
    };
  }

  // Controlled Loading
  let controlledValue = $state(5);
  let controlledIsLoading = $state(false);

  async function handleControlledChange({ value }: { value: number }): Promise<void> {
    controlledIsLoading = true;
    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.5) {
            resolve(true);
          } else {
            reject(new Error('API call failed'));
          }
        }, 1500);
      });
      controlledValue = value;
      toast.show({ content: `Successfully changed value to ${value}`, color: 'positive' });
    } catch {
      toast.show({ content: 'Failed to change value. Please try again.', color: 'negative' });
    } finally {
      controlledIsLoading = false;
    }
  }

  // Disabled State
  let disabledValue = $state(5);

  // Label Positioning
  let topValue = $state(1);
  let leftValue = $state(2);

  // Multiple Counter Inputs
  let formData = $state({ quantity: 2, licenses: 1, users: 5 });

  function handleFieldChange(field: keyof typeof formData): (payload: { value: number }) => void {
    return ({ value }) => {
      formData[field] = value;
    };
  }

  // With Toast Validation
  let validationQuantity = $state(1);

  function handleValidationChange({ value }: { value: number }): void {
    validationQuantity = value;
    if (value > 5) {
      toast.show({
        content: `Quantity ${value} exceeds limit of 5!`,
        color: 'negative',
        autoDismiss: true,
        duration: 3000,
      });
    } else if (value >= 3) {
      toast.show({
        content: `Bulk discount applied for ${value} items!`,
        color: 'positive',
        autoDismiss: true,
        duration: 3000,
      });
    }
  }
</script>

<!-- 1. Basic Usage -->
<Story name="Basic Usage">
  {#snippet template(args)}
    <div style={columnGap4}>
      <Text size="large" weight="semibold">Basic Usage</Text>
      <Text size="medium" color="surface.text.gray.muted">
        Simple counter input with label, value, and onChange handler.
      </Text>
      <CounterInput
        label="Basic Counter"
        {...args}
        value={basicValue}
        onChange={({ value }) => (basicValue = value)}
      />
      <Text size="small" color="surface.text.gray.subtle">Current value: {basicValue}</Text>
    </div>
  {/snippet}
</Story>

<!-- 2. Size Variants -->
<Story name="Size Variants">
  {#snippet template(args)}
    <div style={columnGap6}>
      <Text size="large" weight="semibold">Size Variants</Text>

      <div style={columnGap3}>
        <Text size="medium" weight="medium">XSmall Size</Text>
        <CounterInput
          label="XSmall Counter"
          {...args}
          size="xsmall"
          value={xsmallValue}
          onChange={({ value }) => (xsmallValue = value)}
          min={0}
        />
      </div>

      <div style={columnGap3}>
        <Text size="medium" weight="medium">Medium Size (Default)</Text>
        <CounterInput
          label="Medium Counter"
          size="medium"
          value={mediumValue}
          onChange={({ value }) => (mediumValue = value)}
          min={0}
        />
      </div>

      <div style={columnGap3}>
        <Text size="medium" weight="medium">Large Size</Text>
        <CounterInput
          label="Large Counter"
          size="large"
          value={largeValue}
          onChange={({ value }) => (largeValue = value)}
          min={0}
        />
      </div>
    </div>
  {/snippet}
</Story>

<!-- 3. Emphasis Variants -->
<Story name="Emphasis Variants">
  {#snippet template(args)}
    <div style={columnGap6}>
      <Text size="large" weight="semibold">Emphasis Variants</Text>

      <div style={columnGap3}>
        <Text size="medium" weight="medium">Subtle Emphasis (Default)</Text>
        <Text size="small" color="surface.text.gray.muted">
          Gray icons and borders, no progress bar color
        </Text>
        <CounterInput
          label="Subtle Counter"
          {...args}
          emphasis="subtle"
          value={subtleValue}
          onChange={({ value }) => (subtleValue = value)}
          min={0}
          max={10}
        />
      </div>

      <div style={columnGap3}>
        <Text size="medium" weight="medium">Intense Emphasis</Text>
        <Text size="small" color="surface.text.gray.muted">
          Primary colored icons and borders, blue progress bar
        </Text>
        <CounterInput
          label="Intense Counter"
          emphasis="intense"
          value={intenseValue}
          onChange={({ value }) => (intenseValue = value)}
          min={0}
          max={10}
        />
      </div>
    </div>
  {/snippet}
</Story>

<!-- 4. Min Max Constraints -->
<Story name="Min Max Constraints">
  {#snippet template(args)}
    <div style={columnGap4}>
      <Text size="large" weight="semibold">Min/Max Constraints</Text>
      <Text size="medium" color="surface.text.gray.muted">
        Counter with minimum value of 1 and maximum value of 10. Buttons disable at limits.
      </Text>
      <CounterInput
        label="Constrained Counter"
        {...args}
        value={minMaxValue}
        onChange={({ value }) => (minMaxValue = value)}
        min={1}
        max={10}
      />
      <Text size="small" color="surface.text.gray.subtle">
        Current: {minMaxValue} | Min: 1 | Max: 10
      </Text>
    </div>
  {/snippet}
</Story>

<!-- 5. Uncontrolled Component -->
<Story name="Uncontrolled Component">
  {#snippet template(args)}
    <div style={columnGap4}>
      <Text size="large" weight="semibold">Uncontrolled Component</Text>
      <Text size="medium" color="surface.text.gray.muted">
        Counter with defaultValue, manages its own state internally.
      </Text>
      <CounterInput
        label="Uncontrolled Counter"
        {...args}
        defaultValue={3}
        min={0}
        max={20}
        onChange={({ value }) => console.log('Uncontrolled value changed:', value)}
      />
    </div>
  {/snippet}
</Story>

<!-- 6. Loading State -->
<Story name="Loading State">
  {#snippet template(args)}
    <div style={columnGap4}>
      <Text size="large" weight="semibold">Loading State</Text>
      <Text size="medium" color="surface.text.gray.muted">
        Shows loading indicator and disables interactions during async operations.
      </Text>
      <CounterInput
        label="Cart Quantity (2.5s loading)"
        {...args}
        value={loadingCounters.cartQuantity.value}
        onChange={handleLoadingChange('cartQuantity', 2500)}
        isLoading={loadingCounters.cartQuantity.isLoading}
        emphasis="intense"
        min={0}
        max={10}
      />
      <CounterInput
        label="Subscription Seats (1s loading)"
        {...args}
        value={loadingCounters.subscriptionSeats.value}
        onChange={handleLoadingChange('subscriptionSeats', 1000)}
        isLoading={loadingCounters.subscriptionSeats.isLoading}
        emphasis="subtle"
        min={1}
        max={20}
      />
    </div>
  {/snippet}
</Story>

<!-- 7. Controlled Loading -->
<Story name="Controlled Loading">
  {#snippet template(args)}
    <div style={columnGap4}>
      <Text size="large" weight="semibold">Controlled Loading Example</Text>
      <Text size="medium" color="surface.text.gray.muted">
        User has full control over when the value changes and loading state. Value only updates
        after successful async operation.
      </Text>
      <CounterInput
        label="API-Controlled Counter"
        {...args}
        value={controlledValue}
        onChange={handleControlledChange}
        isLoading={controlledIsLoading}
        min={1}
        max={10}
        emphasis="intense"
      />
      <div style={columnGap2}>
        <Text size="small" color="surface.text.gray.subtle">Current value: {controlledValue}</Text>
        <Text size="small" color="surface.text.gray.subtle">
          Status: {controlledIsLoading ? 'Loading...' : 'Ready'}
        </Text>
        <Text size="small" color="surface.text.gray.muted">
          • Loading starts immediately when button is clicked • Value only changes after successful
          API response • Random 50% failure rate to demonstrate error handling
        </Text>
      </div>
      <ToastContainer />
    </div>
  {/snippet}
</Story>

<!-- 8. Disabled State -->
<Story name="Disabled State">
  {#snippet template(args)}
    <div style={columnGap4}>
      <Text size="large" weight="semibold">Disabled State</Text>
      <Text size="medium" color="surface.text.gray.muted">
        Counter input in disabled state - no interactions allowed.
      </Text>
      <CounterInput
        label="Disabled Counter"
        {...args}
        value={disabledValue}
        onChange={({ value }) => (disabledValue = value)}
        isDisabled={true}
      />
      <CounterInput
        label="Disabled Counter"
        {...args}
        emphasis="subtle"
        value={disabledValue}
        onChange={({ value }) => (disabledValue = value)}
        isDisabled={true}
      />
    </div>
  {/snippet}
</Story>

<!-- 9. Label Positioning -->
<Story name="Label Positioning">
  {#snippet template(args)}
    <div style={columnGap6}>
      <Text size="large" weight="semibold">Label Positioning</Text>

      <div style={columnGap3}>
        <Text size="medium" weight="medium">Top Position (Default)</Text>
        <CounterInput
          label="Top Label"
          {...args}
          labelPosition="top"
          value={topValue}
          onChange={({ value }) => (topValue = value)}
          min={0}
          max={10}
        />
      </div>

      <div style={columnGap3}>
        <Text size="medium" weight="medium">Left Position</Text>
        <CounterInput
          label="Left Label"
          {...args}
          labelPosition="left"
          value={leftValue}
          onChange={({ value }) => (leftValue = value)}
          min={0}
          max={10}
        />
      </div>
    </div>
  {/snippet}
</Story>

<!-- 10. Multiple Counter Inputs -->
<Story name="Multiple Counter Inputs">
  {#snippet template(args)}
    <div style={columnGap6}>
      <Text size="large" weight="semibold">Multiple Counter Inputs</Text>
      <Text size="medium" color="surface.text.gray.muted">
        Multiple counter inputs for payment and subscription management.
      </Text>

      <div style={columnGap4}>
        <CounterInput
          label="Product Quantity"
          {...args}
          name="quantity"
          value={formData.quantity}
          onChange={handleFieldChange('quantity')}
          min={1}
          max={100}
        />
        <CounterInput
          label="API Licenses"
          {...args}
          name="licenses"
          value={formData.licenses}
          onChange={handleFieldChange('licenses')}
          min={1}
          max={20}
        />
        <CounterInput
          label="Team Members"
          {...args}
          name="users"
          value={formData.users}
          onChange={handleFieldChange('users')}
          min={1}
          max={50}
        />
      </div>

      <div style={infoBoxStyle}>
        <Text size="small" weight="medium">Subscription Details:</Text>
        <Text size="small" color="surface.text.gray.subtle">
          Quantity: {formData.quantity}, Licenses: {formData.licenses}, Team Members: {formData.users}
        </Text>
      </div>
    </div>
  {/snippet}
</Story>

<!-- 11. With Toast Validation -->
<Story name="With Toast Validation">
  {#snippet template(args)}
    <div style={columnGap4}>
      <ToastContainer />

      <Text size="large" weight="semibold">Validation with Toast Notifications</Text>

      <CounterInput
        label="Order Quantity"
        {...args}
        value={validationQuantity}
        onChange={handleValidationChange}
        min={1}
        max={10}
      />

      <div style={infoBoxStyle}>
        <Text size="small" weight="medium">Validation Rules (Small Thresholds):</Text>
        <Text size="small" color="surface.text.gray.subtle">• 1-2 items: No toast</Text>
        <Text size="small" color="surface.text.gray.subtle">
          • 3-5 items: Success toast - "Bulk discount applied"
        </Text>
        <Text size="small" color="surface.text.gray.subtle">
          • 6+ items: Error toast - "Exceeds limit of 5"
        </Text>
      </div>
    </div>
  {/snippet}
</Story>

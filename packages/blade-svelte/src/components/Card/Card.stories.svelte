<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: 'Components/Card',
    component: Card,
    tags: ['autodocs'],
  });
</script>

<script lang="ts">
  import {
    Card,
    CardBody,
    CardHeader,
    CardHeaderLeading,
    CardHeaderTrailing,
    CardFooter,
    CardFooterLeading,
    CardFooterTrailing,
  } from './index';
  import Text from '../Typography/Text/Text.svelte';
  import Badge from '../Badge/Badge.svelte';
  import Counter from '../Counter/Counter.svelte';
</script>

<!-- ============ BASIC CARDS ============ -->

<Story name="Basic Card">
  <Card>
    {#snippet children()}
      <CardBody>
        {#snippet children()}
          <Text>This is a basic card with default styling.</Text>
        {/snippet}
      </CardBody>
    {/snippet}
  </Card>
</Story>

<Story name="Card with Header">
  <Card>
    {#snippet children()}
      <CardHeader>
        {#snippet children()}
          <CardHeaderLeading title="Card Title" subtitle="Card subtitle" />
        {/snippet}
      </CardHeader>
      <CardBody>
        {#snippet children()}
          <Text>This is a card with a header.</Text>
        {/snippet}
      </CardBody>
    {/snippet}
  </Card>
</Story>

<Story name="Card with Header and Footer">
  <Card>
    {#snippet children()}
      <CardHeader>
        {#snippet children()}
          <CardHeaderLeading title="Card Title" subtitle="Card subtitle" />
        {/snippet}
      </CardHeader>
      <CardBody>
        {#snippet children()}
          <Text>This is a card with header and footer.</Text>
        {/snippet}
      </CardBody>
      <CardFooter>
        {#snippet children()}
          <CardFooterLeading title="Footer Title" subtitle="Footer subtitle" />
          <CardFooterTrailing
            actions={{
              primary: { text: 'Primary Action', onClick: () => console.log('Primary clicked') },
              secondary: {
                text: 'Secondary Action',
                onClick: () => console.log('Secondary clicked'),
              },
            }}
          />
        {/snippet}
      </CardFooter>
    {/snippet}
  </Card>
</Story>

<!-- ============ ELEVATION VARIANTS ============ -->

<Story name="Elevation Variants">
  <div style="display: flex; gap: 16px; flex-wrap: wrap;">
    <Card elevation="none" width="200px">
      {#snippet children()}
        <CardBody>
          {#snippet children()}
            <Text>Elevation: none</Text>
          {/snippet}
        </CardBody>
      {/snippet}
    </Card>
    <Card elevation="lowRaised" width="200px">
      {#snippet children()}
        <CardBody>
          {#snippet children()}
            <Text>Elevation: lowRaised</Text>
          {/snippet}
        </CardBody>
      {/snippet}
    </Card>
    <Card elevation="midRaised" width="200px">
      {#snippet children()}
        <CardBody>
          {#snippet children()}
            <Text>Elevation: midRaised</Text>
          {/snippet}
        </CardBody>
      {/snippet}
    </Card>
    <Card elevation="highRaised" width="200px">
      {#snippet children()}
        <CardBody>
          {#snippet children()}
            <Text>Elevation: highRaised</Text>
          {/snippet}
        </CardBody>
      {/snippet}
    </Card>
  </div>
</Story>

<!-- ============ BACKGROUND COLOR VARIANTS ============ -->

<Story name="Background Color Variants">
  <div style="display: flex; gap: 16px; flex-wrap: wrap;">
    <Card backgroundColor="surface.background.gray.intense" width="200px">
      {#snippet children()}
        <CardBody>
          {#snippet children()}
            <Text>Background: intense</Text>
          {/snippet}
        </CardBody>
      {/snippet}
    </Card>
    <Card backgroundColor="moderate" width="200px">
      {#snippet children()}
        <CardBody>
          {#snippet children()}
            <Text>Background: moderate</Text>
          {/snippet}
        </CardBody>
      {/snippet}
    </Card>
    <Card backgroundColor="subtle" width="200px">
      {#snippet children()}
        <CardBody>
          {#snippet children()}
            <Text>Background: subtle</Text>
          {/snippet}
        </CardBody>
      {/snippet}
    </Card>
  </div>
</Story>

<!-- ============ BORDER RADIUS VARIANTS ============ -->

<Story name="Border Radius Variants">
  <div style="display: flex; gap: 16px; flex-wrap: wrap;">
    <Card borderRadius="medium" width="200px">
      {#snippet children()}
        <CardBody>
          {#snippet children()}
            <Text>Border Radius: medium</Text>
          {/snippet}
        </CardBody>
      {/snippet}
    </Card>
    <Card borderRadius="large" width="200px">
      {#snippet children()}
        <CardBody>
          {#snippet children()}
            <Text>Border Radius: large</Text>
          {/snippet}
        </CardBody>
      {/snippet}
    </Card>
    <Card borderRadius="xlarge" width="200px">
      {#snippet children()}
        <CardBody>
          {#snippet children()}
            <Text>Border Radius: xlarge</Text>
          {/snippet}
        </CardBody>
      {/snippet}
    </Card>
  </div>
</Story>

<!-- ============ SIZE VARIANTS ============ -->

<Story name="Size Variants">
  <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: flex-start;">
    <Card size="medium" width="200px">
      {#snippet children()}
        <CardHeader>
          {#snippet children()}
            <CardHeaderLeading title="Medium Size" subtitle="Size prop: medium" />
          {/snippet}
        </CardHeader>
        <CardBody>
          {#snippet children()}
            <Text>This card uses medium size which affects header/footer text sizes.</Text>
          {/snippet}
        </CardBody>
      {/snippet}
    </Card>
    <Card size="large" width="200px">
      {#snippet children()}
        <CardHeader>
          {#snippet children()}
            <CardHeaderLeading title="Large Size" subtitle="Size prop: large" />
          {/snippet}
        </CardHeader>
        <CardBody>
          {#snippet children()}
            <Text>This card uses large size which affects header/footer text sizes.</Text>
          {/snippet}
        </CardBody>
      {/snippet}
    </Card>
  </div>
</Story>

<!-- ============ PADDING VARIANTS ============ -->

<Story name="Padding Variants">
  <div style="display: flex; gap: 16px; flex-wrap: wrap;">
    <Card padding="spacing.0" width="200px" backgroundColor="moderate">
      {#snippet children()}
        <CardBody>
          {#snippet children()}
            <Text>Padding: 0</Text>
          {/snippet}
        </CardBody>
      {/snippet}
    </Card>
    <Card padding="spacing.3" width="200px" backgroundColor="moderate">
      {#snippet children()}
        <CardBody>
          {#snippet children()}
            <Text>Padding: 3</Text>
          {/snippet}
        </CardBody>
      {/snippet}
    </Card>
    <Card padding="spacing.5" width="200px" backgroundColor="moderate">
      {#snippet children()}
        <CardBody>
          {#snippet children()}
            <Text>Padding: 5</Text>
          {/snippet}
        </CardBody>
      {/snippet}
    </Card>
    <Card padding="spacing.7" width="200px" backgroundColor="moderate">
      {#snippet children()}
        <CardBody>
          {#snippet children()}
            <Text>Padding: 7</Text>
          {/snippet}
        </CardBody>
      {/snippet}
    </Card>
  </div>
</Story>

<!-- ============ INTERACTIVE STATES ============ -->

<Story name="Selected Card">
  <Card isSelected={true} width="300px">
    {#snippet children()}
      <CardBody>
        {#snippet children()}
          <Text>This is a selected card with a border highlight.</Text>
        {/snippet}
      </CardBody>
    {/snippet}
  </Card>
</Story>

<Story name="Clickable Card">
  <Card onClick={() => alert('Card clicked!')} width="300px">
    {#snippet children()}
      <CardBody>
        {#snippet children()}
          <Text>Click this card to see alert.</Text>
        {/snippet}
      </CardBody>
    {/snippet}
  </Card>
</Story>

<Story name="Card with Link">
  <Card href="https://razorpay.com" target="_blank" width="300px">
    {#snippet children()}
      <CardBody>
        {#snippet children()}
          <Text>This card is a link. Click to navigate to Razorpay.</Text>
        {/snippet}
      </CardBody>
    {/snippet}
  </Card>
</Story>

<Story name="Card with Hover Handler">
  <Card onHover={() => console.log('Card hovered')} width="300px">
    {#snippet children()}
      <CardBody>
        {#snippet children()}
          <Text>Hover over this card to see console log.</Text>
        {/snippet}
      </CardBody>
    {/snippet}
  </Card>
</Story>

<Story name="Card with Scale on Hover (Deprecated)">
  <Card shouldScaleOnHover={true} width="300px">
    {#snippet children()}
      <CardBody>
        {#snippet children()}
          <Text>This card scales on hover (deprecated feature).</Text>
        {/snippet}
      </CardBody>
    {/snippet}
  </Card>
</Story>

<Story name="Card as Label">
  <Card as="label" cursor="pointer" width="300px">
    {#snippet children()}
      <CardBody>
        {#snippet children()}
          <Text>This card renders as a label element.</Text>
        {/snippet}
      </CardBody>
    {/snippet}
  </Card>
</Story>

<!-- ============ HEADER VARIANTS ============ -->

<Story name="Card with Header Trailing Badge">
  <Card width="400px">
    {#snippet children()}
      <CardHeader>
        {#snippet children()}
          <CardHeaderLeading title="Card Title" subtitle="Card subtitle" />
          <CardHeaderTrailing>
            {#snippet visual()}
              <Badge>New</Badge>
            {/snippet}
          </CardHeaderTrailing>
        {/snippet}
      </CardHeader>
      <CardBody>
        {#snippet children()}
          <Text>This card has a badge in the header trailing section.</Text>
        {/snippet}
      </CardBody>
    {/snippet}
  </Card>
</Story>

<Story name="Card with Header Trailing Counter">
  <Card width="400px">
    {#snippet children()}
      <CardHeader>
        {#snippet children()}
          <CardHeaderLeading title="Notifications" subtitle="You have new messages" />
          <CardHeaderTrailing>
            {#snippet visual()}
              <Counter value={5} />
            {/snippet}
          </CardHeaderTrailing>
        {/snippet}
      </CardHeader>
      <CardBody>
        {#snippet children()}
          <Text>This card has a counter in the header trailing section.</Text>
        {/snippet}
      </CardBody>
    {/snippet}
  </Card>
</Story>

<Story name="Card with Header Prefix and Suffix">
  <Card width="400px">
    {#snippet children()}
      <CardHeader>
        {#snippet children()}
          <CardHeaderLeading title="Settings" subtitle="Manage your preferences">
            {#snippet prefix()}
              <Badge color="positive">Pro</Badge>
            {/snippet}
            {#snippet suffix()}
              <Counter value={3} />
            {/snippet}
          </CardHeaderLeading>
        {/snippet}
      </CardHeader>
      <CardBody>
        {#snippet children()}
          <Text>This card has prefix and suffix elements in the header.</Text>
        {/snippet}
      </CardBody>
    {/snippet}
  </Card>
</Story>

<Story name="Card with Header No Divider">
  <Card width="400px">
    {#snippet children()}
      <CardHeader showDivider={false}>
        {#snippet children()}
          <CardHeaderLeading title="No Divider" subtitle="Header without divider" />
        {/snippet}
      </CardHeader>
      <CardBody>
        {#snippet children()}
          <Text>This card header has no divider.</Text>
        {/snippet}
      </CardBody>
    {/snippet}
  </Card>
</Story>

<Story name="Card with Header Custom Spacing">
  <Card width="400px">
    {#snippet children()}
      <CardHeader paddingBottom="spacing.7" marginBottom="spacing.5">
        {#snippet children()}
          <CardHeaderLeading title="Custom Spacing" subtitle="Custom padding and margin" />
        {/snippet}
      </CardHeader>
      <CardBody>
        {#snippet children()}
          <Text>This card header has custom padding and margin.</Text>
        {/snippet}
      </CardBody>
    {/snippet}
  </Card>
</Story>

<!-- ============ FOOTER VARIANTS ============ -->

<Story name="Card with Footer Only Primary Action">
  <Card width="400px">
    {#snippet children()}
      <CardBody>
        {#snippet children()}
          <Text>This card has only a primary action in the footer.</Text>
        {/snippet}
      </CardBody>
      <CardFooter>
        {#snippet children()}
          <CardFooterTrailing
            actions={{
              primary: { text: 'Confirm', onClick: () => alert('Confirmed!') },
            }}
          />
        {/snippet}
      </CardFooter>
    {/snippet}
  </Card>
</Story>

<Story name="Card with Footer Both Actions">
  <Card width="400px">
    {#snippet children()}
      <CardBody>
        {#snippet children()}
          <Text>This card has both primary and secondary actions.</Text>
        {/snippet}
      </CardBody>
      <CardFooter>
        {#snippet children()}
          <CardFooterTrailing
            actions={{
              primary: { text: 'Confirm', onClick: () => alert('Confirmed!') },
              secondary: { text: 'Cancel', onClick: () => alert('Cancelled!') },
            }}
          />
        {/snippet}
      </CardFooter>
    {/snippet}
  </Card>
</Story>

<Story name="Card with Footer Leading and Trailing">
  <Card width="400px">
    {#snippet children()}
      <CardBody>
        {#snippet children()}
          <Text>This card has both leading and trailing footer sections.</Text>
        {/snippet}
      </CardBody>
      <CardFooter>
        {#snippet children()}
          <CardFooterLeading title="Total Amount" subtitle="$1,234.56" />
          <CardFooterTrailing
            actions={{
              primary: { text: 'Pay Now', onClick: () => alert('Payment initiated!') },
              secondary: { text: 'Cancel', onClick: () => alert('Cancelled!') },
            }}
          />
        {/snippet}
      </CardFooter>
    {/snippet}
  </Card>
</Story>

<Story name="Card with Footer No Divider">
  <Card width="400px">
    {#snippet children()}
      <CardBody>
        {#snippet children()}
          <Text>This card footer has no divider.</Text>
        {/snippet}
      </CardBody>
      <CardFooter showDivider={false}>
        {#snippet children()}
          <CardFooterTrailing
            actions={{
              primary: { text: 'Action', onClick: () => console.log('Clicked') },
            }}
          />
        {/snippet}
      </CardFooter>
    {/snippet}
  </Card>
</Story>

<Story name="Card with Footer Custom Spacing">
  <Card width="400px">
    {#snippet children()}
      <CardBody>
        {#snippet children()}
          <Text>This card footer has custom padding and margin.</Text>
        {/snippet}
      </CardBody>
      <CardFooter paddingTop="spacing.7" marginTop="spacing.5">
        {#snippet children()}
          <CardFooterTrailing
            actions={{
              primary: { text: 'Action', onClick: () => console.log('Clicked') },
            }}
          />
        {/snippet}
      </CardFooter>
    {/snippet}
  </Card>
</Story>

<!-- ============ DIMENSION VARIANTS ============ -->

<Story name="Card with Custom Dimensions">
  <div style="display: flex; gap: 16px; flex-wrap: wrap;">
    <Card width="250px" height="200px" backgroundColor="moderate">
      {#snippet children()}
        <CardBody>
          {#snippet children()}
            <Text>Fixed width (250px) and height (200px)</Text>
          {/snippet}
        </CardBody>
      {/snippet}
    </Card>
    <Card minWidth="200px" maxWidth="300px" minHeight="150px" backgroundColor="moderate">
      {#snippet children()}
        <CardBody>
          {#snippet children()}
            <Text>
              Min/max width and height constraints. This card will grow/shrink based on content
              within the specified bounds.
            </Text>
          {/snippet}
        </CardBody>
      {/snippet}
    </Card>
  </div>
</Story>

<Story name="Card with Full Width">
  <Card width="100%">
    {#snippet children()}
      <CardBody>
        {#snippet children()}
          <Text>This card takes full width of its container.</Text>
        {/snippet}
      </CardBody>
    {/snippet}
  </Card>
</Story>

<!-- ============ COMPLEX EXAMPLES ============ -->

<Story name="Complete Card Example">
  <Card
    width="500px"
    elevation="midRaised"
    borderRadius="large"
    backgroundColor="moderate"
    size="large"
  >
    {#snippet children()}
      <CardHeader>
        {#snippet children()}
          <CardHeaderLeading title="Payment Details" subtitle="Transaction #12345">
            {#snippet prefix()}
              <Badge color="positive">Completed</Badge>
            {/snippet}
          </CardHeaderLeading>
          <CardHeaderTrailing>
            {#snippet visual()}
              <Counter value={3} />
            {/snippet}
          </CardHeaderTrailing>
        {/snippet}
      </CardHeader>
      <CardBody>
        {#snippet children()}
          <Text>
            Your payment has been processed successfully. A confirmation email has been sent to your
            registered email address. Transaction ID: TXN123456789.
          </Text>
        {/snippet}
      </CardBody>
      <CardFooter>
        {#snippet children()}
          <CardFooterLeading title="Total Amount" subtitle="$1,234.56" />
          <CardFooterTrailing
            actions={{
              primary: { text: 'Download Receipt', onClick: () => alert('Downloading...') },
              secondary: { text: 'Share', onClick: () => alert('Sharing...') },
            }}
          />
        {/snippet}
      </CardFooter>
    {/snippet}
  </Card>
</Story>

<Story name="Selectable Card Grid">
  <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px;">
    <Card isSelected={true} onClick={() => console.log('Card 1 clicked')}>
      {#snippet children()}
        <CardBody>
          {#snippet children()}
            <Text weight="semibold">Selected Card</Text>
            <Text size="small" color="surface.text.gray.muted">Click to deselect</Text>
          {/snippet}
        </CardBody>
      {/snippet}
    </Card>
    <Card onClick={() => console.log('Card 2 clicked')}>
      {#snippet children()}
        <CardBody>
          {#snippet children()}
            <Text weight="semibold">Card Option 2</Text>
            <Text size="small" color="surface.text.gray.muted">Click to select</Text>
          {/snippet}
        </CardBody>
      {/snippet}
    </Card>
    <Card onClick={() => console.log('Card 3 clicked')}>
      {#snippet children()}
        <CardBody>
          {#snippet children()}
            <Text weight="semibold">Card Option 3</Text>
            <Text size="small" color="surface.text.gray.muted">Click to select</Text>
          {/snippet}
        </CardBody>
      {/snippet}
    </Card>
    <Card onClick={() => console.log('Card 4 clicked')}>
      {#snippet children()}
        <CardBody>
          {#snippet children()}
            <Text weight="semibold">Card Option 4</Text>
            <Text size="small" color="surface.text.gray.muted">Click to select</Text>
          {/snippet}
        </CardBody>
      {/snippet}
    </Card>
  </div>
</Story>

<Story name="Card with Accessibility Label">
  <Card
    href="https://razorpay.com"
    accessibilityLabel="Navigate to Razorpay homepage"
    width="300px"
  >
    {#snippet children()}
      <CardBody>
        {#snippet children()}
          <Text>This card has an accessibility label for screen readers.</Text>
        {/snippet}
      </CardBody>
    {/snippet}
  </Card>
</Story>

<Story name="Card with Test ID and Analytics">
  <Card
    testID="analytics-card"
    data-analytics-section="demo"
    data-analytics-action="click"
    width="300px"
  >
    {#snippet children()}
      <CardBody>
        {#snippet children()}
          <Text>This card has test ID and analytics attributes.</Text>
        {/snippet}
      </CardBody>
    {/snippet}
  </Card>
</Story>

<Story name="Cards with Styled Props">
  <div style="display: flex; gap: 16px; flex-wrap: wrap;">
    <Card marginTop="spacing.5" marginBottom="spacing.7" width="200px">
      {#snippet children()}
        <CardBody>
          {#snippet children()}
            <Text>Card with margin props</Text>
          {/snippet}
        </CardBody>
      {/snippet}
    </Card>
    <Card position="relative" zIndex={10} width="200px">
      {#snippet children()}
        <CardBody>
          {#snippet children()}
            <Text>Card with position props</Text>
          {/snippet}
        </CardBody>
      {/snippet}
    </Card>
  </div>
</Story>

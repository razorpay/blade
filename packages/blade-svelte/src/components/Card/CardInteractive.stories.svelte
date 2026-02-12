<script context="module">
  // @ts-nocheck — story args typing
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Card from './Card.svelte';

  const disable = {
    table: { disable: true },
  };
  const propCategory = {
    category: 'Supports All Card Props Plus:',
  };

  const { Story } = defineMeta({
    title: 'Components/Card/Interactive',
    component: Card,
    tags: ['autodocs'],
    argTypes: {
      width: disable,
      height: disable,
      alignSelf: disable,
      bottom: disable,
      display: disable,
      children: disable,
      gridArea: disable,
      margin: disable,
      top: disable,
      left: disable,
      right: disable,
      marginLeft: disable,
      marginRight: disable,
      marginTop: disable,
      marginBottom: disable,
      testID: disable,
      marginX: disable,
      marginY: disable,
      as: disable,
      target: {
        control: { type: 'text' },
        table: propCategory,
      },
      accessibilityLabel: {
        control: { type: 'text' },
        table: propCategory,
      },
      isSelected: {
        control: { type: 'boolean' },
        table: propCategory,
      },
      shouldScaleOnHover: {
        control: { type: 'boolean' },
        table: propCategory,
      },
      href: {
        control: { type: 'text' },
        table: propCategory,
      },
      rel: {
        control: { type: 'text' },
        table: propCategory,
      },
      elevation: {
        table: propCategory,
      },
      padding: {
        table: propCategory,
      },
    },
    args: {
      accessibilityLabel: 'Payment Pages Card',
      isSelected: false,
      shouldScaleOnHover: true,
      elevation: 'midRaised',
      padding: 'spacing.7',
    },
  });
</script>

<script lang="ts">
  import CardBody from './CardBody.svelte';
  import CardHeader from './CardHeader.svelte';
  import CardHeaderLeading from './CardHeaderLeading.svelte';
  import CardHeaderTrailing from './CardHeaderTrailing.svelte';
  import CardHeaderIcon from './CardHeaderIcon.svelte';
  import CardHeaderCounter from './CardHeaderCounter.svelte';
  import CardHeaderBadge from './CardHeaderBadge.svelte';
  import CardFooter from './CardFooter.svelte';
  import CardFooterLeading from './CardFooterLeading.svelte';
  import CardFooterTrailing from './CardFooterTrailing.svelte';
  import Text from '../Typography/Text/Text.svelte';
  import Code from '../Typography/Code/Code.svelte';
  import Button from '../Button/Button.svelte';
  import Link from '../Link/Link.svelte';
  import Amount from '../Amount/Amount.svelte';
  import Divider from '../Divider/Divider.svelte';
  import { CreditCardIcon, InfoIcon } from '../Icons';

  // Reactive state for stories
  let cardClickCount = $state(0);
  let buttonClickCount = $state(0);
  let switchToggleCount = $state(0);

  // Single select state
  let singleSelected = $state('free');

  // Multi select state
  let multiSelected = $state<string[]>(['free']);

  // Radio-like single select
  let radioSelected = $state('');
  let radioSubmitted = $state(false);

  // Checkbox-like multi select
  let checkboxSelected = $state<string[]>([]);
  let checkboxSubmitted = $state(false);

  // Label left example
  let labelLeftSelected = $state('');

  function handleMultiToggle(value: string): void {
    if (multiSelected.includes(value)) {
      multiSelected = multiSelected.filter((item) => item !== value);
    } else {
      multiSelected = [...multiSelected, value];
    }
  }

  function handleCheckboxToggle(value: string): void {
    if (checkboxSelected.includes(value)) {
      checkboxSelected = checkboxSelected.filter((item) => item !== value);
    } else {
      checkboxSelected = [...checkboxSelected, value];
    }
  }

  const merchantOptions = [
    {
      value: 'payment-gateway',
      title: 'Payment Gateway',
      subtitle: 'Accept online payments',
      features: [
        '100+ payment methods',
        'UPI, Cards, Netbanking, Wallets',
        'Industry-leading success rates',
        'Real-time payment tracking',
      ],
    },
    {
      value: 'payment-links',
      title: 'Payment Links',
      subtitle: 'Share & collect payments',
      features: [
        'No coding required',
        'Share via SMS, email, WhatsApp',
        'Instant payment collection',
        'Custom branding options',
      ],
    },
    {
      value: 'payment-pages',
      title: 'Payment Pages',
      subtitle: 'Create online store',
      features: [
        'Ready-to-use online store',
        'Product catalog management',
        'Inventory tracking',
        'Mobile-optimized checkout',
      ],
    },
    {
      value: 'pos',
      title: 'Point of Sale (POS)',
      subtitle: 'In-store payments',
      features: [
        'Accept card & UPI payments',
        'Contactless payments',
        'Inventory management',
        'Sales analytics & reports',
      ],
    },
  ];
</script>

<!-- Story 1: Default -->
<Story name="Default" asChild>
  <Card
    onHover={() => console.log('Hovered')}
    shouldScaleOnHover
    accessibilityLabel="Payment Pages Card"
    elevation="midRaised"
    width="400px"
  >
    <CardHeader>
      <CardHeaderLeading
        title="Payment Pages"
        subtitle="Card Header Subtitle"
      >
        {#snippet prefix()}
          <CardHeaderIcon icon={CreditCardIcon} />
        {/snippet}
        {#snippet suffix()}
          <CardHeaderCounter value={12} />
        {/snippet}
      </CardHeaderLeading>
      <CardHeaderTrailing>
        {#snippet visual()}
          <CardHeaderBadge color="positive">NEW</CardHeaderBadge>
        {/snippet}
      </CardHeaderTrailing>
    </CardHeader>
    <CardBody>
      <Text>
        Share payment link via an email, SMS, messenger, chatbot etc. and get paid immediately.
        Accepting payments from customers is now just a link away.
      </Text>
    </CardBody>
    <CardFooter>
      <CardFooterLeading title="Footer" subtitle="Footer Subtitle" />
      <CardFooterTrailing
        actions={{
          primary: { text: 'Primary', onClick: () => console.log('Primary') },
          secondary: { text: 'Secondary', onClick: () => console.log('Secondary') },
        }}
      />
    </CardFooter>
  </Card>
</Story>

<!-- Story 2: Clickable Card -->
<Story name="Clickable Card" asChild>
  <div>
    <div style="margin-bottom: 24px;">
      <Text>
        Cards can be made clickable by passing the <Code size="medium">onClick</Code> prop.
      </Text>
      <Text>
        You will also need to pass the <Code size="medium">accessibilityLabel</Code> to make the card accessible to screen readers.
      </Text>
    </div>
    <Card
      accessibilityLabel="Payment Pages Card"
      onClick={() => { cardClickCount += 1; }}
      width="400px"
    >
      <CardHeader>
        <CardHeaderLeading title="Payment Pages" />
      </CardHeader>
      <CardBody>
        <Text>
          Take your store online instantly with zero coding. Accept international & domestic payments.
        </Text>
        <Text marginY="spacing.2">
          Card Clicked: <Text as="span" weight="semibold">{cardClickCount}</Text>
        </Text>
        <Text marginY="spacing.2">
          Button Clicked: <Text as="span" weight="semibold">{buttonClickCount}</Text>
        </Text>
        <Text marginY="spacing.2">
          Switch Toggled: <Text as="span" weight="semibold">{switchToggleCount}</Text>
        </Text>
        <Button
          size="small"
          marginTop="spacing.5"
          onClick={() => { buttonClickCount += 1; }}
        >
          Get Demo
        </Button>
        <div style="margin-top: 8px;">
          <label style="display: inline-flex; align-items: center; gap: 8px; cursor: pointer;">
            <input
              type="checkbox"
              onchange={() => { switchToggleCount += 1; }}
            />
            <span style="font-size: 14px;">Toggle switch</span>
          </label>
        </div>
      </CardBody>
    </Card>
  </div>
</Story>

<!-- Story 3: Hoverable Card -->
<Story name="Hoverable Card" asChild>
  <div>
    <Text marginBottom="spacing.6">
      By passing the <Code size="medium">shouldScaleOnHover</Code> prop, the card will scale up on
      hover. (on mobile devices the interaction will happen on press and the card will scale down instead)
    </Text>
    <Card shouldScaleOnHover width="400px">
      <CardHeader>
        <CardHeaderLeading
          title="Payment Links"
          subtitle="Collect faster payments on UPI Payment Links with upto 50% lower fees"
        />
      </CardHeader>
      <CardBody>
        <Text>
          Share payment link via an email, SMS, messenger, chatbot etc. and get paid immediately.
          Accepting payments from customers is now just a link away.
        </Text>
      </CardBody>
    </Card>
  </div>
</Story>

<!-- Story 4: Linkable Card -->
<Story name="Linkable Card" asChild>
  <div>
    <div style="margin-bottom: 24px;">
      <Text>
        Cards can be made linkable by passing the <Code size="medium">href</Code> prop,
      </Text>
      <Text>
        You will also need to pass the <Code size="medium">accessibilityLabel</Code> to make the link accessible to screen readers.
      </Text>
    </div>
    <Card
      href="https://razorpay.com/payment-links"
      accessibilityLabel="Payment Links"
      shouldScaleOnHover
      width="400px"
    >
      <CardHeader>
        <CardHeaderLeading
          title="Payment Links"
          subtitle="Collect faster payments on UPI Payment Links with upto 50% lower fees"
        />
      </CardHeader>
      <CardBody>
        <Text>
          Share payment link via an email, SMS, messenger, chatbot etc. and get paid immediately.
          Accepting payments from customers is now just a link away.
        </Text>
        <div style="margin-top: 16px;">
          <Link href="https://razorpay.com/payment-links/#overview">
            Get Demo
          </Link>
        </div>
      </CardBody>
    </Card>
  </div>
</Story>

<!-- Story 5: Single Selectable Card -->
<Story name="Single Selectable Card" asChild>
  <div>
    <Text marginBottom="spacing.6">
      To make a group of cards behave like radio buttons, you can put a hidden radio input inside
      the <Code size="medium">CardBody</Code> and pass <Code size="medium">as="label"</Code> prop
      to the <Code size="medium">Card</Code>.
    </Text>
    <div style="display: flex; gap: 16px; flex-direction: row; align-items: stretch;">
      <Card
        as="label"
        accessibilityLabel="Free Tier"
        shouldScaleOnHover
        isSelected={singleSelected === 'free'}
        minHeight="100%"
      >
        <CardBody>
          <span style="position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap;">
            <input
              type="radio"
              name="pricing-card-single"
              value="free"
              checked={singleSelected === 'free'}
              onchange={() => { singleSelected = 'free'; }}
            />
          </span>
          <Amount marginBottom="spacing.1" value={0} currency="USD" size="large" />
          <div style="padding: 0 8px;">
            <Text marginBottom="spacing.3" size="large" color="surface.text.gray.subtle">Free</Text>
            <Text>
              For individuals or teams just getting started with payments. No setup fees, no monthly or annual fees.
            </Text>
          </div>
        </CardBody>
      </Card>
      <Card
        as="label"
        accessibilityLabel="Standard Tier"
        shouldScaleOnHover
        isSelected={singleSelected === 'standard'}
        minHeight="100%"
      >
        <CardBody>
          <span style="position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap;">
            <input
              type="radio"
              name="pricing-card-single"
              value="standard"
              checked={singleSelected === 'standard'}
              onchange={() => { singleSelected = 'standard'; }}
            />
          </span>
          <Amount marginBottom="spacing.1" value={10} currency="USD" size="large" />
          <div style="padding: 0 8px;">
            <Text marginBottom="spacing.3" size="large" color="surface.text.gray.subtle">Standard</Text>
            <Text>
              For teams that are scaling up and need advanced features like payment failure.
            </Text>
          </div>
        </CardBody>
      </Card>
      <Card
        as="label"
        accessibilityLabel="Premium Tier"
        shouldScaleOnHover
        isSelected={singleSelected === 'premium'}
        minHeight="100%"
      >
        <CardBody>
          <span style="position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap;">
            <input
              type="radio"
              name="pricing-card-single"
              value="premium"
              checked={singleSelected === 'premium'}
              onchange={() => { singleSelected = 'premium'; }}
            />
          </span>
          <Amount marginBottom="spacing.1" value={20} currency="USD" size="large" />
          <div style="padding: 0 8px;">
            <Text marginBottom="spacing.3" size="large" color="surface.text.gray.subtle">Premium</Text>
            <Text>
              Best suited for businesses that need a dedicated account manager and 24x7 support.
            </Text>
          </div>
        </CardBody>
      </Card>
    </div>
  </div>
</Story>

<!-- Story 6: Multi Selectable Card -->
<Story name="Multi Selectable Card" asChild>
  <div>
    <Text marginBottom="spacing.6">
      To make a group of cards behave like checkboxes, you can put a hidden checkbox input inside
      the <Code size="medium">CardBody</Code> and pass <Code size="medium">as="label"</Code> prop
      to the <Code size="medium">Card</Code>.
    </Text>
    <div style="display: flex; gap: 16px; flex-direction: row; align-items: stretch;">
      <Card as="label" shouldScaleOnHover isSelected={multiSelected.includes('free')} minHeight="100%">
        <CardBody>
          <span style="position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap;">
            <input type="checkbox" value="free" checked={multiSelected.includes('free')} onchange={() => handleMultiToggle('free')} />
          </span>
          <Amount marginBottom="spacing.1" value={0} currency="USD" size="large" />
          <div style="padding: 0 8px;">
            <Text marginBottom="spacing.3" size="large" color="surface.text.gray.subtle">Free</Text>
            <Text>For individuals or teams just getting started with payments. No setup fees, no monthly or annual fees.</Text>
          </div>
        </CardBody>
      </Card>
      <Card as="label" shouldScaleOnHover isSelected={multiSelected.includes('standard')} minHeight="100%">
        <CardBody>
          <span style="position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap;">
            <input type="checkbox" value="standard" checked={multiSelected.includes('standard')} onchange={() => handleMultiToggle('standard')} />
          </span>
          <Amount marginBottom="spacing.1" value={10} currency="USD" size="large" />
          <div style="padding: 0 8px;">
            <Text marginBottom="spacing.3" size="large" color="surface.text.gray.subtle">Standard</Text>
            <Text>For teams that are scaling up and need advanced features like payment failure.</Text>
          </div>
        </CardBody>
      </Card>
      <Card as="label" shouldScaleOnHover isSelected={multiSelected.includes('premium')} minHeight="100%">
        <CardBody>
          <span style="position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap;">
            <input type="checkbox" value="premium" checked={multiSelected.includes('premium')} onchange={() => handleMultiToggle('premium')} />
          </span>
          <Amount marginBottom="spacing.1" value={20} currency="USD" size="large" />
          <div style="padding: 0 8px;">
            <Text marginBottom="spacing.3" size="large" color="surface.text.gray.subtle">Premium</Text>
            <Text>Best suited for businesses that need a dedicated account manager and 24x7 support.</Text>
          </div>
        </CardBody>
      </Card>
    </div>
  </div>
</Story>

<!-- Story 7: Single Selectable Card With Radio -->
<Story name="Single Selectable Card With Radio" asChild>
  <div style="display: flex; gap: 24px; flex-direction: column;">
    <div>
      <Text marginBottom="spacing.4" weight="semibold" size="large">
        Merchant Onboarding - Primary Product Selection
      </Text>
      <Text marginBottom="spacing.4">
        Choose your primary Razorpay product to get started. You can add more products later from your dashboard.
      </Text>

      <fieldset style="border: none; padding: 0; margin: 0;">
        <legend style="font-size: 14px; font-weight: 600; margin-bottom: 8px;">Select Product *</legend>
        {#if radioSubmitted && !radioSelected}
          <Text color="interactive.text.negative.normal" size="small">Please select a product to continue</Text>
        {/if}
        <Text size="small" color="surface.text.gray.subtle" marginBottom="spacing.4">Select one primary product for your initial setup</Text>
        <div style="display: flex; flex-wrap: wrap; gap: 12px;">
          {#each merchantOptions as option}
            <Card
              as="label"
              isSelected={radioSelected === option.value}
              validationState={radioSubmitted && !radioSelected ? 'error' : 'none'}
              width="400px"
            >
              <CardBody>
                <div style="display: flex; flex-direction: row; gap: 12px; justify-content: space-between;">
                  <CardHeaderLeading
                    title={option.title}
                    subtitle={option.subtitle}
                  >
                    {#snippet prefix()}
                      <CardHeaderIcon icon={InfoIcon} />
                    {/snippet}
                  </CardHeaderLeading>
                  <input
                    type="radio"
                    name="merchant-radio"
                    value={option.value}
                    checked={radioSelected === option.value}
                    onchange={() => { radioSelected = option.value; }}
                  />
                </div>
                <Divider marginTop="spacing.2" />
                <ul style="margin: 8px 0 0 16px; padding: 0; font-size: 14px; color: var(--surface-text-gray-subtle);">
                  {#each option.features as feature}
                    <li style="margin-bottom: 4px;">{feature}</li>
                  {/each}
                </ul>
              </CardBody>
            </Card>
          {/each}
        </div>
      </fieldset>

      <div style="display: flex; justify-content: space-between; margin-top: 16px;">
        <Button marginTop="spacing.4" onClick={() => { radioSubmitted = true; }} variant="primary">
          Continue Setup
        </Button>
        {#if radioSelected}
          <div style="margin-top: 12px; background: var(--surface-background-gray-intense); padding: 12px; border-radius: 4px;">
            <Text color="surface.text.gray.subtle">
              Selected: {merchantOptions.find((o) => o.value === radioSelected)?.title}
            </Text>
          </div>
        {/if}
      </div>
    </div>
  </div>
</Story>

<!-- Story 8: Multi Selectable Card With Checkbox -->
<Story name="Multi Selectable Card With Checkbox" asChild>
  <div style="display: flex; gap: 24px; flex-direction: column;">
    <div>
      <Text marginBottom="spacing.4" weight="semibold" size="large">
        Merchant Onboarding - Multiple Product Selection
      </Text>
      <Text marginBottom="spacing.4">
        Choose multiple Razorpay products you want to integrate. You can always add more products later from your dashboard.
      </Text>

      <fieldset style="border: none; padding: 0; margin: 0;">
        <legend style="font-size: 14px; font-weight: 600; margin-bottom: 8px;">Which products do you want to use? *</legend>
        {#if checkboxSubmitted && checkboxSelected.length === 0}
          <Text color="interactive.text.negative.normal" size="small">Please select at least one Razorpay product to get started</Text>
        {:else if checkboxSelected.length > 3}
          <Text color="interactive.text.negative.normal" size="small">You can select maximum 3 products during initial setup</Text>
        {/if}
        <Text size="small" color="surface.text.gray.subtle" marginBottom="spacing.4">Select 1-3 products to start with. Additional products can be enabled later.</Text>
        <div style="display: flex; flex-wrap: wrap; gap: 12px;">
          {#each merchantOptions as option}
            <Card
              as="label"
              isSelected={checkboxSelected.includes(option.value)}
              validationState={(checkboxSubmitted && checkboxSelected.length === 0) || checkboxSelected.length > 3 ? 'error' : 'none'}
              width="400px"
            >
              <CardBody>
                <div style="display: flex; flex-direction: row; gap: 12px; justify-content: space-between;">
                  <CardHeaderLeading
                    title={option.title}
                    subtitle={option.subtitle}
                  >
                    {#snippet prefix()}
                      <CardHeaderIcon icon={InfoIcon} />
                    {/snippet}
                  </CardHeaderLeading>
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={checkboxSelected.includes(option.value)}
                    onchange={() => handleCheckboxToggle(option.value)}
                  />
                </div>
                <Divider marginTop="spacing.2" />
                <ul style="margin: 8px 0 0 16px; padding: 0; font-size: 14px; color: var(--surface-text-gray-subtle);">
                  {#each option.features as feature}
                    <li style="margin-bottom: 4px;">{feature}</li>
                  {/each}
                </ul>
              </CardBody>
            </Card>
          {/each}
        </div>
      </fieldset>

      <div style="display: flex; justify-content: space-between; margin-top: 16px;">
        <Button marginTop="spacing.4" onClick={() => { checkboxSubmitted = true; }} variant="primary">
          Continue Setup
        </Button>
        {#if checkboxSelected.length > 0}
          <div style="margin-top: 12px; background: var(--surface-background-gray-intense); padding: 12px; border-radius: 4px;">
            <Text color="surface.text.gray.subtle">
              Selected products ({checkboxSelected.length}/3): {checkboxSelected.map((v) => merchantOptions.find((o) => o.value === v)?.title).join(', ')}
            </Text>
          </div>
        {/if}
      </div>
    </div>
  </div>
</Story>

<!-- Story 9: Selectable Card With Label Left -->
<Story name="Selectable Card With Label Left" asChild>
  <div style="display: flex; gap: 24px; flex-direction: column;">
    <div>
      <Text marginBottom="spacing.4" weight="semibold" size="large">
        Label Position Left Example
      </Text>
      <Text marginBottom="spacing.4">
        RadioGroup with label positioned on the left side of the cards.
      </Text>

      <fieldset style="border: none; padding: 0; margin: 0;">
        <legend style="font-size: 14px; font-weight: 600; margin-bottom: 8px;">Select Product</legend>
        <Text size="small" color="surface.text.gray.subtle" marginBottom="spacing.4">Select one primary product for your initial setup</Text>
        <div style="display: flex; flex-wrap: wrap; gap: 12px;">
          {#each merchantOptions.slice(0, 2) as option}
            <Card
              as="label"
              isSelected={labelLeftSelected === option.value}
              width="400px"
            >
              <CardBody>
                <div style="display: flex; flex-direction: row; gap: 12px; justify-content: space-between;">
                  <CardHeaderLeading
                    title={option.title}
                    subtitle={option.subtitle}
                  >
                    {#snippet prefix()}
                      <CardHeaderIcon icon={InfoIcon} />
                    {/snippet}
                  </CardHeaderLeading>
                  <input
                    type="radio"
                    name="label-left-radio"
                    value={option.value}
                    checked={labelLeftSelected === option.value}
                    onchange={() => { labelLeftSelected = option.value; }}
                  />
                </div>
                <Divider marginTop="spacing.2" />
                <ul style="margin: 8px 0 0 16px; padding: 0; font-size: 14px; color: var(--surface-text-gray-subtle);">
                  {#each option.features as feature}
                    <li style="margin-bottom: 4px;">{feature}</li>
                  {/each}
                </ul>
              </CardBody>
            </Card>
          {/each}
        </div>
      </fieldset>
    </div>
  </div>
</Story>
